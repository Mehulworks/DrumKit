// Lesson lock: while a lesson is running (playing or step by step, not the Demo), the drums it does not use stay silent,
// and a short note says which drums it uses, at most once every few seconds.
import { showToast } from './toast.js';

const NOTE_EVERY = 4000; // ms between notes

/**
 * @param {() => boolean} running whether a lesson is being played right now
 */
export function createLessonLock(running) {
  let allowed = null; // the pad ids the open lesson uses
  let names = '';
  let lastNote = 0;

  return {
    /**
     * @param {Set<string>} ids the drums the lesson uses
     * @param {Array<{id: string, label: string}>} pads the kit's pads, for their names
     */
    set(ids, pads) {
      allowed = ids;
      const list = pads.filter((pad) => ids.has(pad.id)).map((pad) => pad.label);
      names = list.length > 1 ? `${list.slice(0, -1).join(', ')} and ${list.at(-1)}` : list.join('');
    },
    clear() {
      allowed = null;
    },
    /** True if this drum may play now; if not, shows the note (now and then). @param {string} id */
    allows(id) {
      if (!allowed || allowed.has(id) || !running()) return true;
      const now = performance.now();
      if (now - lastNote > NOTE_EVERY) {
        lastNote = now;
        showToast(`This lesson uses only ${names}.`);
      }
      return false;
    },
  };
}
