// Mode turns: one mode at a time, on every screen. Learn and Concert take turns, since a lesson needs focus and Concert
// is all lights and crowd: opening a lesson pauses Concert (it comes back when the lesson closes); turning Concert on
// closes the lesson. Learn and Recording take turns too, since a take only keeps your own hits and stops at its time
// limit: pressing Rec closes the lesson, and opening a lesson stops any recording (the take is kept) and hides the
// recording panel until the lesson closes.
import { showToast } from './toast.js';

/**
 * @param {{concert: {setOn: (on: boolean) => void, isOn: () => boolean}, panel: {away: (on: boolean) => boolean},
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
      if (panel.away(true)) showToast('Recording stopped and kept.');
      if (concert.isOn()) {
        switching = true;
        concert.setOn(false);
        switching = false;
        concertPaused = true;
        showToast('Concert paused for the lesson.');
      }
    },
    lessonClosed() {
      panel.away(false);
      if (!concertPaused) return;
      concertPaused = false;
      concert.setOn(true);
    },
    /** Rec was pressed: an open lesson closes. */
    recordingStarted() {
      if (!lessonOpen()) return;
      closeLesson();
      showToast('Lesson closed for recording.');
    },
  };
}
