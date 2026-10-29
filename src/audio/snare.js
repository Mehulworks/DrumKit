// Snare drum sound: a short tuned body plus bright noise for the snare wires.
import { decayEnvelope } from './engine.js';
import { createNoise } from './noise.js';

/**
 * Plays one snare hit.
 * @param {BaseAudioContext} context
 * @param {AudioNode} output
 * @param {number} [time] when to play, on the audio clock (default: now)
 */
export function playSnare(context, output, time = context.currentTime) {
  const now = time;

  // Body: the drum shell's short tone.
  const body = context.createOscillator();
  const bodyVolume = context.createGain();
  body.type = 'triangle';
  body.frequency.setValueAtTime(240, now);
  body.frequency.exponentialRampToValueAtTime(175, now + 0.05);
  decayEnvelope(bodyVolume.gain, now, 0.7, 0.14);
  body.connect(bodyVolume).connect(output);
  body.start(now);
  body.stop(now + 0.2);

  // Wires: filtered noise that rattles a little longer.
  const wires = createNoise(context, now, now + 0.3);
  const brighten = context.createBiquadFilter();
  const wiresVolume = context.createGain();
  brighten.type = 'highpass';
  brighten.frequency.value = 1500;
  decayEnvelope(wiresVolume.gain, now, 0.6, 0.24);
  wires.connect(brighten).connect(wiresVolume).connect(output);
}
