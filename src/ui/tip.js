// One-time tip: a small note with a close button, shown under a button the first time something happens, then never again.
import { ICONS } from './icons.js';
import { settings, saveSettings } from './storage.js';

const SHOW_FOR = 10000; // ms before it closes by itself

/**
 * Shows the tip unless it was shown before (remembered in this browser).
 * @param {string} id a name for this tip
 * @param {HTMLElement} anchor the button it points at
 * @param {string} text the tip (may include simple markup such as <strong>)
 * @param {{label: string, onClick: () => void}} [link] an optional link at the end, such as "How layers work →"
 */
export function showTipOnce(id, anchor, text, link) {
  if (settings.tipsSeen.includes(id)) return;
  settings.tipsSeen.push(id);
  saveSettings();

  const tip = document.createElement('div');
  tip.className = 'coach-tip';
  tip.setAttribute('role', 'status');
  tip.innerHTML = `<p>${text}${link ? ` <button type="button" class="coach-link">${link.label}</button>` : ''}</p>
    <button type="button" class="coach-close" aria-label="Close tip">${ICONS.close}</button>`;
  document.body.append(tip);

  const box = anchor.getBoundingClientRect();
  const left = Math.min(Math.max(8, box.left + box.width / 2 - tip.offsetWidth / 2), innerWidth - tip.offsetWidth - 8);
  tip.style.left = `${left}px`;
  tip.style.top = `${box.bottom + 10}px`;
  tip.style.setProperty('--arrow-x', `${box.left + box.width / 2 - left}px`);

  const close = () => {
    clearTimeout(timer);
    tip.remove();
  };
  const timer = setTimeout(close, SHOW_FOR);
  tip.querySelector('.coach-close').addEventListener('click', close);
  tip.querySelector('.coach-link')?.addEventListener('click', () => {
    close();
    link.onClick();
  });
  // Using the button it points at means the tip did its job.
  anchor.addEventListener('click', close, { once: true });
}
