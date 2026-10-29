// Drum player: plays a pad's sound from the current kit's sound set through the master output.
import { getAudio } from './engine.js';

/** @typedef {Record<string, (context: BaseAudioContext, output: AudioNode, time: number) => void>} SoundSet */

/** @type {SoundSet} */
let sounds = {};

/** Switches to a kit's sounds. @param {SoundSet} set each pad id mapped to its sound */
export function useSounds(set) {
  sounds = set;
}

/** The current kit's sounds (used to render a download). */
export const currentSounds = () => sounds;

/**
 * Plays the sound for one pad (nothing, if the current kit has no such pad).
 * @param {string} id pad id from the kit layout
 * @param {number} [time] when to play, on the audio clock (default: now)
 */
export function playDrum(id, time) {
  const play = sounds[id];
  if (!play) return;
  const { context, master } = getAudio();
  play(context, master, time ?? context.currentTime);
}
