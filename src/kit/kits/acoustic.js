// Studio kit (acoustic): a five-piece rock/pop kit with two crashes, a splash and a ride, laid out as seen from above.

// Where the rack tom arms meet on top of the kick.
const TOM_MOUNT = { x: 800, y: 600 };

/**
 * Pads from bottom layer to top layer. x and y are centres; r is radius, w and h are width and height.
 * key is a KeyboardEvent.code value. Scale: about 17 units per inch (the 14-inch snare is 240 wide),
 * so every piece is drawn at a real-world size: 22" kick, 12" / 13" / 16" toms, 14" hi-hats, 18" crashes,
 * 20" ride and 10" splash. The snare tucks against the kick's back corner, as on a real kit.
 */
export const ACOUSTIC = {
  id: 'acoustic',
  label: 'Studio',
  description: 'A full acoustic kit: two toms, floor tom, two crashes, splash and ride.',
  view: { width: 1600, height: 900 },
  pads: [
    { id: 'kick', label: 'Kick', key: 'Space', art: 'kick', x: 800, y: 695, w: 380, h: 290 },
    { id: 'floorTom', label: 'Floor Tom', key: 'KeyL', art: 'tom', x: 1150, y: 715, r: 140, lugs: 8, legs: true },
    { id: 'snare', label: 'Snare', key: 'KeyS', art: 'snare', x: 500, y: 715, r: 120 },
    { id: 'tom1', label: 'Tom 1', key: 'KeyJ', art: 'tom', x: 690, y: 480, r: 100, lugs: 6, mount: TOM_MOUNT },
    { id: 'tom2', label: 'Tom 2', key: 'KeyK', art: 'tom', x: 915, y: 485, r: 110, lugs: 6, mount: TOM_MOUNT },
    { id: 'hihat', label: 'Hi-Hat', key: 'KeyA', art: 'hihat', x: 215, y: 640, r: 120 },
    { id: 'openHihat', label: 'Open Hi-Hat', key: 'KeyZ', art: 'hihat', x: 240, y: 372, r: 120, open: true },
    { id: 'ride', label: 'Ride', key: 'KeyP', art: 'cymbal', x: 1360, y: 470, r: 170, look: { bell: 0.26, tint: -0.1 } },
    { id: 'crashLeft', label: 'Crash Left', key: 'KeyQ', art: 'cymbal', x: 480, y: 200, r: 150 },
    { id: 'crashRight', label: 'Crash Right', key: 'KeyO', art: 'cymbal', x: 1130, y: 190, r: 150, look: { angle: -45 } },
    { id: 'splash', label: 'Splash', key: 'KeyW', art: 'cymbal', x: 805, y: 150, r: 85, look: { bell: 0.24, tint: 0.05 } },
  ],
};
