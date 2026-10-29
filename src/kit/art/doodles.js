// Doodles: faint hand-drawn music doodles behind the kit on the Plain background: notes, a staff, a drum, sticks,
// headphones, a cymbal, a record, a microphone, a speaker, a metronome, piano keys, a pick, a maraca, a tambourine,
// level bars, a sound wave, stars, sparkles, hearts, bolts and swirls. They are scattered over a large tile with varied
// sizes, angles and gaps (from a fixed random sequence, so the page looks the same on every visit). Drawn in the page's
// text colour at low opacity, so they suit the dark and the light theme. Line drawings made here.

const TILE = { width: 960, height: 672 };
const CELL = 96; // the tile is split into cells; each gets at most one doodle, nudged off-centre

// Each doodle is drawn around (0, 0) at roughly 50 units across.
const DOODLES = {
  note: '<ellipse cx="-4" cy="10" rx="7" ry="5" transform="rotate(-20 -4 10)"/><path d="M 2 8 V -20 C 8 -14 14 -12 16 -4"/>',
  beamed: `<ellipse cx="-12" cy="12" rx="6" ry="4.5" transform="rotate(-20 -12 12)"/><ellipse cx="12" cy="8" rx="6" ry="4.5" transform="rotate(-20 12 8)"/>
    <path d="M -7 10 V -16 L 17 -20 V 6 M -7 -9 L 17 -13"/>`,
  drum: '<ellipse cx="0" cy="-10" rx="20" ry="7"/><path d="M -20 -10 V 10 C -20 20 20 20 20 10 V -10 M -12 -4 L -6 14 M 6 14 L 12 -4"/>',
  sticks: '<path d="M -18 -18 L 16 16 M 18 -18 L -16 16"/><circle cx="-19" cy="-19" r="2.5"/><circle cx="19" cy="-19" r="2.5"/>',
  headphones: '<path d="M -16 8 V 0 C -16 -22 16 -22 16 0 V 8"/><rect x="-21" y="2" width="8" height="14" rx="3"/><rect x="13" y="2" width="8" height="14" rx="3"/>',
  cymbal: '<ellipse cx="0" cy="0" rx="22" ry="6"/><path d="M -4 -5 C -2 -9 2 -9 4 -5 M 0 6 V 22"/>',
  record: '<circle r="18"/><circle r="11"/><circle r="3"/><path d="M 8 -15 A 17 17 0 0 1 15 -8"/>',
  mic: '<rect x="-7" y="-20" width="14" height="22" rx="7"/><path d="M -12 -4 C -12 12 12 12 12 -4 M 0 8 V 18 M -7 18 H 7"/>',
  speaker: '<rect x="-14" y="-19" width="28" height="38" rx="4"/><circle cy="7" r="7"/><circle cy="-10" r="3"/>',
  metronome: '<path d="M -6 -20 H 6 L 14 18 H -14 Z M 0 10 L 9 -14 M -10 12 H 10"/>',
  star: '<path d="M 0 -12 L 3.5 -4 L 12 -3.5 L 5.5 2.5 L 7.5 11 L 0 6.5 L -7.5 11 L -5.5 2.5 L -12 -3.5 L -3.5 -4 Z"/>',
  sparkle: '<path d="M 0 -12 C 1 -3 3 -1 12 0 C 3 1 1 3 0 12 C -1 3 -3 1 -12 0 C -3 -1 -1 -3 0 -12 Z"/>',
  pick: '<path d="M 0 18 C -14 6 -18 -6 -14 -12 C -8 -18 8 -18 14 -12 C 18 -6 14 6 0 18 Z"/>',
  staff: '<path d="M -24 -10 H 24 M -24 -5 H 24 M -24 0 H 24 M -24 5 H 24 M -24 10 H 24"/><ellipse cx="-8" cy="5" rx="4" ry="3"/><path d="M -4 5 V -14"/><ellipse cx="10" cy="-2" rx="4" ry="3"/><path d="M 14 -2 V -20"/>',
  bars: '<path d="M -15 14 V 4 M -7 14 V -8 M 1 14 V -2 M 9 14 V -14 M 17 14 V 0"/>',
  wave: '<path d="M -24 0 C -20 -12 -16 -12 -12 0 S -4 12 0 0 S 8 -16 12 0 S 20 10 24 0"/>',
  keys: '<rect x="-20" y="-12" width="40" height="24" rx="2"/><path d="M -10 -12 V 12 M 0 -12 V 12 M 10 -12 V 12 M -14 -12 V 2 M -5 -12 V 2 M 5 -12 V 2 M 14 -12 V 2"/>',
  maraca: '<ellipse cx="0" cy="-8" rx="9" ry="11"/><path d="M 0 3 V 20 M -5 -10 H 5 M -6 -4 H 6"/>',
  tambourine: '<circle r="16"/><circle r="11"/><path d="M 0 -16 V -11 M 16 0 H 11 M 0 16 V 11 M -16 0 H -11"/>',
  bolt: '<path d="M 4 -18 L -8 2 H 0 L -4 18 L 9 -3 H 1 Z"/>',
  heart: '<path d="M 0 12 C -16 0 -12 -14 0 -6 C 12 -14 16 0 0 12 Z"/>',
  swirl: '<path d="M -16 4 C -10 -10 4 -10 6 0 C 8 8 -4 10 -4 2 C -4 -4 6 -4 10 -2 C 16 2 18 -6 20 -10"/>',
};
const NAMES = Object.keys(DOODLES);

// A small pseudo-random sequence, so the doodles land in the same places on every visit.
function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// One doodle per cell (a few cells stay empty), nudged, turned and sized at random. Small dots fill some gaps.
function layout() {
  const random = seeded(11);
  const parts = [];
  for (let row = 0; row < TILE.height / CELL; row++) {
    for (let col = 0; col < TILE.width / CELL; col++) {
      if (random() < 0.08) continue;
      const x = Math.round(col * CELL + CELL * (0.2 + random() * 0.6));
      const y = Math.round(row * CELL + CELL * (0.2 + random() * 0.6));
      const scale = (0.55 + random() * 0.95).toFixed(2);
      const turn = Math.round((random() - 0.5) * 70);
      const name = NAMES[Math.floor(random() * NAMES.length)];
      parts.push(`<g transform="translate(${x} ${y}) rotate(${turn}) scale(${scale})">${DOODLES[name]}</g>`);
      if (random() < 0.35) {
        parts.push(`<circle cx="${Math.round(col * CELL + random() * CELL)}" cy="${Math.round(row * CELL + random() * CELL)}" r="2.5"/>`);
      }
    }
  }
  return parts.join('');
}

/** The doodle pattern filling the whole kit area. @param {string} p id prefix */
export const doodles = (p) => `<pattern id="${p}-doodles" patternUnits="userSpaceOnUse" width="${TILE.width}" height="${TILE.height}">
    <g fill="none" style="stroke: var(--color-text)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
      vector-effect="non-scaling-stroke">${layout()}</g>
  </pattern><rect x="-1600" y="-900" width="4800" height="2700" fill="url(#${p}-doodles)" opacity="0.07"/>`;
