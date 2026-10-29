// Judge: compares your hits with the notes you were meant to play and says how close each one was: on time, early or
// late, or missed. It also keeps the streak and the score. Times are audio-clock seconds.

// Forgiving on purpose (this is for learners, and touch screens add a little delay).
const ON_TIME = 0.09; // within 90 ms either way counts as on time
const CLOSE = 0.2; // within 200 ms counts, as early or late
const POINTS = { onTime: 1, early: 0.6, late: 0.6, miss: 0 };
const PASS = 0.8; // share of the run's notes, in points, needed to pass

/**
 * @param {Array<{time: number, pad: string}>} notes every note in the run, in time order
 */
export function createJudge(notes) {
  const pending = notes.map((note) => ({ ...note, verdict: null }));
  let streak = 0;
  let best = 0;
  let points = 0;
  let judged = 0;

  function record(note, verdict) {
    note.verdict = verdict;
    judged++;
    points += POINTS[verdict];
    streak = verdict === 'miss' ? 0 : streak + 1;
    best = Math.max(best, streak);
  }

  return {
    /**
     * A hit on a pad at a time. Returns the verdict for the note it matched, or null if it matched none (a stray hit).
     * @returns {{verdict: string, note: object} | null}
     */
    hit(pad, time) {
      let match = null;
      for (const note of pending) {
        if (note.verdict || note.pad !== pad || Math.abs(note.time - time) > CLOSE) continue;
        if (!match || Math.abs(note.time - time) < Math.abs(match.time - time)) match = note;
      }
      if (!match) return null;
      const offset = time - match.time;
      const verdict = Math.abs(offset) <= ON_TIME ? 'onTime' : offset < 0 ? 'early' : 'late';
      record(match, verdict);
      return { verdict, note: match };
    },
    /** Marks every note now too far in the past as missed, and returns them. */
    sweep(now) {
      const missed = pending.filter((note) => !note.verdict && now - note.time > CLOSE);
      missed.forEach((note) => record(note, 'miss'));
      return missed;
    },
    /**
     * Streak, best streak, score so far (0 to 100, from the notes judged), the perfect hits still needed to pass, and
     * whether the pass is already locked in (even missing every note left would still reach 80%).
     */
    stats() {
      const target = PASS * pending.length;
      return {
        streak, best,
        score: judged ? Math.round((points / judged) * 100) : 0,
        need: Math.max(0, Math.ceil(target - points - 1e-9)),
        locked: points >= target - 1e-9,
        done: judged === pending.length,
      };
    },
  };
}
