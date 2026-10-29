// Dampeners on drum heads, as drummers really use them: a plastic O-ring, small gel pads, gaffer tape and a leather
// snare wallet.
import { n } from '../shared.js';

// A point on a drum's head; angle in degrees, clockwise from up.
const at = (x, y, distance, angle) => {
  const rad = (angle * Math.PI) / 180;
  return { px: n(x + distance * Math.sin(rad)), py: n(y - distance * Math.cos(rad)) };
};

/** A thin see-through plastic ring lying round the edge of the head. */
export function oRing({ x, y, r }, color = '#f4f1ea') {
  return `
  <circle cx="${x}" cy="${y}" r="${n(r * 0.86)}" fill="none" stroke="${color}" stroke-opacity="0.45" stroke-width="${n(r * 0.13)}"/>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.795)}" fill="none" stroke="#000" stroke-opacity="0.15" stroke-width="1.2"/>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.86)}" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="1"
    stroke-dasharray="${n(r * 0.6)} ${n(r * 0.9)}"/>`;
}

/** Small soft gel pads near the edge of the head. */
export function gelPads({ x, y, r }, color, angles = [320, 40]) {
  const w = n(r * 0.16);
  const h = n(r * 0.11);
  return angles.map((angle) => {
    const { px, py } = at(x, y, r * 0.72, angle);
    return `<g transform="rotate(${angle} ${px} ${py})">
      <rect x="${n(px - w / 2)}" y="${n(py - h / 2)}" width="${w}" height="${h}" rx="${n(h * 0.4)}" fill="${color}" fill-opacity="0.7"
        stroke="${color}" stroke-width="1.5"/>
      <rect x="${n(px - w * 0.35)}" y="${n(py - h * 0.32)}" width="${n(w * 0.5)}" height="${n(h * 0.22)}" rx="${n(h * 0.1)}"
        fill="#fff" fill-opacity="0.35"/>
    </g>`;
  }).join('');
}

/** A strip of black gaffer tape stuck near the edge of the head, with a folded tab. */
export function tape({ x, y, r }, angle = 35) {
  const { px, py } = at(x, y, r * 0.66, angle);
  const w = n(r * 0.38);
  const h = n(r * 0.11);
  return `<g transform="rotate(${angle + 90} ${px} ${py})">
    <rect x="${n(px - w / 2)}" y="${n(py - h / 2)}" width="${w}" height="${h}" fill="#26272a" fill-opacity="0.92"/>
    <rect x="${n(px + w / 2 - h * 0.6)}" y="${n(py - h / 2)}" width="${n(h * 0.6)}" height="${h}" fill="#3b3c40"/>
    <line x1="${n(px - w / 2)}" y1="${n(py - h * 0.3)}" x2="${n(px + w / 2)}" y2="${n(py - h * 0.3)}" stroke="#fff"
      stroke-opacity="0.12" stroke-width="1"/>
  </g>`;
}

/** A leather flap clipped to the hoop that lies on the edge of the snare head (a "snare wallet"), with stitching. */
export function snareWallet({ x, y, r }, color = '#6b4423', angle = 140) {
  const w = n(r * 0.3);
  const top = n(y - r * 1.0);
  const h = n(r * 0.36);
  return `<g transform="rotate(${angle} ${x} ${y})">
    <rect x="${n(x - w / 2 + 3)}" y="${top + 4}" width="${w}" height="${h}" rx="${n(w * 0.18)}" fill="#000" fill-opacity="0.3"/>
    <rect x="${n(x - w / 2)}" y="${top}" width="${w}" height="${h}" rx="${n(w * 0.18)}" fill="${color}"/>
    <rect x="${n(x - w / 2 + 4)}" y="${top + 4}" width="${n(w - 8)}" height="${n(h - 8)}" rx="${n(w * 0.12)}" fill="none"
      stroke="#e9dcc0" stroke-opacity="0.6" stroke-width="1" stroke-dasharray="3 2"/>
    <rect x="${n(x - w * 0.3)}" y="${n(top - 3)}" width="${n(w * 0.6)}" height="8" rx="2" fill="url(#chrome)"/>
  </g>`;
}
