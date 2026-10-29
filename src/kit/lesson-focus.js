// Lesson focus: while a lesson or beat is open, the drums it uses get a label with their name and key ("Snare · S"),
// shown even when "Show keys" is off, and the drums it does not use are dimmed a little. Never takes clicks.
import { keyName } from './key-labels.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

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
        const text = `${pad.label} · ${keyName(pad.key)}`;
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
