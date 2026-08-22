import { refreshPalette } from './utils.js';
import { initMotion } from './motion.js';
import { initAppShell } from './app-shell.js';
import { hydrateSourceLinks } from './source-brands.js';
import { initI18n, t } from './i18n.js';
import { initUiUpgrades } from './ui-upgrades.js';

const STORAGE_KEY = 'heatmap-volume-theme';
const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: light)');

function savedTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function themeIcon() {
  return `<svg class="theme-glyph" viewBox="0 0 24 24" aria-hidden="true">
    <circle class="theme-glyph-sun" cx="12" cy="12" r="4"></circle>
    <path class="theme-glyph-rays" d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path>
    <path class="theme-glyph-moon" d="M20.2 15.2A8.2 8.2 0 0 1 8.8 3.8a8.5 8.5 0 1 0 11.4 11.4Z"></path>
  </svg>`;
}

function ensureThemeIcons() {
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.replaceChildren();
    button.insertAdjacentHTML('afterbegin', themeIcon());
  });
}

function commitTheme(theme, persist = false) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* storage can be disabled */ }
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const label = t(next === 'light' ? 'theme.light' : 'theme.dark');
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  });

  requestAnimationFrame(() => {
    refreshPalette();
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    window.dispatchEvent(new Event('resize'));
  });
}

function applyTheme(theme, persist = false) {
  const commit = () => commitTheme(theme, persist);
  if (persist && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(commit);
  } else {
    commit();
  }
}

applyTheme(savedTheme() || (media.matches ? 'light' : 'dark'));

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-theme-toggle]');
  if (!button) return;
  applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

media.addEventListener?.('change', (event) => {
  if (!savedTheme()) applyTheme(event.matches ? 'light' : 'dark');
});

function initSharedUi() {
  ensureThemeIcons();
  applyTheme(root.dataset.theme || 'dark');
  initI18n();
  initAppShell();
  hydrateSourceLinks();
  initMotion();
  initUiUpgrades();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSharedUi);
else initSharedUi();
