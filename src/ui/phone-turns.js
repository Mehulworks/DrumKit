// Mode turns: Learn and Concert take turns on every screen, since a lesson needs focus and Concert is all lights and
// crowd. Opening a lesson pauses Concert (it comes back when the lesson closes); turning Concert on closes the lesson.
// On a phone, opening a lesson also folds the recording panel to one line (the recording is kept), so the pads keep
// their room.
import { showToast } from './toast.js';

const PHONE = '(max-width: 35em), (max-width: 60em) and (max-height: 30em)';
const phone = matchMedia(PHONE);

/**
 * @param {{concert: {setOn: (on: boolean) => void, isOn: () => boolean}, panel: {fold: () => void},
 *   lessonOpen: () => boolean, closeLesson: () => void}} parts
 */
export function setupPhoneTurns({ concert, panel, lessonOpen, closeLesson }) {
  let concertPaused = false; // Concert was on when the lesson opened, so it comes back after
  let switching = false;

  document.addEventListener('concert-change', (event) => {
    if (switching || !event.detail.on || !lessonOpen()) return;
    concertPaused = false;
    closeLesson();
    showToast('Lesson closed for Concert mode.');
  });

  return {
    lessonOpened() {
      if (phone.matches) panel.fold();
      if (concert.isOn()) {
        switching = true;
        concert.setOn(false);
        switching = false;
        concertPaused = true;
        showToast('Concert paused for the lesson.');
      }
    },
    lessonClosed() {
      if (!concertPaused) return;
      concertPaused = false;
      concert.setOn(true);
    },
  };
}
