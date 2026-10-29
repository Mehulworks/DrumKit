// Settings in the More menu: switches for key names on the pads and flashing lights, the Metronome switch with its tempo
// − and + (active while it is on), and Reset all (asks first, with Cancel and Yes). They work without closing the menu,
// and every choice is remembered in this browser.
import { setTempo, onTempoChange } from '../audio/metronome.js';
import { ICONS } from './icons.js';
import { confirmToast } from './confirm-toast.js';
import { applyFlashSetting } from './flash-lights.js';
import { settings, saveSettings, clearSettings } from './storage.js';
import { isMetronomeOn, startMetronome, stopMetronome } from '../audio/metronome.js';

const TEMPO = { min: 40, max: 200, step: 5 };

const toggle = (id, icon, label) => `<button type="button" class="icon-button menu-toggle" role="menuitemcheckbox" data-keep-open
  data-setting="${id}" aria-checked="false">${icon}<span class="button-label">${label}</span><span class="menu-switch" aria-hidden="true"></span></button>`;

/**
 * @param {HTMLElement} container the settings area in the More menu
 * @param {(show: boolean) => void} showKeys shows or hides the key names on the pads
 */
export function setupMenuSettings(container, showKeys) {
  container.innerHTML = `
    ${toggle('showKeys', ICONS.keyboard, 'Show keys on pads')}
    ${toggle('flashLights', ICONS.sun, 'Flashing lights')}
    <button type="button" class="icon-button menu-toggle" role="menuitemcheckbox" data-keep-open data-metronome
      aria-checked="false">${ICONS.metronome}<span class="button-label">Metronome</span><span class="menu-switch" aria-hidden="true"></span></button>
    <div class="menu-tempo" role="group" aria-label="Metronome tempo">
      <span class="menu-tempo-gap" aria-hidden="true"></span><span class="button-label menu-tempo-label">Tempo</span>
      <button type="button" class="icon-button menu-step" role="menuitem" data-keep-open data-tempo="-1" aria-label="Slower">−</button>
      <output class="menu-tempo-value" aria-live="polite"></output>
      <button type="button" class="icon-button menu-step" role="menuitem" data-keep-open data-tempo="1" aria-label="Faster">+</button>
    </div>`;

  const apply = {
    showKeys: () => showKeys(settings.showKeys),
    flashLights: () => applyFlashSetting(),
  };
  function mark() {
    container.querySelectorAll('[data-setting]').forEach((button) =>
      button.setAttribute('aria-checked', String(Boolean(settings[button.dataset.setting]))));
    const on = isMetronomeOn();
    container.querySelector('[data-metronome]').setAttribute('aria-checked', String(on));
    container.querySelector('.menu-tempo').classList.toggle('is-off', !on);
    container.querySelectorAll('[data-tempo]').forEach((step) => { step.disabled = !on; });
  }
  // The metronome chip by Rec can switch the metronome off too.
  document.addEventListener('metronome-change', mark);
  container.addEventListener('click', (event) => {
    const switchButton = event.target.closest('[data-setting]');
    if (switchButton) {
      const id = switchButton.dataset.setting;
      settings[id] = !settings[id];
      saveSettings();
      apply[id]();
      mark();
    }
    if (event.target.closest('[data-metronome]')) {
      if (isMetronomeOn()) stopMetronome();
      else startMetronome();
      document.dispatchEvent(new CustomEvent('metronome-change'));
    }
    const step = event.target.closest('[data-tempo]');
    if (step) {
      const bpm = Math.min(TEMPO.max, Math.max(TEMPO.min, settings.tempo + Number(step.dataset.tempo) * TEMPO.step));
      settings.tempo = bpm;
      saveSettings();
      setTempo(bpm);
    }
  });

  setTempo(settings.tempo);
  onTempoChange((bpm) => { container.querySelector('.menu-tempo-value').textContent = `${bpm} BPM`; });
  Object.values(apply).forEach((run) => run());
  mark();
}

/**
 * Reset all: asks in a small message (Cancel or Yes); yes forgets every saved choice and reloads.
 * @param {HTMLButtonElement} button
 */
export function setupResetAll(button) {
  button.innerHTML = `${ICONS.undo}<span class="button-label">Reset all settings</span>`;
  // The menu closes when this is picked, so the question opens below the ⋮ button instead.
  button.addEventListener('click', () => confirmToast(document.getElementById('more-button'),
    'Reset every setting to how it started? The page reloads, so your recording is cleared too.',
    'Yes, reset all', () => {
      clearSettings();
      location.reload();
    }));
}
