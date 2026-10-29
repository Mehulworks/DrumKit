// Audio engine: creates the shared AudioContext and the master output (volume -> EQ -> speakers) on first use.
import { createEq } from './eq.js';

let context = null;
let master = null;
let eq = null;

// Loudest master level: keeps the loudest hits (kick, snare) around 0.6, below the point where sound clips.
const FULL_VOLUME = 0.45;

// Kept here so changes made before the first hit still apply when audio starts.
const eqGains = {};
let masterLevel = FULL_VOLUME;

/**
 * Returns the AudioContext and master gain, creating them on the first call.
 * Call it from a click or key press: browsers only allow sound after a user gesture.
 * @returns {{ context: AudioContext, master: GainNode }}
 */
export function getAudio() {
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = masterLevel;
    eq = createEq(context, eqGains);
    master.connect(eq.input);
    eq.output.connect(context.destination);
  }
  if (context.state === 'suspended') {
    context.resume();
  }
  return { context, master };
}

/**
 * Sets one EQ band, now or (if audio has not started yet) as soon as it starts.
 * @param {string} id band id: 'bass', 'mid' or 'treble'
 * @param {number} db gain in dB
 */
export function setEqGain(id, db) {
  eqGains[id] = db;
  eq?.setGain(id, db);
}

/** The current master level and EQ gains, so a download can be rendered with the same sound. */
export const mixSettings = () => ({ level: masterLevel, eqGains: { ...eqGains } });

/**
 * Sets the master volume.
 * @param {number} percent 0 (silent) to 100 (full)
 */
export function setMasterVolume(percent) {
  // Squared so the slider feels even to the ear (hearing is not linear).
  masterLevel = FULL_VOLUME * (percent / 100) ** 2;
  master?.gain.setTargetAtTime(masterLevel, context.currentTime, 0.02);
}

/**
 * Starts the audio on the user's first touch, click or key press. Some phones (iPhone in particular)
 * only allow sound to start on certain gestures, so several are listened to.
 */
export function unlockAudioOnFirstGesture() {
  const events = ['pointerdown', 'touchend', 'click', 'keydown'];
  const unlock = () => {
    getAudio();
    events.forEach((name) => window.removeEventListener(name, unlock, true));
  };
  events.forEach((name) => window.addEventListener(name, unlock, true));
}

/**
 * Shapes a gain into a drum hit: a very short rise (avoids clicks) then a fast fade.
 * @param {AudioParam} gain
 * @param {number} time start time in seconds
 * @param {number} peak loudest level
 * @param {number} decay seconds until the hit has faded out
 */
export function decayEnvelope(gain, time, peak, decay) {
  gain.setValueAtTime(0, time);
  gain.linearRampToValueAtTime(peak, time + 0.002);
  gain.exponentialRampToValueAtTime(0.001, time + decay);
}
