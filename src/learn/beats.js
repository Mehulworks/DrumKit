// Style beats: grooves named after the style they come from (funk, disco, reggae...), written fresh for this project.
// They are common patterns of each style, not any song's drum part, and carry no song or artist names.
// split 4 = sixteenth-note steps, 3 = triplet (shuffle) steps; see pattern.js.
import { grid } from './pattern.js';

/** The beat library, roughly from easiest to hardest. level 1 to 3; bpm here is the style's real tempo. */
const STYLES = [
  { id: 'disco', title: 'Disco', tip: 'Kick on every beat, open hi-hat on every "and".', bpm: 112, level: 1, bars: 1, loops: 4,
    notes: grid({ kick: 'x.x.x.x.', openHihat: '.x.x.x.x', snare: '..x...x.' }) },
  { id: 'half-time', title: 'Half-time', tip: 'A big, slow feel: the snare lands only on 3.', bpm: 84, level: 1, bars: 1, loops: 4,
    notes: grid({ hihat: 'xxxxxxxx', kick: 'x......x', snare: '....x...' }) },
  { id: 'reggae', title: 'Reggae one-drop', tip: 'Beat 1 is empty: kick and snare drop together on 3.', bpm: 76, level: 1, bars: 1, loops: 4,
    notes: grid({ hihat: '.x.x.x.x', kick: '....x...', snare: '....x...' }) },
  { id: 'punk', title: 'Fast punk', tip: 'Fast and driving: snare on every "and".', bpm: 150, level: 2, bars: 1, loops: 4,
    notes: grid({ hihat: 'xxxxxxxx', kick: 'x.x.x.x.', snare: '.x.x.x.x' }) },
  { id: 'hip-hop', title: 'Hip-hop', tip: 'Laid-back boom-bap: a late kick before the second snare.', bpm: 88, level: 2, bars: 1, loops: 4, split: 4,
    notes: grid({ hihat: 'x.x.x.x.x.x.x.x.', kick: 'x......x..x.....', snare: '....x.......x...' }) },
  { id: 'shuffle', title: 'Shuffle', tip: 'A swinging, bouncing feel: hits on the first and last of each triplet.', bpm: 92, level: 2, bars: 1, loops: 4, split: 3,
    notes: grid({ ride: 'x.xx.xx.xx.x', kick: 'x.....x.....', snare: '...x.....x..' }) },
  { id: 'waltz', title: 'Waltz (3/4)', tip: 'Three beats to a bar: kick on 1, snare on 2 and 3.', bpm: 120, level: 2, bars: 2, loops: 2, beatsPerBar: 3,
    notes: grid({ ride: 'x.x.x. x.x.x.', kick: 'x..... x.....', snare: '..x.x. ..x.x.' }) },
  { id: 'funk', title: 'Funk groove', tip: 'Syncopated kick and a snare that pushes after beat 4.', bpm: 92, level: 3, bars: 1, loops: 4, split: 4,
    notes: grid({ hihat: 'x.x.x.x.x.x.x.x.', kick: 'x..x..x...x.....', snare: '....x..x.x..x...' }) },
  { id: 'trap', title: 'Trap hi-hats', tip: 'Rapid sixteenth hi-hats over a slow, heavy beat.', bpm: 70, level: 3, bars: 1, loops: 4, split: 4,
    notes: grid({ hihat: 'xxxxxxxxxxxxxxxx', kick: 'x......x..x.....', snare: '........x.......' }) },
  { id: 'bossa', title: 'Bossa nova', tip: 'A gentle Latin pattern: steady kick, cross-stick on the snare.', bpm: 100, level: 3, bars: 2, loops: 2, split: 4,
    notes: grid({
      hihat: 'x.x.x.x.x.x.x.x. x.x.x.x.x.x.x.x.', kick: 'x..xx..xx..xx..x x..xx..xx..xx..x',
      snare: 'x..x..x...x..x.. ..x..x..x..x....',
    }) },
];

/** The beats as practised: each starts at 75% of its style's real tempo (realBpm), which you can raise. */
export const BEATS = STYLES.map((beat) => ({ ...beat, realBpm: beat.bpm, bpm: Math.round(beat.bpm * 0.75) }));
