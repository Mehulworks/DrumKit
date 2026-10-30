// Saved settings: remembers the player's choices in this browser only (nothing is uploaded anywhere).
const STORAGE_KEY = 'drumkit-settings';

// Key names help only with a keyboard, so they start on for computers and off on phones and tablets.
const hasKeyboard = typeof matchMedia === 'function' && matchMedia('(pointer: fine)').matches;

/** What a first visit starts with, and what the resets go back to. */
export const DEFAULTS = {
  theme: 'dark',
  mode: 'tap',
  volume: 80, // below full, so the intro sound does not startle
  tempo: 100,
  showKeys: hasKeyboard,
  showNames: true, // instrument names on the Pad grid tiles
  showSticks: true,
  flashLights: true,
  kit: 'acoustic',
  kitTheme: 'flames', // Hot Rod
  background: 'wood',
  customizeTab: 'kits',
  view: 'kit', // 'kit' (the drawn kit) or 'grid' (the Pad grid)
  look: { sticks: 'natural', stickType: 'classic', grip: 'tape', tip: 'none', chain: 'silver', sticker: 'none', hang: 'none', light: 'none' },
  tipsSeen: [],
  lessons: {},
  learnSpeeds: {},
  eq: { preset: 'normal', gains: { bass: 0, mid: 0, treble: 0 } },
};

function load() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage blocked (for example a private window) or unreadable: use the defaults.
  }
  saved = saved && typeof saved === 'object' ? saved : {};
  return {
    ...DEFAULTS,
    ...saved,
    eq: { ...DEFAULTS.eq, ...saved.eq, gains: { ...DEFAULTS.eq.gains, ...saved.eq?.gains } },
    look: { ...DEFAULTS.look, ...saved.look },
    tipsSeen: Array.isArray(saved.tipsSeen) ? saved.tipsSeen : [],
    lessons: { ...saved.lessons },
    learnSpeeds: { ...saved.learnSpeeds },
  };
}

/** The current settings. Change a field, then call saveSettings(). */
export const settings = load();

/** Writes the current settings to this browser's storage (silently skipped if storage is blocked). */
export function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage blocked: settings still work for this visit.
  }
}

/** Forgets all saved settings, so the next page load starts with the defaults. */
export function clearSettings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing saved to clear.
  }
}
