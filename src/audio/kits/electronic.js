// Electronic kit sounds: a long booming kick, a snappy snare, sweeping toms, tight hats and bright cymbals,
// in the style of classic drum machines, all synthesized here.
import { decayEnvelope } from '../engine.js';
import { createNoise } from '../noise.js';
import { createMetal } from '../metal.js';

// A tone that sweeps from one pitch to another and fades.
function sweep(context, output, time, { from, to, glide, peak, decay, type = 'sine' }) {
  const tone = context.createOscillator();
  const volume = context.createGain();
  tone.type = type;
  tone.frequency.setValueAtTime(from, time);
  tone.frequency.exponentialRampToValueAtTime(to, time + glide);
  decayEnvelope(volume.gain, time, peak, decay);
  tone.connect(volume).connect(output);
  tone.start(time);
  tone.stop(time + decay + 0.05);
}

// Noise (and, if base is given, a metallic tone) through one filter, fading out.
function hiss(context, output, time, { filter, cutoff, q = 1, peak, decay, base }) {
  const shape = context.createBiquadFilter();
  const volume = context.createGain();
  shape.type = filter;
  shape.frequency.value = cutoff;
  shape.Q.value = q;
  decayEnvelope(volume.gain, time, peak, decay);
  createNoise(context, time, time + decay + 0.05).connect(shape);
  if (base) createMetal(context, base, time, time + decay + 0.05).connect(shape);
  shape.connect(volume).connect(output);
  return volume;
}

// The open hat still ringing in each audio context (live, or a download being rendered), so a closed hat can cut it off.
const ringingOpen = new WeakMap();
function chokeOpen(context, time) {
  ringingOpen.get(context)?.gain.setTargetAtTime(0, time, 0.01);
  ringingOpen.delete(context);
}

/** @type {import('../drums.js').SoundSet} */
export const ELECTRONIC_SOUNDS = {
  kick: (context, output, time) => {
    sweep(context, output, time, { from: 160, to: 40, glide: 0.12, peak: 1, decay: 0.7 });
    hiss(context, output, time, { filter: 'highpass', cutoff: 3000, peak: 0.2, decay: 0.01 });
  },
  snare: (context, output, time) => {
    sweep(context, output, time, { from: 230, to: 180, glide: 0.04, peak: 0.5, decay: 0.12, type: 'triangle' });
    hiss(context, output, time, { filter: 'highpass', cutoff: 1200, peak: 0.75, decay: 0.2 });
  },
  tom1: (context, output, time) => sweep(context, output, time, { from: 440, to: 210, glide: 0.25, peak: 0.85, decay: 0.4 }),
  tom2: (context, output, time) => sweep(context, output, time, { from: 320, to: 150, glide: 0.25, peak: 0.85, decay: 0.5 }),
  floorTom: (context, output, time) => sweep(context, output, time, { from: 220, to: 100, glide: 0.28, peak: 0.9, decay: 0.6 }),
  hihat: (context, output, time) => {
    chokeOpen(context, time);
    hiss(context, output, time, { filter: 'highpass', cutoff: 9000, peak: 1.1, decay: 0.045, base: 48 });
  },
  openHihat: (context, output, time) => {
    chokeOpen(context, time);
    const choke = context.createGain();
    hiss(context, choke, time, { filter: 'highpass', cutoff: 7000, peak: 0.9, decay: 0.5, base: 48 });
    choke.connect(output);
    ringingOpen.set(context, choke);
  },
  crashLeft: (context, output, time) => hiss(context, output, time, { filter: 'highpass', cutoff: 4500, peak: 0.55, decay: 1.4, base: 40 }),
  crashRight: (context, output, time) => hiss(context, output, time, { filter: 'highpass', cutoff: 6000, peak: 0.5, decay: 1.2, base: 56 }),
  splash: (context, output, time) => hiss(context, output, time, { filter: 'highpass', cutoff: 8000, peak: 0.55, decay: 0.35 }),
  ride: (context, output, time) => {
    hiss(context, output, time, { filter: 'bandpass', cutoff: 6000, q: 2, peak: 1.2, decay: 1.2, base: 120 });
    hiss(context, output, time, { filter: 'highpass', cutoff: 9000, peak: 0.1, decay: 1.6 });
  },
};
