/* ============================================================
   chain-brands.js — one table for every chain name and mark.

   Chain names arrive from three different places and in three different
   shapes: hand-written research config ("BNB Chain"), CoinGecko and
   DexScreener platform ids ("binance-smart-chain", "solana"), and DeFiLlama
   slugs. Each renderer used to carry its own partial map, so the same chain
   appeared as "Solana" on one route and "solana" on another, with a logo on
   one and nothing on the other.

   Everything resolves through canonicalChain() here, so a chain added once is
   named and illustrated the same way site-wide.
   ============================================================ */

/* Canonical display name -> official mark. */
const CHAINS = {
  Ethereum: { logo: '/assets/img/chains/ethereum.png' },
  Solana: { logo: '/assets/img/chains/solana.png' },
  'BNB Chain': { logo: '/assets/img/chains/bnb.svg' },
  Base: { logo: '/assets/img/chains/base.png' },
  Arbitrum: { logo: '/assets/img/chains/arbitrum.png' },
  Hyperliquid: { logo: '/assets/img/chains/hyperliquid.png' },
  'Robinhood Chain': { logo: '/assets/img/chains/robinhood.png' },
  MegaETH: { logo: '/assets/img/chains/megaeth.png' },
  Monad: { logo: '/assets/img/chains/monad.svg' },
  'X Layer': { logo: '/assets/img/chains/xlayer.png' },
  Dogecoin: { logo: '/assets/img/coins/doge.png' },
  Starknet: { logo: null },
  Celestia: { logo: null },
};

/* Every spelling seen in the wild, lower-cased, mapped to the canonical name. */
const ALIASES = new Map(Object.entries({
  eth: 'Ethereum',
  ethereum: 'Ethereum',
  'ethereum-mainnet': 'Ethereum',
  erc20: 'Ethereum',
  sol: 'Solana',
  solana: 'Solana',
  bsc: 'BNB Chain',
  bnb: 'BNB Chain',
  'bnb-chain': 'BNB Chain',
  binancecoin: 'BNB Chain',
  'binance-smart-chain': 'BNB Chain',
  base: 'Base',
  arbitrum: 'Arbitrum',
  'arbitrum-one': 'Arbitrum',
  hyperliquid: 'Hyperliquid',
  'hyperliquid-l1': 'Hyperliquid',
  hyperevm: 'Hyperliquid',
  robinhood: 'Robinhood Chain',
  'robinhood-chain': 'Robinhood Chain',
  megaeth: 'MegaETH',
  monad: 'Monad',
  xlayer: 'X Layer',
  'x-layer': 'X Layer',
  doge: 'Dogecoin',
  dogecoin: 'Dogecoin',
  starknet: 'Starknet',
  celestia: 'Celestia',
}));

/* A chain this table has never seen still gets a readable label rather than a
   raw slug: "some-new-chain" becomes "Some New Chain". */
function titleCase(value) {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word.length <= 3 && word === word.toUpperCase()
      ? word
      : word[0].toUpperCase() + word.slice(1).toLowerCase()))
    .join(' ');
}

export function canonicalChain(raw) {
  const key = String(raw ?? '').trim();
  if (!key) return { name: null, logo: null, known: false };
  const canonical = ALIASES.get(key.toLowerCase()) || (CHAINS[key] ? key : null);
  if (canonical) return { name: canonical, logo: CHAINS[canonical].logo, known: true };
  return { name: titleCase(key), logo: null, known: false };
}

/** Display name only — capitalised, never a raw lower-case slug. */
export function chainLabel(raw, fallback = 'Unavailable') {
  return canonicalChain(raw).name || fallback;
}

/**
 * Logo + capitalised name as one inline unit.
 * A chain with no stored mark renders the name alone rather than a broken
 * image or an empty box.
 */
export function chainBadge(raw, { size = 18, className = '' } = {}) {
  const chain = canonicalChain(raw);
  const node = document.createElement('span');
  node.className = `chain-badge${className ? ` ${className}` : ''}`;
  if (!chain.name) {
    node.textContent = 'Unavailable';
    node.classList.add('is-unknown');
    return node;
  }
  if (chain.logo) {
    const img = document.createElement('img');
    img.className = 'chain-badge-logo';
    img.src = chain.logo;
    img.alt = '';
    img.width = size;
    img.height = size;
    img.loading = 'lazy';
    img.decoding = 'async';
    /* A chain whose art fails to load falls back to the name, which is the
       information that actually matters. */
    img.addEventListener('error', () => img.remove(), { once: true });
    node.append(img);
  }
  node.append(Object.assign(document.createElement('span'), {
    className: 'chain-badge-name',
    textContent: chain.name,
  }));
  return node;
}

/** Several chains as one list, for tokens deployed on more than one network. */
export function chainBadges(list = [], options) {
  const node = document.createElement('span');
  node.className = 'chain-badge-set';
  const names = [...new Set(list.map((entry) => chainLabel(entry, '')).filter(Boolean))];
  if (!names.length) {
    node.textContent = 'Unavailable';
    return node;
  }
  names.forEach((name) => node.append(chainBadge(name, options)));
  return node;
}
