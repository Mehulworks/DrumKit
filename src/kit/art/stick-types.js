// Stick types (part of the removable drumsticks feature): classic wood tip, nylon tip, rods, brushes, mallets and
// light-up sticks, with their accessories from stick-extras.js. Each is drawn along the y axis, butt at 0 and tip near -270,
// so sticks.js can move and spin any of them the same way. Wooden parts use the chosen stick colour (--stick-*).

import { drawExtras } from './stick-extras.js';

export const STICK_TYPES = [
  { id: 'classic', label: 'Classic', description: 'Wood tip. The everyday stick.' },
  { id: 'nylon', label: 'Nylon tip', description: 'A white nylon tip for a brighter ping.' },
  { id: 'rods', label: 'Rods', description: 'A bundle of thin dowels, lighter and softer.' },
  { id: 'brushes', label: 'Brushes', description: 'Fanned wires for soft, swishy grooves.' },
  { id: 'mallets', label: 'Mallets', description: 'Felt heads for rolls and soft swells.' },
  { id: 'glow', label: 'Light-up', description: 'Glowing sticks for a dark stage.' },
];

/** Gradients and patterns the sticks need, added once to the kit drawing's <defs>. */
export const stickDefs = () => `
  <linearGradient id="stick-wood" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" style="stop-color: var(--stick-edge)"/><stop offset="0.45" style="stop-color: var(--stick-body)"/>
    <stop offset="0.6" style="stop-color: var(--stick-tip)"/><stop offset="1" style="stop-color: var(--stick-edge)"/>
  </linearGradient>
  <pattern id="grip-wrap" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(35)">
    <rect width="6" height="1.2" fill="#000" fill-opacity="0.35"/>
  </pattern>
  <pattern id="grip-candy" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(35)">
    <rect width="10" height="10" fill="#f4f2ec"/><rect width="10" height="4.5" fill="#d6334a"/>
  </pattern>`;

const shaft = (top, half = 5, end = 3) => `<path d="M ${-half} 0 L ${half} 0 L ${end} ${top} L ${-end} ${top} Z" fill="url(#stick-wood)"/>`;
const shadow = (top) => `<path class="stick-shadow" d="M -5 0 L 5 0 L 3 ${top} L -3 ${top} Z" transform="translate(10 14)"/>`;

const DRAW = {
  classic: () => `${shadow(-270)}${shaft(-257)}<ellipse class="stick-tip" cx="0" cy="-266" rx="4" ry="7.5"/>`,
  nylon: () => `${shadow(-270)}${shaft(-257)}<ellipse cx="0" cy="-265" rx="4.2" ry="7" fill="#f7f7f2" stroke="#bdbdb4" stroke-width="0.8"/>
    <ellipse cx="-1.2" cy="-267" rx="1.2" ry="3" fill="#fff"/>`,
  rods: () => {
    const dowels = Array.from({ length: 7 }, (_, i) => {
      const spread = i - 3;
      return `<line x1="${spread * 1.3}" y1="-78" x2="${spread * 2}" y2="-268" style="stroke: var(--stick-body)" stroke-width="2.4"
        stroke-linecap="round"/>`;
    }).join('');
    return `${shadow(-268)}${dowels}<line x1="0" y1="-78" x2="0" y2="-268" style="stroke: var(--stick-edge)" stroke-width="0.8" opacity="0.6"/>
      <rect x="-7.5" y="-176" width="15" height="6" rx="2" fill="#c4231d"/>
      <rect x="-5.5" y="-80" width="11" height="80" rx="3" fill="#1f2023"/>`;
  },
  brushes: () => {
    const wires = Array.from({ length: 19 }, (_, i) => {
      const spread = (i - 9) * 1.9;
      return `<line x1="${(spread / 6).toFixed(1)}" y1="-188" x2="${spread.toFixed(1)}" y2="-268" stroke="#c9ced4" stroke-width="0.9"/>`;
    }).join('');
    return `${shadow(-268)}<g opacity="0.95">${wires}</g>
      <rect x="-4.5" y="-192" width="9" height="18" rx="2" fill="url(#chrome)"/>
      <rect x="-5" y="-176" width="10" height="176" rx="4" fill="#232428"/>
      ${[30, 50, 70, 90, 110].map((y) => `<line x1="-5" y1="${-y}" x2="5" y2="${-y}" stroke="#3a3c41" stroke-width="1.2"/>`).join('')}`;
  },
  mallets: () => `${shadow(-262)}${shaft(-244, 3.6, 2.6)}<circle cx="0" cy="-254" r="11.5" fill="#d9cbb0" stroke="#a8977a" stroke-width="1"/>
    <path d="M -11 -254 A 11 4 0 0 0 11 -254" fill="none" stroke="#a8977a" stroke-width="0.8"/>
    <ellipse cx="-4" cy="-259" rx="3.5" ry="2" fill="#fff" opacity="0.4"/>`,
  glow: () => `<path d="M -9 0 L 9 0 L 7 -268 L -7 -268 Z" fill="#2ff3ff" opacity="0.22"/>
    <path d="M -5 0 L 5 0 L 3 -262 L -3 -262 Z" fill="#c8fbff"/>
    <ellipse cx="0" cy="-266" rx="4.5" ry="7.5" fill="#eafeff"/>
    <rect x="-5.5" y="-40" width="11" height="40" rx="3" fill="#1d2a33"/>`,
};

/**
 * One stick with its accessories, drawn along the y axis.
 * @param {string} type one of STICK_TYPES
 * @param {{grip?: string, print?: string, cap?: string, ribbon?: string}} [extras] see stick-extras.js
 */
export function drawStick(type, extras) {
  return (DRAW[type] ?? DRAW.classic)() + drawExtras(extras);
}
