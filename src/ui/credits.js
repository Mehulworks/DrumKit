// Credits: "Made by Mehul with Claude." (the name links to the portfolio), shown small in the bottom-right
// corner of the kit area, at the end of the ⋮ menu and in the guide's About section. The "Code & prompts" link appears once REPO_URL is set.
import { ICONS } from './icons.js';

const PORTFOLIO_URL = 'https://www.mehulvarshney.com/';
const REPO_URL = ''; // paste the GitHub repository address here once it exists
const REPO_LABEL = 'Code & prompts';

const external = (href, className, text) =>
  `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

/** The credit line, with the name linking to the portfolio (opens in a new tab). */
export const creditLine = (className) => `Made by ${external(PORTFOLIO_URL, className, 'Mehul')} with Claude.`;

/** The link to the code and prompts, or nothing until the repository exists. */
export const repoLink = (className = '') =>
  (REPO_URL ? external(REPO_URL, className, `${REPO_LABEL} <span aria-hidden="true">↗</span>`) : '');

/**
 * Fills the corner credit. The whole line takes clicks, so its text can be selected and copied without playing a drum.
 * @param {HTMLElement} container
 */
export function setupCredits(container) {
  const repo = repoLink('credits-link');
  container.innerHTML = `<span>${creditLine('credits-link')}</span>${repo ? `<span class="credits-dot" aria-hidden="true">·</span>${repo}` : ''}`;
}

/**
 * Fills the credit at the end of the ⋮ menu: a divider with a music note in the middle, then the line in light text.
 * The name is a menu item, so the arrow keys reach it.
 * @param {HTMLElement} container
 */
export function setupMenuCredit(container) {
  container.innerHTML = `<div class="menu-note-divider" role="separator">${ICONS.note}</div>
    <p class="menu-credit-line">${creditLine('menu-credit-link')}</p>`;
  const link = container.querySelector('a');
  link.setAttribute('role', 'menuitem');
  link.setAttribute('aria-label', "Made by Mehul with Claude. Opens Mehul's portfolio in a new tab");
}
