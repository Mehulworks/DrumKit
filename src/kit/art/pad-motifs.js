// Pad motifs: what each look adds to a Pad grid tile beyond its colours, in the theme's own style: dragon scales and a
// gold dragon tattoo, gothic filigree, wood grain, glitter, flames along the bottom, a synthwave horizon, a night sky,
// and a lacquer sheen. Also the one-time shine that sweeps across the grid. Original designs drawn in code.
import { dragonTattoo } from './dragon-art.js';

// A fixed number sequence, so sparkles and stars land in the same place on every visit.
function seeded(seed) {
  let value = seed;
  return () => (value = (value * 16807) % 2147483647) / 2147483647;
}

const textures = {
  // Overlapping scales, every other row shifted by half a scale.
  scales: (u) => `<pattern id="pad-wrap" patternUnits="userSpaceOnUse" width="${24 * u}" height="${14 * u}">
    <path d="M0 ${14 * u} A${12 * u} ${12 * u} 0 0 1 ${24 * u} ${14 * u} M${-12 * u} ${7 * u} A${12 * u} ${12 * u} 0 0 1 ${12 * u} ${7 * u}
      M${12 * u} ${7 * u} A${12 * u} ${12 * u} 0 0 1 ${36 * u} ${7 * u}" fill="none" stroke="#e0b04a" stroke-opacity="0.16" stroke-width="${u}"/></pattern>`,
  filigree: (u) => `<pattern id="pad-wrap" patternUnits="userSpaceOnUse" width="${70 * u}" height="${70 * u}">
    <g transform="scale(${u * 0.78})"><path d="M45 8 C62 8 66 28 52 34 C42 38 36 28 44 24 M45 8 C28 8 24 28 38 34 C48 38 54 28 46 24
      M45 52 L45 82 M33 66 L57 66 M45 52 C52 58 52 62 45 66 C38 62 38 58 45 52" fill="none" stroke="#c9ccd4" stroke-opacity="0.22" stroke-width="1.4"/></g></pattern>`,
  grain: (u) => `<pattern id="pad-wrap" patternUnits="userSpaceOnUse" width="${140 * u}" height="${46 * u}">
    <g transform="scale(${u})">${[6, 14, 23, 31, 40].map((y, i) => `<path d="M0 ${y} C35 ${y - 3 - i % 2}, 70 ${y + 4}, 140 ${y}" fill="none"
      stroke="#e8c48f" stroke-opacity="0.16" stroke-width="1.1"/>`).join('')}</g></pattern>`,
  sparkle: (u) => {
    const random = seeded(7);
    return `<pattern id="pad-wrap" patternUnits="userSpaceOnUse" width="${40 * u}" height="${40 * u}">${Array.from({ length: 10 }, () =>
      `<circle cx="${(random() * 40 * u).toFixed(1)}" cy="${(random() * 40 * u).toFixed(1)}" r="${((0.6 + random()) * u).toFixed(2)}" fill="#fff"
        fill-opacity="${(0.25 + random() * 0.45).toFixed(2)}"/>`).join('')}</pattern>`;
  },
};

// Which texture each look's tiles get (none for the rest).
const TEXTURE = { dragon: 'scales', gothic: 'filigree', sunburst: 'grain', sparkle: 'sparkle' };

/** The shared pieces a look needs in the drawing's defs (its texture), sized for the tiles. */
export const motifDefs = (themeId, unit) => (TEXTURE[themeId] ? textures[TEXTURE[themeId]](unit) : '');

/**
 * The look's emblem as one artwork across the whole grid (each tile shows its own slice of it), so every tile looks
 * different, like a custom-printed pad controller. Main features (the dragon's head, the moon, the sun) sit well inside
 * the grid; only flowing parts cross the gaps between tiles.
 * @param {string} themeId
 * @param {{x: number, y: number, w: number, h: number, unit: number}} grid the box round every tile
 * @param {string} id the tile drawing it, so its sun mask has a unique name
 */
