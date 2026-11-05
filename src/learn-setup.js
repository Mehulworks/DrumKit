// Learn wiring: lessons and style beats are picked in the Learn drawer and practised in the lesson bar (beat grid, Demo,
// Start, speed) with a scoreboard over the kit; the players book clicks and cues and judge your hits. Also the lesson lock
// (only a running lesson's drums play) and one mode at a time (Learn, Concert and Recording take turns).
import { setupPhoneTurns } from './ui/phone-turns.js';
import { createLessonLock } from './ui/lesson-lock.js';
import { createLessonPlayer } from './learn/lesson-player.js';
import { createStepPlayer } from './learn/step-player.js';
import { notesFor } from './learn/pattern.js';
import { setupLearnPanel } from './ui/learn-panel.js';
import { setupLearnDrawer } from './ui/learn-drawer.js';
import { setupLearnHud } from './ui/learn-hud.js';
import { startTourOnce } from './ui/tour.js';
import { settings } from './ui/storage.js';

const byId = (id) => document.getElementById(id);

/**
 * @param {{stage: object, bookHit: (id: string, time: number, options?: object) => void, cues: () => object,
 *   lessonFocus: () => object, sticks: () => object, concert: object, panel: object}} parts cues, lessonFocus and sticks
 *   are getters: they belong to the kit on stage and change when a kit is mounted
 * @returns {{hit: (id: string) => void, allows: (id: string) => boolean, recordingStarted: () => void, stop: () => void,
 *   refresh: () => void}}
 */
export function setupLearn({ stage, bookHit, cues, lessonFocus, sticks, concert, panel }) {
  const padsOnStage = () => new Set(stage.current.kit.pads.map((pad) => pad.id));
  const hud = setupLearnHud(byId('learn-hud'), byId('kit'));
  // While a lesson is open, only its drums play (lesson-lock.js).
  const lessonLock = createLessonLock();
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
  // One mode at a time: Learn takes turns with Concert and with Recording (phone-turns.js).
  const turns = setupPhoneTurns({
    concert,
    panel,
    lessonOpen: () => !byId('learn-panel').hidden,
    closeLesson: () => byId('learn-panel').querySelector('[data-learn=close]').click(),
  });
  const learnDrawer = setupLearnDrawer(byId('learn-button'), byId('learn-drawer'), (item, list, label) => {
    learnPanel.open(item, list, label);
    turns.lessonOpened();
    document.dispatchEvent(new CustomEvent('lesson-open')); // main.js refits the Pad grid
    introduceLessonBar();
  });
  // The tour step about speed and the metronome click: on phones they sit in the bar's ⋮ menu.
  function speedStep(bar) {
    const more = bar.querySelector('.learn-more-button');
    if (more.offsetParent) return { target: () => more, text: 'Too fast? The <strong>speed</strong> and the metronome <strong>click</strong> are in ⋮.' };
    const controls = bar.querySelector('.learn-tertiary');
    return { target: () => (controls.offsetParent ? controls : bar.querySelector('.learn-extras')),
      text: 'Too fast? Slow it down with <strong>−</strong> and <strong>+</strong>. The metronome button turns the click on or off.' };
  }

  // Every lesson opened from Learn: a short tour (until "Don't show again" is ticked), then the lesson's tip shows in the
  // middle of the drums before docking at the bottom. The first time after a page load the bar also pulses saffron
  // twice (people missed it).
  let pulsed = false;
  function introduceLessonBar() {
    const bar = byId('learn-panel');
    if (!pulsed) {
      pulsed = true;
      bar.classList.add('is-intro');
      setTimeout(() => bar.classList.remove('is-intro'), 2600);
    }
    setTimeout(() => {
      if (!startLessonTour(bar)) learnPanel.introduceTip(); // no tour (turned off): the tip comes straight in
    }, 900);
  }
  const startLessonTour = (bar) => startTourOnce('tour-learn', [
    { target: () => bar.querySelector('.beat-grid'), text: 'This is the beat. Each row is a drum: hit it when the line reaches its dot.' },
    { target: () => bar.querySelector('.learn-mode'), text: '<strong>In time</strong> keeps the beat going. <strong>Step by step</strong> waits for each hit, to learn the pattern first.' },
    speedStep(bar),
    { target: () => bar.querySelector('[data-learn=start]'), text: 'Ready? <strong>Start</strong> gives a 4, 3, 2, 1 count-in, then play along. 80% on time passes.',
      action: { label: 'Start', run: () => bar.querySelector('[data-learn=start]').click() } },
  ], { everyTime: true, container: bar, onEnd: () => learnPanel.introduceTip() }); // ends if the bar is closed

  return {
    /** A live hit, for the lesson or step player that is running. @param {string} id @param {number} [eventTime] */
    hit(id, eventTime) {
      lessons.hit(id, eventTime);
      steps.hit(id);
    },
    /** Rec was pressed: an open lesson closes, so only one mode runs. */
    recordingStarted: () => turns.recordingStarted(),
    /** False for a drum the running lesson does not use (it stays silent). @param {string} id */
    allows: (id) => lessonLock.allows(id),
    /** Stops any run (when the kit changes). */
    stop() {
      lessons.stop();
      steps.stop();
    },
    /** True while a lesson or step run is playing (not a Demo). */
    isRunning: () => (lessons.isRunning() && !learnPanel.isDemo()) || steps.isRunning(),
    /** Redraws the lesson bar for the kit on stage. */
    refresh: () => learnPanel.refresh(),
  };
}
