// Keyboard input: plays the pad whose key is pressed, one hit per press (holding a key does not repeat).
// Keys follow the kit on stage, so a key for a piece the kit does not have does nothing.

/**
 * Starts listening for pad keys.
 * @param {() => Array<{id: string, key: string}>} getPads the current kit's pads (key is a KeyboardEvent.code value)
 * @param {(id: string, point: undefined, eventTime: number) => void} onHit eventTime is the key press's timeStamp
 */
export function listenToKeys(getPads, onHit) {
  const padFor = (event) => (event.ctrlKey || event.metaKey || event.altKey ? null
    : getPads().find((pad) => pad.key === event.code) ?? null);

  window.addEventListener('keydown', (event) => {
    const pad = padFor(event);
    if (!pad) return;
    event.preventDefault();
    if (!event.repeat) onHit(pad.id, undefined, event.timeStamp);
  });
  // Also cancel the key release, so Space never "clicks" a toolbar button that still has focus.
  window.addEventListener('keyup', (event) => {
    if (padFor(event)) event.preventDefault();
  });
}
