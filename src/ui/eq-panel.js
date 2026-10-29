// EQ tab of the Customize drawer: master volume, preset chips, and Bass, Mid and Treble sliders, remembered between
// visits. The toolbar's EQ button is a shortcut that opens this tab.
import { BANDS, EQ_RANGE, PRESETS } from '../audio/eq.js';
import { setEqGain, setMasterVolume } from '../audio/engine.js';
import { ICONS } from './icons.js';
import { settings, saveSettings, DEFAULTS } from './storage.js';

const formatDb = (db) => `${db > 0 ? '+' : ''}${db} dB`;

function chipMarkup({ id, label }) {
  return `<button type="button" class="chip" data-preset="${id}" aria-pressed="false">${label}</button>`;
}

function bandMarkup({ id, label }) {
  return `
  <label class="slider-row">
    <span>${label}</span>
    <output class="slider-value" id="eq-value-${id}"></output>
    <input type="range" min="${-EQ_RANGE}" max="${EQ_RANGE}" step="1" data-band="${id}"
      aria-describedby="eq-value-${id}" />
  </label>`;
}

/**
 * Fills the EQ tab and applies the saved volume and EQ.
 * @param {HTMLElement} container the Customize drawer's empty EQ area
 */
export function setupEqPanel(container) {
  container.innerHTML = `
  <div class="slider-group">
    <label class="slider-row">
      <span class="setting-name">${ICONS.volume}Volume</span>
      <output class="slider-value" id="volume-value"></output>
      <input type="range" min="0" max="100" step="1" id="volume-slider" aria-describedby="volume-value" />
    </label>
  </div>
  <hr class="fade-divider" />
  <span class="panel-title">Equalizer</span>
  <div class="chips" role="group" aria-label="EQ presets">${PRESETS.map(chipMarkup).join('')}</div>
  <div class="slider-group">${BANDS.map(bandMarkup).join('')}</div>`;

  const volume = container.querySelector('#volume-slider');
  function applyVolume() {
    setMasterVolume(Number(volume.value));
    container.querySelector('#volume-value').textContent = `${volume.value}%`;
  }
  volume.value = String(settings.volume);
  applyVolume();
  volume.addEventListener('input', () => {
    applyVolume();
    settings.volume = Number(volume.value);
    saveSettings();
  });

  const sliders = [...container.querySelectorAll('input[data-band]')];
  const chips = [...container.querySelectorAll('[data-preset]')];

  function apply(slider) {
    const db = Number(slider.value);
    setEqGain(slider.dataset.band, db);
    settings.eq.gains[slider.dataset.band] = db;
    container.querySelector(`#eq-value-${slider.dataset.band}`).textContent = formatDb(db);
  }

  // Highlights one chip; null when the sliders no longer match a preset (the player's own setting).
  function highlight(presetId) {
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.preset === presetId)));
    settings.eq.preset = presetId;
  }

  function setAll(gains, presetId) {
    sliders.forEach((slider) => {
      slider.value = String(gains[slider.dataset.band] ?? 0);
      apply(slider);
    });
    highlight(presetId);
  }

  sliders.forEach((slider) =>
    slider.addEventListener('input', () => {
      apply(slider);
      highlight(null);
      saveSettings();
    }),
  );
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      const preset = PRESETS.find((p) => p.id === chip.dataset.preset);
      setAll(preset.gains, preset.id);
      saveSettings();
    }),
  );

  setAll(settings.eq.gains, settings.eq.preset);

  return {
    /** Back to the first-visit volume, the Normal preset and flat sliders. */
    reset() {
      volume.value = String(DEFAULTS.volume);
      applyVolume();
      settings.volume = DEFAULTS.volume;
      setAll({ bass: 0, mid: 0, treble: 0 }, 'normal');
      saveSettings();
    },
  };
}
