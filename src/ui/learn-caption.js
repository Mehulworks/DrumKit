// Lesson tip caption: the lesson's tip at the bottom of the screen, with a ✕ to dismiss it until the next lesson opens.
// When a lesson opens it first shows large in the middle of the drums (people missed it at the bottom), then docks.
import { ICONS } from './icons.js';

const INTRO_FOR = 4000; // ms in the middle before it docks at the bottom

/** @returns {{setTip: (tip: string) => void, show: () => void, hide: () => void, introduce: () => void, dock: () => void}} */
export function createLearnCaption() {
  const caption = document.createElement('div');
  caption.className = 'learn-caption';
  caption.hidden = true;
  caption.innerHTML = `<p><b>Tip:</b> <span class="learn-caption-text"></span></p>
    <button type="button" class="panel-fold learn-caption-close" aria-label="Hide the tip">${ICONS.close}</button>`;
  document.body.append(caption);
  let timer = 0;
  const dock = () => {
    clearTimeout(timer);
    caption.classList.remove('is-intro');
  };
  caption.querySelector('.learn-caption-close').addEventListener('click', () => { dock(); caption.hidden = true; });
  return {
    setTip: (tip) => { caption.querySelector('.learn-caption-text').textContent = tip; },
    show: () => { caption.hidden = false; },
    hide: () => { dock(); caption.hidden = true; },
    /** Shows the tip in the middle of the drums, then docks it at the bottom after a few seconds. */
    introduce() {
      caption.hidden = false;
      caption.classList.add('is-intro');
      clearTimeout(timer);
      timer = setTimeout(dock, INTRO_FOR);
    },
    /** Docks it at once (when a run or demo starts). */
    dock,
  };
}
