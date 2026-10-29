// Kit list: each kit's layout joined with its sounds, in the order the Kit drawer shows them.
import { ACOUSTIC } from './acoustic.js';
import { ELECTRONIC } from './electronic.js';
import { JAZZ } from './jazz.js';
import { ACOUSTIC_SOUNDS } from '../../audio/kits/acoustic.js';
import { ELECTRONIC_SOUNDS } from '../../audio/kits/electronic.js';
import { JAZZ_SOUNDS } from '../../audio/kits/jazz.js';

/**
 * @typedef {{id: string, label: string, description: string, view: {width: number, height: number},
 *   pads: Array<object>, decor?: () => string, sounds: import('../../audio/drums.js').SoundSet}} Kit
 * @type {Kit[]}
 */
export const KITS = [
  { ...ACOUSTIC, sounds: ACOUSTIC_SOUNDS },
  { ...ELECTRONIC, sounds: ELECTRONIC_SOUNDS },
  { ...JAZZ, sounds: JAZZ_SOUNDS },
];

/** @param {string} id */
export const getKit = (id) => KITS.find((kit) => kit.id === id) ?? KITS[0];
