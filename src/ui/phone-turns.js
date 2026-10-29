// Phone turns: on a phone, Learn and Concert take turns so the kit stays big. Opening a lesson pauses Concert (it comes
// back when the lesson closes) and folds the recording panel to one line (the recording is kept); turning Concert on
// closes the lesson. Bigger screens have room for everything at once, so nothing changes there.
import { showToast } from './toast.js';

const PHONE = '(max-width: 35em), (max-width: 60em) and (max-height: 30em)';

/**
 * @param {{concert: {setOn: (on: boolean) => void, isOn: () => boolean}, panel: {fold: () => void},
 *   lessonOpen: () => boolean, closeLesson: () => void}} parts
 */
export function setupPhoneTurns({ concert, panel, lessonOpen, closeLesson }) {
  const phone = matchMedia(PHONE);
  let concertPaused = false; // Concert was on when the lesson opened, so it comes back after
  let switching = false;

  document.addEventListener('concert-change', (event) => {
    if (switching || !event.detail.on || !phone.matches || !lessonOpen()) return;
    concertPaused = false;
    closeLesson();
    showToast('Lesson closed for Concert mode.');
  });

  return {
    lessonOpened() {
      if (!phone.matches) return;
      panel.fold();
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
