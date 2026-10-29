// Tooltip: a small card (optional picture, title, two short lines) shown on mouse hover or keyboard focus, on desktop only.

const HOVER_DELAY = 350; // ms before showing, so it does not flash while the mouse passes over
let count = 0;

// Only devices with a real mouse (or trackpad) get hover cards; phones and tablets never show them.
const canHover = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Attaches a tooltip card to a button.
 * @param {HTMLElement} target
 * @param {{title: string, lines: string[], picture?: string}} content picture is optional SVG markup
 */
export function attachTooltip(target, { title, lines, picture = '' }) {
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  tip.id = `tooltip-${++count}`;
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  tip.innerHTML = `
    ${picture ? `<div class="tooltip-picture">${picture}</div>` : ''}
    <div>
      <p class="tooltip-title">${title}</p>
      ${lines.map((line) => `<p class="tooltip-text">${line}</p>`).join('')}
    </div>`;
  document.body.append(tip);
  target.setAttribute('aria-describedby', tip.id);
  let timer = 0;

  function show() {
    tip.hidden = false;
    // Below the button, kept inside the screen edges.
    const box = target.getBoundingClientRect();
    const left = Math.min(Math.max(8, box.left + box.width / 2 - tip.offsetWidth / 2), innerWidth - tip.offsetWidth - 8);
    tip.style.left = `${left}px`;
    tip.style.top = `${box.bottom + 8}px`;
    requestAnimationFrame(() => tip.classList.add('is-visible'));
  }

  function hide() {
    clearTimeout(timer);
    tip.classList.remove('is-visible');
    tip.hidden = true;
  }

  target.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && canHover()) timer = setTimeout(show, HOVER_DELAY);
  });
  target.addEventListener('pointerleave', hide);
  target.addEventListener('pointerdown', hide);
  target.addEventListener('focus', () => {
    if (canHover() && target.matches(':focus-visible')) show();
  });
  target.addEventListener('blur', hide);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide();
  });
}
