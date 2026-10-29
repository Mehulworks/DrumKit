// Background drawings: an oak plank floor, polished concrete, a patterned rug on dark boards, and a dim stage with a
// spotlight. All drawn in code. Each takes an id prefix (p), so the same drawing can appear on stage and as a card preview.

// A rectangle far larger than the drawing: the kit area clips it, so the background fills the screen edge to edge.
export const BLEED = 'x="-1600" y="-900" width="4800" height="2700"';

// A gentle varnish sheen under the kit.
const sheen = (p, opacity) => `<radialGradient id="${p}-sheen" gradientUnits="userSpaceOnUse" cx="800" cy="560" r="700">
    <stop offset="0" stop-color="#fff4dc" stop-opacity="${opacity}"/><stop offset="1" stop-color="#fff4dc" stop-opacity="0"/>
  </radialGradient><rect ${BLEED} fill="url(#${p}-sheen)"/>`;

const BOARD = { length: 520, width: 38 };
const JOINS = [0, 330, 140, 430, 60, 260];

/**
 * Planks with uneven joins, two tones per row, soft bevels, wavy grain and the odd knot. The pattern is two boards
 * wide, and each board keeps one colour across the pattern's edge, so no seams show where it repeats.
 */
export function planks(p, tones = ['#5a3d26', '#4c3320', '#634430', '#523822']) {
  const boards = JOINS.map((join, row) => [-1, 0, 1, 2].map((i) => {
    const side = ((i % 2) + 2) % 2;
    const x = join + i * BOARD.length;
    const y = row * BOARD.width;
    const grain = [9, 17, 25, 31].map((dy, g) => `<path d="M${x + 14 + g * 40} ${y + dy} c120 ${g % 2 ? 3 : -3} 220 ${g % 2 ? -2 : 2}
      ${360 - g * 30} 0" fill="none" stroke="#1e130b" stroke-opacity="${0.18 + (g % 2) * 0.1}" stroke-width="1"/>`).join('');
    const knot = (row + side) % 4 === 1 ? `<ellipse cx="${x + 300}" cy="${y + 19}" rx="9" ry="5" fill="#2e1e12" opacity="0.5"/>
      <ellipse cx="${x + 300}" cy="${y + 19}" rx="15" ry="8" fill="none" stroke="#2e1e12" stroke-opacity="0.3"/>` : '';
    return `<rect x="${x}" y="${y}" width="${BOARD.length}" height="${BOARD.width}" fill="${tones[(row + side * 2) % tones.length]}"/>
      ${grain}${knot}<rect x="${x}" y="${y}" width="${BOARD.length}" height="${BOARD.width}" fill="url(#${p}-bevel)"
      stroke="#1a110a" stroke-width="1.2"/>`;
  }).join('')).join('');
  return `<linearGradient id="${p}-bevel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.08"/><stop offset="0.12" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.22"/>
    </linearGradient>
    <pattern id="${p}-planks" patternUnits="userSpaceOnUse" width="${BOARD.length * 2}" height="${JOINS.length * BOARD.width}">
      ${boards}</pattern><rect ${BLEED} fill="url(#${p}-planks)"/>`;
}

/** Oak floor with a varnish sheen. */
export const wood = (p) => planks(p) + sheen(p, 0.1);

