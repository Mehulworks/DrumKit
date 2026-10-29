// Hi-hat sounds: closed and open, where a closed hit cuts off a ringing open one.
import { decayEnvelope } from './engine.js';
import { createMetal } from './metal.js';
import { createNoise } from './noise.js';

// Volume control of the open hi-hat still ringing in each audio context (live, or a download being rendered), so it can be choked.
const ringingOpen = new WeakMap();

// Metallic tone and noise, filtered to the high "tss" range of a hi-hat.
function hat(context, now, decay, level, cutoff) {
  const end = now + decay + 0.05;
  const high = context.createBiquadFilter();
  const volume = context.createGain();
  high.type = 'highpass';
  high.frequency.value = cutoff;
  decayEnvelope(volume.gain, now, level, decay);
  createMetal(context, 40, now, end).connect(high);
  const noiseVolume = context.createGain();
  noiseVolume.gain.value = 0.5;
  createNoise(context, now, end).connect(noiseVolume).connect(high);
  high.connect(volume);
  return volume;
}

function chokeOpen(context, time) {
  ringingOpen.get(context)?.gain.setTargetAtTime(0, time, 0.015);
  ringingOpen.delete(context);
}

/**
 * Plays a closed hi-hat hit: a short, tight "tick".
 * @param {BaseAudioContext} context
 * @param {AudioNode} output
 * @param {number} [time] when to play, on the audio clock (default: now)
 */
export function playClosedHat(context, output, time = context.currentTime) {
  chokeOpen(context, time);
  hat(context, time, 0.06, 1.1, 8000).connect(output);
}

/**
 * Plays an open hi-hat hit: a longer, fuller "tssss".
 * @param {BaseAudioContext} context
 * @param {AudioNode} output
 * @param {number} [time] when to play, on the audio clock (default: now)
 */
export function playOpenHat(context, output, time = context.currentTime) {
  chokeOpen(context, time);
  const choke = context.createGain();
  hat(context, time, 0.8, 0.9, 5500).connect(choke).connect(output);
  ringingOpen.set(context, choke);
}
