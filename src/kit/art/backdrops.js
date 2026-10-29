// Backgrounds behind the kit, chosen separately from the theme: plain (with faint music doodles), oak floor, polished concrete, a stage rug or a
// spotlit stage (drawings in backdrop-art.js), each with props round the edges (backdrop-props.js) and gentle moving
// light and props on top (atmosphere.js, atmosphere-props.js). Soft at the edges so the kit stays the focus.
import { BLEED, wood, concrete, rug, stage } from './backdrop-art.js';
import { ATMOSPHERES, glowFootlights } from './atmosphere.js';
import { PROPS } from './backdrop-props.js';
import { MOVING_PROPS } from './atmosphere-props.js';
import { doodles } from './doodles.js';
import { sketchProps } from './sketch-props.js';

// Edges fade into the page colour, so a floor has no hard box around it.
const fade = (p) => `<radialGradient id="${p}-fade" cx="0.5" cy="0.55" r="0.75">
    <stop offset="0.6" style="stop-color: var(--color-bg); stop-opacity: 0"/>
    <stop offset="1" style="stop-color: var(--color-bg); stop-opacity: 0.8"/>
  </radialGradient><rect ${BLEED} fill="url(#${p}-fade)"/>`;

/** The backgrounds, in the order the picker shows them. draw(p) returns the drawing, with p as its id prefix. */
export const BACKDROPS = [
  { id: 'plain', label: 'Plain', description: 'The page colour with music doodles and sketched props.',
    draw: (p) => doodles(p) + sketchProps() },
  { id: 'wood', label: 'Wood floor', description: 'Warm oak planks with a varnish sheen.', draw: wood },
  { id: 'concrete', label: 'Concrete', description: 'Polished grey floor, like a loft studio.', draw: concrete },
  { id: 'rug', label: 'Stage rug', description: 'A patterned rug on dark boards.', draw: rug },
  { id: 'spotlight', label: 'Spotlight', description: 'A dark stage with light on the kit.', draw: stage },
];

const find = (id) => BACKDROPS.find((backdrop) => backdrop.id === id) ?? BACKDROPS[0];

/**
 * Draws a background behind the kit (in its own layer at the very bottom of the drawing).
 * @param {SVGSVGElement} svg the kit drawing
 * @param {string} id one of BACKDROPS
 */
export function applyBackdrop(svg, id) {
  const art = svg.querySelector('.kit-art');
  let layer = art.querySelector('.kit-backdrop');
  if (!layer) {
    layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    layer.setAttribute('class', 'kit-backdrop');
    art.prepend(layer);
  }
  const backdrop = find(id);
  layer.innerHTML = backdrop.id === 'plain' ? backdrop.draw('bd') : backdrop.draw('bd') + fade('bd') + (PROPS[backdrop.id]?.() ?? '');
  const atmosphere = svg.parentElement?.querySelector('.kit-atmosphere');
  if (atmosphere) {
    atmosphere.innerHTML = (ATMOSPHERES[backdrop.id]?.() ?? '') + (MOVING_PROPS[backdrop.id]?.() ?? '');
    atmosphere.dataset.backdrop = backdrop.id;
  }
}

/**
 * Lights in the background that answer a hit (the Spotlight stage's footlights) glow softly.
 * @param {SVGSVGElement} svg the kit drawing
 */
export function glowBackdropLights(svg) {
  glowFootlights(svg.parentElement?.querySelector('.kit-atmosphere'));
}

/**
 * A small picture of a background for its card: the real drawing, zoomed in on the middle where the kit stands.
 * @param {string} id one of BACKDROPS
 */
export function backdropPreview(id) {
  const backdrop = find(id);
  const body = backdrop.id === 'plain' ? `<rect width="1600" height="900" style="fill: var(--color-bg)"/>${backdrop.draw('pv-plain')}` : backdrop.draw(`pv-${id}`);
  return `<svg viewBox="260 300 1080 608" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;
}
