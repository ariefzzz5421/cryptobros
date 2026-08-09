/* 2026 NFT route — confirmed qualifiers and clearly separated context cases. */

import {
  CONFIRMED_NFT_2026,
  CONTEXT_NFT_2026,
  SCREENED_OUT,
  THRESHOLD_2026_ETH,
  RESEARCH_CUTOFF_2026,
  localizeNft2026,
} from './nft-2026-config.js';
import { fetchNftFloors, fmtEth, fmtResearchDate } from './nft-data.js';
import { fmtUsd, fmtClock, el } from './utils.js';
import { brandedSourceLink } from './source-brands.js';
import { getLocale, localeTag, t } from './i18n.js';
import { startAutoRefresh } from './autorefresh.js';

const $ = (id) => document.getElementById(id);
let latestSnapshot = null;

const copy = () => getLocale() === 'id' ? {
  live: 'Floor langsung', documented: 'Terdokumentasi', mint: 'Mint', unavailable: 'Tidak tersedia',
  read: 'Baca riset', market: 'OpenSea', launched: 'launch', confirmed: 'Kualifikasi terkonfirmasi',
  context: 'Studi konteks penting', screened: 'Sudah diperiksa', below: 'di bawah batas',
  partial: 'Sebagian floor langsung tersedia · riset tetap bersumber', ready: 'Floor langsung siap',
} : {
  live: 'Live floor', documented: 'Documented', mint: 'Mint', unavailable: 'Unavailable',
  read: 'Read research', market: 'OpenSea', launched: 'launched', confirmed: 'Confirmed qualifiers',
  context: 'Important context cases', screened: 'Screened', below: 'below threshold',
  partial: 'Live floors partially available · research remains sourced', ready: 'Live floors ready',
};

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

function card(sourceItem, live) {
  const item = localizeNft2026(sourceItem, getLocale());
  const ui = copy();
  const floor = live?.floorNative;
  const currency = live?.currency || item.peakFloor?.currency || 'ETH';
  const liveLabel = Number.isFinite(floor)
    ? `${floor.toLocaleString(localeTag(), { maximumFractionDigits: 4 })} ${currency}`
    : ui.unavailable;
  const logo = el('img', {
    class: 'nft-card-logo', src: live?.image || item.logo, alt: `${item.name} logo`,
    width: 52, height: 52, loading: 'lazy', decoding: 'async',
    onerror: (event) => {
      const img = event.currentTarget;
      if (img.dataset.fallback) return;
      img.dataset.fallback = '1';
      img.src = item.logoFallback;
    },
  });

  return el('article', { class: `nft-card${item.status === 'context' ? ' is-context' : ''}` },
    el('div', { class: 'nft-card-head' }, logo,
      el('div', {}, el('strong', {}, item.name),
        el('small', {}, `${item.chain} · ${ui.launched} ${fmtResearchDate(item.launch, localeTag())}`))),
    el('p', {}, item.narrative),
    el('div', { class: 'nft-card-stats' },
      el('div', {}, el('span', {}, ui.live), el('strong', { class: 'num' }, liveLabel)),
      el('div', {}, el('span', {}, ui.documented), el('strong', { class: 'num' }, item.peakFloor?.label || ui.unavailable)),
      el('div', {}, el('span', {}, ui.mint), el('strong', { class: 'num' }, item.mint))),
    el('div', { class: 'nft-card-actions' },
      el('a', { class: 'nft-read-link', href: `/nft-2026/${item.slug}/` }, ui.read),
      brandedSourceLink({ label: ui.market, url: item.marketplace, note: 'opensea.io', className: 'source-button' })),
    el('span', { class: `nft-flag${item.status === 'confirmed' ? ' is-live' : ''}` }, item.statusLabel),
  );
}

function renderGrid(snapshot = latestSnapshot) {
  latestSnapshot = snapshot;
  const confirmedRows = CONFIRMED_NFT_2026.map((item) => ({ item, live: snapshot?.collections?.[item.slug] || null }));
  const contextRows = CONTEXT_NFT_2026.map((item) => ({ item, live: snapshot?.collections?.[item.slug] || null }));
  $('nftGrid').replaceChildren(...confirmedRows.map(({ item, live }) => card(item, live)));
  $('contextGrid').replaceChildren(...contextRows.map(({ item, live }) => card(item, live)));

  const withLive = confirmedRows.filter(({ live }) => Number.isFinite(live?.floorNative));
  const totalMcap = withLive.reduce((sum, { live }) => sum + (live.marketCapUsd || 0), 0);
  $('kpiCount').textContent = String(CONFIRMED_NFT_2026.length);
  $('kpiScreened').textContent = String(SCREENED_OUT.length + CONTEXT_NFT_2026.length);
  $('kpiMcap').textContent = totalMcap > 0 ? fmtUsd(totalMcap) : '—';
  $('kpiMcapSub').textContent = withLive.length
    ? `${getLocale() === 'id' ? 'dari' : 'across'} ${withLive.length} ${getLocale() === 'id' ? 'koleksi terhubung' : 'resolved collection(s)'}`
    : (getLocale() === 'id' ? 'data floor langsung belum tersedia' : 'live floor data unavailable right now');
}

function renderScreened() {
  $('screenedList').replaceChildren(...SCREENED_OUT.map((row) => el('li', { class: 'doc-trigger' },
    el('time', {}, row.floor),
    el('p', {}, el('a', { href: row.url, target: '_blank', rel: 'noreferrer' }, row.name), ` — ${getLocale() === 'id' ? row.noteId : row.note}.`))));
}

async function refresh({ force = false } = {}) {
  const snapshot = await fetchNftFloors({ force, slugs: CONFIRMED_NFT_2026.map((item) => item.slug) });
  renderGrid(snapshot);
  $('updatedAt').textContent = fmtClock(snapshot.fetchedAt);
  setStatus(snapshot.partial ? copy().partial : copy().ready, snapshot.partial ? 'busy' : 'ok');
}

function renderLocale() {
  $('researchCutoff').textContent = fmtResearchDate(RESEARCH_CUTOFF_2026, localeTag());
  if ($('thresholdValue')) $('thresholdValue').textContent = `${THRESHOLD_2026_ETH} ETH`;
  renderScreened();
  renderGrid();
}

function init() {
  renderLocale();
  refresh().catch((error) => {
    console.warn('NFT floors:', error.message);
    setStatus(getLocale() === 'id' ? 'Floor langsung tidak tersedia · riset bersumber tetap ditampilkan' : 'Live floor data unavailable · sourced research is still shown', 'err');
  });
  startAutoRefresh([{ every: 60_000, run: () => refresh({ force: true }) }]);
  window.addEventListener('localechange', renderLocale);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
