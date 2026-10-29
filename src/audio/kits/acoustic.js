// Studio kit sounds: each pad id mapped to its acoustic drum sound.
import { playKick } from '../kick.js';
import { playSnare } from '../snare.js';
import { playTom } from '../tom.js';
import { playClosedHat, playOpenHat } from '../hihat.js';
import { playCymbal } from '../cymbal.js';

/** @type {import('../drums.js').SoundSet} */
export const ACOUSTIC_SOUNDS = {
  kick: playKick,
  snare: playSnare,
  tom1: (context, output, time) => playTom(context, output, 220, 0.4, time),
  tom2: (context, output, time) => playTom(context, output, 160, 0.5, time),
  floorTom: (context, output, time) => playTom(context, output, 105, 0.75, time),
  hihat: playClosedHat,
  openHihat: playOpenHat,
  crashLeft: (context, output, time) => playCymbal(context, output, 'crashLeft', time),
  crashRight: (context, output, time) => playCymbal(context, output, 'crashRight', time),
  splash: (context, output, time) => playCymbal(context, output, 'splash', time),
  ride: (context, output, time) => playCymbal(context, output, 'ride', time),
};
