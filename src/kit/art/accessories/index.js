// Theme accessories: the real-world add-ons each theme puts on the kit itself (mics, chains, rattlers, stickers,
// dampeners, a tambourine, charms, LED lights, glow tape, painted hoops, coloured felts) and, on the Electronic kit,
// coloured mesh heads, rims and cymbal edges plus stickers on the kick tower.
import { paintedHoop } from './hoops.js';
import { ledGlow } from './lights.js';
import { oRing, gelPads, tape, snareWallet } from './dampers.js';
import { towel, stickBag } from './cloth.js';
import { sizzleChain, rattler, kickChain } from './chains.js';
import { clipMic } from './mics.js';
import { hihatTambourine } from './percussion.js';
import { glowTape, cymbalFelt } from './tools.js';
import { luckyKnot, fuzzyDice } from './charms.js';
import { meshTint, padRim, cymbalPadEdge, towerSpots } from './e-pads.js';
import { sticker, kickSpots } from './stickers.js';

// The kit's pieces that accessories can go on, found by what they are drawn as.
function pieces(kit) {
  const of = (test) => kit.pads.filter(test);
  return {
    snare: of((p) => p.art === 'snare'),
    toms: of((p) => p.art === 'tom' && !p.legs),
    floorTom: of((p) => p.art === 'tom' && p.legs),
    drums: of((p) => p.art === 'snare' || p.art === 'tom'),
    kick: of((p) => p.art === 'kick'),
    ride: of((p) => p.id === 'ride' && p.art === 'cymbal'),
    crashes: of((p) => p.art === 'cymbal' && p.id !== 'ride'),
    cymbals: of((p) => p.art === 'cymbal'),
    hihat: of((p) => p.id === 'hihat' && p.art === 'hihat'),
    pads: of((p) => p.art === 'epad'),
    padCymbals: of((p) => p.art === 'ecymbal'),
    tower: of((p) => p.art === 'ekick'),
  };
}

// Stickers on the kick (or the electronic kick tower), one per name, in its free spots.
const stickers = (names, turns = [-12, 10, -6, 14]) => (kick) => {
  const tower = kick.art === 'ekick';
  const spots = tower ? towerSpots(kick) : kickSpots(kick);
  const size = kick.w * (tower ? 0.1 : 0.072);
  return spots.slice(0, names.length)
    .map((spot, i) => sticker(names[i], spot.x, spot.y, size * (i > 1 ? 0.9 : 1), turns[i])).join('');
};

// The Electronic kit's share of a theme: mesh colour, rim colour and tower stickers.
const electronic = (p, { mesh, rim, tags = [] }) => [
  [p.pads, (d) => (mesh ? meshTint(d, mesh) : '') + (rim ? padRim(d, rim) : '')],
  [p.padCymbals, (d) => (rim ? cymbalPadEdge(d, rim) : '')],
  [p.tower, stickers(tags)],
];

// Neon colours alternate so neighbouring drums differ.
const neonColor = (pad) => (pad.art === 'snare' || pad.legs ? '#ff4fd8' : '#2ff3ff');

