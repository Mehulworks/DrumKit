// Lesson tip caption: the lesson's tip at the bottom of the screen, with a ✕ to dismiss it until the next lesson opens.
import { ICONS } from './icons.js';

/** @returns {{setTip: (tip: string) => void, show: () => void, hide: () => void}} */
export function createLearnCaption() {
  const caption = document.createElement('div');
  caption.className = 'learn-caption';
  caption.hidden = true;
  caption.innerHTML = `<p><b>Tip:</b> <span class="learn-caption-text"></span></p>
    <button type="button" class="panel-fold learn-caption-close" aria-label="Hide the tip">${ICONS.close}</button>`;
  document.body.append(caption);
  caption.querySelector('.learn-caption-close').addEventListener('click', () => { caption.hidden = true; });
  return {
    setTip: (tip) => { caption.querySelector('.learn-caption-text').textContent = tip; },
    show: () => { caption.hidden = false; },
    hide: () => { caption.hidden = true; },
  };
}
