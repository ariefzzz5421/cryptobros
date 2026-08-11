import { startAutoRefresh } from './autorefresh.js';
import { localeTag } from './i18n.js';

const ICONS = {
  bitcoin: '/assets/img/coins/majors/btc.png',
  ethereum: '/assets/img/coins/majors/eth.png',
  solana: '/assets/img/coins/majors/sol.png',
  hyperliquid: '/assets/img/coins/majors/hype.png',
  zcash: '/assets/img/coins/majors/zec.png',
};

const root = document.querySelector('[data-market-ticker]');
let latest = null;

function price(value) {
  if (!Number.isFinite(value)) return '—';
  const maximumFractionDigits = value >= 1_000 ? 0 : value >= 1 ? 2 : value >= 0.01 ? 4 : 7;
  return new Intl.NumberFormat(localeTag(), {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value);
}

function item(asset, duplicate = false) {
  const change = Number.isFinite(asset.change24h) ? asset.change24h : null;
  const node = document.createElement('span');
  node.className = 'market-tape-item';
  node.dataset.tickerKey = `${asset.id}:${duplicate ? 'b' : 'a'}`;
  node.title = `${asset.name} · ${asset.source}`;
  node.setAttribute('aria-hidden', duplicate ? 'true' : 'false');
  node.innerHTML = `
    <img src="${ICONS[asset.id]}" alt="" width="22" height="22" decoding="async">
    <strong>${asset.symbol}</strong>
    <span class="market-tape-price num">${price(asset.price)}</span>
    <span class="market-tape-change num ${change == null ? '' : change >= 0 ? 'up' : 'down'}">${change == null ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}</span>
  `;
  return node;
}

function group(assets, duplicate = false) {
  const node = document.createElement('span');
  node.className = 'market-tape-group';
  node.setAttribute('aria-hidden', duplicate ? 'true' : 'false');
  node.replaceChildren(...assets.map((asset) => item(asset, duplicate)));
  return node;
}

function render(data) {
  latest = data;
  const message = root.querySelector('[data-ticker-error]');
  if (message) message.hidden = true;
  root.setAttribute('aria-label', 'Live crypto prices, updated automatically');
  root.dataset.state = data.partial ? 'partial' : 'ready';
  root.querySelector('.market-tape-track')?.replaceChildren(
    group(data.assets),
    group(data.assets, true),
  );
  const stamp = root.querySelector('[data-ticker-updated]');
  if (stamp) stamp.textContent = new Intl.DateTimeFormat(localeTag(), {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(new Date(data.fetchedAt));
}

async function refresh() {
  const bucket = Math.floor(Date.now() / 10_000);
  const response = await fetch(`/api/market/?resource=ticker&t=${bucket}`, {
    headers: { accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Ticker HTTP ${response.status}`);
  const data = await response.json();
  if (!data?.ok || !Array.isArray(data.assets) || !data.assets.length) {
    throw new Error(data?.error || 'Ticker unavailable');
  }
  render(data);
}

function init() {
  if (!root) return;
  refresh().catch(() => {
    root.dataset.state = 'error';
    const message = root.querySelector('[data-ticker-error]');
    if (message) message.hidden = false;
  });
  startAutoRefresh([{ every: 10_000, run: refresh }]);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
