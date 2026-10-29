// Chains: a ball "sizzle" chain hung from a cymbal's wing nut, a ring of loose beads round a cymbal's bell (both make a
// buzzing ride or crash) and a link chain draped over the kick drum's shell.
import { n } from '../shared.js';

// A row of beads along a path: round dots of the line's width, spaced by the dash gap.
const beads = (d, color, width, gap) => `
  <path d="${d}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="${width}" stroke-dasharray="0 ${gap}"
    stroke-linecap="round" transform="translate(2 3)"/>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="0 ${gap}" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="${n(width * 0.35)}" stroke-dasharray="0 ${gap}"
    stroke-linecap="round" transform="translate(-1 -1)"/>`;

/**
 * A ball chain hanging from the centre of a cymbal and lying in a loop on its bow.
 * @param {{x: number, y: number, r: number}} pad
 */
export function sizzleChain({ x, y, r }, color = '#d8dbe0') {
  const tip = { x: n(x + r * 0.55), y: n(y + r * 0.62) };
  const d = `M${x} ${y} Q${n(x + r * 0.05)} ${n(y + r * 0.7)} ${tip.x} ${tip.y} Q${n(x + r * 0.8)} ${n(y + r * 0.2)} ${x} ${y}`;
  return beads(d, color, n(r * 0.035), n(r * 0.05));
}

/**
 * A bead rattler: a ring of loose metal beads sitting on the cymbal round its bell (a no-drill sizzle).
 * @param {{x: number, y: number, r: number}} pad
 */
export function rattler({ x, y, r }, color = '#d8dbe0') {
  const ring = n(r * 0.26);
  const d = `M${n(x - ring)} ${y} A${ring} ${ring} 0 1 1 ${n(x + ring)} ${y} A${ring} ${ring} 0 1 1 ${n(x - ring)} ${y}`;
  return beads(d, color, n(r * 0.04), n(r * 0.065));
}

/**
 * A heavy link chain draped across the kick shell, hanging lowest in the middle.
 * @param {{x: number, y: number, w: number, h: number}} pad
 */
export function kickChain({ x, y, w, h }, color = '#cfd3d8') {
  const top = y - h / 2;
  const end = top + h * 0.3;
  const sag = 2 * (y + h * 0.38) - end;
  const d = `M${n(x - w / 2 + 8)} ${n(end)} Q${x} ${n(sag)} ${n(x + w / 2 - 8)} ${n(end)}`;
  const link = n(h * 0.05);
  return `
  <path d="${d}" fill="none" stroke="#000" stroke-opacity="0.4" stroke-width="${n(link * 0.75)}" stroke-dasharray="${link} ${n(link * 0.3)}"
    transform="translate(3 5)"/>
  <path d="${d}" fill="none" stroke="${color}" stroke-width="${n(link * 0.7)}" stroke-dasharray="${link} ${n(link * 0.3)}"
    stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="#111" stroke-opacity="0.7" stroke-width="${n(link * 0.22)}"
    stroke-dasharray="${n(link * 0.55)} ${n(link * 0.75)}" stroke-dashoffset="${n(-link * 0.2)}"/>
  <path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.5" stroke-dasharray="${link} ${n(link * 0.3)}"
    transform="translate(-1 -2)"/>`;
}
