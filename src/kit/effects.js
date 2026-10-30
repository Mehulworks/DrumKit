// Hit effects on the art layer: ripples on a drum head where it was hit, a shimmer sweeping across a cymbal, and a
// faint ring on the floor where a tap missed every drum.
const SVG_NS = 'http://www.w3.org/2000/svg';
const RIPPLE_MS = 520;
const SHIMMER_MS = 520;

/**
 * @param {SVGSVGElement} svg the kit drawing (with an empty .kit-effects layer)
 * @param {Array<{id: string, art: string, x: number, y: number, r?: number}>} pads
 * @returns {{hit: (id: string, options?: {point?: {x: number, y: number}, playback?: boolean}) => void,
 *   floorTap: (point: {x: number, y: number}) => void}}
 */
export function createEffects(svg, pads) {
  const layer = svg.querySelector('.kit-effects');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const byId = new Map(pads.map((pad) => [pad.id, pad]));

  // A clip shape per round piece, so its effects stay inside the head (drums), the disc (cymbals) or the mesh (e-pads);
  // a grid pad clips to its tile.
  const HEAD = { cymbal: 1, hihat: 1, ecymbal: 0.96, epad: 0.8 };
  const defs = svg.querySelector('defs');
  for (const pad of pads) {
    if (!pad.r && !pad.grid) continue;
    const clip = document.createElementNS(SVG_NS, 'clipPath');
    clip.id = `clip-${pad.id}`;
    clip.innerHTML = pad.grid ? `<rect x="${pad.x - pad.w / 2}" y="${pad.y - pad.h / 2}" width="${pad.w}" height="${pad.h}" rx="${pad.rx}"/>`
      : `<circle cx="${pad.x}" cy="${pad.y}" r="${pad.r * (HEAD[pad.art] ?? 0.93)}"/>`;
    defs.append(clip);
  }

  // Screen point -> drawing coordinates.
  function toDrawing(point) {
    const matrix = svg.getScreenCTM();
    return matrix ? new DOMPoint(point.x, point.y).matrixTransform(matrix.inverse()) : null;
  }

  function add(tag, attributes, pad) {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    element.setAttribute('clip-path', `url(#clip-${pad.id})`);
    layer.append(element);
    return element;
  }

  // Two rings spreading from the hit point and fading, like a ripple on the skin.
  function ripple(pad, at, color) {
    [0, 90].forEach((delay) => {
      const ring = add('circle', { cx: at.x, cy: at.y, r: (pad.r ?? Math.max(pad.w, pad.h) / 2) * 0.55, fill: 'none', stroke: color,
        'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke', class: 'effect-ring' }, pad);
      // Soft enough to read on dark heads without glaring: the first ring starts at 0.35, the second fainter.
      ring.animate([{ transform: 'scale(0.12)', opacity: delay ? 0.22 : 0.35 }, { transform: 'scale(1)', opacity: 0 }],
        { duration: RIPPLE_MS, delay, easing: 'ease-out', fill: 'backwards' }).onfinish = () => ring.remove();
    });
  }

  // A slice of light that sweeps across the cymbal and fades.
  function shimmer(pad, color) {
    const { x, y, r } = pad;
    const point = (deg) => `${x + r * Math.sin((deg * Math.PI) / 180)} ${y - r * Math.cos((deg * Math.PI) / 180)}`;
    const slice = add('path', { d: `M ${x} ${y} L ${point(-20)} A ${r} ${r} 0 0 1 ${point(20)} Z`, fill: color }, pad);
    slice.style.transformBox = 'view-box';
    slice.style.transformOrigin = `${x}px ${y}px`;
    slice.animate([
      { transform: 'rotate(-70deg)', opacity: 0 },
      { transform: 'rotate(-20deg)', opacity: 0.18, offset: 0.35 },
      { transform: 'rotate(40deg)', opacity: 0 },
    ], { duration: SHIMMER_MS, easing: 'ease-out' }).onfinish = () => slice.remove();
  }

  return {
    hit(id, { point, playback = false } = {}) {
      const pad = byId.get(id);
      if (!(pad?.r || pad?.grid) || reduced.matches) return;
      const color = playback ? getComputedStyle(document.documentElement).getPropertyValue('--color-playback').trim() : '#fff';
      if (pad.art === 'cymbal' || pad.art === 'hihat') return shimmer(pad, color);
      const at = (point && toDrawing(point)) || { x: pad.x, y: pad.y };
      ripple(pad, at, color);
    },
    // A tap on the floor between drums: one faint ring, so the tap still feels answered.
    floorTap(point) {
      const at = toDrawing(point);
      if (!at || reduced.matches) return;
      const ring = document.createElementNS(SVG_NS, 'circle');
      Object.entries({ cx: at.x, cy: at.y, r: 34, fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
        'vector-effect': 'non-scaling-stroke', class: 'effect-ring floor-ring' }).forEach(([k, v]) => ring.setAttribute(k, String(v)));
      layer.append(ring);
      ring.animate([{ transform: 'scale(0.3)', opacity: 0.5 }, { transform: 'scale(1)', opacity: 0 }],
        { duration: 500, easing: 'ease-out' }).onfinish = () => ring.remove();
    },
  };
}
