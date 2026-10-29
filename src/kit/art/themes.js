// Kit themes: each one sets the shells, cymbals, hardware, heads, stage light and pad lights together, can add a wrap
// pattern on the shells and a graphic on the kick, and puts real-world accessories on the kit (see accessories/).
// All designs are original and drawn in code.
import { SHELLS, CYMBALS, METALS, HEADS, setVars } from './finishes.js';
import { wrapPattern, kickGraphic } from './wraps.js';
import { drawAccessories } from './accessories/index.js';

/** The themes, in the order the Kit drawer shows them. accent, hoop and glow are used by the preview cards. */
export const THEMES = [
  { id: 'classic', label: 'Classic Studio', description: 'Red lacquer and chrome, miked up for the studio, with a towel and stick bag.',
    shell: 'red', cymbals: 'classic', metal: 'chrome', heads: 'white', light: '#ffffff', led: '#ff4d5a' },
  { id: 'dragon', label: 'Dragon', description: 'Crimson scales and gold, a coiled dragon, gold chains and lucky stickers.',
    shell: 'crimson', cymbals: 'brilliant', metal: 'gold', heads: 'black', light: '#ff6a3d', led: '#ff7a1a',
    wrap: 'scales', graphic: 'dragon', accent: '#e0b04a' },
  { id: 'gothic', label: 'Gothic', description: 'Wine and black with purple hoops, a heavy chain, gel pads and dark stickers.',
    shell: 'wine', cymbals: 'dark', metal: 'black', heads: 'black', light: '#b07cff', led: '#b07cff',
    wrap: 'filigree', graphic: 'crest', accent: '#c9ccd4', hoop: '#5e3596' },
  { id: 'neon', label: 'Neon Synthwave', description: 'Violet shells, neon hoops and LED-lit clear heads, with synthwave stickers.',
    shell: 'violet', cymbals: 'brilliant', metal: 'black', heads: 'clear', light: '#ff4fd8', led: '#2ff3ff',
    graphic: 'neon', accent: '#2ff3ff', hoop: '#2ff3ff', glow: '#ff4fd8' },
  { id: 'midnight', label: 'Midnight', description: 'Deep blue shells, a blue LED glow through clear heads, tape and moon stickers.',
    shell: 'navy', cymbals: 'dark', metal: 'black', heads: 'clear', light: '#9ec5ff', led: '#6aa8ff', glow: '#3d8bff' },
  { id: 'flames', label: 'Hot Rod', description: 'Hot-rod flames, red hoops, a chrome chain and racing stickers.',
    shell: 'black', cymbals: 'brilliant', metal: 'chrome', heads: 'white', light: '#ff9b50', led: '#ff7a1a',
    graphic: 'flames', accent: '#ff7a1a', hoop: '#c4231d' },
  { id: 'sunburst', label: 'Vintage Sunburst', description: 'Wood grain and gold, a hi-hat tambourine, a sizzle chain and a vintage badge.',
    shell: 'wood', cymbals: 'classic', metal: 'gold', heads: 'cream', light: '#ffd29a', led: '#ffb547',
    wrap: 'grain', graphic: 'sunburst', accent: '#3a2410' },
  { id: 'sparkle', label: 'Retro Sparkle', description: 'Silver glitter, white hoops, a tambourine and retro flower stickers.',
    shell: 'sparkle', cymbals: 'brilliant', metal: 'chrome', heads: 'white', light: '#ffffff', led: '#9fd3ff',
    wrap: 'sparkle', accent: '#eaf2ff', hoop: '#f1f1ee' },
];

/** @param {string} id */
export const getTheme = (id) => THEMES.find((theme) => theme.id === id) ?? THEMES[0];

/** The plain colours of a theme, for drawing previews. */
export const themeColors = (theme) => ({
  shell: SHELLS[theme.shell], cymbals: CYMBALS[theme.cymbals], metal: METALS[theme.metal], heads: HEADS[theme.heads],
});

/**
 * Applies a theme to the drawn kit: colours through CSS variables, the wrap pattern, the kick graphic, and the
 * accessories, which go inside each piece's group (the hi-hat's inside its top cymbal) so they move with it.
 * @param {SVGSVGElement} svg the kit drawing
 * @param {typeof THEMES[number]} theme
 * @param {{pads: Array<{id: string, x: number, y: number, w?: number, h?: number}>}} kit
 */
export function applyTheme(svg, theme, kit) {
  const { shell, cymbals, metal, heads } = themeColors(theme);
  setVars('shell', shell);
  setVars('bronze', cymbals.bronze);
  setVars('bell', cymbals.bell);
  setVars('metal', metal.tones);
  setVars('head', heads);
  const style = document.documentElement.style;
  style.setProperty('--metal-solid', metal.solid);
  style.setProperty('--stage-tint', theme.light);
  style.setProperty('--led', theme.led);

  svg.querySelector('#shell-wrap')?.replaceWith(patternElement(wrapPattern(theme.wrap)));
  const graphic = svg.querySelector('.kick-graphic');
  const kick = kit.pads.find((pad) => pad.id === 'kick');
  if (graphic && kick) graphic.innerHTML = kickGraphic(theme.graphic, kick);

  const extras = drawAccessories(theme.id, kit);
  svg.querySelectorAll('.pad-art').forEach((group) => {
    let layer = group.querySelector('.pad-extras');
    if (!layer) {
      layer = document.createElementNS(SVG_NS, 'g');
      layer.setAttribute('class', 'pad-extras');
      (group.querySelector('.hihat-top') ?? group).append(layer);
    }
    layer.innerHTML = extras[group.dataset.artPad] ?? '';
  });
}

const SVG_NS = 'http://www.w3.org/2000/svg';

// SVG markup -> an element in the SVG namespace.
function patternElement(markup) {
  const holder = document.createElementNS(SVG_NS, 'svg');
  holder.innerHTML = markup;
  return holder.firstElementChild;
}
