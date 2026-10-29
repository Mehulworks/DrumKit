// Input modes: Tap (press a pad to play it) or Hover (a pad plays when the pointer or a finger moves onto it).
import { settings, saveSettings } from '../ui/storage.js';

/** The modes in the order the switch shows them. */
export const MODES = [
  { id: 'hover', label: 'Hover' },
  { id: 'tap', label: 'Tap' },
];

/** @returns {'hover' | 'tap'} */
export const getMode = () => (settings.mode === 'hover' ? 'hover' : 'tap');

/** @param {'hover' | 'tap'} id */
export function setMode(id) {
  settings.mode = id;
  saveSettings();
}
