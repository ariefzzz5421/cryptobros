/* 2026 NFT route index — collections that broke 0.1 ETH this year. */

import { NFT_2026, SCREENED_OUT, THRESHOLD_2026_ETH, RESEARCH_CUTOFF_2026 } from './nft-2026-config.js';
import { fetchNftFloors, fmtEth, fmtResearchDate } from './nft-data.js';
import { fmtUsd, fmtPct, fmtClock, el } from './utils.js';
import { startAutoRefresh } from './autorefresh.js';

const $ = (id) => document.getElementById(id);

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

function card(item, live) {
  const floor = live?.floorNative;
  const logo = el('img', {
    class: 'nft-card-logo',
    src: live?.image || item.logo,
    alt: `${item.name} logo`,
    width: 52,
    height: 52,
    loading: 'lazy',
    decoding: 'async',
    onerror: (event) => {
      const img = event.currentTarget;
      if (img.dataset.fallback) return;
      img.dataset.fallback = '1';
      img.src = item.logoFallback;
    },
  });

  return el('a', { class: 'nft-card', href: `/nft-2026/${item.slug}/` },
    el('div', { class: 'nft-card-head' },
      logo,
      el('div', {},
        el('strong', {}, item.name),
        el('small', {}, `${item.chain} · launched ${fmtResearchDate(item.launch)}`),
      ),
    ),
    el('p', {}, item.narrative),
    el('div', { class: 'nft-card-stats' },
      el('div', {},
        el('span', {}, 'Live floor'),
        el('strong', { class: 'num' }, Number.isFinite(floor) ? fmtEth(floor) : 'Unavailable'),
      ),
      el('div', {},
        el('span', {}, 'Documented'),
        el('strong', { class: 'num' }, item.peakFloor?.label || 'Not sourced'),
      ),
      el('div', {},
        el('span', {}, 'Mint'),
        el('strong', { class: 'num' }, item.mint),
      ),
    ),
    el('span', { class: 'nft-flag is-live' }, `Broke ${THRESHOLD_2026_ETH} ETH in 2026`),
  );
}

function renderGrid(snapshot) {
  const rows = NFT_2026.map((item) => ({ item, live: snapshot?.collections?.[item.slug] || null }));
  $('nftGrid').replaceChildren(...rows.map(({ item, live }) => card(item, live)));

  const withLive = rows.filter(({ live }) => Number.isFinite(live?.floorNative));
  const totalMcap = withLive.reduce((sum, { live }) => sum + (live.marketCapUsd || 0), 0);
  $('kpiCount').textContent = String(NFT_2026.length);
  $('kpiScreened').textContent = String(SCREENED_OUT.length);
  $('kpiMcap').textContent = totalMcap > 0 ? fmtUsd(totalMcap) : '—';
  $('kpiMcapSub').textContent = withLive.length
    ? `across ${withLive.length} resolved collection(s)`
    : 'live floor data unavailable right now';
}

function renderScreened() {
  $('screenedList').replaceChildren(...SCREENED_OUT.map((row) => el('li', { class: 'doc-trigger' },
    el('time', {}, row.floor),
    el('p', {},
      el('a', { href: row.url, target: '_blank', rel: 'noreferrer' }, row.name),
      ` — ${row.note}.`),
  )));
}

async function refresh({ force = false } = {}) {
  const snapshot = await fetchNftFloors({ force });
  renderGrid(snapshot);
  $('updatedAt').textContent = fmtClock(snapshot.fetchedAt);
  setStatus(snapshot.partial ? 'Live floors partially available · research remains sourced' : 'Live floors ready',
    snapshot.partial ? 'busy' : 'ok');
}

function init() {
  $('researchCutoff').textContent = fmtResearchDate(RESEARCH_CUTOFF_2026);
  $('thresholdValue').textContent = `${THRESHOLD_2026_ETH} ETH`;
  renderScreened();
  renderGrid(null);

  refresh().catch((error) => {
    console.warn('NFT floors:', error.message);
    setStatus('Live floor data unavailable · sourced research is still shown', 'err');
  });

  startAutoRefresh([{ every: 60_000, run: () => refresh({ force: true }) }]);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
