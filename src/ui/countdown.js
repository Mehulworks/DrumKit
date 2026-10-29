// Countdown: big numbers (3, 2, 1, or 4 to 1 with the metronome) in the middle of the kit area, a little above centre,
// before a recording, then a short red "REC" flash as recording starts. It never takes clicks, so the drums still play under it.
const REC_FLASH = 700; // ms the "REC" flash stays

export function createCountdown() {
  const box = document.createElement('div');
  box.className = 'countdown';
  box.setAttribute('aria-live', 'assertive');
  box.hidden = true;
  document.body.append(box);
  let shown = null;
  let flashTimer = 0;

  // Places the numbers in the middle of the kit area, a little above centre (the area moves as panels open).
  function place() {
    const kit = document.querySelector('#kit');
    if (!kit) return;
    const r = kit.getBoundingClientRect();
    box.style.left = `${r.left + r.width / 2}px`;
    box.style.top = `${r.top + r.height * 0.42}px`;
  }

  function show(text, className) {
    clearTimeout(flashTimer);
    place();
    box.textContent = text;
    box.className = `countdown ${className}`;
    box.hidden = false;
    // Restart the pop animation for each new number.
    box.style.animation = 'none';
    void box.offsetWidth;
    box.style.animation = '';
  }

  return {
    /**
     * Call on every frame of the recorder's status: shows each new count, the REC flash, or hides.
     * @param {{mode: string, beatsLeft?: number}} status
     */
    update(status) {
      if (!box.hidden) place(); // the kit area can move as the recording panel opens
      if (status.mode === 'counting') {
        if (shown !== status.beatsLeft) show(String(status.beatsLeft), 'is-number');
        shown = status.beatsLeft;
      } else if (status.mode === 'recording' && typeof shown === 'number') {
        show('REC', 'is-rec');
        shown = 'rec';
        flashTimer = setTimeout(() => { box.hidden = true; }, REC_FLASH);
      } else if (status.mode !== 'recording' && shown !== null) {
        if (shown !== 'rec') box.hidden = true; // cancelled during the count
        shown = null;
      }
    },
  };
}
