// Grid pad art: one pad of the Pad grid view: a rounded tile with a faint glow of its role's colour in one corner, its
// name in the top-left corner, a short colour bar at the bottom left, and a simple line drawing of the instrument in the
// middle (seen from above, like the drawn kit). Colours come from tokens.css and grid.css, so they follow the theme.
import { keyName } from '../key-labels.js';

const point = (cx, cy, r, deg) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)];

// Small marks round a drumhead: the lugs.
const lugs = (cx, cy, r, count) => Array.from({ length: count }, (_, i) => {
  const [x1, y1] = point(cx, cy, r * 1.04, (360 / count) * i);
  const [x2, y2] = point(cx, cy, r * 1.2, (360 / count) * i);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
}).join('');

// A cymbal: the disc, two lathe rings and the bell.
const cymbal = (cx, cy, r, bell) => `<circle cx="${cx}" cy="${cy}" r="${r}"/><circle class="faint" cx="${cx}" cy="${cy}" r="${r * 0.68}"/>
  <circle class="faint" cx="${cx}" cy="${cy}" r="${r * 0.42}"/><circle class="solid" cx="${cx}" cy="${cy}" r="${r * bell}"/>`;

// The drawing for each piece, centred on (cx, cy) with size s.
const ICON = {
  crashLeft: (cx, cy, s) => cymbal(cx, cy, s, 0.14),
  crashRight: (cx, cy, s) => cymbal(cx, cy, s, 0.14),
  splash: (cx, cy, s) => cymbal(cx, cy, s * 0.78, 0.16),
  ride: (cx, cy, s) => cymbal(cx, cy, s * 1.1, 0.24),
  hihat: (cx, cy, s) => `<circle cx="${cx - s * 0.12}" cy="${cy + s * 0.08}" r="${s * 0.9}"/>
    <circle cx="${cx + s * 0.12}" cy="${cy - s * 0.08}" r="${s * 0.9}"/><circle class="solid" cx="${cx + s * 0.12}" cy="${cy - s * 0.08}" r="${s * 0.13}"/>`,
  openHihat: (cx, cy, s) => `<circle cx="${cx - s * 0.32}" cy="${cy + s * 0.2}" r="${s * 0.82}"/>
    <circle cx="${cx + s * 0.32}" cy="${cy - s * 0.2}" r="${s * 0.82}"/><circle class="solid" cx="${cx + s * 0.32}" cy="${cy - s * 0.2}" r="${s * 0.12}"/>`,
  tom1: (cx, cy, s) => `<circle cx="${cx}" cy="${cy}" r="${s * 0.86}"/><circle class="faint" cx="${cx}" cy="${cy}" r="${s * 0.7}"/>${lugs(cx, cy, s * 0.86, 6)}`,
  tom2: (cx, cy, s) => `<circle cx="${cx}" cy="${cy}" r="${s * 0.92}"/><circle class="faint" cx="${cx}" cy="${cy}" r="${s * 0.76}"/>${lugs(cx, cy, s * 0.92, 6)}`,
  floorTom: (cx, cy, s) => `<circle cx="${cx}" cy="${cy}" r="${s}"/><circle class="faint" cx="${cx}" cy="${cy}" r="${s * 0.84}"/>${lugs(cx, cy, s, 8)}`,
  snare: (cx, cy, s) => `<circle cx="${cx}" cy="${cy}" r="${s * 0.9}"/>${lugs(cx, cy, s * 0.9, 8)}
    <line class="faint" x1="${cx - s * 0.55}" y1="${cy - s * 0.12}" x2="${cx + s * 0.55}" y2="${cy - s * 0.12}" stroke-dasharray="6 6"/>
    <line class="faint" x1="${cx - s * 0.55}" y1="${cy + s * 0.12}" x2="${cx + s * 0.55}" y2="${cy + s * 0.12}" stroke-dasharray="6 6"/>`,
  kick: (cx, cy, s) => `<circle cx="${cx}" cy="${cy - s * 0.12}" r="${s * 0.95}"/><circle class="faint" cx="${cx}" cy="${cy - s * 0.12}" r="${s * 0.32}"/>
    <rect x="${cx - s * 0.18}" y="${cy + s * 0.88}" width="${s * 0.36}" height="${s * 0.38}" rx="${s * 0.06}"/>`,
};

