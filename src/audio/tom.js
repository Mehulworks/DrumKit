// Tom sound: a drum-head tone that settles slightly in pitch, a second head tone, and a stick "tok".
import { decayEnvelope } from './engine.js';
import { createNoise } from './noise.js';

// A round drum head also vibrates at about 1.59 times its main pitch.
const SECOND_MODE = 1.59;

function tone(context, output, start, end, startPitch, pitch, peak, decay) {
  const osc = context.createOscillator();
  const volume = context.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(startPitch, start);
  osc.frequency.exponentialRampToValueAtTime(pitch, start + 0.15);
  decayEnvelope(volume.gain, start, peak, decay);
  osc.connect(volume).connect(output);
  osc.start(start);
  osc.stop(end);
}

/**
 * Plays one tom hit.
 * @param {BaseAudioContext} context
 * @param {AudioNode} output
 * @param {number} pitch resting pitch in Hz (lower for bigger toms)
 * @param {number} decay seconds until the hit has faded out
 * @param {number} [time] when to play, on the audio clock (default: now)
 */
export function playTom(context, output, pitch, decay, time = context.currentTime) {
  const now = time;
  const end = now + decay + 0.05;

  // Main tone: a small, slow drop (a big fast drop sounds like a synth "pew").
  tone(context, output, now, end, pitch * 1.25, pitch, 0.9, decay);
  // Second head tone: steady, quieter and shorter.
  const mode = pitch * SECOND_MODE;
  tone(context, output, now, end, mode * 1.1, mode, 0.2, decay * 0.4);

  // Stick "tok": a short burst of mid-range noise.
  const stick = createNoise(context, now, now + 0.06);
  const band = context.createBiquadFilter();
  const stickVolume = context.createGain();
  band.type = 'bandpass';
  band.frequency.value = 2500;
  band.Q.value = 0.8;
  decayEnvelope(stickVolume.gain, now, 0.5, 0.04);
  stick.connect(band).connect(stickVolume).connect(output);
}
