// Shared art: SVG gradients (metal, lacquer, heads, bronze, shadows, stage light), arcs and the top view of a drum.
// Shell, metal, head, cymbal and light colours come from CSS variables set by themes.js, so a theme changes the
// look without redrawing; the shell-wrap pattern is filled in by the theme too.

/** Rounds a number for tidy SVG markup. */
export const n = (value) => +value.toFixed(1);

// A gradient stop whose colour is a CSS variable (from themes.js).
const stop = (offset, variable, opacity = 1) =>
  `<stop offset="${offset}" style="stop-color: var(--${variable}); stop-opacity: ${opacity}"/>`;

/** Returns the <defs> content that every art file relies on. */
export function defs() {
  return `
  <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
    ${stop(0, 'metal-1')}${stop(0.22, 'metal-2')}${stop(0.45, 'metal-3')}${stop(0.7, 'metal-4')}${stop(1, 'metal-5')}
  </linearGradient>
  <pattern id="shell-wrap" patternUnits="userSpaceOnUse" width="10" height="10"></pattern>
  <linearGradient id="dark-metal" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#55595f"/>
    <stop offset="1" stop-color="#1c1e21"/>
  </linearGradient>
  <linearGradient id="lacquer" x1="0" y1="0" x2="0.6" y2="1">
    ${stop(0, 'shell-light')}${stop(0.5, 'shell-mid')}${stop(1, 'shell-dark')}
  </linearGradient>
  <linearGradient id="lacquer-cylinder" x1="0" y1="0" x2="1" y2="0">
    ${stop(0, 'shell-dark')}${stop(0.28, 'shell-light')}${stop(0.36, 'shell-sheen')}
    ${stop(0.44, 'shell-light')}${stop(0.8, 'shell-mid')}${stop(1, 'shell-dark')}
  </linearGradient>
  <radialGradient id="head" cx="0.42" cy="0.38" r="0.7">
    ${stop(0, 'head-1')}${stop(0.65, 'head-2')}${stop(1, 'head-3')}
  </radialGradient>
  <radialGradient id="shadow">
    <stop offset="0.55" stop-color="#000" stop-opacity="0.36"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="bronze">
    ${stop(0, 'bronze-1')}${stop(0.3, 'bronze-2')}${stop(0.75, 'bronze-3')}${stop(1, 'bronze-4')}
  </radialGradient>
  <radialGradient id="bell" cx="0.45" cy="0.4" r="0.6">
    ${stop(0, 'bell-1')}${stop(0.6, 'bell-2')}${stop(1, 'bell-3')}
  </radialGradient>
  <radialGradient id="lathe" r="0.012" spreadMethod="repeat">
    <stop offset="0" stop-color="#fff" stop-opacity="0.13"/>
    <stop offset="0.5" stop-color="#000" stop-opacity="0.13"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0.13"/>
  </radialGradient>
  <radialGradient id="stage-light" cx="0.5" cy="0.55" r="0.55">
    ${stop(0, 'stage-tint', 0.09)}${stop(1, 'stage-tint', 0)}
  </radialGradient>
  <radialGradient id="stick-wear">
    <stop offset="0" stop-color="#8f8674" stop-opacity="0.16"/>
    <stop offset="1" stop-color="#8f8674" stop-opacity="0"/>
  </radialGradient>`;
}

/**
 * An arc along a circle, for highlights and shadows on round parts. Angles in degrees, clockwise from up.
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {number} from
 * @param {number} to
 * @param {string} style stroke attributes, such as 'stroke="#fff" stroke-width="3"'
 */
export function arc(x, y, radius, from, to, style) {
  const point = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return `${n(x + radius * Math.sin(rad))} ${n(y - radius * Math.cos(rad))}`;
  };
  return `<path d="M ${point(from)} A ${n(radius)} ${n(radius)} 0 0 1 ${point(to)}" fill="none" stroke-linecap="round" ${style}/>`;
}

/**
 * Draws a drum seen from above: shadow, lacquered shell edge, lugs, chrome hoop, head and tension rods.
 * @param {{x: number, y: number, r: number}} pad
 * @param {number} lugCount
 */
export function drumTop({ x, y, r }, lugCount) {
  let lugs = '';
  let rods = '';
  for (let i = 0; i < lugCount; i++) {
    const turn = `transform="rotate(${n((360 / lugCount) * (i + 0.5))} ${x} ${y})"`;
    lugs += `<rect x="${n(x - r * 0.045)}" y="${n(y - r * 1.13)}" width="${n(r * 0.09)}" height="${n(r * 0.2)}"
      rx="${n(r * 0.03)}" fill="url(#chrome)" stroke="#2b2e33" stroke-width="0.8" ${turn}/>`;
    rods += `<circle cx="${x}" cy="${n(y - r * 0.968)}" r="${n(r * 0.03)}"
      style="fill: var(--metal-3)" stroke="#3a3d42" stroke-width="0.8" ${turn}/>`;
  }
  return `
  <circle cx="${n(x + r * 0.07)}" cy="${n(y + r * 0.12)}" r="${n(r * 1.22)}" fill="url(#shadow)"/>
  <circle cx="${x}" cy="${n(y + r * 0.05)}" r="${n(r * 1.03)}" fill="url(#lacquer)"/>
  <circle cx="${x}" cy="${n(y + r * 0.05)}" r="${n(r * 1.03)}" fill="url(#shell-wrap)"/>
  <circle cx="${x}" cy="${n(y + r * 0.05)}" r="${n(r * 1.03)}" fill="none" stroke="#fff" stroke-opacity="0.12"/>
  ${arc(x, y + r * 0.05, r * 1.015, 140, 220, `stroke="#fff" stroke-opacity="0.22" stroke-width="${n(r * 0.02)}"`)}
  ${lugs}
  <circle cx="${x}" cy="${y}" r="${n(r * 0.965)}" fill="none" stroke="url(#chrome)" stroke-width="${n(r * 0.07)}"/>
  ${arc(x, y, r * 0.965, 280, 350, `stroke="#fff" stroke-opacity="0.7" stroke-width="${n(r * 0.022)}"`)}
  ${arc(x, y, r * 0.965, 100, 170, `stroke="#000" stroke-opacity="0.35" stroke-width="${n(r * 0.03)}"`)}
  <circle cx="${x}" cy="${y}" r="${n(r)}" fill="none" stroke="#000" stroke-opacity="0.45"/>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.93)}" fill="url(#head)"/>
  <ellipse cx="${n(x - r * 0.06)}" cy="${n(y + r * 0.12)}" rx="${n(r * 0.34)}" ry="${n(r * 0.27)}" fill="url(#stick-wear)"/>
  <ellipse cx="${n(x - r * 0.34)}" cy="${n(y - r * 0.4)}" rx="${n(r * 0.3)}" ry="${n(r * 0.12)}" fill="#fff" fill-opacity="0.2"
    transform="rotate(-35 ${n(x - r * 0.34)} ${n(y - r * 0.4)})"/>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.93)}" fill="none" stroke="#000" stroke-opacity="0.3" stroke-width="1.5"/>
  <circle cx="${x}" cy="${y}" r="${n(r * 0.86)}" fill="none" stroke="#786e5a" stroke-opacity="0.1" stroke-width="${n(r * 0.06)}"/>
  ${rods}`;
}
