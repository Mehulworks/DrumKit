// Lesson bar extras on phones: Demo, the click and the speed sit in a small ⋮ dropdown (with their names), so the bar
// keeps room for the lesson's name. On bigger screens they stay on the bar and the ⋮ is hidden (learn-extras.css).
/** @param {HTMLElement} panel the lesson bar */
export function setupLearnExtras(panel) {
  const button = panel.querySelector('[data-learn-more]');
  const menu = panel.querySelector('.learn-extras');
  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  };
  button.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  // Starting the Demo closes it (the click and speed keep it open, to try a few values).
  menu.addEventListener('click', (event) => { if (event.target.closest('[data-learn=demo]')) setOpen(false); });
  document.addEventListener('pointerdown', (event) => {
    if (!menu.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      event.stopPropagation();
      setOpen(false);
      button.focus();
    }
  });
}
