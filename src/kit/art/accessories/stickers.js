// Stickers: die-cut vinyl stickers (white border, soft shadow) in generic shapes, for the kick drum's shell.
// No logos, brands or names: only simple shapes drawn here.
import { n } from '../shared.js';

const starPoints = Array.from({ length: 10 }, (_, i) => {
  const rad = (i * Math.PI) / 5;
  const reach = i % 2 ? 0.45 : 1;
  return `${n(reach * Math.sin(rad))},${n(-reach * Math.cos(rad))}`;
}).join(' ');

// Stripes across a circle, cut to its edge: for the sunset sticker.
const sunStripes = [0.2, 0.42, 0.62, 0.8].map((y, i) => {
  const half = n(Math.sqrt(1 - y * y));
  return `<line x1="${-half}" y1="${y}" x2="${half}" y2="${y}" stroke="#2a1145" stroke-width="${n(0.06 + i * 0.03)}"/>`;
}).join('');

const checks = Array.from({ length: 12 }, (_, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return (col + row) % 2 ? '' : `<rect x="${n(-0.8 + col * 0.4)}" y="${n(-0.6 + row * 0.4)}" width="0.4" height="0.4" fill="#111"/>`;
}).join('');

const rays = Array.from({ length: 12 }, (_, i) =>
  `<line x1="0" y1="-0.3" x2="0" y2="-0.68" stroke="#7a4b14" stroke-width="0.07" transform="rotate(${i * 30})"/>`).join('');

