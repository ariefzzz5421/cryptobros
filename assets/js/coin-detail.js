import { fmtUsd, fmtPrice, fmtPct, fmtClock, el } from './utils.js';
import { CASES } from './cases-config.js';
import { fetchDexLaunch, renderDexScreenerChart } from './dexscreener.js';
import { brandedSourceLink } from './source-brands.js';
import {
  findToken,
  tokenDetailHref,
  unresolvedToken,
} from './token-registry.js';
import { renderTokenLore } from './token-lore.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const request = {
  id: params.get('id'),
  chain: params.get('chain'),
  contract: params.get('contract'),
  symbol: params.get('symbol'),
  name: params.get('name'),
};

const CHAIN_NAMES = {
  ethereum: 'Ethereum',
  solana: 'Solana',
  bsc: 'BNB Chain',
  base: 'Base',
  robinhood: 'Robinhood Chain',
  dogecoin: 'Dogecoin',
  arbitrum: 'Arbitrum',
  polygon: 'Polygon',
  avalanche: 'Avalanche',
  optimism: 'Optimism',
  hyperliquid: 'Hyperliquid',
  megaeth: 'MegaETH',
  monad: 'Monad',
};

let token = findToken(request) || unresolvedToken({
  id: request.id,
  symbol: request.symbol,
  name: request.name || (request.id ? request.id.replaceAll('-', ' ') : 'Unknown token'),
  chain: request.chain,
  contract: request.contract,
});
let tokenPayload = null;
let dexLaunchPayload = null;

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

const fmtDate = (value) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Unavailable';
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
};

