// Beat grid: a small drum-machine view of the lesson in the lesson bar: one row per drum, one column per step, the
// count ("1 & 2 &") along the top, a dot where to hit, a Ready box that counts 4-3-2-1 and fills green while the line
// crosses it, and a line that sweeps across in time (or waits on a step, in step-by-step mode). Hit when the line
// reaches a dot; it then turns green (on time), amber (early or late) or red.
import { getAudio } from '../audio/engine.js';
import { counts, loopSteps } from '../learn/pattern.js';

// Rows from top to bottom, cymbals first, kick last (how drum grooves are usually written).
const ORDER = ['crashLeft', 'crashRight', 'splash', 'ride', 'openHihat', 'hihat', 'tom1', 'tom2', 'floorTom', 'snare', 'kick'];
const NAMES = { crashLeft: 'Crash', crashRight: 'Crash R', splash: 'Splash', ride: 'Ride', openHihat: 'Open HH', hihat: 'Hi-hat',
  tom1: 'Tom 1', tom2: 'Tom 2', floorTom: 'Floor', snare: 'Snare', kick: 'Kick' };

/** @param {HTMLElement} container */
export function createBeatGrid(container) {
  let timing = null;
  let frame = 0;

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
      return `<span class="grid-cell${beatStart}" data-cell="${pad}:${step}">${has.has(`${pad}:${step}`) ? '<i></i>' : ''}</span>`;
    }).join('');
    container.style.setProperty('--steps', String(steps));
    container.innerHTML = `
      <div class="grid-row grid-counts"><span class="grid-name"></span><span class="grid-lead-label">Ready</span>${counts(beat).map((label, step) =>
        `<span class="grid-count${step % split === 0 ? ' is-beat' : ''}">${label}</span>`).join('')}</div>
      ${pads.map((pad) => `<div class="grid-row"><span class="grid-name">${NAMES[pad]}</span><span class="grid-lead"></span>${cells(pad)}</div>`).join('')}
      <span class="grid-playhead" aria-hidden="true"></span>`;
  }

  // Moves the line in step with what is heard.
  function tick() {
    const line = container.querySelector('.grid-playhead');
    if (!timing || !line) return;
    const { context } = getAudio();
    const heard = context.currentTime - (context.outputLatency || 0);
    const loopLength = timing.loopSteps * timing.stepLength;
    const half = timing.stepLength / 2;
    const label = container.querySelector('.grid-lead-label');
    label.textContent = heard < timing.first ? String(Math.ceil((timing.first - heard) / timing.beatLength)) : 'Ready';
    label.classList.toggle('is-counting', heard < timing.first);
    // Count-in: the line crosses the Ready box (which fills green) and stays in it until the last half step, then
    // moves the short way onto the first dot, reaching it just as the first hit is due.
    const leadEnd = timing.first - half;
    const lead = Math.min(1, Math.max(0, 1 - (leadEnd - heard) / (timing.countIn - half)));
    container.style.setProperty('--lead-fill', heard < timing.first ? lead.toFixed(4) : '1');
    if (heard < leadEnd) {
      line.style.setProperty('--lead-in', lead.toFixed(4));
      line.style.setProperty('--progress', '0');
    } else if (heard < timing.first) {
      line.style.setProperty('--lead-in', '1');
      line.style.setProperty('--progress', ((heard - leadEnd) / loopLength).toFixed(4));
    } else {
      // The line crosses the middle of a step (where its dot is) at the moment to hit it.
      line.style.setProperty('--lead-in', '1');
      line.style.setProperty('--progress', ((((heard - timing.first) + half) % loopLength) / loopLength).toFixed(4));
    }
    if (heard - timing.first < timing.loops * loopLength + 0.3) frame = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(frame);
    timing = null;
    const label = container.querySelector('.grid-lead-label');
    if (label) {
      label.textContent = 'Ready';
      label.classList.remove('is-counting');
    }
    container.querySelector('.grid-playhead')?.style.setProperty('--progress', '0');
    container.querySelector('.grid-playhead')?.style.setProperty('--lead-in', '0');
    container.style.setProperty('--lead-fill', '0');
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
      line?.style.setProperty('--lead-in', '1');
      line?.style.setProperty('--progress', ((step + 0.5) / steps).toFixed(4));
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
