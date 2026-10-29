// Hit areas: invisible, generous shapes over the art, tagged with their pad id, that glow briefly when hit.
const SVG_NS = 'http://www.w3.org/2000/svg';

// Hit areas reach a little past the drawn edge so they are easy to hit.
const REACH = 1.06;
const PEDAL_DEPTH = 55;

function createShape(pad) {
  if (pad.w) {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', String(pad.x - pad.w / 2));
    rect.setAttribute('y', String(pad.y - pad.h / 2));
    rect.setAttribute('width', String(pad.w));
    rect.setAttribute('height', String(pad.h + (pad.grid ? 0 : PEDAL_DEPTH)));
    rect.setAttribute('rx', pad.grid ? '28' : '12');
    return rect;
  }
  const circle = document.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('cx', String(pad.x));
  circle.setAttribute('cy', String(pad.y));
  circle.setAttribute('r', String(pad.r * REACH));
  return circle;
}

/**
 * Adds one hit area per pad to the layer.
 * @param {SVGGElement} layer
 * @param {Array<{id: string, label: string}>} pads
 * @returns {{flash: (id: string, playback?: boolean) => void}} flash shows the hit glow on a pad
 */
export function createHitAreas(layer, pads) {
  const areas = new Map();
  const byId = new Map(pads.map((pad) => [pad.id, pad]));
  for (const pad of pads) {
    const shape = createShape(pad);
    shape.classList.add('hit-area');
    shape.dataset.pad = pad.id;
    shape.setAttribute('role', 'button');
    shape.setAttribute('aria-label', pad.label);
    layer.append(shape);
    areas.set(pad.id, shape);
  }
  return {
    /** Glow on a hit: a soft white flash for live hits (a Pad grid tile: its own colour), gold for the recording playing back. */
    flash(id, playback = false) {
      const pad = byId.get(id);
      const token = playback ? '--color-playback' : pad?.grid ? `--grid-${pad.role}` : null;
      const color = token ? getComputedStyle(document.documentElement).getPropertyValue(token).trim() : '#fff';
      const peak = pad?.grid ? 0.3 : playback ? 0.2 : 0.1; // a Pad grid tile lights up in its own colour
      areas.get(id)?.animate([{ fill: color, fillOpacity: peak }, { fill: color, fillOpacity: 0 }],
        { duration: playback || pad?.grid ? 260 : 180, easing: 'ease-out' });
    },
  };
}
