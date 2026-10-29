// Small things drummers put on a kit: glow-tape marks on hoops (for dark stages) and coloured felts under a cymbal's
// wing nut.
import { arc, n } from '../shared.js';

/**
 * Short strips of glow-in-the-dark tape on the hoop, so the drum can be found on a dark stage.
 * @param {{x: number, y: number, r: number}} pad
 */
export function glowTape({ x, y, r }, color = '#c8ff7a') {
  return [20, 140, 260].map((at) =>
    arc(x, y, r * 0.965, at, at + 14, `stroke="${color}" stroke-width="${n(r * 0.05)}" stroke-linecap="butt" opacity="0.9"`)).join('');
}

/**
 * A coloured felt washer showing round the wing nut of a cymbal.
 * @param {{x: number, y: number, r: number}} pad
 */
export function cymbalFelt({ x, y, r }, color) {
  const s = Math.max(r * 0.045, 6);
  return `<circle cx="${x}" cy="${y}" r="${n(s * 2.7)}" fill="none" stroke="${color}" stroke-width="${n(s * 0.9)}"/>
    <circle cx="${x}" cy="${y}" r="${n(s * 3.1)}" fill="none" stroke="#000" stroke-opacity="0.3" stroke-width="1"/>`;
}
