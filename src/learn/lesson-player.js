// Lesson player: runs a lesson or style beat on the audio clock: a bar of count-in clicks, then the pattern looped with
// a click on every beat. It books a cue for each note, judges your hits (allowing for the speakers' delay) and reports
// live stats and a final result. A demo run plays the pattern itself, looping until stopped, so you can hear it first. The
// beat clicks can be switched off; the count-in clicks always play. A run stops as soon as the pass is locked in.
import { getAudio } from '../audio/engine.js';
import { playClick } from '../audio/metronome.js';
import { startScheduler } from '../audio/scheduler.js';
import { createJudge } from './judge.js';
import { loopSteps } from './pattern.js';

const PASS = 80; // score needed to pass

/**
 * @param {{
 *   play: (pad: string, time: number) => void,
 *   cue: (pad: string, time: number) => void,
 *   feedback: (pad: string, verdict: string, step: number) => void,
 *   onStart: (timing: {first: number, stepLength: number, loopSteps: number, loops: number}) => void,
 *   onUpdate: (state: object) => void,
 *   onFinish: (result: {score: number, best: number, passed: boolean, demo: boolean}) => void,
 * }} hooks play sounds a note (demo), cue marks the moment a pad should be hit, feedback shows a verdict
 */
export function createLessonPlayer(hooks) {
  let stopScheduler = null;
  let judge = null;
  let running = false;
  let clickOn = true; // the beat clicks (the count-in always clicks); can change while a run plays

  // Speakers and Bluetooth add a delay: you hear (and answer) a click a little after it is booked.
  const delay = (context) => context.outputLatency || context.baseLatency || 0;

  function stop() {
    stopScheduler?.();
    stopScheduler = null;
    judge = null;
    running = false;
  }

  /**
   * @param {{bpm: number, bars: number, loops: number, beatsPerBar?: number, split?: number}} beat the lesson or beat
   * @param {Array<{step: number, pad: string}>} pattern its notes for the kit on stage
   * @param {number} speed 1 is normal speed
   * @param {boolean} demo true to play the pattern once instead of judging you
   * @param {boolean} [click] false to keep only the count-in clicks, not the beat clicks
   */
  function start(beat, pattern, speed, demo, click = true) {
    stop();
    const { context } = getAudio();
    const beatsPerBar = beat.beatsPerBar ?? 4;
    const beatLength = 60 / (beat.bpm * speed);
    const stepLength = beatLength / (beat.split ?? 2);
    const first = context.currentTime + 0.15 + beatsPerBar * beatLength;
    const loops = demo ? 50 : beat.loops; // a demo keeps looping until it is stopped
    const steps = loopSteps(beat);
    const notes = [];
    for (let loop = 0; loop < loops; loop++) {
      pattern.forEach((note) => notes.push({ pad: note.pad, step: note.step, time: first + (loop * steps + note.step) * stepLength }));
    }
    notes.sort((a, b) => a.time - b.time);
    const clicks = beatsPerBar + loops * beat.bars * beatsPerBar;
    const end = first + loops * steps * stepLength;
    judge = demo ? null : createJudge(notes);
    clickOn = click;
    running = true;
    hooks.onStart({ first, stepLength, loopSteps: steps, loops, countIn: beatsPerBar * beatLength, beatLength });
    let clicked = 0;
    let cued = 0;

    stopScheduler = startScheduler(context, (until) => {
      while (clicked < clicks && first + (clicked - beatsPerBar) * beatLength < until) {
        if (clickOn || clicked < beatsPerBar) playClick(first + (clicked - beatsPerBar) * beatLength, clicked % beatsPerBar === 0);
        clicked++;
      }
      while (cued < notes.length && notes[cued].time < until) {
        hooks.cue(notes[cued].pad, notes[cued].time);
        if (demo) hooks.play(notes[cued].pad, notes[cued].time);
        cued++;
      }
      const heard = context.currentTime - delay(context);
      judge?.sweep(heard).forEach((note) => hooks.feedback(note.pad, 'miss', note.step));
      const countdown = Math.ceil((first - heard) / beatLength);
      hooks.onUpdate({ demo, counting: heard < first ? Math.min(beatsPerBar, countdown) : 0, ...(judge?.stats() ?? {}) });
      const live = judge?.stats();
      // A run ends once the pass is locked in, or when the last note has gone by.
      if (live?.locked || heard > end + 0.3) {
        const stats = live ?? { score: 0, best: 0 };
        stop();
        hooks.onFinish({ score: stats.score, best: stats.best, passed: !demo && (live.locked || stats.score >= PASS), early: Boolean(live?.locked && heard < end), demo });
      }
    });
  }

  return {
    start,
    stop,
    /** Turns the beat clicks on or off, also during a run. @param {boolean} on */
    setClick(on) {
      clickOn = on;
    },
    isRunning: () => running,
    /** A hit on a pad during a run; judged against the notes, then shown. */
    hit(pad) {
      if (!judge) return;
      const { context } = getAudio();
      const result = judge.hit(pad, context.currentTime - delay(context));
      if (result) hooks.feedback(pad, result.verdict, result.note.step);
    },
  };
}
