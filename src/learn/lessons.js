// Lessons: short, original practice beats from easiest to hardest, written for this project (common beginner patterns,
// not taken from any song). All in 4/4 with eighth-note steps; see pattern.js for how they are written.
import { grid } from './pattern.js';

/**
 * The lessons, in order, at beginner speeds (60 to 70 BPM). bpm is the normal speed, level 1 to 3, bars the pattern's
 * length, loops how often a run plays it.
 */
export const LESSONS = [
  { id: 'steady-kick', title: 'Steady kick', tip: 'Kick on every beat. Space on a keyboard.', bpm: 60, level: 1, bars: 1, loops: 4,
    notes: grid({ kick: 'x.x.x.x.' }) },
  { id: 'kick-snare', title: 'Kick and snare', tip: 'Kick on 1 and 3, snare on 2 and 4.', bpm: 60, level: 1, bars: 1, loops: 4,
    notes: grid({ kick: 'x...x...', snare: '..x...x.' }) },
  { id: 'hihat-time', title: 'Hi-hat time', tip: 'Even eighth notes on the hi-hat.', bpm: 60, level: 1, bars: 1, loops: 4,
    notes: grid({ hihat: 'xxxxxxxx' }) },
  { id: 'rock-beat', title: 'Basic rock beat', tip: 'Hi-hat eighths, kick on 1 and 3, snare on 2 and 4.', bpm: 65, level: 2, bars: 1, loops: 4,
    notes: grid({ hihat: 'xxxxxxxx', kick: 'x...x...', snare: '..x...x.' }) },
  { id: 'four-floor', title: 'Four on the floor', tip: 'Kick on every beat, hi-hat between, snare on 2 and 4.', bpm: 70, level: 2, bars: 1, loops: 4,
    notes: grid({ kick: 'x.x.x.x.', hihat: '.x.x.x.x', snare: '..x...x.' }) },
  { id: 'ride-groove', title: 'Ride groove', tip: 'Ride eighths with a pushed kick on the "and" of 3.', bpm: 65, level: 2, bars: 1, loops: 4,
    notes: grid({ ride: 'xxxxxxxx', kick: 'x....x..', snare: '..x...x.' }) },
  { id: 'tom-fill', title: 'Round-the-kit fill', tip: 'Two hits on each tom, then snare and a crash.', bpm: 65, level: 3, bars: 1, loops: 4,
    notes: grid({ tom1: 'xx......', tom2: '..xx....', floorTom: '....xx..', snare: '......x.', crashLeft: '.......x' }) },
  { id: 'beat-fill', title: 'Beat with a fill', tip: 'One bar of rock beat, then a bar of fill into the next.', bpm: 65, level: 3, bars: 2, loops: 2,
    notes: grid({
      hihat: 'xxxxxxxx ........', kick: 'x...x... x.......', snare: '..x...x. ....xxxx',
      tom1: '........ .x......', tom2: '........ ..x.....', floorTom: '........ ...x....',
    }) },
];
