// Kick drum sound: a deep tone that drops fast in pitch, plus a short beater click.
import { decayEnvelope } from './engine.js';
import { createNoise } from './noise.js';

/**
 * Plays one kick hit.
 * @param {BaseAudioContext} context
 * @param {AudioNode} output where the sound is sent (the master gain)
 * @param {number} [time] when to play, on the audio clock (default: now)
 */
export function playKick(context, output, time = context.currentTime) {
  const now = time;

  // Body: the pitch drop gives the "thump".
  const tone = context.createOscillator();
  const volume = context.createGain();
  tone.type = 'sine';
  tone.frequency.setValueAtTime(130, now);
  tone.frequency.exponentialRampToValueAtTime(48, now + 0.09);
  decayEnvelope(volume.gain, now, 1, 0.45);
  tone.connect(volume).connect(output);
  tone.start(now);
  tone.stop(now + 0.5);

  // Beater click: a very short, bright tap at the start.
  const click = createNoise(context, now, now + 0.02);
  const brighten = context.createBiquadFilter();
  const clickVolume = context.createGain();
  brighten.type = 'highpass';
  brighten.frequency.value = 2000;
  decayEnvelope(clickVolume.gain, now, 0.35, 0.012);
  click.connect(brighten).connect(clickVolume).connect(output);
}
