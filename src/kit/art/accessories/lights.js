// LED shell lights: a coloured glow inside a drum, seen through its clear head (real LED kits mount inside the shell).
import { n } from '../shared.js';

/**
 * @param {{id: string, x: number, y: number, r: number}} pad
 * @param {string} color
 */
export function ledGlow({ id, x, y, r }, color) {
  const glow = `led-glow-${id}`;
  return `
  <radialGradient id="${glow}">
    <stop offset="0" stop-color="${color}" stop-opacity="0.5"/>
    <stop offset="0.7" stop-color="${color}" stop-opacity="0.22"/>
    <stop offset="1" stop-color="${color}" stop-opacity="0.6"/>
  </radialGradient>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.93)}" fill="url(#${glow})"/>`;
}
