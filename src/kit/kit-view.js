// Kit view: draws a kit's artwork (any decor such as a rack, the gear around the kit, one group per piece, and a soft
// stage light on top) and returns the empty layers for key labels and hit areas, plus an empty atmosphere layer on top
// for the background's moving light. Theme accessories are added into each piece's group later.
import { defs } from './art/shared.js';
import { drawKick } from './art/kick.js';
import { drawSnare } from './art/snare.js';
import { drawTom } from './art/tom.js';
import { drawCymbal } from './art/cymbal.js';
import { drawHihat } from './art/hihat.js';
import { electronicDefs, drawPad, drawCymbalPad, drawKickTower } from './art/electronic.js';
import { drawGear } from './art/gear.js';
import { drawGridPad } from './art/grid-pad.js';

const ART = {
  kick: drawKick, snare: drawSnare, tom: drawTom, cymbal: drawCymbal, hihat: drawHihat,
  epad: drawPad, ecymbal: drawCymbalPad, ekick: drawKickTower, gridpad: drawGridPad,
};

/**
 * Renders a kit into a container element (replacing whatever was there).
 * @param {HTMLElement} container
 * @param {{label: string, view: {width: number, height: number}, pads: Array<{id: string, art: string}>, decor?: () => string,
 *   grid?: boolean}} kit grid: the Pad grid view (flat tiles, no stands or stage light)
 * @returns {{svg: SVGSVGElement, labelLayer: SVGGElement, hitLayer: SVGGElement}}
 */
export function renderKit(container, { label, view, pads, decor, grid }) {
  container.innerHTML = `
  <svg class="kit-svg${grid ? ' is-grid' : ''}" viewBox="0 0 ${view.width} ${view.height}" role="group"
    aria-label="${label} ${grid ? 'drum pads' : 'drum kit seen from above'}">
    <defs>${defs()}${electronicDefs()}</defs>
    <g class="kit-art" aria-hidden="true">
      ${decor ? decor() : ''}
      ${grid ? '' : drawGear(pads)}
      ${pads.map((pad) => `<g class="pad-art" data-art-pad="${pad.id}">${ART[pad.art](pad)}</g>`).join('')}
      ${grid ? '' : `<rect class="kit-light" width="${view.width}" height="${view.height}" fill="url(#stage-light)"/>`}
    </g>
    <g class="kit-effects" aria-hidden="true"></g>
    <g class="kit-labels" aria-hidden="true"></g>
    <g class="kit-hits"></g>
  </svg>
  <svg class="kit-atmosphere" viewBox="0 0 ${view.width} ${view.height}" aria-hidden="true"></svg>`;
  return {
    svg: container.querySelector('.kit-svg'),
    labelLayer: container.querySelector('.kit-labels'),
    hitLayer: container.querySelector('.kit-hits'),
  };
}
