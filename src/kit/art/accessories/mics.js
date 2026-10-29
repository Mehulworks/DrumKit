// Clip-on drum mics: a small mic clamped to a drum's hoop, pointing in at the head, with its cable running away.
import { n } from '../shared.js';

/**
 * @param {{x: number, y: number, r: number}} pad
 * @param {number} angle where on the hoop it sits, in degrees clockwise from up
 */
export function clipMic({ x, y, r }, angle) {
  const s = Math.max(r * 0.11, 10);
  const rim = y - r * 0.97;
  const grille = y - r * 0.64;
  return `<g transform="rotate(${angle} ${x} ${y})">
    <path d="M${x} ${n(rim)} C${n(x + s)} ${n(y - r * 1.25)} ${n(x - s * 2)} ${n(y - r * 1.4)} ${n(x + s * 0.5)} ${n(y - r * 1.6)}"
      fill="none" stroke="#141518" stroke-width="${n(s * 0.35)}" stroke-linecap="round"/>
    <rect x="${n(x - s * 0.7)}" y="${n(rim - s * 0.6)}" width="${n(s * 1.4)}" height="${n(s * 1.2)}" rx="${n(s * 0.25)}"
      fill="url(#dark-metal)" stroke="#000" stroke-opacity="0.6"/>
    <rect x="${n(x - s * 0.42)}" y="${n(rim)}" width="${n(s * 0.84)}" height="${n(grille - rim)}" rx="${n(s * 0.4)}"
      fill="#232428" stroke="#000" stroke-opacity="0.6"/>
    <rect x="${n(x - s * 0.22)}" y="${n(rim + s * 0.4)}" width="${n(s * 0.16)}" height="${n(grille - rim - s * 0.9)}"
      rx="${n(s * 0.08)}" fill="#fff" fill-opacity="0.2"/>
    <circle cx="${x}" cy="${n(grille)}" r="${n(s * 0.48)}" fill="#55595f" stroke="#1a1b1e" stroke-width="1"/>
    <circle cx="${x}" cy="${n(grille)}" r="${n(s * 0.3)}" fill="none" stroke="#8a8f96" stroke-width="0.8"
      stroke-dasharray="1.5 1.5"/>
  </g>`;
}
