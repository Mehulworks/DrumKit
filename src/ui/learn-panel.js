// Lesson bar: under the toolbar while you practise a lesson or style beat: its name and tip, the beat grid, a mode
// switch (In time keeps time; Step by step waits for you), Demo (loops until stopped), Start (the main button), and
// quieter controls for the click and the speed (remembered for each lesson), then the result (with the next speed level and
// Next). Lessons and beats are picked in the Learn drawer; best scores are remembered in this browser.
import { ICONS, METRONOME_PICTURE } from './icons.js';
import { attachTooltip } from './tooltip.js';
import { createBeatGrid } from './beat-grid.js';
import { setupLearnExtras } from './learn-extras.js';
import { learnPanelMarkup } from './learn-panel-markup.js';
import * as text from './learn-texts.js';
import { createLearnCaption } from './learn-caption.js';
import { createCountdown } from './countdown.js';
import { createLearnResult } from './learn-result.js';
import { settings, saveSettings } from './storage.js';

// Speed levels: big enough steps to feel the difference (− and + in the bar, and the result card, move between them).
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

/**
 * @param {HTMLElement} panel the empty lesson bar
 * @param {{start: Function, startSteps: Function, stop: () => void, pattern: (item: object) => Array,
 *   focus: (item: object) => void}} player focus labels the drums the lesson uses
 */