/** Each shape: its outline path d (filled, or stroked when line is true), its colour and any inner detail. */
const SHAPES = {
  star: { d: `M${starPoints}Z`, fill: '#ffd23f' },
  bolt: { d: 'M0.2,-1 L-0.6,0.15 L-0.05,0.15 L-0.25,1 L0.6,-0.2 L0.05,-0.2 Z', fill: '#2ff3ff' },
  moon: { d: 'M0.35,-0.95 A1 1 0 1 0 0.35,0.95 A1.1 1.1 0 0 1 0.35,-0.95 Z', fill: '#e8ecf7' },
  heart: { d: 'M0,0.9 C-1.3,0 -0.9,-1.1 0,-0.4 C0.9,-1.1 1.3,0 0,0.9 Z', fill: '#ff5c8a' },
  triangle: { d: 'M0,-1 L0.95,0.75 L-0.95,0.75 Z', fill: '#ff4fd8',
    detail: '<path d="M0,-0.45 L0.45,0.4 L-0.45,0.4 Z" fill="#17172b"/>' },
  sun: { d: 'M-1,0 A1 1 0 1 1 1,0 A1 1 0 1 1 -1,0 Z', fill: '#ff4fd8',
    detail: `<path d="M-1,0 A1 1 0 0 1 1,0 Z" fill="#ffd23f"/>${sunStripes}` },
  flower: { d: 'M0,-1 C0.5,-1 0.5,-0.4 0.3,-0.3 C0.9,-0.6 1.2,0 0.5,0.15 C0.9,0.6 0.4,1 0.1,0.45 C0,1.1 -0.6,0.9 -0.35,0.35 C-1,0.6 -1.1,-0.1 -0.45,-0.1 C-0.9,-0.6 -0.4,-1 -0.15,-0.4 C-0.2,-0.8 -0.3,-1 0,-1 Z',
    fill: '#ff8a3d', detail: '<circle r="0.28" fill="#ffd23f"/>' },
  skull: { d: 'M-0.8,-0.1 A0.8 0.85 0 1 1 0.8,-0.1 L0.5,0.45 L0.5,0.9 L-0.5,0.9 L-0.5,0.45 Z', fill: '#ece8df',
    detail: `<circle cx="-0.32" cy="-0.1" r="0.22" fill="#1b1b1f"/><circle cx="0.32" cy="-0.1" r="0.22" fill="#1b1b1f"/>
      <path d="M0,0.12 L0.1,0.32 L-0.1,0.32 Z" fill="#1b1b1f"/>
      <path d="M-0.25,0.55 L-0.25,0.85 M0,0.55 L0,0.85 M0.25,0.55 L0.25,0.85" stroke="#1b1b1f" stroke-width="0.06"/>` },
  bat: { d: 'M0,-0.35 L0.15,-0.6 L0.2,-0.3 C0.5,-0.5 0.8,-0.5 1,-0.2 C0.8,-0.1 0.75,0.1 0.7,0.3 C0.5,0.15 0.35,0.2 0.25,0.35 C0.15,0.2 0.05,0.25 0,0.45 C-0.05,0.25 -0.15,0.2 -0.25,0.35 C-0.35,0.2 -0.5,0.15 -0.7,0.3 C-0.75,0.1 -0.8,-0.1 -1,-0.2 C-0.8,-0.5 -0.5,-0.5 -0.2,-0.3 L-0.15,-0.6 Z',
    fill: '#1b1b1f' },
  ankh: { d: 'M0,-0.2 C-0.45,-0.5 -0.35,-1 0,-1 C0.35,-1 0.45,-0.5 0,-0.2 M-0.55,-0.1 L0.55,-0.1 M0,-0.2 L0,1', line: true, fill: '#b07cff' },
  flag: { d: 'M-0.9,-0.7 L0.9,-0.7 L0.9,0.7 L-0.9,0.7 Z', fill: '#f4f2ec', detail: checks },
  roundel: { d: 'M-1,0 A1 1 0 1 1 1,0 A1 1 0 1 1 -1,0 Z', fill: '#c4231d',
    detail: `<circle r="0.7" fill="#f4f2ec"/><text y="0.36" text-anchor="middle" font-family="system-ui, sans-serif"
      font-weight="800" font-size="1.05" fill="#111">8</text>` },
  badge: { d: 'M-1,0 A1 1 0 1 1 1,0 A1 1 0 1 1 -1,0 Z', fill: '#e2bf74',
    detail: `<circle r="0.82" fill="none" stroke="#7a4b14" stroke-width="0.06"/>${rays}<circle r="0.24" fill="#f3ead2"/>` },
  pearl: { d: 'M-1,0 A1 1 0 1 1 1,0 A1 1 0 1 1 -1,0 Z', fill: '#e9b949',
    detail: `<circle r="0.62" fill="#fff2bd"/><path d="M0,-0.5 C0.5,-0.3 0.4,0.3 0,0.25 C-0.3,0.2 -0.2,-0.15 0.05,-0.05"
      fill="none" stroke="#c4231d" stroke-width="0.12" stroke-linecap="round"/>` },
  seal: { d: 'M-0.85,-0.85 L0.85,-0.85 L0.85,0.85 L-0.85,0.85 Z', fill: '#b3191b',
    detail: `<rect x="-0.62" y="-0.62" width="1.24" height="1.24" fill="none" stroke="#f0c75e" stroke-width="0.08"/>
      <path d="M-0.4,-0.4 L0.4,-0.4 L0.4,0.4 L-0.2,0.4 L-0.2,-0.15 L0.15,-0.15 L0.15,0.15" fill="none" stroke="#f0c75e"
        stroke-width="0.1"/>` },
};

/**
 * One sticker.
 * @param {keyof SHAPES} name
 * @param {number} x
 * @param {number} y
 * @param {number} size radius in kit units
 * @param {number} [turn] rotation in degrees
 */
export function sticker(name, x, y, size, turn = 0) {
  const { d, fill, detail = '', line } = SHAPES[name];
  const paint = (color, extra) => line
    ? `<path d="${d}" fill="none" stroke="${color}" stroke-width="${extra + 0.24}" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="${extra}" stroke-linejoin="round"/>`;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${turn}) scale(${n(size)})">
    <g transform="translate(0.08 0.12)" opacity="0.35">${paint('#000', 0.3)}</g>
    ${paint('#f4f2ec', 0.3)}
    ${paint(fill, 0)}
    ${detail}
  </g>`;
}

/**
 * Spots on the kick shell that stay in view on every acoustic kit (clear of the toms, snare and floor tom) and sit
 * between the lug columns, as a real sticker would.
 * @param {{x: number, y: number, w: number, h: number}} kick
 */
export const kickSpots = ({ x, y, w, h }) => [
  { x: x - w * 0.2, y: y + h * 0.02 },
  { x: x + w * 0.2, y: y },
  { x: x - w * 0.385, y: y + h * 0.15 },
  { x: x + w * 0.385, y: y + h * 0.13 },
];
