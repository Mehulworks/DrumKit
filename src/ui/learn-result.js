// Lesson result: a card in the middle of the kit when a run ends, with what to do next (next lesson, replay, faster or
// slower...). The lesson bar never grows extra buttons, so nothing shifts while you play. A pass sets off a short burst of
// confetti from the main button. ✕ or Esc closes it; the drums still play under it.
import { ICONS } from './icons.js';

const CONFETTI = ['#ffa62b', '#4d8dff', '#3ddc84', '#ff4fd8', '#e5484d', '#ffd75e'];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

/**
 * @param {(action: string) => void} onAction called with the chosen action: next, replay, slower, faster, steps, time
 * @returns {{show: (result: {title: string, line: string, actions: Array<[string, string, ('primary' | 'secondary')]>,
 *   celebrate?: boolean}) => void, hide: () => void}} actions run left to right, the main one last (on the right)
 */
export function createLearnResult(onAction) {
  const card = document.createElement('div');
  card.className = 'learn-result';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', 'Lesson result');
  card.hidden = true;
  // Behind the card: a dim layer over everything, so nothing under it can be pressed while the result is up.
  const backdrop = document.createElement('div');
  backdrop.className = 'learn-result-backdrop';
  backdrop.hidden = true;
  document.body.append(backdrop, card);

  const hide = () => { card.hidden = true; backdrop.hidden = true; };
  // Over the middle of the kit area, like the count-in (the area moves as panels open).
  function place() {
    const r = document.getElementById('kit').getBoundingClientRect();
    card.style.left = `${r.left + r.width / 2}px`;
    card.style.top = `${r.top + r.height * 0.45}px`;
  }
  // A short burst of paper bits from the top middle of the card, thrown up and out, then falling.
  function confetti() {
    if (reduced.matches) return;
    const r = card.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.className = 'confetti';
    burst.style.left = `${r.left + r.width / 2}px`;
    burst.style.top = `${r.top + 8}px`;
    burst.innerHTML = Array.from({ length: 44 }, (_, i) => {
      const angle = Math.PI + (i / 43) * Math.PI; // the upper half: left, up, right
      const distance = 90 + Math.random() * 140;
      return `<i style="--x:${Math.cos(angle) * distance}px;--y:${Math.sin(angle) * distance}px;--r:${Math.random() * 720 - 360}deg;
        background:${CONFETTI[i % CONFETTI.length]};animation-delay:${Math.random() * 80}ms"></i>`;
    }).join('');
    document.body.append(burst);
    setTimeout(() => burst.remove(), 1400);
  }
  card.addEventListener('click', (event) => {
    if (event.target.closest('.learn-result-close')) return hide();
    const button = event.target.closest('[data-result]');
    if (!button) return;
    hide();
    onAction(button.dataset.result);
  });
  addEventListener('keydown', (event) => { if (event.key === 'Escape' && !card.hidden) hide(); });
  addEventListener('resize', () => { if (!card.hidden) place(); });

  return {
    show({ title, line, actions, celebrate = false }) {
      card.classList.toggle('is-pass', celebrate);
      card.innerHTML = `<button type="button" class="learn-result-close" aria-label="Close">${ICONS.close}</button>
        <p class="learn-result-title">${title}</p>
        <p class="learn-result-line">${line}</p>
        <div class="learn-result-actions">${actions.map(([action, label, kind]) =>
          `<button type="button" class="learn-${kind}" data-result="${action}">${label}</button>`).join('')}</div>`;
      card.hidden = false;
      backdrop.hidden = false;
      place();
      const main = card.querySelector('.learn-primary');
      main?.focus({ preventScroll: true });
      if (celebrate) confetti();
    },
    hide,
  };
}
