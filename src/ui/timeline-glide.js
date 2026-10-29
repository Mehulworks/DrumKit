// Timeline glide: when the timeline's time scale changes (the first take grows from 15 s to 30 s, or fits its real
// length when stopped), the hit marks slide to their new places instead of jumping.

/** Remembers where each row's marks are now, before the rows are redrawn. @param {HTMLElement} rows */
export const markPositions = (rows) =>
  [...rows.querySelectorAll('.timeline-row')].map((row) => [...row.querySelectorAll('.row-track i')].map((mark) => mark.style.left));

/**
 * Starts each redrawn mark at its old place, then lets CSS slide it to the new one (timeline.css sets the transition).
 * @param {HTMLElement} rows
 * @param {string[][]} before positions from markPositions
 */
export function glideMarks(rows, before) {
  [...rows.querySelectorAll('.timeline-row')].forEach((row, r) => {
    row.querySelectorAll('.row-track i').forEach((mark, m) => {
      const from = before[r]?.[m];
      const to = mark.style.left;
      if (!from || from === to) return;
      mark.style.transition = 'none';
      mark.style.left = from;
      void mark.offsetWidth; // apply the old place first, so the change animates
      mark.style.transition = '';
      mark.style.left = to;
    });
  });
}
