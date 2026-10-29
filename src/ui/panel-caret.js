// Panel caret: the small triangle on the recording panel's top edge that points up at the Rec button, so the panel
// reads as coming from Rec (like a speech bubble). It follows Rec as the toolbar changes with the screen size.
const EDGE = 18; // the caret stays at least this far from the panel's rounded corners (px)

/**
 * @param {HTMLElement} panel the recording panel
 * @param {() => HTMLElement | null} target finds the Rec button
 * @returns {() => void} call to re-aim the caret (on changes and while Rec's label is changing)
 */
export function createPanelCaret(panel, target) {
  const caret = document.createElement('span');
  caret.className = 'panel-caret';
  caret.setAttribute('aria-hidden', 'true');
  panel.prepend(caret);

  function aim() {
    const rec = target();
    if (!rec || panel.hidden) return;
    const box = panel.getBoundingClientRect();
    const r = rec.getBoundingClientRect();
    const x = Math.min(box.width - EDGE, Math.max(EDGE, r.left + r.width / 2 - box.left));
    panel.style.setProperty('--caret-x', `${x}px`);
  }

  addEventListener('resize', aim);
  return aim;
}