function displayChain(value) {
  const key = String(value || '').trim().toLowerCase();
  if (!key) return 'Unavailable';
  return CHAIN_NAMES[key] || `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

function fact(label, value, note = '', emphasis = false) {
  return el('article', { class: `dossier-stat${emphasis ? ' is-emphasis' : ''}` },
    el('span', {}, label),
    el('strong', { class: 'num' }, value),
    note ? el('small', {}, note) : null,
  );
}

async function writeClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Clipboard API unavailable');
}

function copyIcon() {
  return el('img', {
    src: '/assets/img/sources/copy.svg',
    alt: '',
    width: '20',
    height: '20',
    'aria-hidden': 'true',
  });
}

function contractFact(contract) {
  const value = String(contract || '').trim();
  if (!value) return fact('Contract', 'Unavailable', 'not verified');
  if (value.toLowerCase() === 'native') return fact('Contract', 'Native asset', 'no token contract');

  const button = el('button', {
    class: 'contract-copy-button',
    type: 'button',
    title: 'Copy contract address',
    'aria-label': 'Copy contract address',
  }, copyIcon());

  button.addEventListener('click', async () => {
    try {
      await writeClipboard(value);
      button.classList.add('is-copied');
      button.title = 'Copied';
      button.setAttribute('aria-label', 'Contract address copied');
      button.replaceChildren(el('span', { class: 'copy-check', 'aria-hidden': 'true' }, '✓'));
      window.setTimeout(() => {
        button.classList.remove('is-copied');
        button.title = 'Copy contract address';
        button.setAttribute('aria-label', 'Copy contract address');
        button.replaceChildren(copyIcon());
      }, 1400);
    } catch (error) {
      console.warn('Copy contract:', error.message);
    }
  });

  return el('article', { class: 'dossier-stat contract-identity-stat' },
    el('span', {}, 'Contract'),
    el('div', { class: 'contract-copy-row' },
      el('code', { class: 'contract-address-full' }, value),
      button,
    ),
    el('small', {}, 'canonical identity'),
  );
}

function knownCase() {
  return CASES.find((item) => item.id === token.coingeckoId || item.id === token.id) || null;
}

function tokenSources() {
  return [
    token.officialX ? { label: 'X', url: token.officialX } : null,
    token.officialSite ? { label: 'Site', url: token.officialSite, logo: token.logo } : null,
    token.explorer ? { label: 'Explorer', url: token.explorer, note: 'exact contract' } : null,
    token.launchpadVerifiedSource ? {
      label: 'Launchpad provenance',
      url: token.launchpadVerifiedSource,
    } : null,
    ...(tokenPayload?.sources || []),
    dexLaunchPayload?.pair?.url ? { label: 'DEX Screener', url: dexLaunchPayload.pair.url } : null,
  ]
    .filter(Boolean)
    .filter((source, index, rows) => rows.findIndex((item) => item.url === source.url) === index);
}

function renderIdentity() {
  const name = token.name || tokenPayload?.coin?.name || token.id || 'Unknown token';
  const symbol = token.symbol || tokenPayload?.coin?.sym || '—';
  document.title = `${name} (${symbol}) — Token Research`;
  $('tokenName').textContent = name;
  $('tokenSym').textContent = symbol;
  $('crumbToken').textContent = symbol;
  $('tokenLogo').src = tokenPayload?.coin?.image || token.logo || '/assets/img/brand/crypto-bros-hex.svg';
  $('tokenLogo').alt = `${name} logo`;
  renderTokenLore($('tokenLore'), token);

  $('tokenIdentity').replaceChildren(
    fact('Chain', displayChain(token.chain), token.contract === 'native' ? 'native asset' : ''),
    contractFact(token.contract),
    token.explorer
      ? el('a', { class: 'identity-explorer-link', href: token.explorer, target: '_blank', rel: 'noreferrer' },
        el('span', {}, 'Explorer'), el('strong', {}, 'Verify contract'))
      : fact('Explorer', 'Unavailable', 'No verified explorer link'),
  );
}

function renderMarket() {
  const coin = tokenPayload?.coin || null;
  const launch = dexLaunchPayload?.launch;
  const currentPrice = Number.isFinite(coin?.price)
    ? coin.price
    : Number.isFinite(dexLaunchPayload?.pair?.priceUsd)
      ? dexLaunchPayload.pair.priceUsd : null;
  const currentMcap = Number.isFinite(coin?.mcap)
    ? coin.mcap
    : Number.isFinite(dexLaunchPayload?.pair?.marketCap)
      ? dexLaunchPayload.pair.marketCap
      : null;
  const summary = [
    Number.isFinite(currentPrice) ? `Price ${fmtPrice(currentPrice)}` : null,
    Number.isFinite(currentMcap) ? `market cap ${fmtUsd(currentMcap)}` : null,
    Number.isFinite(coin?.ch24h) ? `24h ${fmtPct(coin.ch24h, 1)}` : null,
  ].filter(Boolean);
  $('tokenSummary').textContent = summary.length
    ? `${summary.join(' · ')}.`
    : 'Market research unavailable for this token.';

  const caseDefinition = knownCase();
  const athPrice = Number.isFinite(coin?.ath) ? coin.ath : null;
  const athTimestamp = coin?.athDate ? Date.parse(coin.athDate) : null;
  const launchTimestamp = Date.parse(caseDefinition?.launch || '');
  const daysToAth = Number.isFinite(launchTimestamp) && Number.isFinite(athTimestamp)
    ? Math.max(0, Math.round((athTimestamp - launchTimestamp) / 86_400_000))
    : null;
  const facts = [
    caseDefinition ? fact('Launch date', fmtDate(caseDefinition.launch), caseDefinition.launchNote, true) : null,
    fact('First 15m close', Number.isFinite(launch?.price) ? fmtPrice(launch.price) : 'Unavailable',
      launch?.source || 'No public 15m candle returned'),
    fact(
      launch?.metricKind === 'FDV estimate' ? 'First 15m FDV' : 'First 15m market cap',
      Number.isFinite(launch?.valuation) ? fmtUsd(launch.valuation) : 'Unavailable',
      launch?.methodology || 'No value is interpolated',
    ),
    fact('Current price', Number.isFinite(currentPrice) ? fmtPrice(currentPrice) : 'Unavailable',
      Number.isFinite(coin?.ch24h) ? `${fmtPct(coin.ch24h, 1)} / 24h` : ''),
    fact('Market cap', Number.isFinite(currentMcap) ? fmtUsd(currentMcap) : 'Unavailable',
      coin?.rank ? `Rank #${coin.rank}` : dexLaunchPayload?.pair ? 'DEX Screener exact pair' : ''),
    fact('Price ATH', Number.isFinite(athPrice) ? fmtPrice(athPrice) : 'Unavailable',
      Number.isFinite(athTimestamp) ? fmtDate(athTimestamp) : ''),
    fact('Launch → price ATH', Number.isFinite(daysToAth) ? `${daysToAth} days` : 'Unavailable',
      Number.isFinite(daysToAth) ? 'UTC calendar days · CoinGecko ATH date'
        : Number.isFinite(athTimestamp) ? 'Launch date unavailable' : 'No sourced ATH date'),
  ].filter(Boolean);
  $('caseFacts').replaceChildren(...facts);
  renderDexScreenerChart(
    $('dexScreenerChart'),
    dexLaunchPayload?.pair || token.dexScreener || null,
    token.name,
    dexLaunchPayload,
  );
  $('sourceLinks').replaceChildren(...tokenSources().map((source) => brandedSourceLink(source)));
  $('updatedAt').textContent = fmtClock(
    tokenPayload?.fetchedAt || dexLaunchPayload?.fetchedAt || Date.now(),
  );
}

