// Pad looks: the kit themes (Look tab) dressed onto the Pad grid's tiles: each tile gets the theme's shell colour as a
// lacquered face (kept dark enough for white names), an inner trim line in its hoop or accent colour, and, on the
// Electronic kit, a glowing LED edge. The family colour stays on the border, bar and drawing, so the grouping holds.
import { themeColors } from './themes.js';
import { motifDefs, tileMotif, burstDef } from './pad-motifs.js';
import { gridIcon } from './grid-pad.js';

// Mixes two #rrggbb colours: share of a (0 to 1).
function mix(a, b, share) {
  const ch = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2].map((i) => Math.round(ch(a, i) * share + ch(b, i) * (1 - share)).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * The colours a theme gives the tiles, and a kit's character: the face top and bottom, the trim, and the LED glow.
 * @param {typeof import('./themes.js').THEMES[number]} theme
 * @param {{id: string}} [kit]
 */
export function padLook(theme, kit) {
  const { shell, metal } = themeColors(theme);
  const electronic = kit?.id === 'electronic';
  return {
    top: mix(shell.light, '#0c0c0e', 0.5),
    bottom: mix(shell.dark, '#000000', 0.8),
    trim: electronic ? theme.led : theme.hoop ?? theme.glow ?? metal.solid, // hoops, else the light, else the hardware
    glow: electronic ? theme.led : null,
  };
}

/**
 * Dresses the Pad grid in a theme (the drawn kit uses applyTheme instead).
 * @param {SVGSVGElement} svg the Pad grid drawing
 * @param {typeof import('./themes.js').THEMES[number]} theme
 * @param {{id: string}} kit
 */
let shone = false; // the shine sweeps across the grid once per visit

export function applyPadLook(svg, theme, kit) {
  const look = padLook(theme, kit);
  const shine = !shone;
  shone = true;
  if (!svg.querySelector('#pad-face')) {
    svg.querySelector('defs').insertAdjacentHTML('beforeend', `<linearGradient id="pad-face" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" class="pad-face-top"/><stop offset="1" class="pad-face-bottom"/></linearGradient>`);
  }
  svg.classList.add('has-pad-look');
  svg.classList.toggle('is-electronic', Boolean(look.glow));
  svg.style.setProperty('--pad-top', look.top);
  svg.style.setProperty('--pad-bottom', look.bottom);
  svg.style.setProperty('--pad-trim', look.trim);
  svg.style.setProperty('--pad-led', look.glow ?? 'transparent');
  // The look's texture and emblem on each tile, under its drawing and name (replacing the last look's).
  svg.querySelector('#pad-wrap')?.remove();
  svg.querySelector('#pad-burst')?.remove();
  const unit = Number(svg.dataset.unit) || 1;
  svg.querySelector('defs').insertAdjacentHTML('beforeend', motifDefs(theme.id, unit) + burstDef);
  // The box round every tile: the grid-wide emblem is drawn in it, and each tile shows its slice.
  const boxes = [...svg.querySelectorAll('.pad-tile')].map((t) => ({ x: +t.getAttribute('x'), y: +t.getAttribute('y'), w: +t.getAttribute('width'), h: +t.getAttribute('height') }));
  const left = Math.min(...boxes.map((r) => r.x));
  const top = Math.min(...boxes.map((r) => r.y));
  const grid = { x: left, y: top, w: Math.max(...boxes.map((r) => r.x + r.w)) - left, h: Math.max(...boxes.map((r) => r.y + r.h)) - top, unit };
  svg.querySelectorAll('.pad-tile').forEach((tile) => {
    const group = tile.parentElement;
    group.querySelector('.pad-motif')?.remove();
    const box = { x: +tile.getAttribute('x'), y: +tile.getAttribute('y'), w: +tile.getAttribute('width'), h: +tile.getAttribute('height'),
      rx: +tile.getAttribute('rx'), unit };
    group.querySelector('.pad-tile-icon').insertAdjacentHTML('beforebegin', `<g class="pad-motif" aria-hidden="true">${tileMotif(theme.id, box, group.dataset.artPad, grid, shine)}</g>`);
  });
}

let samples = 0; // each sample gets its own pattern and gradient names

/**
 * One sample pad in a look, for the Look cards in the Pad grid view: the snare's tile with the look's face, trim,
 * texture and artwork, its drawing, name and colour bar (and the LED edge on the Electronic kit).
 * @param {typeof import('./themes.js').THEMES[number]} theme
 * @param {{id: string}} kit
 */
export function padLookPreview(theme, kit) {
  const look = padLook(theme, kit);
  const id = `ps${(samples += 1)}`;
  const tile = { x: 24, y: 22, w: 432, h: 226, rx: 24, unit: 2 };
  const own = (markup) => markup.replace(/pad-(wrap|burst|flame|sun-cut|sun)/g, `pad-$1-${id}`); // names unique to this card
  return `<svg viewBox="0 0 480 270" aria-hidden="true">
    <defs><linearGradient id="${id}-face" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${look.top}"/><stop offset="1" stop-color="${look.bottom}"/></linearGradient>
      ${own(motifDefs(theme.id, tile.unit) + burstDef)}</defs>
    <rect class="mini-tile" data-role="snare" x="${tile.x}" y="${tile.y}" width="${tile.w}" height="${tile.h}" rx="${tile.rx}" fill="url(#${id}-face)"/>
    ${own(tileMotif(theme.id, tile, id, tile))}
    <rect x="${tile.x + 12}" y="${tile.y + 12}" width="${tile.w - 24}" height="${tile.h - 24}" rx="${tile.rx - 10}" fill="none" stroke="${look.trim}"
      stroke-width="${look.glow ? 5 : 3}" opacity="${look.glow ? 0.95 : 0.6}" ${look.glow ? `style="filter: drop-shadow(0 0 6px ${look.glow})"` : ''}/>
    <g class="pad-tile-icon" data-role="snare" stroke-width="5">${gridIcon('snare', 300, 140, 64)}</g>
    <text class="pad-tile-name" x="60" y="84" font-size="34" style="fill: #fff">Snare</text>
    <rect class="pad-tile-bar" data-role="snare" x="60" y="206" width="76" height="6" rx="3"/>
  </svg>`;
}
