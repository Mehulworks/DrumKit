// Snare art: a drum seen from above with ten lugs and the snare throw-off on its side.
import { drumTop, n } from './shared.js';

/**
 * Draws the snare drum.
 * @param {{x: number, y: number, r: number}} pad
 */
export function drawSnare(pad) {
  const { x, y, r } = pad;
  return `
  <g>
    ${drumTop(pad, 10)}
    <g transform="rotate(252 ${x} ${y})">
      <rect x="${n(x - r * 0.025)}" y="${n(y - r * 1.32)}" width="${n(r * 0.05)}" height="${n(r * 0.16)}"
        rx="${n(r * 0.02)}" fill="#1f2125"/>
      <rect x="${n(x - r * 0.07)}" y="${n(y - r * 1.2)}" width="${n(r * 0.14)}" height="${n(r * 0.17)}"
        rx="${n(r * 0.025)}" fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.8"/>
    </g>
  </g>`;
}
