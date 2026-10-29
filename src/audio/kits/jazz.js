// Jazz kit sounds: a higher, shorter 18" kick, a soft brushy snare, singing toms, and dark cymbals with a big ride.
import { decayEnvelope } from '../engine.js';
import { createNoise } from '../noise.js';
import { playTom } from '../tom.js';
import { playClosedHat, playOpenHat } from '../hihat.js';
import { playCymbal } from '../cymbal.js';

// A small kick: higher pitch, short and round, with only a soft felt tap.
function kick(context, output, time) {
  const tone = context.createOscillator();
  const volume = context.createGain();
  tone.frequency.setValueAtTime(110, time);
  tone.frequency.exponentialRampToValueAtTime(58, time + 0.08);
  decayEnvelope(volume.gain, time, 0.9, 0.32);
  tone.connect(volume).connect(output);
  tone.start(time);
  tone.stop(time + 0.36);

  const tap = context.createBiquadFilter();
  const tapVolume = context.createGain();
  tap.type = 'lowpass';
  tap.frequency.value = 1500;
  decayEnvelope(tapVolume.gain, time, 0.15, 0.02);
  createNoise(context, time, time + 0.03).connect(tap).connect(tapVolume).connect(output);
}

// A softer snare: a lighter body and a brushy swish instead of a hard crack.
function snare(context, output, time) {
  const body = context.createOscillator();
  const bodyVolume = context.createGain();
  body.type = 'triangle';
  body.frequency.setValueAtTime(300, time);
  body.frequency.exponentialRampToValueAtTime(230, time + 0.05);
  decayEnvelope(bodyVolume.gain, time, 0.45, 0.1);
  body.connect(bodyVolume).connect(output);
  body.start(time);
  body.stop(time + 0.14);

  const swish = context.createBiquadFilter();
  const swishVolume = context.createGain();
  swish.type = 'bandpass';
  swish.frequency.value = 3000;
  swish.Q.value = 0.8;
  decayEnvelope(swishVolume.gain, time, 0.4, 0.3);
  createNoise(context, time, time + 0.32).connect(swish).connect(swishVolume).connect(output);
}

/** @type {import('../drums.js').SoundSet} */
export const JAZZ_SOUNDS = {
  kick,
  snare,
  tom1: (context, output, time) => playTom(context, output, 200, 0.7, time),
  floorTom: (context, output, time) => playTom(context, output, 125, 0.95, time),
  hihat: playClosedHat,
  openHihat: playOpenHat,
  ride: (context, output, time) => playCymbal(context, output, 'ride', time),
  crashLeft: (context, output, time) => playCymbal(context, output, 'crashLeft', time),
};