export function setupLearnPanel(panel, player) {
  panel.innerHTML = learnPanelMarkup();

  const part = (selector) => panel.querySelector(selector);
  attachTooltip(panel.querySelector('[data-learn=click]'), { title: 'Metronome click', picture: METRONOME_PICTURE,
    lines: ['A tick on every beat while the lesson plays, to keep you in time.', 'Tap to turn it off or on.'] });
  const grid = createBeatGrid(part('.beat-grid'));
  const countdown = createCountdown(); // the count-in, big in the middle of the kit, as before a recording
  // After a run: a card in the middle of the kit with what to do next (the bar itself never grows extra buttons).
  const result = createLearnResult((action) => {
    if (action === 'slower') setSpeed(SPEEDS[Math.max(0, SPEEDS.indexOf(speed) - 1)]);
    if (action === 'faster') setSpeed(SPEEDS[Math.min(SPEEDS.length - 1, SPEEDS.indexOf(speed) + 1)]);
    if (action === 'steps' || action === 'time') { mode = action === 'steps' ? 'steps' : 'time'; showMode(); }
    if (action === 'next') { item = list[Math.min(list.length - 1, index() + 1)]; finished = false; passedRun = false; showItem(); setPlaying(false); part('[data-learn=start]').classList.add('is-cue'); return; }
    showItem();
    part('[data-learn=start]').click(); // replay, slower, faster, steps and time all go straight into a run
  });
  let finished = false; // a run has ended since this lesson was shown: Start reads Replay
  let passedRun = false; // the last run passed
  setupLearnExtras(panel); // the ⋮ dropdown on phones
  const caption = createLearnCaption(); // the lesson's tip at the bottom of the screen
  let item = null;
  let list = [];
  let label = 'Lesson';
  let speed = 1;
  let mode = 'time';
  let click = true;
  let playing = false;
  let demoRun = false;
  let closeListener = () => {};

  const index = () => list.indexOf(item);
  // Each lesson remembers the speed you last used.
  function setSpeed(value) {
    speed = value;
    settings.learnSpeeds[item.id] = value;
    saveSettings();
  }
  function setPlaying(on, demo = false) {
    playing = on;
    demoRun = on && demo;
    const start = part('[data-learn=start]');
    start.innerHTML = on && !demo ? `${ICONS.stop}<span>Stop</span>` : finished ? `${ICONS.replay}<span>Replay</span>` : `${ICONS.play}<span>Start</span>`;
    start.classList.toggle('is-playing', on && !demo);
    start.classList.toggle('is-replay', !on && passedRun); // after a pass, Next lesson is the main action, so Replay steps back
    if (on) start.classList.remove('is-cue'); // the "press me" ring stops once a run starts
    const demoButton = part('[data-learn=demo]');
    demoButton.disabled = on && !demo;
    demoButton.innerHTML = demoRun ? `${ICONS.stop}<span class="panel-button-text">Stop demo</span>`
      : `${ICONS.sticks}<span class="panel-button-text">Demo</span>`;
    panel.querySelectorAll('[data-learn-mode]').forEach((button) => { button.disabled = on; });
  }
  function showMode() {
    panel.querySelectorAll('[data-learn-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.learnMode === mode)));
    panel.classList.toggle('is-steps', mode === 'steps');
    part('[data-learn=click]').setAttribute('aria-pressed', String(click));
  }
  // What passing takes: 80% on time over every hit in a run (each loop of the pattern counts).
  const hits = () => player.pattern(item).length * item.loops;
  const goal = () => text.goal(hits());
  const shortGoal = () => text.shortGoal(hits()); // phones: "Pass 13 of 16"
  function showItem() {
    part('.learn-title').textContent = `${label} ${index() + 1} · ${item.title}`;
    const bpm = `${Math.round(item.bpm * speed)} BPM`;
    part('.learn-meta').innerHTML = mode === 'steps'
      ? '<span class="meta-long">Hit each glowing drum; the beat waits for you.</span><span class="meta-short">The beat waits for you.</span>'
      : `<span class="meta-long">${bpm}${item.realBpm ? ` (real speed ${item.realBpm})` : ''} · ${goal()}</span><span class="meta-short">${bpm} · ${shortGoal()}</span>`;
    caption.setTip(item.tip);
    part('.learn-speed-value').textContent = `${Math.round(speed * 100)}%`;
    part('[data-learn=next]').hidden = true;
    part('[data-learn=push]').hidden = true;
    grid.show(item, player.pattern(item));
    player.focus(item);
  }
  function stopAll() {
    result.hide();
    countdown.count(null);
    player.stop();
    grid.stop();
    setPlaying(false);
  }

  panel.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-learn-mode]');
    if (modeButton) {
      mode = modeButton.dataset.learnMode;
      showMode();
      showItem();
      return;
    }
    const action = event.target.closest('[data-learn]')?.dataset.learn;
    if (!action) return;
    if (action === 'close') {
      stopAll();
      panel.hidden = true;
      caption.hide();
      closeListener();
    } else if (action === 'start') {
      part('[data-learn=start]').classList.remove('is-cue');
      // Start during a demo ends the demo and starts your run; during your run it means Stop.
      if (playing && !demoRun) {
        stopAll();
        showItem();
        return;
      }
      stopAll();
      part('[data-learn=next]').hidden = true;
      part('[data-learn=push]').hidden = true;
      grid.reset();
      setPlaying(true);
      if (mode === 'steps') player.startSteps(item);
      else player.start(item, speed, false, click);
    } else if (action === 'demo') {
      if (demoRun) {
        stopAll();
        showItem();
        return;
      }
      stopAll();
      grid.reset();
      setPlaying(true, true);
      player.start(item, speed, true, click);
    } else if (action === 'click') {
      click = !click;
      player.setClick(click); // applies at once, also to a run or Demo already playing
      showMode();
    } else if (action === 'slower' || action === 'faster') {
      const at = SPEEDS.indexOf(speed) + (action === 'faster' ? 1 : -1);
      setSpeed(SPEEDS[Math.min(SPEEDS.length - 1, Math.max(0, at))]);
      showItem();
    } else if (action === 'push') {
      // After a pass: the next speed level, straight into the next run.
      setSpeed(SPEEDS[Math.min(SPEEDS.length - 1, SPEEDS.indexOf(speed) + 1)]);
      showItem();
      grid.reset();
      setPlaying(true);
      player.start(item, speed, false, click);
    } else if (action === 'next') {
      item = list[Math.min(list.length - 1, index() + 1)];
      showItem();
    }
  });

  return {
    grid,
    isDemo: () => demoRun,
    open(chosen, chosenList, chosenLabel) {
      stopAll();
      item = chosen;
      list = chosenList;
      label = chosenLabel;
      const saved = settings.learnSpeeds[chosen.id] ?? 1; // older versions saved 10% steps: snap to the nearest level
      speed = SPEEDS.reduce((best, level) => (Math.abs(level - saved) < Math.abs(best - saved) ? level : best), 1);
      showMode();
      finished = false;
      passedRun = false;
      showItem();
      setPlaying(false);
      part('[data-learn=start]').classList.add('is-cue'); // a gentle ring until the first Start or Demo
      panel.hidden = false;
      caption.show();
    },
    /** Redraws the grid for the kit on stage (after a kit change). */
    refresh() {
      if (item && !panel.hidden) {
        stopAll();
        showItem();
      }
    },
    onClose(fn) {
      closeListener = fn;
    },
    update({ demo, counting, streak = 0, score = 0, step, done = 0, total = 0 }) {
      if (step) {
        part('[data-learn-status]').textContent = text.step(done, total);
        return;
      }
      part('[data-learn-status]').textContent = text.progress({ demo, counting, streak, score });
      countdown.count(counting || null);
    },
    /** End of a step-by-step run. */
    finishSteps({ wrong }) {
      finished = true;
      setPlaying(false);
      part('[data-learn-status]').textContent = text.stepsDone(wrong);
      result.show(text.stepsCard(wrong));
    },
    finish({ score, best, passed, early, demo }) {
      setPlaying(false);
      if (demo) {
        part('[data-learn-status]').textContent = text.yourTurn(mode);
        return;
      }
      if (score > (settings.lessons[item.id] ?? 0)) {
        settings.lessons[item.id] = score;
        saveSettings();
      }
      finished = true;
      passedRun = passed && index() < list.length - 1;
      setPlaying(false);
      part('[data-learn-status]').textContent = text.result({ passed, early, score, best });
      const level = SPEEDS.indexOf(speed);
      result.show(passed
        ? text.passCard({ score, best, last: index() === list.length - 1, faster: SPEEDS[level + 1] ?? null })
        : text.failCard({ score, slower: level > 0 ? SPEEDS[level - 1] : null }));
    },
  };
}
