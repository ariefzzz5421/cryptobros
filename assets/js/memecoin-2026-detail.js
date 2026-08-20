import { fmtClock, fmtPct, fmtPrice, fmtUsd, el } from './utils.js';
import { brandedSourceLink } from './source-brands.js';
import { startAutoRefresh } from './autorefresh.js';
import { fetchDexLaunch, renderDexScreenerChart } from './dexscreener.js';
import { findToken } from './token-registry.js';
import { renderTokenLore } from './token-lore.js';

const $ = (id) => document.getElementById(id);
const slug = document.body.dataset.event;
let eventRecord = null;
let dexLaunchPayload = null;

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

const fmtDate = (value) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value));

async function fetchRecords() {
  const response = await fetch('/api/market/?resource=meme2026', {
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Backend HTTP ${response.status}`);
  const data = await response.json();
  if (!data?.ok) throw new Error(data?.error || 'Research record unavailable');
  return data;
}

function renderCurrent(data) {
  const record = data.events.find((event) => event.id === slug);
  if (!record) throw new Error('This research record was not found');
  eventRecord = record;
  const registryToken = findToken({ id: record.marketId || record.id }) || findToken({ id: slug });
  renderTokenLore($('tokenLore'), registryToken || {
    id: record.id,
    symbol: record.symbol,
    name: record.name,
    chain: record.chain,
    contract: record.contract,
    explorer: record.explorer,
  });

  if (record.current?.image) $('eventLogo').src = record.current.image;
  const ath = record.priceAth;
  const athSnapshot = $('athSnapshot');
  if (athSnapshot) {
    athSnapshot.replaceChildren(
      el('div', {},
        el('span', {}, 'Price ATH'),
        el('strong', { class: 'num' }, ath ? fmtPrice(ath.price) : 'Unavailable'),
        ath?.at ? el('small', {}, fmtDate(ath.at)) : null,
      ),
      el('div', { class: 'is-emphasis' },
        el('span', {}, 'Launch → ATH'),
        el('strong', { class: 'num' }, Number.isFinite(ath?.daysFromLaunch)
          ? `${ath.daysFromLaunch} days`
          : 'Unavailable'),
        el('small', {}, ath ? 'UTC calendar days · CoinGecko' : 'No sourced ATH date'),
      ),
    );
  }
  const live = $('liveSnapshot');
  if (record.current) {
    live.replaceChildren(
      el('div', { class: 'is-emphasis' },
        el('span', {}, 'Current market cap'),
        el('strong', { class: 'num' }, fmtUsd(record.current.mcap)),
      ),
      el('div', {},
        el('span', {}, 'Price · 24h'),
        el('strong', { class: `num ${Number(record.current.ch24h) >= 0 ? 'up' : 'down'}` },
          `${fmtPrice(record.current.price)} · ${fmtPct(record.current.ch24h, 1)}`),
      ),
    );
  } else {
    live.replaceChildren(
      el('div', {},
        el('span', {}, 'Current snapshot'),
        el('strong', {}, 'Unavailable'),
      ),
      el('div', {},
        el('span', {}, 'Record'),
        el('strong', {}, 'Historical evidence remains valid'),
      ),
    );
  }

  const social = record.officialX
    ? { label: record.socialLabel || 'X', url: record.officialX, note: 'public account' }
    : { label: 'X unavailable', url: 'https://x.com/', note: record.socialNote, disabled: true };
  const sources = [
    { label: 'CoinGecko', url: record.coingecko, note: 'market record' },
    { label: 'Contract explorer', url: record.explorer, note: 'contract address' },
    social,
    ...record.evidence,
  ].filter((source, index, rows) =>
    source.url && rows.findIndex((item) => item.url === source.url) === index);
  $('eventSources').replaceChildren(...sources.map((source) => brandedSourceLink({
    ...source,
    className: 'source-button',
  })));
  $('updatedAt').textContent = fmtClock(data.fetchedAt);
  setStatus(data.partial ? 'Article ready · live snapshot partial' : 'Article and live snapshot ready', data.partial ? 'busy' : 'ok');
}

async function loadDex() {
  const registryToken = findToken({ id: eventRecord?.marketId || eventRecord?.id }) || findToken({ id: slug });
  const data = await fetchDexLaunch(registryToken || {
    id: eventRecord?.marketId || eventRecord?.id || slug,
    chain: eventRecord?.chain,
    contract: eventRecord?.contract,
  });
  dexLaunchPayload = data;
  if (!eventRecord?.current && data.pair) {
    $('liveSnapshot').replaceChildren(
      el('div', { class: 'is-emphasis' },
        el('span', {}, 'Current DEX snapshot'),
        el('strong', { class: 'num' }, Number.isFinite(data.pair.marketCap)
          ? fmtUsd(data.pair.marketCap)
          : Number.isFinite(data.pair.fdv) ? `${fmtUsd(data.pair.fdv)} FDV` : fmtPrice(data.pair.priceUsd)),
      ),
      el('div', {},
        el('span', {}, 'Price · 24h'),
        el('strong', { class: `num ${Number(data.pair.change24h) >= 0 ? 'up' : 'down'}` },
          `${fmtPrice(data.pair.priceUsd)} · ${fmtPct(data.pair.change24h, 1)}`),
      ),
    );
  }
  renderDexScreenerChart(
    $('eventDexChart'),
    data.pair,
    eventRecord?.name || slug,
    data,
  );
}

async function refreshRecord() {
  renderCurrent(await fetchRecords());
}

async function init() {
  try {
    await refreshRecord();
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadDex().catch((error) => {
        $('eventDexChart').replaceChildren(el('p', { class: 'dex-empty-note' }, error.message));
      }), { timeout: 800 });
    } else {
      setTimeout(() => loadDex().catch((error) => {
        $('eventDexChart').replaceChildren(el('p', { class: 'dex-empty-note' }, error.message));
      }), 0);
    }
  } catch (error) {
    console.error(error);
    setStatus('Live snapshot unavailable · article remains ready', 'err');
    $('liveSnapshot').replaceChildren(el('div', {},
      el('span', {}, 'Current snapshot'), el('strong', {}, 'Unavailable')));
  }

  startAutoRefresh([{ every: 10_000, run: refreshRecord }]);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