/** For each theme: a list of [pieces, draw] pairs. Each draw returns the markup added to that piece. */
const THEME_ACCESSORIES = {
  classic: (p) => [
    [p.snare, (d) => oRing(d) + clipMic(d, 320)],
    [p.toms, (d) => clipMic(d, d.x > 800 ? 30 : 330)],
    [p.floorTom, (d) => clipMic(d, 40) + towel(d) + stickBag(d)],
    [p.cymbals, (d) => cymbalFelt(d, '#b02a33')],
    ...electronic(p, { rim: '#a32a36', tags: ['star'] }),
  ],
  dragon: (p) => [
    [p.kick, (d) => stickers(['pearl', 'seal'])(d) + kickChain(d, '#d9b24c')],
    [p.ride, (d) => sizzleChain(d, '#e9c86a')],
    [p.crashes, (d) => rattler(d, '#e9c86a') + cymbalFelt(d, '#b3191b')],
    [p.drums, (d) => gelPads(d, '#c4231d', [40])],
    [p.floorTom, (d) => towel(d, '#d4a23c', '#7a1414') + luckyKnot(d)],
    ...electronic(p, { mesh: '#b3191b', rim: '#d9b24c', tags: ['pearl', 'seal'] }),
  ],
  gothic: (p) => [
    [p.drums, (d) => paintedHoop(d, '#5e3596') + gelPads(d, '#9b6bd6')],
    [p.kick, (d) => stickers(['skull', 'bat', 'ankh'])(d) + kickChain(d, '#4a4d54')],
    [p.ride, (d) => sizzleChain(d, '#6d7178')],
    [p.crashes, (d) => rattler(d, '#6d7178') + cymbalFelt(d, '#5e3596')],
    ...electronic(p, { mesh: '#5e3596', rim: '#9b6bd6', tags: ['skull', 'bat'] }),
  ],
  neon: (p) => [
    [p.drums, (d) => ledGlow(d, neonColor(d)) + paintedHoop(d, neonColor(d))],
    [p.kick, stickers(['sun', 'triangle', 'bolt', 'star'])],
    [p.cymbals, (d) => cymbalFelt(d, '#ff4fd8')],
    [p.floorTom, (d) => glowTape(d, '#2ff3ff')],
    ...electronic(p, { mesh: '#ff4fd8', rim: '#2ff3ff', tags: ['sun', 'bolt'] }),
  ],
  midnight: (p) => [
    [p.drums, (d) => ledGlow(d, '#3d8bff') + glowTape(d)],
    [p.snare, (d) => tape(d)],
    [p.kick, stickers(['moon', 'star', 'star'])],
    [p.floorTom, (d) => stickBag(d, '#141518')],
    [p.cymbals, (d) => cymbalFelt(d, '#3d8bff')],
    ...electronic(p, { mesh: '#3d8bff', tags: ['moon', 'star'] }),
  ],
  flames: (p) => [
    [p.drums, (d) => paintedHoop(d, '#c4231d')],
    [p.kick, (d) => stickers(['flag', 'roundel', 'bolt'])(d) + kickChain(d)],
    [p.floorTom, (d) => stickBag(d, '#b52a22') + fuzzyDice(d)],
    [p.crashes, (d) => rattler(d)],
    [p.cymbals, (d) => cymbalFelt(d, '#ff7a1a')],
    ...electronic(p, { rim: '#c4231d', mesh: '#ff7a1a', tags: ['flag', 'roundel'] }),
  ],
  sunburst: (p) => [
    [p.snare, (d) => oRing(d, '#efe3c4') + snareWallet(d)],
    [p.hihat, (d) => hihatTambourine(d, '#5a3c1c')],
    [p.ride, (d) => sizzleChain(d)],
    [p.kick, stickers(['badge'])],
    [p.floorTom, (d) => towel(d, '#e9dcc0', '#9a6d3c')],
    [p.cymbals, (d) => cymbalFelt(d, '#6b4423')],
    ...electronic(p, { mesh: '#c99c64', rim: '#c9a64a', tags: ['badge'] }),
  ],
  sparkle: (p) => [
    [p.drums, (d) => paintedHoop(d, '#f1f1ee')],
    [p.toms, (d) => gelPads(d, '#ff7eb3')],
    [p.hihat, (d) => hihatTambourine(d, '#f1f1ee')],
    [p.kick, stickers(['flower', 'heart', 'star'])],
    [p.crashes, (d) => rattler(d)],
    [p.cymbals, (d) => cymbalFelt(d, '#f1f1ee')],
    ...electronic(p, { mesh: '#ff7eb3', rim: '#f1f1ee', tags: ['flower', 'heart'] }),
  ],
};

/**
 * The accessories for a theme on a kit, as markup per pad id.
 * @param {string} themeId
 * @param {{pads: Array<{id: string, art: string}>}} kit
 * @returns {Record<string, string>}
 */
export function drawAccessories(themeId, kit) {
  const out = {};
  const pairs = (THEME_ACCESSORIES[themeId] ?? THEME_ACCESSORIES.classic)(pieces(kit));
  for (const [pads, draw] of pairs) {
    pads.forEach((pad) => { out[pad.id] = (out[pad.id] ?? '') + draw(pad); });
  }
  return out;
}
