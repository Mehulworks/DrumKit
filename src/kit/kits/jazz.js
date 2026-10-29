// Jazz kit (acoustic): a small four-piece with an 18" kick, one rack tom, a floor tom, hi-hats, a crash and a big ride.
// It uses the same keys as the Studio kit; the keys for pieces it does not have (K, O, W) simply do nothing here.

const TOM_MOUNT = { x: 800, y: 620 };

/** Same scale as the Studio kit (about 17 units per inch): 18" × 14" kick, 12" and 14" toms, 14" hi-hats, 18" crash, 20" ride. */
export const JAZZ = {
  id: 'jazz',
  label: 'Jazz',
  description: 'A small, warm kit: 18" kick, one rack tom, floor tom, crash and a big ride.',
  view: { width: 1600, height: 900 },
  pads: [
    { id: 'kick', label: 'Kick', key: 'Space', art: 'kick', x: 800, y: 712, w: 306, h: 238 },
    { id: 'floorTom', label: 'Floor Tom', key: 'KeyL', art: 'tom', x: 1110, y: 700, r: 120, lugs: 6, legs: true },
    { id: 'snare', label: 'Snare', key: 'KeyS', art: 'snare', x: 535, y: 712, r: 120 },
    { id: 'tom1', label: 'Tom', key: 'KeyJ', art: 'tom', x: 800, y: 505, r: 102, lugs: 6, mount: TOM_MOUNT },
    { id: 'hihat', label: 'Hi-Hat', key: 'KeyA', art: 'hihat', x: 270, y: 640, r: 120 },
    { id: 'openHihat', label: 'Open Hi-Hat', key: 'KeyZ', art: 'hihat', x: 285, y: 360, r: 120, open: true },
    { id: 'ride', label: 'Ride', key: 'KeyP', art: 'cymbal', x: 1180, y: 360, r: 170, look: { bell: 0.24, tint: -0.12 } },
    { id: 'crashLeft', label: 'Crash', key: 'KeyQ', art: 'cymbal', x: 560, y: 230, r: 150, look: { tint: -0.05 } },
  ],
};
