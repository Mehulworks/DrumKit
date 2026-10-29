// Kit finishes: the colour sets for shells, cymbals, hardware, drum heads and drumsticks. Themes (themes.js) combine
// them; they reach the artwork as CSS variables, so changing them recolours the kit without redrawing it.

/** Shell lacquers: light, mid and dark tones plus the bright sheen line. */
export const SHELLS = {
  red: { light: '#a32a36', mid: '#6e1520', dark: '#2e0609', sheen: '#d9606b' },
  black: { light: '#3c3f45', mid: '#1e2024', dark: '#08090a', sheen: '#6f747c' },
  wood: { light: '#c99c64', mid: '#9a6d3c', dark: '#5a3c1c', sheen: '#e8c48f' },
  pearl: { light: '#f2efe8', mid: '#d6d1c6', dark: '#a39d90', sheen: '#ffffff' },
  sparkle: { light: '#a7bad4', mid: '#5d7393', dark: '#27354a', sheen: '#eaf2ff' },
  wine: { light: '#5a1626', mid: '#360b16', dark: '#120308', sheen: '#8e3a4e' },
  night: { light: '#2b2b48', mid: '#17172b', dark: '#07070f', sheen: '#4f4f80' },
  crimson: { light: '#93201d', mid: '#5c0d0d', dark: '#1c0303', sheen: '#d4504a' },
  violet: { light: '#6a3bb0', mid: '#3d1f6e', dark: '#140829', sheen: '#a77be8' },
  navy: { light: '#2c4378', mid: '#16244a', dark: '#060b1a', sheen: '#5f7fc4' },
};

/** Cymbal metals: four bronze tones from centre to edge, and three for the bell. */
export const CYMBALS = {
  classic: { bronze: ['#e2bf74', '#c79c4f', '#a87f38', '#7c5a24'], bell: ['#f0d58f', '#c39a4c', '#9c7432'] },
  dark: { bronze: ['#ab8d58', '#8a6b3a', '#6b5028', '#46331a'], bell: ['#bc9b62', '#8d6c39', '#6b4f27'] },
  brilliant: { bronze: ['#f6dd94', '#e6c068', '#cda24a', '#a07c31'], bell: ['#fff2bd', '#e8c66e', '#ba9341'] },
};

/** Hardware (hoops, lugs, stands): five tones for the shiny gradient, and one solid tone for rods and arms. */
export const METALS = {
  chrome: { tones: ['#f5f7f9', '#9097a0', '#eef1f4', '#5f656d', '#d6dade'], solid: '#9ea4ab' },
  black: { tones: ['#70757d', '#2a2d32', '#5c6168', '#141518', '#41444a'], solid: '#3a3d42' },
  gold: { tones: ['#fff1c4', '#b8902f', '#f7e2a0', '#7a5a14', '#e0c06a'], solid: '#c9a64a' },
};

/** Drum heads: centre, middle and edge tones. */
export const HEADS = {
  white: ['#f6f4ee', '#e4e0d4', '#c9c3b3'],
  cream: ['#f3ead2', '#e2d4b0', '#c5b48a'],
  black: ['#4a4c52', '#2a2c30', '#141518'],
  clear: ['#666a72', '#3e4148', '#25272c'],
};

/** Drumstick woods: body, tip and the darker edge that makes them look round. */
export const STICKS = [
  { id: 'natural', label: 'Natural wood', colors: { body: '#dcbc8c', tip: '#f0dcb8', edge: '#a8834f' } },
  { id: 'black', label: 'Black', colors: { body: '#2a2b2f', tip: '#4a4c52', edge: '#0e0f11' } },
  { id: 'white', label: 'White', colors: { body: '#efeee9', tip: '#ffffff', edge: '#b9b6ad' } },
  { id: 'red', label: 'Red', colors: { body: '#c4302b', tip: '#e2554f', edge: '#7a1512' } },
  { id: 'blue', label: 'Blue', colors: { body: '#2f5fb5', tip: '#5a86d6', edge: '#173a7a' } },
  { id: 'pink', label: 'Pink', colors: { body: '#e56aa3', tip: '#f59cc4', edge: '#a8366b' } },
];

/** Sets CSS variables on the page: setVars('shell', {light: '#..'}) sets --shell-light. Arrays become --name-1, -2... */
export function setVars(prefix, values) {
  const style = document.documentElement.style;
  Object.entries(values).forEach(([key, color]) =>
    style.setProperty(`--${prefix}-${Array.isArray(values) ? Number(key) + 1 : key}`, color));
}

/** Colours the drumsticks. @param {string} id one of STICKS */
export function applyStickFinish(id) {
  setVars('stick', (STICKS.find((stick) => stick.id === id) ?? STICKS[0]).colors);
}
