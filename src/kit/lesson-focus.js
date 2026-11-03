// Lesson focus: while a lesson or beat is open, the drums it uses get a label with their name and key ("Snare · S"),
// shown even when "Show keys" is off, and the drums it does not use are dimmed a little. On touch screens (no keyboard)
// the label is just the name, and the pad grid's tiles (which show their name) get none. Never takes clicks.
import { keyName } from './key-labels.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const hasKeyboard = () => matchMedia('(pointer: fine)').matches;

/**
 * @param {SVGSVGElement} svg the kit drawing
 * @param {Array<{id: string, label: string, key: string, x: number, y: number, r?: number, w?: number}>} pads
 */
export function createLessonFocus(svg, pads) {
  const layer = document.createElementNS(SVG_NS, 'g');
  layer.setAttribute('class', 'lesson-labels');
  layer.setAttribute('aria-hidden', 'true');
  svg.querySelector('.kit-labels').after(layer);

  function clear() {
    layer.innerHTML = '';
    svg.querySelectorAll('.pad-art.is-dimmed').forEach((group) => group.classList.remove('is-dimmed'));
  }

  return {
    /** @param {Set<string>} ids the pads the lesson uses */
    show(ids) {
      clear();
      svg.querySelectorAll('.pad-art').forEach((group) => group.classList.toggle('is-dimmed', !ids.has(group.dataset.artPad)));
      layer.innerHTML = pads.filter((pad) => ids.has(pad.id)).map((pad) => {
        // A Pad grid tile already shows its name: a small key badge in its corner (screen pixels), so the drawing stays
        // in view.
        if (pad.grid) {
          if (!hasKeyboard()) return '';
          const u = pad.unit ?? 1;
          const key = keyName(pad.key);
          const w = (18 + key.length * 8.5) * u;
          const h = 24 * u;
          const inset = pad.inset ?? 20 * u;
          const x = pad.x + pad.w / 2 - inset - w;
          const y = pad.y + pad.h / 2 - inset - h;
          return `<g class="key-label lesson-label is-tile">
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" style="stroke-width:${1.5 * u}"/>
            <text x="${x + w / 2}" y="${y + h / 2}" text-anchor="middle" dominant-baseline="central" style="font-size:${13 * u}px">${key}</text></g>`;
        }
        const text = hasKeyboard() ? `${pad.label} · ${keyName(pad.key)}` : pad.label;
        const width = 30 + text.length * 13;
        // Below the centre on round pieces, so the label does not hide the wing nut or clutch.
        const y = pad.w ? pad.y : pad.y + pad.r * 0.55;
        return `<g class="key-label lesson-label">
          <rect x="${pad.x - width / 2}" y="${y - 21}" width="${width}" height="42" rx="21"/>
          <text x="${pad.x}" y="${y}" text-anchor="middle" dominant-baseline="central">${text}</text></g>`;
      }).join('');
    },
    clear,
  };
}