function gridEmblem(themeId, { x, y, w, h, unit }, id) {
  return {
    // One gold dragon coiling across the grid, its head inside the middle row (the head sits 125 left and 15 up of
    // the tattoo's centre, in its own units).
    dragon: () => {
      const size = Math.min(w * 0.55, h * 1.05);
      const s = size / 340;
      return `<g opacity="0.3">${dragonTattoo(x + w * 0.25 + 125 * s, y + h / 2 + 15 * s, size)}</g>`;
    },
    // Flames rising from the bottom of the grid: tall over the bottom row, just tips on the middle one.
    flames: () => {
      const random = seeded(11);
      const base = y + h;
      const count = Math.max(6, Math.round(w / (h * 0.35)));
      return `<g opacity="0.26">${Array.from({ length: count }, (_, i) => {
        const cx = x + ((i + 0.5) * w) / count;
        const fw = (w / count) * 1.4;
        const fh = h * (0.32 + random() * 0.26);
        return `<path d="M${cx - fw / 2} ${base} C${cx - fw / 2} ${base - fh * 0.45}, ${cx - fw * 0.1} ${base - fh * 0.6}, ${cx + fw * 0.18} ${base - fh}
          C${cx + fw * 0.05} ${base - fh * 0.55}, ${cx + fw / 2} ${base - fh * 0.45}, ${cx + fw / 2} ${base} Z" fill="url(#pad-flame)"/>`;
      }).join('')}</g>`;
    },
    // A synthwave sun behind the middle of the grid, cut by stripes, over a horizon of lines closing up downwards.
    neon: () => {
      const r = Math.min(w, h) * 0.32;
      const cx = x + w / 2;
      const cy = y + h * 0.48;
      const cuts = [0.1, 0.32, 0.5, 0.66, 0.8].map((t, i) => `<rect x="${cx - r}" y="${cy + r * t}" width="${r * 2}" height="${r * (0.04 + i * 0.03)}" fill="#000"/>`).join('');
      const lines = [0.66, 0.74, 0.81, 0.87, 0.92, 0.96].map((t, i) =>
        `<line x1="${x}" y1="${y + h * t}" x2="${x + w}" y2="${y + h * t}" stroke="${i % 2 ? '#ff4fd8' : '#2ff3ff'}" stroke-width="${2 * unit}"/>`).join('');
      return `<g opacity="0.3"><mask id="pad-sun-cut-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff"/>${cuts}</mask>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#pad-sun)" mask="url(#pad-sun-cut-${id})"/>${lines}</g>`;
    },
    // A night sky across the grid, with one crescent moon high on the right.
    midnight: () => {
      const random = seeded(5);
      const stars = Array.from({ length: Math.round(w * h / 9000) }, () => `<circle cx="${x + random() * w}" cy="${y + random() * h}"
        r="${(0.8 + random() * 1.2) * unit}" fill="#cfe0ff" fill-opacity="${0.3 + random() * 0.45}"/>`).join('');
      const mr = Math.min(w, h) * 0.07;
      const mx = x + w * 0.88;
      const my = y + h * 0.13;
      return `${stars}<path d="M${mx} ${my - mr} A${mr} ${mr} 0 1 0 ${mx} ${my + mr} A${mr * 0.75} ${mr * 0.85} 0 1 1 ${mx} ${my - mr} Z"
        fill="#9ec5ff" fill-opacity="0.45"/>`;
    },
    // Gloss: one soft diagonal band of light across the whole set.
    classic: () => `<path d="M${x + w * 0.18} ${y} L${x + w * 0.34} ${y} L${x + w * 0.2} ${y + h} L${x + w * 0.04} ${y + h} Z" fill="#fff" fill-opacity="0.06"/>`,
  }[themeId]?.() ?? '';
}

/**
 * What a look adds to one tile, inside its own outline: its texture (a surface finish, on every tile), the burst
 * finish, and its slice of the grid-wide emblem.
 * @param {string} themeId
 * @param {{x: number, y: number, w: number, h: number, rx: number, unit: number}} tile its top-left corner, size and corner
 * @param {string} id a name for this tile, so its clip outline is unique
 * @param {{x: number, y: number, w: number, h: number, unit: number}} grid the box round every tile
 */
export function tileMotif(themeId, { x, y, w, h, rx }, id, grid, shine = false) {
  const texture = TEXTURE[themeId] ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#pad-wrap)"/>` : '';
  const burst = themeId === 'sunburst' ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#pad-burst)"/>` : '';
  // Everything stays inside the tile's rounded outline.
  return `<clipPath id="pm-${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>
    <g clip-path="url(#pm-${id})">${texture}${burst}${gridEmblem(themeId, grid, id)}${shine
      ? `<rect class="pad-shine" x="${grid.x}" y="${grid.y}" width="${grid.w}" height="${grid.h}" fill="url(#pad-shine)"/>` : ''}</g>`;
}

/** Shared defs: the sunburst edge fade, the flame colours, the synthwave sun and the band of light for the shine. */
export const burstDef = `<radialGradient id="pad-burst" cx="0.5" cy="0.5" r="0.7"><stop offset="0.45" stop-color="#1a0d05" stop-opacity="0"/>
  <stop offset="1" stop-color="#1a0d05" stop-opacity="0.65"/></radialGradient>
  <linearGradient id="pad-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e52d00"/><stop offset="0.6" stop-color="#ff8a00"/>
  <stop offset="1" stop-color="#ffc94d"/></linearGradient>
  <linearGradient id="pad-sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff4fd8"/></linearGradient>
  <linearGradient id="pad-shine" x1="0" y1="0" x2="1" y2="0.35"><stop offset="0.38" stop-color="#fff" stop-opacity="0"/>
  <stop offset="0.5" stop-color="#fff" stop-opacity="0.32"/><stop offset="0.62" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
