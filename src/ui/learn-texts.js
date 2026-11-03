// Lesson messages: the goal shown in the lesson bar's info line, the live progress and results read out to screen readers,
// and the words and buttons of the result card after a run.

/** "Pass: about 13 of 16 hits on time (80%)…" @param {number} hits every hit in a run */
export const goal = (hits) => `Pass: about ${Math.ceil(hits * 0.8)} of ${hits} hits on time (80%). The streak is just for fun.`;

/** The short version for phones: "Pass 13 of 16". @param {number} hits */
export const shortGoal = (hits) => `Pass ${Math.ceil(hits * 0.8)} of ${hits}`;

/** Step by step, while it runs. */
export const step = (done, total) => `Step ${done + 1} of ${total}: hit the glowing drum${done ? '' : ' (the beat waits for you)'}.`;

/** In time, while it runs: the count-in, the Demo, or the streak and score. */
export const progress = ({ demo, counting, streak, score }) => (counting ? (demo ? 'Listen…' : 'Get ready…')
  : demo ? 'Listen and watch the line cross the dots.' : `Streak ${streak} · ${score}% on time`);

/** The end of a step-by-step run. @param {number} wrong wrong drums hit */
export const stepsDone = (wrong) => `Done ✓ ${wrong ? `(${wrong} wrong drum${wrong === 1 ? '' : 's'}) ` : ''}Now try it In time, slowly at first.`;

/** After a Demo. @param {'time' | 'steps'} mode */
export const yourTurn = (mode) => (mode === 'steps'
  ? 'Your turn: press Start and hit each glowing drum.' : 'Your turn: press Start and hit each drum as the line reaches its dot.');

/** The end of a run in time. */
export const result = ({ passed, early, score, best }) => (passed
  ? `Passed ✓${early ? ' (locked in early)' : ''} ${score}% on time · best streak ${best}`
  : `${score}% on time. 80% passes: try Step by step, or a slower speed.`);

const percent = (value) => `${Math.round(value * 100)}%`;

/** The result card after a step-by-step run. @param {number} wrong wrong drums hit */
export const stepsCard = (wrong) => ({
  title: 'Pattern learned',
  line: wrong ? `${wrong} wrong drum${wrong === 1 ? '' : 's'} on the way. Now try it with the beat.` : 'Clean run. Now try it with the beat.',
  actions: [['replay', 'Replay', 'secondary'], ['time', 'Play it in time', 'primary']],
});

/**
 * The result card after a passed run in time: Replay on the left, the next speed level in the middle, the next lesson
 * (the main step) on the right.
 * @param {{score: number, best: number, last: boolean, faster: number | null}} run last: the list's last lesson; faster:
 *   the next speed level, if any
 */
export const passCard = ({ score, best, last, faster }) => ({
  title: 'Passed!', line: `${score}% on time · best streak ${best}`, celebrate: true,
  actions: [
    ...(last ? [] : [['replay', 'Replay', 'secondary']]),
    ...(faster ? [['faster', `Replay at ${percent(faster)}`, 'secondary']] : []),
    last ? ['replay', 'Play again', 'primary'] : ['next', 'Next lesson →', 'primary'],
  ],
});

/** The result card after a run in time that did not pass. @param {{score: number, slower: number | null}} run */
export const failCard = ({ score, slower }) => ({
  title: `${score}% on time`, line: '80% passes. Slow it down, or learn the pattern step by step.',
  actions: [...(slower ? [['slower', `Try at ${percent(slower)}`, 'secondary']] : []), ['steps', 'Step by step', 'secondary'],
    ['replay', 'Try again', 'primary']],
});
