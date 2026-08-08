/* 2026 NFT collection article.

   Same layout as every other case endpoint: official logo centred above the
   headline, then thesis, why it moved, why it counts as a success, the factors,
   the floor chart, and the dated triggers. Only the research set and the
   threshold differ from the historic route. */

import {
  NFT_2026_BY_SLUG as NFT_BY_SLUG,
  THRESHOLD_2026_ETH as FLOOR_THRESHOLD_ETH,
  localizeNft2026,
} from './nft-2026-config.js';
import { fetchNftFloors, fmtEth, fmtResearchDate } from './nft-data.js';
import { renderFloorChart } from './nft-chart.js';
import { brandedSourceLink } from './source-brands.js';
import { fmtUsd, fmtPct, fmtNum, fmtClock, el } from './utils.js';
import { startAutoRefresh } from './autorefresh.js';
import { getLocale, localeTag } from './i18n.js';

const $ = (id) => document.getElementById(id);
const sourceItem = NFT_BY_SLUG[document.body.dataset.nft];
let item = sourceItem;
let live = null;

const ui = () => getLocale() === 'id' ? {
  launch: 'Peluncuran', mint: 'Harga mint', supply: 'Supply', peak: 'Floor puncak', live: 'Floor langsung',
  unavailable: 'Tidak tersedia', thresholdAbove: `Di atas batas riset ${FLOOR_THRESHOLD_ETH} ETH`,
  thresholdBelow: `Di bawah batas riset ${FLOOR_THRESHOLD_ETH} ETH hari ini`,
  context: 'Studi konteks · tidak dihitung sebagai kualifikasi', creator: 'Kreator / penerbit',
  detail: 'Detail peluncuran', market: 'Marketplace', peakNote: 'Catatan floor puncak',
  caseStudy: 'Studi kasus NFT', collection: 'Koleksi OpenSea', official: 'Situs resmi', social: 'X resmi',
  marketNote: 'pasar dan floor langsung', siteNote: 'sumber proyek', socialNote: 'akun publik',
  cap: 'kapitalisasi koleksi', ready: 'Artikel dan floor langsung siap',
} : {
  launch: 'Launch', mint: 'Mint price', supply: 'Supply', peak: 'Peak floor', live: 'Live floor',
  unavailable: 'Unavailable', thresholdAbove: `Above the ${FLOOR_THRESHOLD_ETH} ETH research threshold`,
  thresholdBelow: `Below the ${FLOOR_THRESHOLD_ETH} ETH research threshold today`,
  context: 'Context case · not counted as a qualifier', creator: 'Creator / issuer',
  detail: 'Launch detail', market: 'Marketplace', peakNote: 'Peak floor note',
  caseStudy: 'NFT case study', collection: 'OpenSea collection', official: 'Official site', social: 'Official X',
  marketNote: 'market and live floor', siteNote: 'project source', socialNote: 'public account',
  cap: 'collection cap', ready: 'Article and live floor ready',
};

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

function metaCard(label, value, emphasis = false) {
  return el('div', { class: emphasis ? 'is-emphasis' : null },
    el('span', {}, label),
    el('strong', { class: 'num' }, value),
  );
}

function renderMeta() {
  const text = ui();
  const floor = live?.floorNative;
  const currency = live?.currency || item.peakFloor?.currency || 'ETH';
  const floorText = Number.isFinite(floor)
    ? `${floor.toLocaleString(localeTag(), { maximumFractionDigits: 4 })} ${currency}`
    : text.unavailable;
  $('docMeta').replaceChildren(
    metaCard(text.launch, fmtResearchDate(item.launch, localeTag())),
    metaCard(text.mint, item.mint),
    metaCard(text.supply, fmtNum(item.supply)),
    metaCard(text.peak, item.peakFloor?.label || text.unavailable),
    metaCard(text.live, floorText, true),
  );

  const snapshot = $('liveSnapshot');
  if (Number.isFinite(floor)) {
    snapshot.replaceChildren(
      el('span', { class: `nft-flag${floor >= FLOOR_THRESHOLD_ETH ? ' is-live' : ''}` },
        item.status === 'context' ? text.context
          : floor >= FLOOR_THRESHOLD_ETH ? text.thresholdAbove : text.thresholdBelow),
      el('span', { class: 'nft-flag' },
        `${floorText}${Number.isFinite(live.floorUsd) ? ` · ${fmtUsd(live.floorUsd, 0)}` : ''}`),
      Number.isFinite(live.floorChange24h)
        ? el('span', { class: `nft-flag ${live.floorChange24h >= 0 ? 'up' : 'down'}` },
          `${fmtPct(live.floorChange24h, 1)} / 24h`)
        : null,
      Number.isFinite(live.marketCapUsd)
        ? el('span', { class: 'nft-flag' }, `${fmtUsd(live.marketCapUsd)} ${text.cap}`)
        : null,
      /* Collections refresh in slices, so a value a few minutes old is normal
         and not worth flagging. Say so only once it is genuinely lagging. */
      live.stale && live.ageMs > 10 * 60_000
        ? el('span', { class: 'nft-flag' },
          `floor read ${Math.round(live.ageMs / 60_000)}m ago`)
        : null,
    );
  } else {
    snapshot.replaceChildren(
      el('span', { class: `nft-flag${item.status === 'confirmed' ? ' is-live' : ''}` }, item.statusLabel),
    );
  }
}

