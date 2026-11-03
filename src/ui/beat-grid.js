// Beat grid: a small drum-machine view of the lesson in the lesson bar: one row per drum, one column per step, the
// count ("1 & 2 &") along the top, a dot where to hit in the drum family's colour (as on the pad grid and the recording
// timeline), and a line that sweeps across in time once the count-in ends (the count-in shows big on the kit), or waits
// on a step in step-by-step mode. Hit when the line reaches a dot; its ring then shows on time, early or late, or missed.
// The steps with a note are tinted in their family's colour, and the dots under the line light up briefly as it passes.
import { getAudio, heardDelay } from '../audio/engine.js';
import { counts, loopSteps } from '../learn/pattern.js';
import { roleOf } from '../kit/grid-layout.js';

// Rows from top to bottom, cymbals first, kick last (how drum grooves are usually written).
const ORDER = ['crashLeft', 'crashRight', 'splash', 'ride', 'openHihat', 'hihat', 'tom1', 'tom2', 'floorTom', 'snare', 'kick'];
const NAMES = { crashLeft: 'Crash', crashRight: 'Crash R', splash: 'Splash', ride: 'Ride', openHihat: 'Open HH', hihat: 'Hi-hat',
  tom1: 'Tom 1', tom2: 'Tom 2', floorTom: 'Floor', snare: 'Snare', kick: 'Kick' };

/** @param {HTMLElement} container */
export function createBeatGrid(container) {
  let timing = null;
  let frame = 0;
  let lit = -1; // the step the line is on

  // Lights the dots (and the count) of the step under the line; only notes light, so busy rows stay calm.
  function light(step) {
    if (step === lit) return;
    container.querySelectorAll('.is-now').forEach((cell) => cell.classList.remove('is-now'));
    lit = step;
    if (step < 0) return;
    container.querySelectorAll(`.has-note[data-cell$=":${step}"], [data-count="${step}"]`).forEach((cell) => cell.classList.add('is-now'));
  }

  /**
   * Draws a beat's grid.
   * @param {object} beat the lesson or style beat
   * @param {Array<{step: number, pad: string}>} pattern its notes for the kit on stage
   */
  function show(beat, pattern) {
    stop();
    const steps = loopSteps(beat);
    const split = beat.split ?? 2;
    const pads = ORDER.filter((pad) => pattern.some((note) => note.pad === pad));
    const has = new Set(pattern.map((note) => `${note.pad}:${note.step}`));
    const cells = (pad) => Array.from({ length: steps }, (_, step) => {
      const beatStart = step % split === 0 ? ' is-beat' : '';
      const note = has.has(`${pad}:${step}`);
      return `<span class="grid-cell${beatStart}${note ? ` has-note" data-role="${roleOf(pad)}` : ''}" data-cell="${pad}:${step}">${note ? '<i></i>' : ''}</span>`;
    }).join('');
    container.style.setProperty('--steps', String(steps));
    container.innerHTML = `
      <div class="grid-row grid-counts"><span class="grid-name"></span>${counts(beat).map((label, step) =>
        `<span class="grid-count${step % split === 0 ? ' is-beat' : ''}" data-count="${step}">${label}</span>`).join('')}</div>
      ${pads.map((pad) => `<div class="grid-row"><span class="grid-name">${NAMES[pad]}</span>${cells(pad)}</div>`).join('')}
      <span class="grid-playhead" aria-hidden="true"></span>`;
  }

  // Moves the line in step with what is heard.
  function tick() {
    const line = container.querySelector('.grid-playhead');
    if (!timing || !line) return;
    const { context } = getAudio();
    const heard = context.currentTime - heardDelay(context);
    const loopLength = timing.loopSteps * timing.stepLength;
    const half = timing.stepLength / 2;
    // During the count-in the line waits, hidden, at the start; in the last half step it slides onto the first dot,
    // reaching it just as the first hit is due. After that it crosses the middle of each step at the moment to hit it.
    const leadEnd = timing.first - half;
    line.classList.toggle('is-waiting', heard < leadEnd);
    const progress = heard < leadEnd ? 0 : heard < timing.first ? (heard - leadEnd) / loopLength : (((heard - timing.first) + half) % loopLength) / loopLength;
    line.style.setProperty('--progress', progress.toFixed(4));
    light(heard < timing.first - half ? -1 : Math.floor(progress * timing.loopSteps));
    if (heard - timing.first < timing.loops * loopLength + 0.3) frame = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frame);
    timing = null;
    light(-1);
    container.querySelector('.grid-playhead')?.style.setProperty('--progress', '0');
    container.querySelector('.grid-playhead')?.classList.remove('is-waiting');
  }

  return {
    show,
    /** Starts the line for a run. @param {{first: number, stepLength: number, loopSteps: number, loops: number}} t */
    start(t) {
      cancelAnimationFrame(frame);
      timing = t;
      container.querySelectorAll('[data-cell]').forEach((cell) => cell.removeAttribute('data-verdict'));
      frame = requestAnimationFrame(tick);
    },
    stop,
    /** Parks the line on a step (step-by-step mode). */
    setStep(step) {
      cancelAnimationFrame(frame);
      timing = null;
      const line = container.querySelector('.grid-playhead');
      const steps = Number(container.style.getPropertyValue('--steps')) || 1;
      line?.classList.remove('is-waiting');
      line?.style.setProperty('--progress', ((step + 0.5) / steps).toFixed(4));
      light(step);
    },
    /** Clears the colours from the last run. */
    reset() {
      container.querySelectorAll('[data-cell]').forEach((cell) => cell.removeAttribute('data-verdict'));
    },
    /** Colours the dot for a hit or a missed note. */
    mark(pad, step, verdict) {
      container.querySelector(`[data-cell="${pad}:${step}"]`)?.setAttribute('data-verdict', verdict);
    },
  };
}
