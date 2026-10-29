// Electronic kit art: mesh drum pads with a glowing ring, rubber cymbal pads, a kick tower with its pedal, and the
// sound module, cables and headphones on the rack.
// The pad body follows the theme's shell colour, the rim its hardware, and the ring its pad-light colour (--led).
import { n } from './shared.js';

const SHADOW = (x, y, r) => `<circle cx="${n(x + r * 0.08)}" cy="${n(y + r * 0.12)}" r="${n(r * 1.2)}" fill="url(#shadow)"/>`;

// The mesh head: a dark disc with a fine woven texture made of crossing lines.
function mesh(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${n(r)}" fill="#25272b"/>
    <circle cx="${x}" cy="${y}" r="${n(r)}" fill="url(#mesh)"/>
    <ellipse cx="${n(x - r * 0.3)}" cy="${n(y - r * 0.38)}" rx="${n(r * 0.36)}" ry="${n(r * 0.13)}" fill="#fff" fill-opacity="0.07"
      transform="rotate(-35 ${n(x - r * 0.3)} ${n(y - r * 0.38)})"/>`;
}

/** Defs the electronic art needs (the mesh texture and the module screen's pixel rows). */
export const electronicDefs = () => `
  <pattern id="mesh" patternUnits="userSpaceOnUse" width="6" height="6">
    <path d="M0 0 L6 6 M6 0 L0 6" stroke="#fff" stroke-opacity="0.06" stroke-width="1"/>
  </pattern>
  <pattern id="lcd-rows" patternUnits="userSpaceOnUse" width="4" height="4">
    <rect width="4" height="1" fill="#000" fill-opacity="0.18"/>
  </pattern>`;

/** A drum pad: body, metal rim, glowing ring and mesh head, plus a clamp to the rack. */
export function drawPad({ x, y, r }) {
  return `<g>
    ${SHADOW(x, y, r)}
    <rect x="${n(x - r * 0.12)}" y="${n(y - r * 1.25)}" width="${n(r * 0.24)}" height="${n(r * 0.3)}" rx="4" fill="url(#chrome)"/>
    <circle cx="${x}" cy="${y}" r="${n(r)}" fill="url(#lacquer)"/>
    <circle cx="${x}" cy="${y}" r="${n(r * 0.95)}" fill="none" stroke="url(#chrome)" stroke-width="${n(r * 0.06)}"/>
    <circle cx="${x}" cy="${y}" r="${n(r * 0.87)}" fill="none" style="stroke: var(--led)" stroke-opacity="0.25" stroke-width="${n(r * 0.1)}"/>
    <circle cx="${x}" cy="${y}" r="${n(r * 0.87)}" fill="none" style="stroke: var(--led)" stroke-width="${n(r * 0.03)}"/>
    ${mesh(x, y, r * 0.8)}
  </g>`;
}

/** A rubber cymbal pad: a dark disc with an edge zone, a raised bell, a small status light and a centre bolt. */
export function drawCymbalPad({ x, y, r }) {
  return `<g>
    ${SHADOW(x, y, r)}
    <circle cx="${x}" cy="${y}" r="${n(r)}" fill="#1d1e21"/>
    <circle cx="${x}" cy="${y}" r="${n(r * 0.96)}" fill="none" stroke="#34363b" stroke-width="${n(r * 0.08)}"/>
    <circle cx="${x}" cy="${y}" r="${n(r * 0.7)}" fill="none" stroke="#2a2c30" stroke-width="1.5"/>
    <circle cx="${x}" cy="${y}" r="${n(r * 0.24)}" fill="#2a2c30" stroke="#3a3c41"/>
    <circle cx="${n(x + r * 0.5)}" cy="${n(y - r * 0.5)}" r="${n(Math.max(3, r * 0.035))}" style="fill: var(--led)"/>
    <circle cx="${x}" cy="${y}" r="${n(r * 0.07)}" fill="url(#chrome)"/>
  </g>`;
}

/** The kick tower seen from above: a box with a mesh pad facing the drummer, a light strip, and the pedal with its beater. */
export function drawKickTower({ x, y, w, h }) {
  const left = x - w / 2;
  const top = y - h / 2;
  const bottom = y + h / 2;
  return `<g>
    <ellipse cx="${x + 8}" cy="${y + 12}" rx="${n(w * 0.7)}" ry="${n(h * 0.75)}" fill="url(#shadow)"/>
    <rect x="${left}" y="${top}" width="${w}" height="${h - 24}" rx="10" fill="url(#lacquer)" stroke="#000" stroke-opacity="0.5"/>
    <rect x="${left + 14}" y="${top + 14}" width="${w - 28}" height="6" rx="3" style="fill: var(--led)"/>
    <rect x="${left + 10}" y="${bottom - 34}" width="${w - 20}" height="18" rx="6" fill="#25272b"/>
    <rect x="${left + 10}" y="${bottom - 34}" width="${w - 20}" height="18" rx="6" fill="url(#mesh)"/>
    <rect x="${x - 23}" y="${bottom - 6}" width="46" height="44" rx="8" fill="url(#dark-metal)" stroke="#000" stroke-opacity="0.6"/>
    <g class="kick-beater">
      <line x1="${x}" y1="${bottom + 22}" x2="${x}" y2="${bottom}" style="stroke: var(--metal-solid)" stroke-width="4" stroke-linecap="round"/>
      <rect x="${x - 13}" y="${bottom - 8}" width="26" height="11" rx="5.5" fill="#e6e1d6" stroke="#2b2e33" stroke-width="0.8"/>
    </g>
  </g>`;
}

/**
 * What sits on the rack besides the pads: the sound module (its screen lit in the pad-light colour) on a clamp, the
 * cable loom taped along the rack, and a pair of headphones hanging from the left post.
 */
export function rackExtras() {
  const mx = 1262;
  const my = 800;
  const buttons = [0, 1, 2, 3, 4].map((i) => `<rect x="${mx - 66 + i * 18}" y="${my + 18}" width="12" height="8" rx="2" fill="#3a3c41"/>`).join('');
  const clips = [520, 700, 880, 1060].map((cx) => `<rect x="${cx}" y="${598}" width="10" height="16" rx="2" fill="#141518"/>`).join('');
  return `
  <path d="M410 606 L1188 606 L1192 760 L1200 780" fill="none" stroke="#141518" stroke-width="7" stroke-linecap="round"/>
  ${clips}
  <rect x="1188" y="776" width="28" height="22" rx="4" fill="url(#chrome)"/>
  <rect x="${mx - 82 + 8}" y="${my - 46 + 10}" width="164" height="96" rx="12" fill="#000" fill-opacity="0.35"/>
  <rect x="${mx - 82}" y="${my - 46}" width="164" height="92" rx="12" fill="url(#dark-metal)" stroke="#000" stroke-opacity="0.6"/>
  <rect x="${mx - 66}" y="${my - 32}" width="84" height="40" rx="4" style="fill: var(--led)" opacity="0.85"/>
  <rect x="${mx - 66}" y="${my - 32}" width="84" height="40" rx="4" fill="url(#lcd-rows)"/>
  <circle cx="${mx + 48}" cy="${my - 10}" r="20" fill="url(#chrome)" stroke="#2b2e33"/>
  <circle cx="${mx + 48}" cy="${my - 10}" r="12" fill="#2a2c30"/>
  <line x1="${mx + 48}" y1="${my - 10}" x2="${mx + 48}" y2="${my - 21}" stroke="#d6dade" stroke-width="3" stroke-linecap="round"/>
  ${buttons}
  <circle cx="${mx + 48}" cy="${my + 22}" r="4" style="fill: var(--led)"/>
  <g>
    <path d="M372 772 A30 30 0 0 1 432 772" fill="none" stroke="#1a1b1e" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="372" cy="790" rx="15" ry="20" fill="#202125" stroke="#000" stroke-opacity="0.6"/>
    <ellipse cx="432" cy="790" rx="15" ry="20" fill="#202125" stroke="#000" stroke-opacity="0.6"/>
    <ellipse cx="372" cy="790" rx="9" ry="13" fill="none" style="stroke: var(--led)" stroke-width="2.5"/>
    <ellipse cx="432" cy="790" rx="9" ry="13" fill="none" style="stroke: var(--led)" stroke-width="2.5"/>
    <path d="M432 810 C440 840 470 830 480 860" fill="none" stroke="#141518" stroke-width="3"/>
  </g>`;
}
