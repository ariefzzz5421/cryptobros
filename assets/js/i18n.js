/* English-only compatibility layer.
   Route modules can keep using locale helpers without mounting a translator UI. */

const COPY = {
  'nav.open': 'Open navigation',
  'nav.close': 'Close navigation',
  'nav.routes': 'Explore Crypto Bros',
  'nav.prompt': 'Choose a market or research route.',
  'theme.light': 'Switch to light theme',
  'theme.dark': 'Switch to dark theme',
};

export function getLocale() {
  return 'en';
}

export function localeTag() {
  return 'en-US';
}

export function t(key, fallback = '') {
  return COPY[key] || fallback || key;
}

export function applyTranslations(root = document) {
  document.documentElement.lang = 'en';
  root.querySelectorAll?.('[data-language-toggle]').forEach((button) => button.remove());
}

export function setLocale() {
  return 'en';
}

export function initI18n() {
  try { localStorage.removeItem('crypto-bros-language'); } catch { /* storage can be disabled */ }
  applyTranslations(document);
}
