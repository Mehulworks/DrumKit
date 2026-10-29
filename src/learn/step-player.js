// Step-by-step player: a lesson with no clock. The beat waits on each step until you hit every drum it asks for (in any
// order), then moves to the next, so you can learn where the hits go before playing them in time. Wrong drums are
// pointed out, never counted against you.
import { loopSteps } from './pattern.js';

/**
 * @param {{
 *   show: (step: number, pads: string[]) => void,
 *   feedback: (pad: string, verdict: string, step: number) => void,
 *   onUpdate: (state: object) => void,
 *   onFinish: (result: {steps: number, wrong: number}) => void,
 * }} hooks show puts the beat on a step and lights its drums; feedback marks a hit (onTime) or a wrong drum
 */
export function createStepPlayer(hooks) {
  let groups = [];
  let at = 0;
  let remaining = new Set();
  let wrong = 0;
  let running = false;

  function showCurrent() {
    const group = groups[at];
    remaining = new Set(group.pads);
    hooks.show(group.step, group.pads);
    hooks.onUpdate({ step: true, done: at, total: groups.length });
  }

  return {
    /**
     * @param {{bars: number, beatsPerBar?: number, split?: number}} beat
     * @param {Array<{step: number, pad: string}>} pattern its notes for the kit on stage
     * @param {number} loops how many times through
     */
    start(beat, pattern, loops = 2) {
      const steps = loopSteps(beat);
      const byStep = new Map();
      pattern.forEach((note) => byStep.set(note.step, [...(byStep.get(note.step) ?? []), note.pad]));
      groups = [];
      for (let loop = 0; loop < loops; loop++) {
        [...byStep.keys()].sort((a, b) => a - b).forEach((step) => groups.push({ step, pads: byStep.get(step), index: loop * steps + step }));
      }
      at = 0;
      wrong = 0;
      running = groups.length > 0;
      if (running) showCurrent();
    },
    stop() {
      running = false;
    },
    isRunning: () => running,
    /** A hit: ticks off a drum the step asks for, or points out a wrong one. */
    hit(pad) {
      if (!running) return;
      const group = groups[at];
      if (!remaining.has(pad)) {
        wrong++;
        hooks.feedback(pad, 'wrong', group.step);
        return;
      }
      remaining.delete(pad);
      hooks.feedback(pad, 'onTime', group.step);
      if (remaining.size) return;
      at++;
      if (at < groups.length) {
        showCurrent();
      } else {
        running = false;
        hooks.onFinish({ steps: groups.length, wrong });
      }
    },
  };
}
