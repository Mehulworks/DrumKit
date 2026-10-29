// Spotlight: makes a real control glow for a few seconds, so the guide's "Try it" buttons can point at it.

const GLOW_FOR = 3600; // ms

/** @param {HTMLElement} element */
export function spotlight(element) {
  element.classList.remove('is-spotlit');
  void element.offsetWidth; // restart the glow if it was already running
  element.classList.add('is-spotlit');
  setTimeout(() => element.classList.remove('is-spotlit'), GLOW_FOR);
}
