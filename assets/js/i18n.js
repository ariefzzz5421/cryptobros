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

/* Reviewed interface copy shared by static and dynamically-rendered routes.
   Proper names, symbols, contracts, prices, and source names intentionally stay
   unchanged. MutationObserver applies the same dictionary to content inserted
   after a market request finishes. */
const ID_TEXT = new Map(Object.entries({
  'Skip to the map': 'Lewati ke peta',
  'Skip to the article': 'Lewati ke artikel',
  'Preparing market data…': 'Menyiapkan data pasar…',
  'Market data ready': 'Data pasar siap',
  'Global crypto volume · 24h': 'Volume kripto global · 24 jam',
  'all spot markets': 'seluruh pasar spot',
  'Largest volume hub': 'Pusat volume terbesar',
  'Average volume per exchange': 'Rata-rata volume per bursa',
  'Most active hour': 'Jam paling aktif',
  'Memecoin category · 24h': 'Kategori memecoin · 24 jam',
  'Market size and share': 'Ukuran dan pangsa pasar',
  "CoinGecko category total with a clearly labeled tracked-basket fallback.": 'Total kategori CoinGecko dengan fallback keranjang terpantau yang diberi label jelas.',
  'Total market cap': 'Total kapitalisasi pasar',
  'Crypto market share': 'Pangsa pasar kripto',
  'Share of total crypto market cap': 'Pangsa dari total kapitalisasi pasar kripto',
  'Live movers · 24h': 'Pergerakan langsung · 24 jam',
  'Memecoin leaderboard': 'Peringkat memecoin',
  "Largest percentage moves in CoinGecko's memecoin category. Open any coin for price and market-cap history.": 'Pergerakan persentase terbesar dalam kategori memecoin CoinGecko. Buka koin untuk melihat riwayat harga dan kapitalisasi pasar.',
  'Explore $100M+ coins →': 'Jelajahi koin $100 juta+',
  'Global crypto volume map': 'Peta volume kripto global',
  'Bubble size and color represent reported 24h exchange volume grouped by legal jurisdiction. Scroll to zoom, drag to pan, and click to lock details.': 'Ukuran dan warna gelembung mewakili volume bursa 24 jam berdasarkan yurisdiksi hukum. Gulir untuk zoom, geser untuk memindahkan, dan klik untuk mengunci detail.',
  'Zoom in': 'Perbesar',
  'Zoom out': 'Perkecil',
  'Reset': 'Atur ulang',
  'Labels': 'Label',
  'Loading map geometry…': 'Memuat geometri peta…',
  'Jurisdiction ranking': 'Peringkat yurisdiksi',
  'Regional distribution': 'Distribusi regional',
  'Full jurisdiction table': 'Tabel yurisdiksi lengkap',
  'Most active trading hours': 'Jam perdagangan paling aktif',
  'Average quote volume from real 1-hour candles. The primary axis is WIB (UTC+7), with UTC shown for comparison.': 'Rata-rata volume kuotasi dari candle 1 jam yang nyata. Sumbu utama menggunakan WIB (UTC+7), dengan UTC sebagai pembanding.',
  'Coin basket': 'Keranjang koin',
  'Time range': 'Rentang waktu',
  'Memecoin': 'Memecoin',
  'Major': 'Aset utama',
  'Average hourly volume profile': 'Profil rata-rata volume per jam',
  'Market-session contribution': 'Kontribusi sesi pasar',
  'Peak hour by coin': 'Jam puncak per koin',
  'Average volume by hour · 24 rows': 'Rata-rata volume per jam · 24 baris',
  'Memecoin volume heatmap': 'Heatmap volume memecoin',
  'Tile area is 24h volume share. Color is price change ( blue up, red down).': 'Luas kotak adalah pangsa volume 24 jam. Warna menunjukkan perubahan harga (biru naik, merah turun).',
  'Strongest gain · 24 hours': 'Kenaikan terkuat · 24 jam',
  'Deepest drop · 24 hours': 'Penurunan terdalam · 24 jam',
  'Coins up': 'Koin naik',
  'Largest volume': 'Volume terbesar',
  'Memecoin volume · 24h': 'Volume memecoin · 24 jam',
  'top 40 coins': '40 koin teratas',
  'over 24 hours': 'selama 24 jam',
  "this map uses an exchange's legal-jurisdiction metadata, not trader location. Exchanges without a country field are excluded from jurisdiction totals. Active trading hours below come from real hourly candles.": 'peta ini menggunakan metadata yurisdiksi hukum bursa, bukan lokasi trader. Bursa tanpa data negara tidak dihitung dalam total yurisdiksi. Jam perdagangan aktif di bawah berasal dari candle per jam yang nyata.',
  '⚠ Volume and momentum are not buy signals. Avoid leverage and size positions before entering.': '⚠ Volume dan momentum bukan sinyal beli. Hindari leverage dan tentukan ukuran posisi sebelum masuk.',
  'Change period': 'Periode perubahan',
  'View': 'Tampilan',
  'Tiles': 'Kotak',
  'Table': 'Tabel',
  'Live prices temporarily unavailable': 'Harga langsung sementara tidak tersedia',
  'Last update': 'Pembaruan terakhir',
  'Loading live floor…': 'Memuat floor langsung…',
  'NFT case study': 'Studi kasus NFT',
  'Loading summary…': 'Memuat ringkasan…',
  'Thesis': 'Tesis',
  'What this collection actually priced': 'Apa yang sebenarnya dihargai oleh koleksi ini',
  'Narrative': 'Narasi',
  'Why it pumped': 'Mengapa harganya naik',
  'The move, and what was behind it': 'Pergerakan harga dan faktor di baliknya',
  'Reasons and factors': 'Alasan dan faktor',
  'What carried the floor': 'Faktor yang menopang floor',
  'Why it counts as a success': 'Mengapa kasus ini dianggap berhasil',
  'What success means in this case': 'Arti keberhasilan dalam kasus ini',
  'Floor history': 'Riwayat floor',
  'Sourced floor milestones': 'Tonggak floor berdasarkan sumber',
  'Triggers': 'Pemicu',
  'What triggered each move': 'Pemicu setiap pergerakan',
  'Triggers are publicly dated events that correlate with a floor move. Correlation is not proof that a single event caused the repricing.': 'Pemicu adalah peristiwa bertanggal publik yang berkorelasi dengan perubahan floor. Korelasi bukan bukti bahwa satu peristiwa menyebabkan perubahan harga.',
  'Identity': 'Identitas',
  'Creator and contract': 'Kreator dan kontrak',
  'Creator / issuer': 'Kreator / penerbit',
  'Launch detail': 'Detail peluncuran',
  'Marketplace': 'Marketplace',
  'Peak floor note': 'Catatan floor puncak',
  'Sources': 'Sumber',
  'Pages, verified contracts, and publications cited above.': 'Halaman proyek, kontrak terverifikasi, dan publikasi yang dikutip di atas.',
  'Project pages, the verified contract, and every publication cited above.': 'Halaman proyek, kontrak terverifikasi, dan setiap publikasi yang dikutip di atas.',
  'Project identity, explorer, and market-history links.': 'Identitas proyek, explorer, dan tautan riwayat pasar.',
  'Live floor': 'Floor langsung',
  'Peak floor': 'Floor puncak',
  'Mint price': 'Harga mint',
  'Supply': 'Supply',
  'Launch': 'Peluncuran',
  'Current market cap': 'Kapitalisasi pasar saat ini',
  'Current snapshot': 'Snapshot saat ini',
  'Historical evidence remains valid': 'Bukti historis tetap berlaku',
  'Documented peak': 'Puncak terdokumentasi',
  'Research cutoff': 'Batas waktu riset',
  'Confirmed qualifiers': 'Kualifikasi terkonfirmasi',
  'Important context': 'Konteks penting',
  'Screened out': 'Sudah diperiksa',
  'Read research': 'Baca riset',
  'Loading leaderboard…': 'Memuat peringkat…',
  'Unavailable': 'Tidak tersedia',
  'Loading…': 'Memuat…',
  'Data boundary:': 'Batas data:',
  'Coverage note': 'Catatan cakupan',
  'Source': 'Sumber',
  'Sources and boundaries': 'Sumber dan batasan',
  'Open navigation': 'Buka navigasi',
  'Close navigation': 'Tutup navigasi',
}));

