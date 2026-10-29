// Cymbal sounds: crash left, crash right, splash and ride, from metallic tones and noise.
import { decayEnvelope } from './engine.js';
import { createMetal } from './metal.js';
import { createNoise } from './noise.js';

// Crashes and splash: a wash of metal and noise. base: metallic pitch, low/high: tone range in Hz,
// decay: ring time. Crash left is dark, crash right brighter, splash brightest and shortest.
const WASHES = {
  crashLeft: { base: 38, low: 1800, high: 7000, decay: 2.2, level: 0.8 },
  crashRight: { base: 58, low: 3500, high: 12000, decay: 1.6, level: 0.6 },
  splash: { base: 78, low: 7000, high: 20000, decay: 0.5, level: 0.6 },
};

function playWash(context, output, now, { base, low, high, decay, level }) {
  const end = now + decay + 0.05;
  const lowCut = context.createBiquadFilter();
  const highCut = context.createBiquadFilter();
  const volume = context.createGain();
  lowCut.type = 'highpass';
  lowCut.frequency.value = low;
  highCut.type = 'lowpass';
  highCut.frequency.value = high;
  decayEnvelope(volume.gain, now, level, decay);
  createMetal(context, base, now, end).connect(lowCut);
  createNoise(context, now, end).connect(lowCut);
  lowCut.connect(highCut).connect(volume).connect(output);
}

// Ride "ting": a few high tones at uneven ratios, like a struck bell, each fading at its own speed.
const RIDE_TONES = [
  { freq: 3150, peak: 0.14, decay: 1.4 },
  { freq: 4430, peak: 0.09, decay: 1.1 },
  { freq: 5870, peak: 0.06, decay: 0.8 },
  { freq: 7240, peak: 0.04, decay: 0.6 },
];

// Ride: the bell-like "ting" plus a stick tick, over a smooth shimmer that rings on.
function playRide(context, output, now) {
  for (const { freq, peak, decay } of RIDE_TONES) {
    const osc = context.createOscillator();
    const volume = context.createGain();
    osc.frequency.value = freq;
    decayEnvelope(volume.gain, now, peak, decay);
    osc.connect(volume).connect(output);
    osc.start(now);
    osc.stop(now + decay + 0.05);
  }

  const tick = context.createBiquadFilter();
  const tickVolume = context.createGain();
  tick.type = 'highpass';
  tick.frequency.value = 4000;
  decayEnvelope(tickVolume.gain, now, 0.3, 0.02);
  createNoise(context, now, now + 0.03).connect(tick).connect(tickVolume).connect(output);

  const shimmer = context.createBiquadFilter();
  const shimmerVolume = context.createGain();
  shimmer.type = 'highpass';
  shimmer.frequency.value = 7000;
  decayEnvelope(shimmerVolume.gain, now, 0.3, 2.5);
  createMetal(context, 60, now, now + 2.55).connect(shimmer);
  createNoise(context, now, now + 2.55).connect(shimmer);
  shimmer.connect(shimmerVolume).connect(output);
}

/**
 * Plays one cymbal hit.
 * @param {BaseAudioContext} context
 * @param {AudioNode} output
 * @param {'crashLeft' | 'crashRight' | 'splash' | 'ride'} type
 * @param {number} [time] when to play, on the audio clock (default: now)
 */
export function playCymbal(context, output, type, time = context.currentTime) {
  if (type === 'ride') playRide(context, output, time);
  else playWash(context, output, time, WASHES[type]);
}
