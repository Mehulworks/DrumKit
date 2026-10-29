// Lesson scoreboard: floats over the top of the kit area while you practise: a big verdict that pops after each hit
// (Perfect!, Early, Late, Miss; Nice! or Not that one in step-by-step mode), the streak, the score and a bar showing it
// against the 80% pass mark. The count-in shows in the beat grid's Ready box. It never takes clicks, so the drums
// underneath still play.

const WORDS = { onTime: 'Perfect!', early: 'Early', late: 'Late', miss: 'Miss', nice: 'Nice!', wrong: 'Not that one' };

/**
 * @param {HTMLElement} hud the empty scoreboard element
 * @param {HTMLElement} kitArea the kit area it sits over
 */
export function setupLearnHud(hud, kitArea) {
  hud.innerHTML = `
    <div class="hud-board">
      <span class="hud-word"></span>
      <span class="hud-stat"><b class="hud-streak">0</b><small>streak</small></span>
      <span class="hud-stat"><b class="hud-score">0%</b><small>on time</small></span>
      <span class="hud-goal"><span class="hud-goal-bar" aria-hidden="true"><i class="hud-goal-fill"></i><b class="hud-goal-mark"></b></span>
        <span class="hud-goal-text" aria-live="polite"></span></span>
    </div>`;
  const word = hud.querySelector('.hud-word');

  // Lines the scoreboard up with the kit area (below the toolbar and any panels).
  function place() {
    const box = kitArea.getBoundingClientRect();
    hud.style.setProperty('--top', `${box.top + 8}px`);
  }
  addEventListener('resize', place);

  return {
    /** @param {{steps?: boolean}} [options] steps: step-by-step mode (no streak or score) */
    show({ steps = false } = {}) {
      place();
      hud.hidden = false;
      hud.classList.toggle('is-steps', steps);
      word.textContent = '';
      word.removeAttribute('data-verdict');
    },
    hide() {
      hud.hidden = true;
    },
    /** @param {{streak?: number, score?: number, need?: number, locked?: boolean, demo: boolean}} state */
    update({ streak = 0, score = 0, need, locked = false, demo }) {
      hud.classList.toggle('is-demo', demo);
      hud.querySelector('.hud-streak').textContent = String(streak);
      hud.querySelector('.hud-score').textContent = `${score}%`;
      const fill = hud.querySelector('.hud-goal-fill');
      fill.style.width = `${score}%`;
      fill.classList.toggle('is-passing', locked || score >= 80);
      hud.querySelector('.hud-goal-text').textContent = locked ? 'Passed ✓'
        : need === undefined ? '80% to pass' : `${need} more hit${need === 1 ? '' : 's'} to pass`;
    },
    /** Pops the word for a verdict. */
    verdict(verdict) {
      word.textContent = WORDS[verdict] ?? '';
      word.dataset.verdict = verdict;
      word.getAnimations().forEach((animation) => animation.cancel());
      word.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 180, easing: 'ease-out' });
    },
  };
}