const originalText = new WeakMap();
const originalAttributes = new WeakMap();
let observer = null;
let eventsBound = false;

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

function translationIcon() {
  return '<svg class="translation-orbit" viewBox="0 0 28 28" fill="none" aria-hidden="true"><path class="translation-orbit-ring" d="M4.5 13.8a9.7 9.7 0 0 1 16.9-6.4"/><path class="translation-orbit-ring" d="M23.5 14.2a9.7 9.7 0 0 1-16.9 6.4"/><path class="translation-bubble translation-bubble-a" d="M5.5 6.5h10v7h-5l-3.3 2.4.8-2.4H5.5z"/><path class="translation-bubble translation-bubble-b" d="M12.5 14.5h10v7H20l.8 2.4-3.3-2.4h-5z"/><path class="translation-glyph" d="M8.2 9.5h4.6M10.5 8v4M15.3 17.3h4.4M17.5 16v4"/></svg>';
}

function syncLanguageButton() {
  document.querySelectorAll('[data-language-toggle]').forEach((button) => {
    const next = locale === 'en' ? 'id' : 'en';
    button.setAttribute('aria-label', t('language.switch'));
    button.setAttribute('title', t('language.switch'));
    button.setAttribute('lang', locale);
    const code = button.querySelector('.language-code');
    if (code) code.textContent = locale.toUpperCase();
    if (!button.querySelector('.translation-orbit')) {
      button.innerHTML = `${translationIcon()}<span class="language-code">${locale.toUpperCase()}</span>`;
    }
    button.dataset.nextLanguage = next;
  });
}

