// Lesson messages: the goal, the live progress and the results shown in the lesson bar's info line.

/** "Pass: about 13 of 16 hits on time (80%)…" @param {number} hits every hit in a run */
export const goal = (hits) => `Pass: about ${Math.ceil(hits * 0.8)} of ${hits} hits on time (80%). The streak is just for fun.`;

/** The short version for phones: "Pass 13 of 16". @param {number} hits */
export const shortGoal = (hits) => `Pass ${Math.ceil(hits * 0.8)} of ${hits}`;

/** Step by step, while it runs. */
export const step = (done, total) => `Step ${done + 1} of ${total}: hit the glowing drum${done ? '' : ' (the beat waits for you)'}.`;

/** In time, while it runs: the count-in, the Demo, or the streak and score. */
export const progress = ({ demo, counting, streak, score }) => (counting ? `${demo ? 'Listen' : 'Get ready'}: ${counting}`
  : demo ? 'Listen and watch the line cross the dots.' : `Streak ${streak} · ${score}% on time`);

/** The end of a step-by-step run. @param {number} wrong wrong drums hit */
export const stepsDone = (wrong) => `Done ✓ ${wrong ? `(${wrong} wrong drum${wrong === 1 ? '' : 's'}) ` : ''}Now try it In time, slowly at first.`;

/** After a Demo. @param {'time' | 'steps'} mode */
export const yourTurn = (mode) => (mode === 'steps'
  ? 'Your turn: press Start and hit each glowing drum.' : 'Your turn: press Start and hit each drum as the line reaches its dot.');

/** The end of a run in time. */
export const result = ({ passed, early, score, best }) => (passed
  ? `Passed ✓${early ? ' (you locked it in early)' : ''} ${score}% on time · best streak ${best}. Try it faster, or move on.`
  : `${score}% on time. 80% passes: try Step by step, or a slower speed.`);
