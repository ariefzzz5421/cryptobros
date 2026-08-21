/* NFT history index.

   Historical inclusion is two conditions, not one floor:

     documented peak floor      >= 0.1 ETH
     documented lifetime volume >= 25 ETH

   The test is on the peak floor a collection reached, never on today's floor —
   a collection that once met the threshold stays a historical qualifier. Where
   lifetime volume has no source yet, the card says so; a 24h volume is never
   promoted into a lifetime one. */

import {
  NFT_CASES, NFT_UPDATES, HISTORICAL_RULE, RESEARCH_CUTOFF,
  nftMetrics, qualificationLabel,
} from './nft-config.js';
import { fmtEth, fmtResearchDate, fetchNftFloors } from './nft-data.js';
import { fmtClock, el } from './utils.js';
import { startAutoRefresh } from './autorefresh.js';

const $ = (id) => document.getElementById(id);

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

function liveFor(snapshot, item) {
  return snapshot?.collections?.[item.slug] || null;
}

function stat(label, value, note) {
  return el('div', { class: 'nft-stat' },
    el('span', {}, label),
    el('strong', { class: 'num' }, value),
    note ? el('small', {}, note) : null,
  );
}

function card(item, live) {
  const metrics = nftMetrics(item, live);

  const logo = el('img', {
    class: 'nft-card-logo',
    src: live?.image || item.logo,
    alt: `${item.name} collection logo`,
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

  return el('article', { class: 'nft-card' },
    el('div', { class: 'nft-card-head' },
      logo,
      el('div', {},
        el('a', { class: 'nft-card-title', href: `/nft/${item.slug}/` }, item.name),
        el('small', {}, `${item.chain} · launched ${fmtResearchDate(item.launch)} · mint ${item.mint}`),
      ),
    ),

    /* The four numbers the inclusion rule is actually about, visible without
       any interaction on any screen width. */
    el('div', { class: 'nft-card-stats' },
      stat('Current floor', Number.isFinite(metrics.currentFloorEth)
        ? fmtEth(metrics.currentFloorEth) : 'Unavailable'),
      stat('Peak floor', Number.isFinite(metrics.documentedPeakFloorEth)
        ? fmtEth(metrics.documentedPeakFloorEth, 1)
        : 'Not sourced', item.peakFloor?.at || null),
      stat('Lifetime volume', Number.isFinite(metrics.lifetimeVolumeEth)
        ? fmtEth(metrics.lifetimeVolumeEth, 0)
        : 'Unavailable', metrics.volumeSource || null),
      stat('24h volume', Number.isFinite(metrics.volume24hEth)
        ? fmtEth(metrics.volume24hEth, 1) : 'Unavailable'),
    ),

    /* Everything a reader opens deliberately, so the card stays short on a
       phone without hiding anything the rule depends on. */
    el('details', { class: 'nft-card-more' },
      el('summary', {}, 'Supply, marketplace and rule check'),
      el('dl', { class: 'rank-card-details' },
        el('dt', {}, 'Supply'), el('dd', { class: 'num' }, item.supply ? item.supply.toLocaleString('en-US') : 'Unavailable'),
        el('dt', {}, 'Mint price'), el('dd', {}, item.mint),
        el('dt', {}, 'Launch'), el('dd', {}, `${fmtResearchDate(item.launch)}${item.launchNote ? ` — ${item.launchNote}` : ''}`),
        el('dt', {}, 'Rule check'), el('dd', {}, qualificationLabel(metrics)),
        el('dt', {}, 'OpenSea'), el('dd', {}, el('a', {
          href: item.marketplace, target: '_blank', rel: 'noreferrer',
        }, 'View collection')),
      ),
    ),

    el('span', {
      class: `nft-flag is-${metrics.qualifiesHistoricalRule}${metrics.qualifiesHistoricalRule === 'qualified' ? ' is-live' : ''}`,
    }, qualificationLabel(metrics)),
  );
}

function renderGrid(snapshot) {
  const rows = NFT_CASES
    .map((item) => ({ item, live: liveFor(snapshot, item), metrics: nftMetrics(item, liveFor(snapshot, item)) }))
    /* Sorted on the documented peak floor, because that is the historical
       measurement this route researches. */
    .sort((a, b) => (b.metrics.documentedPeakFloorEth ?? 0) - (a.metrics.documentedPeakFloorEth ?? 0));

  $('nftGrid').replaceChildren(...rows.map(({ item, live }) => card(item, live)));

  const qualified = rows.filter(({ metrics }) => metrics.qualifiesHistoricalRule === 'qualified');
  const pending = rows.filter(({ metrics }) => metrics.qualifiesHistoricalRule === 'pending');
  const withVolume = rows.filter(({ metrics }) => Number.isFinite(metrics.lifetimeVolumeEth));
  const combinedVolume = withVolume.reduce((sum, { metrics }) => sum + metrics.lifetimeVolumeEth, 0);
  const peaks = rows.map(({ metrics }) => metrics.documentedPeakFloorEth).filter(Number.isFinite);
  const withFloor = rows.filter(({ metrics }) => Number.isFinite(metrics.currentFloorEth));
  const aboveToday = withFloor.filter(({ metrics }) => metrics.currentFloorEth >= HISTORICAL_RULE.peakFloorEth);

  $('kpiQualified').textContent = qualified.length
    ? `${qualified.length} / ${rows.length}`
    : `0 / ${rows.length}`;
  $('kpiQualifiedSub').textContent = pending.length
    ? `${pending.length} pending a lifetime-volume source`
    : 'both conditions confirmed';

  $('kpiVolume').textContent = withVolume.length ? fmtEth(combinedVolume, 0) : 'Unavailable';
  $('kpiVolumeSub').textContent = withVolume.length
    ? `across ${withVolume.length} of ${rows.length} collections`
    : 'lifetime volume requires the OpenSea provider';

  $('kpiPeak').textContent = peaks.length ? fmtEth(Math.max(...peaks), 1) : 'Unavailable';
  $('kpiAbove').textContent = withFloor.length
    ? `${aboveToday.length} / ${withFloor.length}`
    : 'Unavailable';
  $('kpiAboveSub').textContent = withFloor.length
    ? `live floors at or above ${HISTORICAL_RULE.peakFloorEth} ETH`
    : 'live floor data unavailable right now';
}

function renderUpdates() {
  $('nftUpdates').replaceChildren(...NFT_UPDATES.map((update) => el('li', { class: 'doc-trigger' },
    el('time', { datetime: update.d }, fmtResearchDate(update.d)),
    el('p', {},
      `${update.t} `,
      el('a', { href: update.url, target: '_blank', rel: 'noreferrer' }, update.label),
    ),
  )));
}

function renderProviderState(snapshot) {
  const host = $('providerState');
  if (!host) return;
  const openSea = snapshot?.openSea;
  if (openSea?.available) {
    host.textContent = 'Lifetime volume, 24h volume and current floor come from the OpenSea V2 collection stats endpoint.';
    return;
  }
  host.textContent = `Lifetime volume is unavailable: ${openSea?.reason || 'OpenSea API key not configured'}. Sourced research and CoinGecko floors are shown; no volume figure is estimated in its place.`;
}

async function refresh({ force = false } = {}) {
  const snapshot = await fetchNftFloors({ force });
  renderGrid(snapshot);
  renderProviderState(snapshot);
  $('updatedAt').textContent = fmtClock(snapshot.fetchedAt);
  setStatus(
    snapshot.partial ? 'Live floors partially available · research remains sourced' : 'Live floors ready',
    snapshot.partial ? 'busy' : 'ok',
  );
}

function init() {
  $('researchCutoff').textContent = fmtResearchDate(RESEARCH_CUTOFF);
  document.querySelectorAll('[data-rule-summary]').forEach((node) => {
    node.textContent = HISTORICAL_RULE.summary;
  });
  renderUpdates();
  renderGrid(null);

  refresh().catch((error) => {
    console.warn('NFT floors:', error.message);
    setStatus('Live floor data unavailable · sourced research is still shown', 'err');
    renderProviderState(null);
  });

  /* Historical research does not need a one-minute poll. Current floor and 24h
     volume are the only fields that move, and their provider TTL is five
     minutes, so anything faster would just re-serve the same cached bytes. */
  startAutoRefresh([{ every: 5 * 60_000, run: () => refresh({ force: true }) }]);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
