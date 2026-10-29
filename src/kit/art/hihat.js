// Hi-hat art: two cymbals on a stand seen from above, closed or with the top cymbal lifted (open).
import { cymbalBody } from './cymbal.js';
import { n } from './shared.js';

function clutch(x, y, r) {
  const s = r * 0.075;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const rad = (i * Math.PI) / 3;
    return `${n(x + s * Math.cos(rad))},${n(y + s * Math.sin(rad))}`;
  }).join(' ');
  return `
  <circle cx="${x}" cy="${y}" r="${n(s * 1.5)}" fill="#2a2522"/>
  <polygon points="${hex}" fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.8"/>
  <circle cx="${x}" cy="${y}" r="${n(s * 0.35)}" fill="#1d1f22"/>`;
}

/**
 * Draws a hi-hat. When open, the bottom cymbal shows below the lifted top one.
 * @param {{x: number, y: number, r: number, open?: boolean}} pad
 */
export function drawHihat({ x, y, r, open }) {
  const bottom = open ? cymbalBody(n(x + r * 0.06), n(y + r * 0.09), r, { lift: 0.06, angle: 150 }) : '';
  const top = cymbalBody(x, y, r, { lift: open ? 0.3 : 0.12, angle: -25 });
  // The top cymbal and clutch are one group, so motion.js can lift or close it on its own.
  return `<g>${bottom}<g class="hihat-top">${top}${clutch(x, y, r)}</g></g>`;
}
