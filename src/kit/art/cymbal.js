// Cymbal art: a bronze cymbal seen from above with lathe rings, hammer marks, an aged edge, a bell, light sheen and a wing nut.
import { n } from './shared.js';

// A thin slice of light from the centre to the edge; angles in degrees, clockwise from up.
function wedge(x, y, r, centre, span, opacity) {
  const point = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return `${n(x + r * Math.sin(rad))} ${n(y - r * Math.cos(rad))}`;
  };
  return `<path d="M ${x} ${y} L ${point(centre - span / 2)} A ${r} ${r} 0 0 1 ${point(centre + span / 2)} Z"
    fill="#fff8e6" fill-opacity="${opacity}"/>`;
}

function sheen(x, y, r, angle) {
  return [angle, angle + 180]
    .map((centre) => wedge(x, y, r, centre, 30, 0.07) + wedge(x, y, r, centre, 10, 0.1))
    .join('');
}

// Hammer marks: small dents (dark) with a lit rim, scattered over the bow. A fixed number sequence (seeded by the
// position) places them, so each cymbal looks the same on every visit but different from the others.
function hammerMarks(x, y, r, bell) {
  let seed = Math.round(x * 7 + y * 13) % 2147483647 || 1;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let marks = '';
  for (let i = 0; i < Math.round(r * 0.35); i++) {
    const distance = r * (bell + 0.08 + random() * (0.86 - bell));
    const angle = random() * Math.PI * 2;
    const mx = n(x + distance * Math.cos(angle));
    const my = n(y + distance * Math.sin(angle));
    const size = r * (0.016 + random() * 0.018);
    const turn = `transform="rotate(${n((angle * 180) / Math.PI)} ${mx} ${my})"`;
    marks += `<ellipse cx="${mx}" cy="${my}" rx="${n(size * 1.5)}" ry="${n(size)}" fill="#3c280a" fill-opacity="0.1" ${turn}/>
      <ellipse cx="${n(mx - size * 0.35)}" cy="${n(my - size * 0.35)}" rx="${n(size)}" ry="${n(size * 0.55)}"
        fill="#fff3d6" fill-opacity="0.09" ${turn}/>`;
  }
  return marks;
}

/**
 * Draws the bronze disc with rings, marks, sheen and bell (no stand top). Shared with the hi-hat.
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {{bell?: number, tint?: number, angle?: number, lift?: number}} [look]
 *   bell: bell size as a share of r; tint: + lighter / - darker; angle: light direction; lift: shadow distance.
 */
export function cymbalBody(x, y, r, { bell = 0.2, tint = 0, angle = -30, lift = 0.15 } = {}) {
  const tintLayer = tint
    ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${tint > 0 ? '#fff' : '#000'}" fill-opacity="${Math.abs(tint)}"/>`
    : '';
  const b = n(r * bell);
  return `
  <circle cx="${n(x + r * lift * 0.6)}" cy="${n(y + r * lift)}" r="${n(r * 1.08)}" fill="url(#shadow)"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#bronze)"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#lathe)"/>
  ${tintLayer}
  ${hammerMarks(x, y, r, bell)}
  ${sheen(x, y, r, angle)}
  <circle cx="${x}" cy="${y}" r="${n(r * 0.965)}" fill="none" stroke="#4a3210" stroke-opacity="0.28" stroke-width="${n(r * 0.07)}"/>
  <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#3c280a" stroke-opacity="0.6" stroke-width="1.2"/>
  <circle cx="${x}" cy="${y}" r="${n(b + r * 0.03)}" fill="none" stroke="#ffebbe" stroke-opacity="0.18"
    stroke-width="${n(r * 0.02)}"/>
  <circle cx="${x}" cy="${y}" r="${b}" fill="url(#bell)"/>
  <circle cx="${x}" cy="${y}" r="${b}" fill="url(#lathe)"/>
  <ellipse cx="${n(x - b * 0.32)}" cy="${n(y - b * 0.36)}" rx="${n(b * 0.38)}" ry="${n(b * 0.22)}"
    fill="#fff8e1" fill-opacity="0.32" transform="rotate(-30 ${n(x - b * 0.32)} ${n(y - b * 0.36)})"/>
  <circle cx="${x}" cy="${y}" r="${b}" fill="none" stroke="#462d0a" stroke-opacity="0.35"/>`;
}

function wingNut(x, y, r) {
  const s = Math.max(r * 0.045, 6);
  return `
  <circle cx="${x}" cy="${y}" r="${n(s * 1.6)}" fill="#2a2522"/>
  <g transform="rotate(25 ${x} ${y})">
    <rect x="${n(x - s * 2.4)}" y="${n(y - s * 0.55)}" width="${n(s * 4.8)}" height="${n(s * 1.1)}" rx="${n(s * 0.5)}"
      fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.6"/>
    <circle cx="${x}" cy="${y}" r="${n(s * 0.9)}" fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.6"/>
  </g>`;
}

/**
 * Draws a crash, splash or ride cymbal.
 * @param {{x: number, y: number, r: number, look?: object}} pad
 */
export function drawCymbal({ x, y, r, look }) {
  return `<g>${cymbalBody(x, y, r, look)}${wingNut(x, y, r)}</g>`;
}