function renderArticle() {
  const text = ui();
  item = localizeNft2026(sourceItem, getLocale());
  $('docKicker').textContent =
    `${text.caseStudy} · ${item.chain} · ${fmtResearchDate(item.launch, localeTag())}`;
  $('docTitle').replaceChildren(item.name, el('span', { class: 'doc-sym' }, item.short));
  $('docStandfirst').textContent = item.standfirst;

  $('docThesis').textContent = item.thesis;
  $('docNarrative').textContent = item.narrative;
  $('docWhy').replaceChildren(el('p', {}, item.whyItPumped));

  $('docSuccessClaim').textContent = item.success.claim;
  $('docSuccessMarkers').replaceChildren(...item.success.markers.map((marker) =>
    el('li', {}, marker)));

  $('docFactors').replaceChildren(...item.factors.map((factor) => el('li', { class: 'doc-factor' },
    el('strong', {}, factor.label),
    el('span', {}, factor.detail),
  )));

  $('docTriggers').replaceChildren(...item.triggers.map((trigger) => el('li', { class: 'doc-trigger' },
    el('time', { datetime: trigger.d }, fmtResearchDate(trigger.d, localeTag())),
    el('p', {}, trigger.t),
  )));

  $('docIdentity').replaceChildren(
    el('div', { class: 'identity-item' },
      el('span', {}, text.creator),
      el('strong', {}, item.creator),
    ),
    el('div', { class: 'identity-item' },
      el('span', {}, text.detail),
      el('strong', {}, item.launchNote),
    ),
    el('div', { class: 'identity-item' },
      el('span', {}, text.market),
      el('a', { href: item.marketplace, target: '_blank', rel: 'noreferrer' }, text.collection),
    ),
    el('div', { class: 'identity-item' },
      el('span', {}, text.peakNote),
      el('strong', {}, item.peakFloor?.note || text.unavailable),
    ),
    item.contract ? el('div', { class: 'identity-item is-wide' },
      el('span', {}, 'Contract'), el('code', {}, item.contract)) : null,
  );

  $('docSources').replaceChildren(...[
    { label: text.collection, url: item.marketplace, note: text.marketNote },
    item.official ? { label: text.official, url: item.official, note: text.siteNote } : null,
    item.officialX ? { label: text.social, url: item.officialX, note: text.socialNote } : null,
    item.coingecko ? { label: 'CoinGecko', url: item.coingecko, note: 'floor history' } : null,
    ...item.sources.map(([label, url]) => ({ label, url, note: new URL(url).hostname })),
  ].filter(Boolean).filter((source, index, rows) => rows.findIndex((row) => row.url === source.url) === index)
    .map((source) => brandedSourceLink(source)));
}

function renderChart() {
  renderFloorChart($('floorChart'), item.floorMilestones, {
    liveFloor: live?.floorNative ?? null,
    currency: live?.currency || item.peakFloor?.currency || 'ETH',
  });
}

async function refresh({ force = false } = {}) {
  const snapshot = await fetchNftFloors({ force, slugs: ['stonkbrokers', 'pyopyopyopyo'] });
  live = snapshot.collections?.[item.slug] || null;
  if (live?.image) $('docLogo').src = live.image;
  renderMeta();
  renderChart();
  $('updatedAt').textContent = fmtClock(snapshot.fetchedAt);
  setStatus(live ? ui().ready : (getLocale() === 'id' ? 'Floor langsung tidak tersedia · catatan bersumber ditampilkan' : 'Live floor unavailable · sourced record shown'), live ? 'ok' : 'busy');
}

function init() {
  if (!sourceItem) {
    setStatus('Unknown collection', 'err');
    return;
  }
  renderArticle();
  renderMeta();
  renderChart();

  refresh().catch((error) => {
    console.warn('NFT floors:', error.message);
    setStatus('Live floor unavailable · sourced record shown', 'err');
  });

  startAutoRefresh([{ every: 60_000, run: () => refresh({ force: true }) }]);
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderChart, 180);
  });
  window.addEventListener('themechange', renderChart);
  window.addEventListener('localechange', () => {
    renderArticle();
    renderMeta();
    renderChart();
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
