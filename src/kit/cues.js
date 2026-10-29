// Lesson cue on the kit: the pad you should hit glows softly in saffron, peaking exactly at the moment to hit it (the
// beat grid in the lesson bar shows what comes next). Gentle on purpose: a low glow that rises and falls, never a sharp
// flash, and none at all for reduced motion or with Flashing lights off. In step-by-step mode the pads to hit glow
// steadily instead. Drawn in the effects layer; never takes clicks.
import { getAudio } from '../audio/engine.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const RISE = 0.06; // seconds the glow takes to rise to its peak
const FALL = 0.2; // seconds it takes to fade after the moment

// The glow's shape: an oval over a drum or cymbal, a rounded rectangle over a Pad grid tile.
function glowShape(pad, attributes) {
  const shape = pad.grid
    ? { tag: 'rect', x: pad.x - pad.w / 2, y: pad.y - pad.h / 2, width: pad.w, height: pad.h, rx: 28 }
    : { tag: 'ellipse', cx: pad.x, cy: pad.y, rx: pad.r ?? pad.w / 2, ry: pad.r ?? pad.h / 2 };
  const { tag, ...rest } = shape;
  const glow = document.createElementNS(SVG_NS, tag);
  Object.entries({ ...rest, ...attributes }).forEach(([name, value]) => glow.setAttribute(name, String(value)));
  return glow;
}

/**
 * @param {SVGSVGElement} svg the kit drawing
 * @param {Array<{id: string, x: number, y: number, r?: number, w?: number, h?: number}>} pads
 * @param {() => boolean} allowed whether glows may show (reduced motion and the Flashing lights setting)
 */
export function createCues(svg, pads, allowed) {
  const layer = svg.querySelector('.kit-effects');
  const byId = new Map(pads.map((pad) => [pad.id, pad]));
  const timers = new Set();

  return {
    /** The pad glows, peaking at this audio-clock time (allowing for the speakers' delay). */
    cue(id, time) {
      const pad = byId.get(id);
      if (!pad || !allowed()) return;
      const { context } = getAudio();
      const ms = (time - RISE - context.currentTime + (context.outputLatency || 0)) * 1000;
      const timer = setTimeout(() => {
        timers.delete(timer);
        const glow = glowShape(pad, { class: 'cue-glow' });
        layer.append(glow);
        const total = (RISE + FALL) * 1000;
        glow.animate([{ opacity: 0 }, { opacity: 0.38, offset: RISE / (RISE + FALL) }, { opacity: 0 }], { duration: total, easing: 'ease-out' })
          .onfinish = () => glow.remove();
      }, Math.max(0, ms));
      timers.add(timer);
    },
    /** Step-by-step mode: these pads glow steadily until the next step (shown even with Flashing lights off). */
    hold(ids) {
      layer.querySelectorAll('.cue-hold').forEach((element) => element.remove());
      ids.forEach((id) => {
        const pad = byId.get(id);
        if (!pad) return;
        layer.append(glowShape(pad, { class: 'cue-glow cue-hold', 'data-hold': id }));
      });
    },
    /** A held pad was hit: its glow goes. */
    release(id) {
      layer.querySelector(`.cue-hold[data-hold="${id}"]`)?.remove();
    },
    /** Removes every glow still waiting or showing (when a lesson stops). */
    clear() {
      timers.forEach(clearTimeout);
      timers.clear();
      layer.querySelectorAll('.cue-glow').forEach((element) => element.remove());
    },
  };
}
