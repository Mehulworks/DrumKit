// Intro sting: a short "ba-dum-tss" (snare, tom, then kick and crash together) played by the current kit's own
// synthesized sounds, once per page load. It tries to play as soon as the page loads; most browsers only allow sound
// after the user touches the page, so in that case it plays on the first touch, click or key press instead.
// It is a generic drum rhythm, not taken from any recording.
import { getAudio } from './engine.js';

// When each hit lands, in seconds after the start.
const STING = [
  { id: 'snare', at: 0 },
  { id: 'tom1', at: 0.17 },
  { id: 'kick', at: 0.42 },
  { id: 'crashLeft', at: 0.42 },
];
// On load, wait for the kit to settle in before playing.
const LOAD_DELAY = 0.7;

/**
 * @param {(id: string, time: number) => void} play books one hit at an exact audio-clock time (sound and glow)
 */
export function playIntro(play) {
  const events = ['pointerdown', 'keydown'];
  let played = false;
  const start = (delay) => {
    if (played) return;
    played = true;
    events.forEach((name) => window.removeEventListener(name, onGesture, true));
    const begin = getAudio().context.currentTime + delay;
    STING.forEach(({ id, at }) => play(id, begin + at));
  };
  const onGesture = () => start(0.06);
  events.forEach((name) => window.addEventListener(name, onGesture, true));

  // Try at once. If the browser blocks sound for now, the audio waits (suspended) and the first gesture plays it.
  const { context } = getAudio();
  if (context.state === 'running') start(LOAD_DELAY);
  else context.resume().then(() => { if (context.state === 'running') start(LOAD_DELAY); }).catch(() => {});
}
