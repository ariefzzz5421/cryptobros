/* Local bilingual UI. Research text is translated from reviewed copy in the
   route modules; no page content is sent to a third-party translation API. */

const STORAGE_KEY = 'crypto-bros-language';
const SUPPORTED = new Set(['en', 'id']);

const UI = {
  en: {
    'language.name': 'English',
    'language.switch': 'Switch to Indonesian',
    'nav.open': 'Open navigation',
    'nav.close': 'Close navigation',
    'nav.routes': 'Explore',
    'nav.prompt': 'Choose a market or research route',
    'theme.light': 'Switch to light theme',
    'theme.dark': 'Switch to dark theme',
    'source.open': 'Open source',
    'common.unavailable': 'Unavailable',
    'common.loading': 'Loading…',
    'common.readResearch': 'Read research',
    'nft2026.brandSub': '2026 NFT breakout research',
    'nft2026.eyebrow': '2026 launches · 0.1 ETH floor rule',
    'nft2026.title': 'Confirmed breakouts, with the exceptions made visible',
    'nft2026.intro': 'This register separates collections that satisfy the rule from important 2026 market cases that do not. Open every card for the launch story, thesis, success factors, floor history, contract, and primary sources.',
    'nft2026.cutoff': 'Research cutoff',
    'nft2026.confirmed': 'Confirmed qualifiers',
    'nft2026.context': 'Important context',
    'nft2026.screened': 'Screened out',
    'nft2026.contextNote': 'Requested case studies with a meaningful 2026 event, kept outside the confirmed count when the launch year or quote currency does not match the rule.',
    'nft2026.screenedNote': 'Published so the threshold remains a visible filter. These collections were reviewed but had no public record above 0.1 ETH at the cutoff.',
    'meme2026.window': 'January 1 — August 9, 2026',
    'meme2026.title': '$100M crossings in 2026',
    'meme2026.intro': 'Scan each verified event, then open its sourced research dossier for the launch story, narrative, creator attribution, contract, chart, and evidence.',
    'meme2026.verified': 'verified events · research cutoff 9 Aug 2026',
  },
  id: {
    'language.name': 'Indonesia',
    'language.switch': 'Ganti ke bahasa Inggris',
    'nav.open': 'Buka navigasi',
    'nav.close': 'Tutup navigasi',
    'nav.routes': 'Jelajahi',
    'nav.prompt': 'Pilih halaman pasar atau riset',
    'theme.light': 'Ganti ke tema terang',
    'theme.dark': 'Ganti ke tema gelap',
    'source.open': 'Buka sumber',
    'common.unavailable': 'Tidak tersedia',
    'common.loading': 'Memuat…',
    'common.readResearch': 'Baca riset',
    'nft2026.brandSub': 'Riset breakout NFT 2026',
    'nft2026.eyebrow': 'Peluncuran 2026 · aturan floor 0,1 ETH',
    'nft2026.title': 'Breakout terkonfirmasi, dengan pengecualian yang tetap terlihat',
    'nft2026.intro': 'Register ini memisahkan koleksi yang memenuhi aturan dari studi pasar 2026 penting yang tidak memenuhi aturan. Buka setiap kartu untuk melihat kisah peluncuran, tesis, faktor keberhasilan, riwayat floor, kontrak, dan sumber utama.',
    'nft2026.cutoff': 'Batas waktu riset',
    'nft2026.confirmed': 'Kualifikasi terkonfirmasi',
    'nft2026.context': 'Konteks penting',
    'nft2026.screened': 'Sudah diperiksa',
    'nft2026.contextNote': 'Studi kasus yang diminta dan memiliki peristiwa penting pada 2026, tetapi tidak masuk hitungan jika tahun peluncuran atau mata uang harganya tidak sesuai aturan.',
    'nft2026.screenedNote': 'Ditampilkan agar batas tetap menjadi filter yang transparan. Koleksi ini diperiksa tetapi tidak memiliki catatan publik di atas 0,1 ETH pada tanggal riset.',
    'meme2026.window': '1 Januari — 9 Agustus 2026',
    'meme2026.title': 'Memecoin yang menembus $100 juta pada 2026',
    'meme2026.intro': 'Lihat setiap peristiwa terverifikasi, lalu buka artikel risetnya untuk kisah peluncuran, narasi, atribusi kreator, kontrak, chart, dan bukti.',
    'meme2026.verified': 'peristiwa terverifikasi · batas riset 9 Agustus 2026',
  },
};

let locale = 'en';

function storedLocale() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.has(value) ? value : null;
  } catch {
    return null;
  }
}

export function getLocale() {
  return locale;
}

export function localeTag() {
  return locale === 'id' ? 'id-ID' : 'en-US';
}

export function t(key, fallback = '') {
  return UI[locale]?.[key] || UI.en[key] || fallback || key;
}

function globeIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"></path></svg>';
}

function syncLanguageButton() {
  document.querySelectorAll('[data-language-toggle]').forEach((button) => {
    const next = locale === 'en' ? 'id' : 'en';
    button.setAttribute('aria-label', t('language.switch'));
    button.setAttribute('title', t('language.switch'));
    button.setAttribute('lang', locale);
    const code = button.querySelector('.language-code');
    if (code) code.textContent = locale.toUpperCase();
    button.dataset.nextLanguage = next;
  });
}

export function applyTranslations(root = document) {
  root.documentElement?.setAttribute('lang', locale);
  root.querySelectorAll?.('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (!node.dataset.i18nEn) node.dataset.i18nEn = node.textContent.trim();
    node.textContent = locale === 'en' ? node.dataset.i18nEn : t(key, node.dataset.i18nEn);
  });
  syncLanguageButton();
}

export function setLocale(next, { persist = true } = {}) {
  if (!SUPPORTED.has(next) || next === locale) return;
  locale = next;
  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* storage can be disabled */ }
  }
  applyTranslations(document);
  window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
}

export function initI18n() {
  locale = storedLocale() || 'en';
  document.documentElement.lang = locale;

  const actions = document.querySelector('.head-actions');
  if (actions && !actions.querySelector('[data-language-toggle]')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'language-toggle';
    button.dataset.languageToggle = '';
    button.innerHTML = `${globeIcon()}<span class="language-code">${locale.toUpperCase()}</span>`;
    actions.prepend(button);
    button.addEventListener('click', () => setLocale(locale === 'en' ? 'id' : 'en'));
  }
  applyTranslations(document);
}
