// Painted hoops: a coloured hoop over a drum's chrome one (real kits come with colour-matched hoops), with its tension
// rods drawn again on top so the hardware still shows.
import { arc, n } from '../shared.js';

/**
 * @param {{x: number, y: number, r: number, lugs?: number}} pad
 * @param {string} color
 */
export function paintedHoop({ x, y, r, lugs = 10 }, color) {
  let rods = '';
  for (let i = 0; i < lugs; i++) {
    rods += `<circle cx="${x}" cy="${n(y - r * 0.968)}" r="${n(r * 0.03)}" style="fill: var(--metal-3)" stroke="#3a3d42"
      stroke-width="0.8" transform="rotate(${n((360 / lugs) * (i + 0.5))} ${x} ${y})"/>`;
  }
  return `
  <circle cx="${x}" cy="${y}" r="${n(r * 0.965)}" fill="none" stroke="${color}" stroke-width="${n(r * 0.07)}"/>
  ${arc(x, y, r * 0.965, 280, 350, `stroke="#fff" stroke-opacity="0.5" stroke-width="${n(r * 0.022)}"`)}
  ${arc(x, y, r * 0.965, 100, 170, `stroke="#000" stroke-opacity="0.35" stroke-width="${n(r * 0.03)}"`)}
  ${rods}`;
}
