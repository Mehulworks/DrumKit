// Electronic kit: rubber and mesh pads on a rack, with glowing rings. Same 11 pads and keys as the Studio kit, so
// everything you know (and anything you recorded) plays here too, with electronic sounds.

import { rackExtras } from '../art/electronic.js';

/** A rack seen from above: two cross bars and two posts, drawn under the pads, with the module and cables on it. */
function rack() {
  const bar = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: var(--metal-solid)"
    stroke-width="16" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-opacity="0.18"
    stroke-width="4" stroke-linecap="round"/>`;
  return `<g class="rack">${bar(400, 330, 1200, 330)}${bar(400, 590, 1200, 590)}${bar(400, 330, 400, 760)}${bar(1200, 330, 1200, 760)}${rackExtras()}</g>`;
}

export const ELECTRONIC = {
  id: 'electronic',
  label: 'Electronic',
  description: 'Pads with glowing rings on a rack, and punchy electronic sounds.',
  view: { width: 1600, height: 900 },
  decor: rack,
  pads: [
    { id: 'kick', label: 'Kick', key: 'Space', art: 'ekick', x: 800, y: 725, w: 220, h: 170 },
    { id: 'floorTom', label: 'Floor Tom', key: 'KeyL', art: 'epad', x: 1060, y: 690, r: 100 },
    { id: 'snare', label: 'Snare', key: 'KeyS', art: 'epad', x: 560, y: 700, r: 100 },
    { id: 'tom1', label: 'Tom 1', key: 'KeyJ', art: 'epad', x: 680, y: 470, r: 85 },
    { id: 'tom2', label: 'Tom 2', key: 'KeyK', art: 'epad', x: 920, y: 470, r: 85 },
    { id: 'hihat', label: 'Hi-Hat', key: 'KeyA', art: 'ecymbal', x: 300, y: 640, r: 105 },
    { id: 'openHihat', label: 'Open Hi-Hat', key: 'KeyZ', art: 'ecymbal', x: 300, y: 395, r: 105 },
    { id: 'ride', label: 'Ride', key: 'KeyP', art: 'ecymbal', x: 1300, y: 520, r: 135 },
    { id: 'crashLeft', label: 'Crash Left', key: 'KeyQ', art: 'ecymbal', x: 480, y: 220, r: 120 },
    { id: 'crashRight', label: 'Crash Right', key: 'KeyO', art: 'ecymbal', x: 1120, y: 220, r: 120 },
    { id: 'splash', label: 'Splash', key: 'KeyW', art: 'ecymbal', x: 800, y: 190, r: 80 },
  ],
};
