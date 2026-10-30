// Toolbar: fills the logo, the Hover + Tap switch, and the tools in the More menu: EQ (a shortcut to Customize > EQ),
// theme and How to play (focus-mode.js fills Focus, menu-settings.js the settings; more-menu.js runs the menu).
import { ICONS, LOGO } from './icons.js';
import { settings, saveSettings } from './storage.js';
import { MODES, getMode, setMode } from '../input/modes.js';

// The theme is a "Dark mode" switch in the More menu: on means dark.
function applyTheme(button, theme) {
  document.documentElement.dataset.theme = theme;
  button.setAttribute('aria-checked', String(theme === 'dark'));
}

function setupModeSwitch(group) {
  // Touch screens have no hover: there the same mode is "Drag", a sliding finger playing each pad it crosses.
  const touch = matchMedia('(hover: none)').matches;
  group.innerHTML = MODES.map(({ id, label }) =>
    `<button type="button" data-mode="${id}" aria-pressed="${id === getMode()}">${id === 'hover' && touch ? 'Drag' : label}</button>`).join('');
  group.addEventListener('click', (event) => {
    const choice = event.target.closest('[data-mode]');
    if (!choice) return;
    setMode(choice.dataset.mode);
    group.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b === choice)));
  });
}

/** Sets up every part of the toolbar. Call before the drawers, which rely on the buttons existing. */
export function setupToolbar() {
  document.querySelector('.title-logo').innerHTML = LOGO;
  document.getElementById('eq-button').innerHTML = `${ICONS.eq}<span class="button-label">EQ</span>`;
  const help = document.getElementById('help-button');
  help.innerHTML = `${ICONS.help}<span class="button-label">How to play</span>`;
  help.setAttribute('aria-label', 'How to play');
  help.title = 'How to play';

  const themeButton = document.getElementById('theme-button');
  themeButton.innerHTML = `${ICONS.moon}<span class="button-label">Dark mode</span><span class="menu-switch" aria-hidden="true"></span>`;
  themeButton.setAttribute('role', 'menuitemcheckbox');
  themeButton.dataset.keepOpen = '';
  applyTheme(themeButton, settings.theme === 'light' ? 'light' : 'dark');
  themeButton.addEventListener('click', () => {
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
    saveSettings();
    applyTheme(themeButton, settings.theme);
  });

  setupModeSwitch(document.getElementById('mode-switch'));
}
