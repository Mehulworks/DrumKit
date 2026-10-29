// Drawer behaviour shared by the Customize, Settings and Help panels: open, close, Esc, focus, and only one open at a time.
const drawers = [];

/**
 * Connects a slide-out panel to the button that opens it. The panel needs a [data-close] button.
 * @param {HTMLButtonElement} button
 * @param {HTMLElement} panel
 */
export function createDrawer(button, panel) {
  const drawer = {
    isOpen: () => panel.classList.contains('is-open'),
    /**
     * @param {boolean} open
     * @param {boolean} [moveFocus] false when another drawer is taking over
     */
    setOpen(open, moveFocus = true) {
      if (open) drawers.forEach((other) => other !== drawer && other.isOpen() && other.setOpen(false, false));
      panel.classList.toggle('is-open', open);
      panel.inert = !open;
      button.setAttribute('aria-expanded', String(open));
      // A button inside a closed menu cannot take focus back, so its menu button does instead.
      const back = button.getClientRects().length ? button : document.getElementById(button.dataset.focusFallback) ?? button;
      if (moveFocus) (open ? panel.querySelector('[data-close]') : back).focus();
    },
  };
  drawers.push(drawer);

  button.addEventListener('click', () => drawer.setOpen(!drawer.isOpen()));
  panel.querySelector('[data-close]').addEventListener('click', () => drawer.setOpen(false));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.isOpen()) drawer.setOpen(false);
  });
  return drawer;
}