/** Polished concrete: soft cloudy patches, fine speckles, saw-cut seams and a hairline crack. */
export function concrete(p) {
  const clouds = [[200, 150, 420, 0.5], [1300, 120, 380, 0.4], [700, 520, 520, 0.35], [180, 760, 400, 0.45],
    [1400, 720, 460, 0.4], [950, 260, 300, 0.3]].map(([cx, cy, r, o], i) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.7}" fill="url(#${p}-${i % 2 ? 'dark' : 'light'})" opacity="${o}"/>`).join('');
  const specks = Array.from({ length: 24 }, (_, i) => {
    const x = (i * 67) % 180;
    const y = (i * 113) % 180;
    return `<circle cx="${x}" cy="${y}" r="${1 + (i % 3) * 0.6}" fill="${i % 4 ? '#000' : '#fff'}" fill-opacity="${i % 4 ? 0.22 : 0.08}"/>`;
  }).join('');
  return `<radialGradient id="${p}-light"><stop offset="0" stop-color="#55585d"/><stop offset="1" stop-color="#55585d" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-dark"><stop offset="0" stop-color="#1f2124"/><stop offset="1" stop-color="#1f2124" stop-opacity="0"/></radialGradient>
    <pattern id="${p}-specks" patternUnits="userSpaceOnUse" width="180" height="180">${specks}</pattern>
    <pattern id="${p}-seams" patternUnits="userSpaceOnUse" width="400" height="400">
      <path d="M0 1 H400 M1 0 V400" stroke="#17181a" stroke-width="3"/><path d="M0 4 H400 M4 0 V400" stroke="#fff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <rect ${BLEED} fill="#36383c"/>${clouds}<rect ${BLEED} fill="url(#${p}-specks)"/><rect ${BLEED} fill="url(#${p}-seams)"/>
    <path d="M1180 -20 l30 90 l-18 70 l40 110 l-10 60" fill="none" stroke="#151617" stroke-opacity="0.6" stroke-width="1.5"/>
    ${sheen(p, 0.06)}`;
}

/** A patterned rug (border bands, a lattice field, a centre medallion, a fringe) on dark boards. */
export function rug(p) {
  const r = { x: 230, y: 300, w: 1140, h: 660 };
  const band = (inset, color, width) => `<rect x="${r.x + inset}" y="${r.y + inset}" width="${r.w - inset * 2}" height="${r.h}" fill="none"
    stroke="${color}" stroke-width="${width}"/>`;
  const diamonds = Array.from({ length: 27 }, (_, i) => `<path d="M${r.x + 50 + i * 40} ${r.y + 26} l10 -10 l10 10 l-10 10 Z" fill="#d9b46a"/>`).join('');
  const fringe = Array.from({ length: 114 }, (_, i) => `<line x1="${r.x + 5 + i * 10}" y1="${r.y}" x2="${r.x + 5 + i * 10}" y2="${r.y - 16}"/>`).join('');
  const medallion = (s, fill, stroke) => `<path d="M800 ${630 - s} L${800 + s * 1.3} 630 L800 ${630 + s} L${800 - s * 1.3} 630 Z" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
  return `${planks(p, ['#2a1d14', '#241911', '#2f2117', '#271b12'])}
    <pattern id="${p}-lattice" patternUnits="userSpaceOnUse" width="64" height="64">
      <rect width="64" height="64" fill="#7a2222"/><path d="M32 2 L62 32 L32 62 L2 32 Z" fill="none" stroke="#933232" stroke-width="2"/>
      <circle cx="32" cy="32" r="3" fill="#d9b46a" fill-opacity="0.6"/><circle cx="0" cy="0" r="2" fill="#1f2a44"/>
    </pattern>
    <g stroke="#e8dcc2" stroke-opacity="0.8" stroke-width="2.5">${fringe}</g>
    <rect x="${r.x + 6}" y="${r.y + 8}" width="${r.w}" height="${r.h}" fill="#000" opacity="0.35"/>
    <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="#5c1717"/>
    <rect x="${r.x + 70}" y="${r.y + 70}" width="${r.w - 140}" height="${r.h}" fill="url(#${p}-lattice)"/>
    ${band(8, '#1f2a44', 10)}${band(44, '#c9a25a', 4)}${band(62, '#1f2a44', 6)}${band(70, '#d9b46a', 2)}${diamonds}
    ${medallion(150, '#1f2a44', '#d9b46a')}${medallion(105, '#8f2a2a', '#d9b46a')}${medallion(55, '#d9b46a', '#1f2a44')}`;
}

/** A dim stage: black-painted boards, darker edges, a warm pool of light on the kit, and two spike-tape marks. */
export function stage(p) {
  return `${planks(p, ['#1c1c1f', '#19191c', '#1f1f22', '#1a1a1d'])}
    <radialGradient id="${p}-dim" gradientUnits="userSpaceOnUse" cx="800" cy="540" r="1000">
      <stop offset="0.4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.6"/>
    </radialGradient>
    <radialGradient id="${p}-spot" gradientUnits="userSpaceOnUse" cx="800" cy="560" r="620">
      <stop offset="0" stop-color="#ffe9c2" stop-opacity="0.2"/><stop offset="0.7" stop-color="#ffe9c2" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#ffe9c2" stop-opacity="0"/>
    </radialGradient>
    <rect ${BLEED} fill="url(#${p}-dim)"/><rect ${BLEED} fill="url(#${p}-spot)"/>
    <path d="M240 862 h40 M240 862 v-40 M1360 862 h-40 M1360 862 v-40" stroke="#d8f06a" stroke-opacity="0.75" stroke-width="7"/>`;
}
