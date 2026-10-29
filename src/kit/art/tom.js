// Tom art: a drum seen from above, with a mount arm (rack toms) or three legs (floor tom).
import { drumTop, n } from './shared.js';

// Leg directions in degrees, clockwise from straight up; chosen to stay clear of the kick.
const LEG_ANGLES = [50, 165, 235];

function mountArm({ x, y, mount }) {
  return `
  <line x1="${mount.x}" y1="${mount.y}" x2="${x}" y2="${y}" style="stroke: var(--metal-solid)" stroke-width="16" stroke-linecap="round"/>
  <line x1="${mount.x}" y1="${mount.y}" x2="${x}" y2="${y}" stroke="#eef0f2" stroke-width="4" stroke-linecap="round"
    opacity="0.7"/>
  <rect x="${mount.x - 22}" y="${mount.y - 16}" width="44" height="32" rx="6" fill="url(#chrome)"
    stroke="#2b2e33" stroke-width="0.8"/>`;
}

function legs({ x, y, r }) {
  return LEG_ANGLES.map((angle) => `
  <g transform="rotate(${angle} ${x} ${y})">
    <line x1="${x}" y1="${n(y - r * 0.9)}" x2="${x}" y2="${n(y - r * 1.32)}" style="stroke: var(--metal-solid)"
      stroke-width="${n(r * 0.06)}" stroke-linecap="round"/>
    <line x1="${x}" y1="${n(y - r * 0.9)}" x2="${x}" y2="${n(y - r * 1.32)}" stroke="#eef0f2"
      stroke-width="${n(r * 0.02)}" stroke-linecap="round"/>
    <circle cx="${x}" cy="${n(y - r * 1.32)}" r="${n(r * 0.05)}" fill="#2a2c30"/>
  </g>`).join('');
}

/**
 * Draws a tom.
 * @param {{x: number, y: number, r: number, lugs: number, mount?: {x: number, y: number}, legs?: boolean}} pad
 */
export function drawTom(pad) {
  const support = pad.mount ? mountArm(pad) : pad.legs ? legs(pad) : '';
  return `<g>${support}${drumTop(pad, pad.lugs)}</g>`;
}
