// Lesson lock: while a lesson is open (before Start, during a run and its Demo), the drums it does not use stay silent
// (a softer sound would read as the device's volume dropping), and every tap on one shows a short note saying which
// drums the lesson uses (the same note again, never a pile). Closing the lesson brings every drum back.
import { showToast } from './toast.js';

export function createLessonLock() {
  let allowed = null; // the pad ids the open lesson uses
  let names = '';

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
    /** True if this drum may play now; if not, the note shows (again). @param {string} id */
    allows(id) {
      if (!allowed || allowed.has(id)) return true;
      showToast(`This lesson only uses ${names}.`);
      return false;
    },
  };
}
