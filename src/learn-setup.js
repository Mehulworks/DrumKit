// Learn wiring: lessons and style beats are picked in the Learn drawer and practised in the lesson bar (beat grid, Demo,
// Start, speed) with a scoreboard over the kit; the players book clicks and cues and judge your hits. Also the lesson lock
// (only a running lesson's drums play) and, on phones, Learn and Concert taking turns.
import { setupPhoneTurns } from './ui/phone-turns.js';
import { createLessonLock } from './ui/lesson-lock.js';
import { createLessonPlayer } from './learn/lesson-player.js';
import { createStepPlayer } from './learn/step-player.js';
import { notesFor } from './learn/pattern.js';
import { setupLearnPanel } from './ui/learn-panel.js';
import { setupLearnDrawer } from './ui/learn-drawer.js';
import { setupLearnHud } from './ui/learn-hud.js';
import { settings } from './ui/storage.js';
import { showNoticeOnce } from './ui/toast.js';

// Upright phones: the first lesson opened suggests turning sideways for a bigger beat grid (once, closable). If another
// message is showing (such as Concert pausing), the tip waits until it has gone.
const UPRIGHT_PHONE = matchMedia('(orientation: portrait) and (max-width: 35em)');
function learnRotateTip() {
  if (!UPRIGHT_PHONE.matches) return;
  const show = () => showNoticeOnce('learn-rotate', 'Tip: turn your phone sideways for a bigger beat grid.');
  if (document.querySelector('.toast')) setTimeout(show, 3600);
  else show();
}

const byId = (id) => document.getElementById(id);

/**
 * @param {{stage: object, bookHit: (id: string, time: number, options?: object) => void, cues: () => object,
 *   lessonFocus: () => object, sticks: () => object, concert: object, panel: object}} parts cues, lessonFocus and sticks
 *   are getters: they belong to the kit on stage and change when a kit is mounted
 * @returns {{hit: (id: string) => void, allows: (id: string) => boolean, stop: () => void, refresh: () => void}}
 */
export function setupLearn({ stage, bookHit, cues, lessonFocus, sticks, concert, panel }) {
  const padsOnStage = () => new Set(stage.current.kit.pads.map((pad) => pad.id));
  const hud = setupLearnHud(byId('learn-hud'), byId('kit'));
  // While a lesson runs (not its Demo), only its drums play.
  const lessonLock = createLessonLock(() => (lessons.isRunning() && !learnPanel.isDemo()) || steps.isRunning());
  const lessons = createLessonPlayer({
    play: (id, time) => bookHit(id, time, { playback: true }),
    cue: (id, time) => cues()?.cue(id, time),
    feedback: (id, verdict, step) => {
      learnPanel.grid.mark(id, step, verdict);
      if (!learnPanel.isDemo()) hud.verdict(verdict);
    },
    onStart: (timing) => {
      learnPanel.grid.start(timing);
      hud.show();
    },
    onUpdate: (state) => {
      learnPanel.update(state);
      hud.update(state);
    },
    onFinish: (result) => {
      learnPanel.finish(result);
      learnDrawer.refresh();
      setTimeout(() => { if (!lessons.isRunning()) hud.hide(); }, 2500);
    },
  });
  // Step by step: the beat waits on each step until you hit its glowing drums.
  const steps = createStepPlayer({
    show: (step, pads) => {
      learnPanel.grid.setStep(step);
      cues()?.hold(pads);
    },
    feedback: (id, verdict, step) => {
      if (verdict === 'onTime') {
        learnPanel.grid.mark(id, step, 'onTime');
        cues()?.release(id);
      }
      hud.verdict(verdict === 'onTime' ? 'nice' : 'wrong');
    },
    onUpdate: (state) => learnPanel.update(state),
    onFinish: (result) => {
      learnPanel.finishSteps(result);
      cues()?.clear();
      setTimeout(() => { if (!steps.isRunning()) hud.hide(); }, 1500);
    },
  });
  const learnPanel = setupLearnPanel(byId('learn-panel'), {
    pattern: (item) => notesFor(item, padsOnStage()),
    focus: (item) => {
      const ids = new Set(notesFor(item, padsOnStage()).map((note) => note.pad));
      lessonFocus()?.show(ids);
      lessonLock.set(ids, stage.current.kit.pads);
    },
    start(item, speed, demo, click) {
      cues()?.clear();
      if (demo) sticks()?.setVisible(true); // sticks: in a demo the drumsticks play the beat for you
      lessons.start(item, notesFor(item, padsOnStage()), speed, demo, click);
    },
    setClick: (on) => lessons.setClick(on),
    startSteps(item) {
      cues()?.clear();
      hud.show({ steps: true });
      steps.start(item, notesFor(item, padsOnStage()), 2);
    },
    stop() {
      lessons.stop();
      steps.stop();
      cues()?.clear();
      hud.hide();
      sticks()?.setVisible(settings.showSticks); // sticks
    },
  });
  learnPanel.onClose(() => {
    hud.hide();
    lessonFocus()?.clear();
    lessonLock.clear();
    turns.lessonClosed();
  });
  // On phones, Learn and Concert take turns and the recording panel folds during a lesson, so the kit stays big.
  const turns = setupPhoneTurns({
    concert,
    panel,
    lessonOpen: () => !byId('learn-panel').hidden,
    closeLesson: () => byId('learn-panel').querySelector('[data-learn=close]').click(),
  });
  const learnDrawer = setupLearnDrawer(byId('learn-button'), byId('learn-drawer'), (item, list, label) => {
    learnPanel.open(item, list, label);
    turns.lessonOpened();
    learnRotateTip();
  });

  return {
    /** A live hit, for the lesson or step player that is running. @param {string} id */
    hit(id) {
      lessons.hit(id);
      steps.hit(id);
    },
    /** False for a drum the running lesson does not use (it stays silent). @param {string} id */
    allows: (id) => lessonLock.allows(id),
    /** Stops any run (when the kit changes). */
    stop() {
      lessons.stop();
      steps.stop();
    },
    /** Redraws the lesson bar for the kit on stage. */
    refresh: () => learnPanel.refresh(),
  };
}
