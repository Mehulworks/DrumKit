// Extra percussion: a jingle ring that sits on the hi-hat's top cymbal (a real hi-hat tambourine), so it shakes on
// every hit.
import { n } from '../shared.js';

/**
 * @param {{x: number, y: number, r: number}} pad
 * @param {string} frame colour of the ring
 */
export function hihatTambourine({ x, y, r }, frame = '#1e1f22') {
  const ring = r * 0.3;
  const jingles = [45, 135, 225, 315].map((angle) => {
    const rad = (angle * Math.PI) / 180;
    const jx = n(x + ring * Math.sin(rad));
    const jy = n(y - ring * Math.cos(rad));
    const s = n(r * 0.062);
    return `<g transform="rotate(${angle} ${jx} ${jy})">
      <rect x="${n(jx - s * 1.3)}" y="${n(jy - s * 0.75)}" width="${n(s * 2.6)}" height="${n(s * 1.5)}" rx="${n(s * 0.3)}" fill="#000"
        fill-opacity="0.5"/>
      <circle cx="${n(jx - s * 0.45)}" cy="${jy}" r="${s}" fill="url(#chrome)" stroke="#3a3d42" stroke-width="0.8"/>
      <circle cx="${n(jx + s * 0.45)}" cy="${jy}" r="${s}" fill="url(#chrome)" stroke="#3a3d42" stroke-width="0.8"/>
      <circle cx="${n(jx + s * 0.45)}" cy="${jy}" r="${n(s * 0.25)}" fill="#3a3d42"/>
    </g>`;
  }).join('');
  return `
  <circle cx="${n(x + 3)}" cy="${n(y + 5)}" r="${n(ring)}" fill="none" stroke="#000" stroke-opacity="0.35" stroke-width="${n(r * 0.07)}"/>
  <circle cx="${x}" cy="${y}" r="${n(ring)}" fill="none" stroke="${frame}" stroke-width="${n(r * 0.07)}"/>
  <circle cx="${x}" cy="${y}" r="${n(ring - r * 0.02)}" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="1.5"/>
  ${jingles}`;
}
