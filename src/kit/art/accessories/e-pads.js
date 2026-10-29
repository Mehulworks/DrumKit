// Electronic kit accessories: coloured mesh heads and pad rims (both sold for real e-kits), a coloured edge on the
// cymbal pads, and the spots on the kick tower where stickers fit.
import { n } from '../shared.js';

/** A coloured mesh head over the pad's dark one. @param {{x: number, y: number, r: number}} pad */
export const meshTint = ({ x, y, r }, color) =>
  `<circle cx="${x}" cy="${y}" r="${n(r * 0.8)}" fill="${color}" fill-opacity="0.38"/>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.8)}" fill="url(#mesh)"/>`;

/** A coloured rim over the pad's chrome one. @param {{x: number, y: number, r: number}} pad */
export const padRim = ({ x, y, r }, color) =>
  `<circle cx="${x}" cy="${y}" r="${n(r * 0.95)}" fill="none" stroke="${color}" stroke-width="${n(r * 0.06)}"/>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.95)}" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"
    stroke-dasharray="${n(r * 0.8)} ${n(r * 1.2)}"/>`;

/** A coloured edge zone on a rubber cymbal pad. @param {{x: number, y: number, r: number}} pad */
export const cymbalPadEdge = ({ x, y, r }, color) =>
  `<circle cx="${x}" cy="${y}" r="${n(r * 0.96)}" fill="none" stroke="${color}" stroke-opacity="0.75" stroke-width="${n(r * 0.06)}"/>`;

/**
 * Spots on the kick tower's top for stickers (between its light strip and its mesh pad).
 * @param {{x: number, y: number, w: number, h: number}} tower
 */
export const towerSpots = ({ x, y, w, h }) => [
  { x: x - w * 0.24, y: y - h * 0.06 },
  { x: x + w * 0.24, y: y - h * 0.04 },
];
