// Patterns: how lessons and beats are written. Each pad gets a text row, "x" for a hit and "." for a rest, one
// character per step; spaces are ignored and only help the eye. A beat says how many beats a bar has (4 or 3) and how
// many steps each beat splits into (2 eighths, 3 triplets for a shuffle, or 4 sixteenths).

/**
 * Turns text rows into notes.
 * @param {Record<string, string>} rows pad id -> row, such as { kick: 'x...x...' }
 * @returns {Array<{step: number, pad: string}>}
 */
export function grid(rows) {
  const notes = [];
  Object.entries(rows).forEach(([pad, row]) => {
    [...row.replaceAll(' ', '')].forEach((mark, step) => { if (mark === 'x') notes.push({ step, pad }); });
  });
  return notes.sort((a, b) => a.step - b.step);
}

/** Steps in one loop of a pattern. @param {{bars: number, beatsPerBar?: number, split?: number}} beat */
export const loopSteps = ({ bars, beatsPerBar = 4, split = 2 }) => bars * beatsPerBar * split;

/** The count written above each step: "1 & 2 &", "1 e & a", or "1 trip let". */
export function counts({ bars, beatsPerBar = 4, split = 2 }) {
  const within = { 2: ['', '&'], 3: ['', 'tri', 'let'], 4: ['', 'e', '&', 'a'] }[split];
  const labels = [];
  for (let bar = 0; bar < bars; bar++) {
    for (let beat = 1; beat <= beatsPerBar; beat++) within.forEach((part) => labels.push(part || String(beat)));
  }
  return labels;
}

// Pads a kit may not have, and what to play instead (the Jazz kit has one rack tom and one crash, for example).
const STAND_INS = { tom2: 'tom1', crashRight: 'crashLeft', splash: 'crashLeft', openHihat: 'hihat' };

/**
 * A pattern's notes for the kit on stage: missing pads swap to a stand-in, or drop out if there is none.
 * @param {{notes: Array<{step: number, pad: string}>}} beat
 * @param {Set<string>} padIds the pads this kit has
 */
export function notesFor(beat, padIds) {
  return beat.notes
    .map((note) => (padIds.has(note.pad) ? note : { ...note, pad: STAND_INS[note.pad] }))
    .filter((note) => note.pad && padIds.has(note.pad));
}
