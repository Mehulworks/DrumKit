// Look-ahead scheduler: a timer wakes up often and books sounds slightly ahead on the audio clock, so timing stays tight.

// How far ahead to book sounds (seconds), and how often to wake up (milliseconds).
const LOOK_AHEAD = 0.12;
const WAKE_EVERY_MS = 25;

/**
 * Calls bookUntil(time) repeatedly; it should schedule every sound due before that audio-clock time.
 * @param {BaseAudioContext} context
 * @param {(until: number) => void} bookUntil
 * @returns {() => void} call to stop
 */
export function startScheduler(context, bookUntil) {
  const tick = () => bookUntil(context.currentTime + LOOK_AHEAD);
  const timer = setInterval(tick, WAKE_EVERY_MS);
  tick();
  return () => clearInterval(timer);
}