function translatedText(source) {
  const trimmed = source.trim();
  if (!trimmed) return source;
  const exact = ID_TEXT.get(trimmed);
  let translated = exact || trimmed;
  if (!exact) {
    translated = translated
      .replace(/^Loading (.+)…$/u, 'Memuat $1…')
      .replace(/^Read research\s*→?$/u, 'Baca riset')
      .replace(/^Open research\s+/u, 'Buka riset ')
      .replace(/^Switch to light theme$/u, 'Ganti ke tema terang')
      .replace(/^Switch to dark theme$/u, 'Ganti ke tema gelap');
  }
  const leading = source.match(/^\s*/u)?.[0] || '';
  const trailing = source.match(/\s*$/u)?.[0] || '';
  return `${leading}${translated}${trailing}`;
}

function translatable(node) {
  const parent = node.parentElement;
  return parent && !parent.closest('script,style,noscript,code,pre,[data-no-translate]');
}

function translateTree(root = document) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!translatable(node)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    node.nodeValue = locale === 'id' ? translatedText(source) : source;
  });

  root.querySelectorAll?.('[aria-label],[title],[placeholder]').forEach((node) => {
    if (!originalAttributes.has(node)) originalAttributes.set(node, {});
    const originals = originalAttributes.get(node);
    for (const attribute of ['aria-label', 'title', 'placeholder']) {
      if (!node.hasAttribute(attribute)) continue;
      originals[attribute] ||= node.getAttribute(attribute);
      node.setAttribute(attribute, locale === 'id' ? translatedText(originals[attribute]) : originals[attribute]);
    }
  });
}

export function applyTranslations(root = document) {
  root.documentElement?.setAttribute('lang', locale);
  root.querySelectorAll?.('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (!node.dataset.i18nEn) node.dataset.i18nEn = node.textContent.trim();
    node.textContent = locale === 'en' ? node.dataset.i18nEn : t(key, node.dataset.i18nEn);
  });
  translateTree(root);
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
    button.innerHTML = `${translationIcon()}<span class="language-code">${locale.toUpperCase()}</span>`;
    actions.prepend(button);
  }
  if (!eventsBound) {
    eventsBound = true;
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-language-toggle]');
      if (!button) return;
      button.classList.remove('is-switching');
      void button.offsetWidth;
      button.classList.add('is-switching');
      setTimeout(() => button.classList.remove('is-switching'), 520);
      setLocale(locale === 'en' ? 'id' : 'en');
    });
  }
  observer ||= new MutationObserver((records) => {
    if (locale !== 'id') return;
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && translatable(node)) {
        if (!originalText.has(node)) originalText.set(node, node.nodeValue);
        node.nodeValue = translatedText(originalText.get(node));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        translateTree(node);
      }
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
  applyTranslations(document);
}
