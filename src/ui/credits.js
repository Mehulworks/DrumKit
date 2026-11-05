// Credits: "Made by Mehul with Claude." (the name links to the portfolio), at the end of the ⋮ menu (with the case study
// and the version) and in the guide's About section (with the case study and the code). Nothing over the drums.
import { ICONS } from './icons.js';
import { version } from '../../package.json';

const PORTFOLIO_URL = 'https://www.mehulvarshney.com/';
const CASE_STUDY_URL = 'https://www.mehulvarshney.com/aibuilds/drum-kit'; // how it was designed and built
const RELEASES_URL = 'https://github.com/Mehulworks/DrumKit/releases';
const SHORT_VERSION = version.replace(/\.0$/, ''); // "2.2.0" shows as "v2.2", like the release tags
const REPO_URL = 'https://github.com/Mehulworks/DrumKit'; // the public repository
const ARROW = ' <span aria-hidden="true">↗</span>';
const DOT = '<span aria-hidden="true"> · </span>';

const external = (href, className, text) =>
  `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

/** The credit line, with the name linking to the portfolio (opens in a new tab). */
export const creditLine = (className) => `Made by ${external(PORTFOLIO_URL, className, 'Mehul')} with Claude.`;

/** The links to the case study and the code, for the guide's About section. */
export const aboutLinks = (className) =>
  `${external(CASE_STUDY_URL, className, `Case study${ARROW}`)}${DOT}${external(REPO_URL, className, `Code${ARROW}`)}`;

/**
 * Fills the credit at the end of the ⋮ menu: a divider with a music note in the middle, then the line in light text,
 * and below it the case study and the version (which links to the release notes). The links are menu items, so the
 * arrow keys reach them.
 * @param {HTMLElement} container
 */
export function setupMenuCredit(container) {
  container.innerHTML = `<div class="menu-note-divider" role="separator">${ICONS.note}</div>
    <p class="menu-credit-line menu-credit-by">${creditLine('menu-credit-link')}</p>
    <p class="menu-credit-line menu-credit-links">${external(CASE_STUDY_URL, 'menu-credit-link', `Case study${ARROW}`)}${DOT}${external(RELEASES_URL, 'menu-version-link', `v${SHORT_VERSION}`)}</p>`;
  const [name, study, release] = container.querySelectorAll('a');
  name.setAttribute('aria-label', "Made by Mehul with Claude. Opens Mehul's portfolio in a new tab");
  study.setAttribute('aria-label', 'Case study: how Drum Kit was designed and built. Opens in a new tab');
  release.setAttribute('aria-label', `Version ${SHORT_VERSION}. Opens the release notes in a new tab`);
  for (const link of [name, study, release]) link.setAttribute('role', 'menuitem');
}
