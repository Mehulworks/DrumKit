// Stage: draws the current kit and owns everything tied to its drawing (hit areas, motion, effects, key labels),
// so a kit can be swapped for another without reloading the page.
import { renderKit } from './kit-view.js';
import { createHitAreas } from './hit-areas.js';
import { createMotion } from './motion.js';
import { createEffects } from './effects.js';
import { drawKeyLabels } from './key-labels.js';

/**
 * @param {HTMLElement} container the kit area
 */
export function createStage(container) {
  /** @type {{kit: import('./kits/index.js').Kit, svg: SVGSVGElement, hitAreas: object, motion: object, effects: object} | null} */
  let current = null;

  return {
    /** Draws a kit in place of the current one. @param {import('./kits/index.js').Kit} kit */
    mount(kit) {
      const { svg, labelLayer, hitLayer } = renderKit(container, kit);
      current = {
        kit,
        svg,
        hitAreas: createHitAreas(hitLayer, kit.pads),
        motion: createMotion(svg, kit.pads),
        effects: createEffects(svg, kit.pads),
      };
      drawKeyLabels(labelLayer, kit.pads);
      return current;
    },
    /** What the eye sees on a hit: glow, movement, and a ripple or shimmer. */
    showHit(id, options = {}) {
      if (!current) return;
      current.hitAreas.flash(id, options.playback);
      current.motion.hit(id);
      current.effects.hit(id, options);
    },
    /** A tap on the floor between drums. @param {{x: number, y: number}} point screen point */
    floorTap(point) {
      current?.effects.floorTap(point);
    },
    /** The kit on stage and its drawing. */
    get current() {
      return current;
    },
  };
}
