// Lesson bar: under the toolbar while you practise a lesson or style beat: its name and tip, the beat grid, a mode
// switch (In time keeps time; Step by step waits for you), Demo (loops until stopped), Start (the main button), and
// quieter controls for the click and the speed (remembered for each lesson), then the result (with 10% faster and
// Next). Lessons and beats are picked in the Learn drawer; best scores are remembered in this browser.
import { ICONS, METRONOME_PICTURE } from './icons.js';
import { attachTooltip } from './tooltip.js';
import { createBeatGrid } from './beat-grid.js';
import { setupLearnExtras } from './learn-extras.js';
import { learnPanelMarkup } from './learn-panel-markup.js';
import * as text from './learn-texts.js';
import { settings, saveSettings } from './storage.js';

const SPEEDS = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5];

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
  setupLearnExtras(panel); // the ⋮ dropdown on phones
  // The lesson's tip, as a caption at the bottom of the screen (it never takes clicks).
  const caption = document.createElement('p');
  caption.className = 'learn-caption';
  caption.hidden = true;
  document.body.append(caption);
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
    start.innerHTML = on && !demo ? `${ICONS.stop}<span>Stop</span>` : `${ICONS.play}<span>Start</span>`;
    start.classList.toggle('is-playing', on && !demo);
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
    caption.innerHTML = `<b>Tip:</b> ${item.tip}`;
    part('.learn-speed-value').textContent = `${Math.round(speed * 100)}%`;
    part('[data-learn=next]').hidden = true;
    part('[data-learn=push]').hidden = true;
    grid.show(item, player.pattern(item));
    player.focus(item);
  }
  function stopAll() {
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
      caption.hidden = true;
      closeListener();
    } else if (action === 'start') {
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
      // After a pass: 10% faster, straight into the next run.
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
      speed = SPEEDS.includes(settings.learnSpeeds[chosen.id]) ? settings.learnSpeeds[chosen.id] : 1;
      showMode();
      showItem();
      panel.hidden = false;
      caption.hidden = false;
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
        part('.learn-meta').textContent = text.step(done, total);
        return;
      }
      part('.learn-meta').textContent = text.progress({ demo, counting, streak, score });
    },
    /** End of a step-by-step run. */
    finishSteps({ wrong }) {
      setPlaying(false);
      part('.learn-meta').textContent = text.stepsDone(wrong);
    },
    finish({ score, best, passed, early, demo }) {
      setPlaying(false);
      if (demo) {
        part('.learn-meta').textContent = text.yourTurn(mode);
        return;
      }
      if (score > (settings.lessons[item.id] ?? 0)) {
        settings.lessons[item.id] = score;
        saveSettings();
      }
      part('.learn-meta').textContent = text.result({ passed, early, score, best });
      part('[data-learn=next]').hidden = !passed || index() === list.length - 1;
      part('[data-learn=push]').hidden = !passed || speed >= SPEEDS[SPEEDS.length - 1];
    },
  };
}
