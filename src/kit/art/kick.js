// Kick art: the bass drum lying on its side seen from above, with hoops, lugs, rods and pedal. Its shell shows the
// theme's wrap pattern and an empty .kick-graphic group where a theme can paint (flames, stripes, a crest...).
import { n } from './shared.js';

// Lug positions across the shell, as a share of the half-width (the top half of a round shell).
const LUG_SPOTS = [-0.95, -0.59, 0, 0.59, 0.95];
const HOOP = 22;
const LUG = 46;
const GAP = 16;

function hoop(left, width, top) {
  return `
  <rect x="${left - 6}" y="${top}" width="${width + 12}" height="${HOOP}" rx="4" fill="url(#lacquer-cylinder)"
    stroke="#000" stroke-opacity="0.5"/>
  <rect x="${left - 6}" y="${top + HOOP / 2 - 1.5}" width="${width + 12}" height="3" style="fill: var(--metal-3)" opacity="0.8"/>`;
}

// One lug on the shell, its tension rod, and the claw that hooks over the hoop.
function tensioner(lx, lugWidth, hoopTop, lugTop) {
  const clawMid = hoopTop + HOOP / 2;
  const lugMid = lugTop + LUG / 2;
  return `
  <line x1="${lx}" y1="${clawMid}" x2="${lx}" y2="${lugMid}" style="stroke: var(--metal-solid)" stroke-width="3"/>
  <rect x="${n(lx - lugWidth / 2)}" y="${lugTop}" width="${lugWidth}" height="${LUG}" rx="${n(lugWidth / 2)}"
    fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.8"/>
  <rect x="${n(lx - 6)}" y="${hoopTop + 2}" width="12" height="${HOOP - 4}" rx="3" fill="url(#chrome)"
    stroke="#2b2e33" stroke-width="0.8"/>`;
}

function hardware(x, halfWidth, top, bottom) {
  let parts = '';
  for (const spot of LUG_SPOTS) {
    const lx = n(x + spot * halfWidth);
    const lugWidth = n(14 * Math.max(Math.sqrt(1 - spot * spot), 0.45));
    parts += tensioner(lx, lugWidth, top, top + HOOP + GAP);
    parts += tensioner(lx, lugWidth, bottom - HOOP, bottom - HOOP - GAP - LUG);
  }
  return parts;
}

function pedal(x, bottom) {
  const grip = [22, 30, 38, 46].map((dy) => `<line x1="${x - 15}" y1="${bottom + dy}" x2="${x + 15}"
    y2="${bottom + dy}" stroke="#6b7076" stroke-width="1.5"/>`).join('');
  return `
  <rect x="${x - 62}" y="${bottom + 2}" width="124" height="12" rx="4" fill="url(#dark-metal)"/>
  <circle cx="${x - 52}" cy="${bottom + 8}" r="7" fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.8"/>
  <circle cx="${x + 52}" cy="${bottom + 8}" r="7" fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.8"/>
  <rect x="${x - 23}" y="${bottom + 12}" width="46" height="44" rx="8" fill="url(#dark-metal)"
    stroke="#000" stroke-opacity="0.6"/>
  ${grip}`;
}

// The pedal's beater: a felt head on a rod, resting just off the batter head (motion.js swings it in on a hit).
function beater(x, bottom) {
  return `
  <g class="kick-beater">
    <line x1="${x}" y1="${bottom + 34}" x2="${x}" y2="${bottom + 12}" style="stroke: var(--metal-solid)" stroke-width="4"
      stroke-linecap="round"/>
    <rect x="${x - 13}" y="${bottom + 4}" width="26" height="11" rx="5.5" fill="#e6e1d6" stroke="#2b2e33" stroke-width="0.8"/>
  </g>`;
}

/**
 * Draws the kick drum.
 * @param {{x: number, y: number, w: number, h: number}} pad
 */
export function drawKick({ x, y, w, h }) {
  const left = x - w / 2;
  const top = y - h / 2;
  const bottom = y + h / 2;
  // A soft oval shadow, large enough to reach under the shell's corners; it fades out instead of ending in hard edges.
  const shadow = `<ellipse cx="${x + 10}" cy="${y + 16}" rx="${n(w * 0.74)}" ry="${n(h * 0.76)}" fill="url(#shadow)"/>`;
  return `
  <g>
    ${shadow}
    ${pedal(x, bottom)}
    <rect x="${left}" y="${top + HOOP / 2}" width="${w}" height="${h - HOOP}" fill="url(#lacquer-cylinder)"/>
    <rect x="${left}" y="${top + HOOP / 2}" width="${w}" height="${h - HOOP}" fill="url(#shell-wrap)"/>
    <clipPath id="kick-shell-clip"><rect x="${left}" y="${top + HOOP}" width="${w}" height="${h - HOOP * 2}"/></clipPath>
    <g class="kick-graphic" clip-path="url(#kick-shell-clip)"></g>
    ${hoop(left, w, top)}
    ${hoop(left, w, bottom - HOOP)}
    ${hardware(x, w / 2, top, bottom)}
    ${beater(x, bottom)}
  </g>`;
}