function mergeIdentity(payload) {
  const identity = payload?.identity || {};
  const curated = findToken(identity) || findToken({ id: identity.coingeckoId || request.id });
  token = {
    ...unresolvedToken({
      id: identity.id || request.id,
      name: identity.name || payload?.coin?.name || token.name,
      symbol: identity.symbol || payload?.coin?.sym || token.symbol,
      chain: identity.chain || token.chain,
      contract: identity.contract || token.contract,
      explorer: identity.explorer || token.explorer,
      image: payload?.coin?.image || token.logo,
    }),
    ...(curated || {}),
    name: curated?.name || identity.name || payload?.coin?.name || token.name,
    symbol: curated?.symbol || identity.symbol || payload?.coin?.sym || token.symbol,
    chain: curated?.chain || identity.chain || token.chain,
    contract: curated?.contract || identity.contract || token.contract,
    explorer: curated?.explorer || identity.explorer || token.explorer,
    coingeckoId: curated?.coingeckoId || identity.coingeckoId || token.coingeckoId,
  };
  if (token.chain && token.contract && (request.chain !== token.chain || request.contract !== token.contract)) {
    history.replaceState(null, '', tokenDetailHref(token));
  }
}

async function fetchToken() {
  const query = new URLSearchParams({ resource: 'token' });
  if (request.id) query.set('id', request.id);
  if (request.chain) query.set('chain', request.chain);
  if (request.contract) query.set('contract', request.contract);
  const response = await fetch(`/api/market/?${query}`, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Token backend HTTP ${response.status}`);
  const payload = await response.json();
  if (!payload?.ok) throw new Error(payload?.error || 'Token research unavailable');
  tokenPayload = payload;
  mergeIdentity(payload);
  renderIdentity();
  renderMarket();
  return payload;
}

async function fetchDex() {
  dexLaunchPayload = await fetchDexLaunch(token);
  renderMarket();
}

async function init() {
  renderIdentity();
  renderMarket();
  setStatus('Identity ready · loading live market data…', 'busy');

  const tokenResult = await fetchToken().catch((error) => {
    console.warn('Token snapshot:', error.message);
    return null;
  });
  const [dexResult] = await Promise.allSettled([fetchDex()]);
  if (dexResult.status === 'rejected') console.warn('DEX:', dexResult.reason.message);
  renderMarket();

  if (!tokenResult && !dexLaunchPayload?.pair) {
    setStatus('Verified identity ready · market research unavailable', 'err');
  } else if (!tokenResult || !dexLaunchPayload?.pair) {
    setStatus('Token research ready · some market sources unavailable', 'busy');
  } else {
    setStatus('Token research ready', 'ok');
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
