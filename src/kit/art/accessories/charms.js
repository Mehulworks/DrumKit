// Charms hung on a drum's rim: a red lucky knot with a tassel, and a pair of fuzzy dice. Generic shapes, drawn here.
import { n } from '../shared.js';

// Where a charm hangs: just outside the rim, lower left (between the floor tom and the kick).
const hook = ({ x, y, r }) => ({ hx: n(x - r * 0.36), hy: n(y + r * 0.98) });

/** A diamond-shaped knot of red cord with a gold bead and a tassel. @param {{x: number, y: number, r: number}} pad */
export function luckyKnot(pad) {
  const { hx, hy } = hook(pad);
  const s = pad.r * 0.11;
  const diamond = (size) => `M${hx} ${n(hy + s * 1.4 - size)} L${n(hx + size)} ${n(hy + s * 1.4)} L${hx} ${n(hy + s * 1.4 + size)}
    L${n(hx - size)} ${n(hy + s * 1.4)} Z`;
  return `<g>
    <line x1="${hx}" y1="${hy - 4}" x2="${hx}" y2="${n(hy + s * 0.4)}" stroke="#a3151a" stroke-width="3"/>
    <path d="${diamond(s)}" fill="#c4231d" stroke="#7a0d10" stroke-width="2"/>
    <path d="${diamond(s * 0.55)}" fill="none" stroke="#e9b949" stroke-width="1.2" stroke-dasharray="3 3"/>
    <circle cx="${hx}" cy="${n(hy + s * 2.7)}" r="${n(s * 0.28)}" fill="#e9b949"/>
    ${[-0.3, -0.1, 0.1, 0.3].map((dx) => `<line x1="${hx}" y1="${n(hy + s * 2.9)}" x2="${n(hx + dx * s)}" y2="${n(hy + s * 4)}"
      stroke="#c4231d" stroke-width="2.5" stroke-linecap="round"/>`).join('')}
  </g>`;
}

/** Two soft dice on a short cord. @param {{x: number, y: number, r: number}} pad */
export function fuzzyDice(pad, color = '#f4f2ec') {
  const { hx, hy } = hook(pad);
  const s = pad.r * 0.13;
  const die = (cx, cy, turn, pips) => `<g transform="rotate(${turn} ${cx} ${cy})">
    <rect x="${n(cx - s / 2)}" y="${n(cy - s / 2)}" width="${n(s)}" height="${n(s)}" rx="${n(s * 0.22)}" fill="${color}"
      stroke="#000" stroke-opacity="0.35"/>
    ${pips.map(([px, py]) => `<circle cx="${n(cx + px * s * 0.26)}" cy="${n(cy + py * s * 0.26)}" r="${n(s * 0.09)}" fill="#111"/>`).join('')}
  </g>`;
  return `<g>
    <path d="M${hx} ${hy - 4} L${n(hx - s * 0.6)} ${n(hy + s * 0.9)} M${hx} ${hy - 4} L${n(hx + s * 0.7)} ${n(hy + s * 1.1)}"
      stroke="#222" stroke-width="2" fill="none"/>
    ${die(n(hx - s * 0.6), n(hy + s * 1.3), -14, [[-1, -1], [0, 0], [1, 1]])}
    ${die(n(hx + s * 0.7), n(hy + s * 1.5), 18, [[-1, -1], [1, -1], [-1, 1], [1, 1]])}
  </g>`;
}