/** @param {{id: string, x: number, y: number, w: number, h: number, label: string, role: string, unit?: number}} pad unit:
 *   drawing units per screen pixel, so text and spacing stay the same size on every screen */
export function drawGridPad({ id, x, y, w, h, rx = 16 * unit, inset, font = 14 * unit, showKey = true, label, role, key = '', unit = 1 }) {
  const left = x - w / 2;
  const top = y - h / 2;
  const pad = inset ?? 20 * unit; // inner padding, set by the grid layout
  // The drawing never touches the name (top left), the colour bar (bottom left) or the key (bottom right, if shown). It goes
  // either in the band between the name and the bar, or, on wide, short tiles (phones held sideways), beside them:
  // midway between the end of the name and the key, at the size the tile's height allows, so a row's drawings match.
  // Drawings reach about 1.25 × s from their centre.
  // A name too long for the tile wraps at its last space onto a second line.
  const fits = label.length * font * 0.52 <= w - pad * 2;
  const lines = fits || !label.includes(' ') ? [label] : [label.slice(0, label.lastIndexOf(' ')), label.slice(label.lastIndexOf(' ') + 1)];
  const longest = Math.max(...lines.map((line) => line.length));
  const cap = Math.min(w * 0.16, (h - pad * 2) * 0.3);
  const bandTop = top + pad + font * (1.15 + 1.2 * (lines.length - 1));
  const bandBottom = top + h - pad - 9 * unit;
  const stacked = (bandBottom - bandTop) / 2.5;
  const nameEnd = left + pad + longest * font * 0.52; // about half an em per letter
  const keyStart = left + w - pad - (showKey ? (12 + keyName(key).length * 7) * unit : 0); // the key badge's left edge (key-labels.js)
  const side = Math.min((h - pad * 2) / 2.5, (keyStart - nameEnd - 8 * unit) / 2.5);
  const s = Math.min(cap, Math.max(stacked, side));
  const icon = stacked >= side
    ? (ICON[id] ?? ICON.tom1)(x, (bandTop + bandBottom) / 2, s)
    : (ICON[id] ?? ICON.tom1)(Math.min(Math.max(x, nameEnd + 4 * unit + 1.25 * s), keyStart - 4 * unit - 1.25 * s), y, s);
  return `
  <defs><radialGradient id="pad-glow-${id}" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox">
    <stop offset="0" class="pad-glow-stop" data-role="${role}"/><stop offset="1" class="pad-glow-stop pad-glow-end" data-role="${role}"/>
  </radialGradient></defs>
  <rect class="pad-tile" data-role="${role}" x="${left}" y="${top}" width="${w}" height="${h}" rx="${rx}" stroke-width="${1.5 * unit}"/>
  <rect class="pad-tile-glow" x="${left}" y="${top}" width="${w}" height="${h}" rx="${rx}" fill="url(#pad-glow-${id})"/>
  <g class="pad-tile-icon" data-role="${role}" stroke-width="${2.5 * unit}">${icon}</g>
  <rect class="pad-tile-bar" data-role="${role}" x="${left + pad}" y="${top + h - pad - 3 * unit}" width="${Math.min(40 * unit, w - pad * 2)}" height="${3 * unit}" rx="${1.5 * unit}"/>
  <text class="pad-tile-name" x="${left + pad}" y="${top + pad + font * 0.78}" font-size="${font}">${lines.map((line, i) => `<tspan x="${left + pad}" dy="${i ? 1.2 : 0}em">${line}</tspan>`).join('')}</text>`;
}
