// More menu: the ⋮ button in the toolbar opens a small menu with the less-used tools (EQ, Focus, light or dark, the
// settings, How to play, Reset all, and the credit), so the toolbar keeps room for playing and for Learn and Concert. A proper menu:
// announced as one, arrow keys move between items, Enter picks one, Esc or a click outside closes it and returns focus
// to ⋮.
import { ICONS } from './icons.js';

/**
 * @param {HTMLButtonElement} button the ⋮ button
 * @param {HTMLElement} menu the menu element holding the tool buttons
 */
export function setupMoreMenu(button, menu) {
  button.innerHTML = `${ICONS.more}<span class="button-label">More</span>`;
  button.setAttribute('aria-label', 'More: EQ, focus, theme, settings and help');
  button.setAttribute('aria-haspopup', 'menu');
  button.setAttribute('aria-expanded', 'false');
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'More');
  const items = () => [...menu.querySelectorAll('button, a[role=menuitem]')];
  items().forEach((item) => {
    if (!item.getAttribute('role')) item.setAttribute('role', 'menuitem');
    item.dataset.focusFallback = button.id; // where focus goes when a drawer opened from here closes
  });

  const isOpen = () => !menu.hidden;
  function setOpen(open, focusButton = false) {
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (open) items()[0]?.focus();
    else if (focusButton) button.focus();
  }

  button.addEventListener('click', () => setOpen(!isOpen()));
  // Picking an item closes the menu (the item's own action still runs); switches, tempo and Reset keep it open.
  menu.addEventListener('click', (event) => {
    const item = event.target.closest('button, a');
    if (item && !('keepOpen' in item.dataset)) setOpen(false);
  });
  menu.addEventListener('keydown', (event) => {
    const list = items();
    const at = list.indexOf(document.activeElement);
    const moves = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: list.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      list[(moves[event.key] + list.length) % list.length].focus();
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      setOpen(false, true);
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (isOpen() && !menu.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });
}
