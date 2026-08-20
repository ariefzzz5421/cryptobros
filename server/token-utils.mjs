const PLATFORM_META = {
  ethereum: { chain: 'ethereum', explorer: (contract) => `https://etherscan.io/token/${contract}` },
  solana: { chain: 'solana', explorer: (contract) => `https://solscan.io/token/${contract}` },
  'binance-smart-chain': { chain: 'bsc', explorer: (contract) => `https://bscscan.com/token/${contract}` },
  base: { chain: 'base', explorer: (contract) => `https://basescan.org/token/${contract}` },
  'arbitrum-one': { chain: 'arbitrum', explorer: (contract) => `https://arbiscan.io/token/${contract}` },
  'polygon-pos': { chain: 'polygon', explorer: (contract) => `https://polygonscan.com/token/${contract}` },
  avalanche: { chain: 'avalanche', explorer: (contract) => `https://snowtrace.io/token/${contract}` },
  'avalanche-c-chain': { chain: 'avalanche', explorer: (contract) => `https://snowtrace.io/token/${contract}` },
  'optimistic-ethereum': { chain: 'optimism', explorer: (contract) => `https://optimistic.etherscan.io/token/${contract}` },
  robinhood: { chain: 'robinhood', explorer: (contract) => `https://robinhoodchain.blockscout.com/token/${contract}` },
  tron: { chain: 'tron', explorer: (contract) => `https://tronscan.org/#/token20/${contract}` },
  ton: { chain: 'ton', explorer: (contract) => `https://tonviewer.com/${contract}` },
  sui: { chain: 'sui', explorer: (contract) => `https://suiscan.xyz/mainnet/coin/${contract}` },
  aptos: { chain: 'aptos', explorer: (contract) => `https://explorer.aptoslabs.com/coin/${contract}?network=mainnet` },
};

export const PLATFORM_TO_DEX_CHAIN = Object.fromEntries(
  Object.entries(PLATFORM_META).map(([platform, meta]) => [platform, meta.chain]),
);

const EVM_CHAINS = new Set(['ethereum', 'bsc', 'base', 'arbitrum', 'polygon', 'avalanche', 'optimism', 'robinhood']);

export function normalizeChain(value) {
  return String(value || '').trim().toLowerCase();
}

export function sameContract(chain, left, right) {
  const a = String(left || '').trim();
  const b = String(right || '').trim();
  if (!a || !b) return false;
  return EVM_CHAINS.has(normalizeChain(chain)) ? a.toLowerCase() === b.toLowerCase() : a === b;
}

export function registryKey(chain, contract) {
  const normalizedChain = normalizeChain(chain);
  const value = String(contract || '').trim();
  if (!normalizedChain || !value) return '';
  return `${normalizedChain}:${EVM_CHAINS.has(normalizedChain) ? value.toLowerCase() : value}`;
}

export function primaryPlatformIdentity(row) {
  const entries = Object.entries(row?.platforms || {});
  for (const [platform, contract] of entries) {
    const meta = PLATFORM_META[platform];
    if (!meta || !String(contract || '').trim()) continue;
    return {
      chain: meta.chain,
      contract: String(contract).trim(),
      explorer: meta.explorer(String(contract).trim()),
      platform,
    };
  }
  return null;
}

export function buildCoinDirectory(rows = []) {
  const byId = new Map();
  const byContract = new Map();
  for (const row of rows) {
    const identities = Object.entries(row?.platforms || {}).flatMap(([platform, contract]) => {
      const meta = PLATFORM_META[platform];
      if (!meta || !String(contract || '').trim()) return [];
      const identity = {
        id: row.id,
        symbol: String(row.symbol || '').toUpperCase(),
        name: row.name,
        chain: meta.chain,
        contract: String(contract).trim(),
        explorer: meta.explorer(String(contract).trim()),
        platform,
      };
      byContract.set(registryKey(identity.chain, identity.contract), identity);
      return [identity];
    });
    byId.set(row.id, {
      id: row.id,
      symbol: String(row.symbol || '').toUpperCase(),
      name: row.name,
      identities,
      primary: identities[0] || null,
    });
  }
  return { byId, byContract };
}

export function resolveCoinIdentity(directory, { id, chain, contract } = {}) {
  if (chain && contract) {
    if (contract === 'native' && id === 'dogecoin') {
      return {
        id,
        coingeckoId: id,
        symbol: 'DOGE',
        name: 'Dogecoin',
        chain: 'dogecoin',
        contract: 'native',
        explorer: 'https://blockchair.com/dogecoin',
        platform: null,
        verified: true,
      };
    }
    const exact = directory?.byContract?.get(registryKey(chain, contract));
    if (exact) return { ...exact, coingeckoId: exact.id, verified: true };
    return {
      id: id || null,
      coingeckoId: null,
      symbol: null,
      name: null,
      chain: normalizeChain(chain),
      contract: String(contract).trim(),
      explorer: null,
      platform: null,
      verified: false,
    };
  }
  const byId = directory?.byId?.get(String(id || ''));
  if (!byId) return null;
  if (!byId.primary) {
    return {
      id: byId.id,
      coingeckoId: byId.id,
      symbol: byId.symbol,
      name: byId.name,
      chain: byId.id === 'dogecoin' ? 'dogecoin' : null,
      contract: byId.id === 'dogecoin' ? 'native' : null,
      explorer: byId.id === 'dogecoin' ? 'https://blockchair.com/dogecoin' : null,
      platform: null,
      verified: byId.id === 'dogecoin',
    };
  }
  return { ...byId.primary, coingeckoId: byId.id, verified: true };
}

export function enrichMarketCoins(coins = [], directory) {
  return coins.map((coin) => {
    const identity = resolveCoinIdentity(directory, { id: coin.id });
    return identity ? {
      ...coin,
      chain: identity.chain,
      contract: identity.contract,
      explorer: identity.explorer,
      identityVerified: identity.verified,
    } : { ...coin, chain: null, contract: null, explorer: null, identityVerified: false };
  });
}

export function pairMatchesContract(pair, chain, contract) {
  if (!pair || !chain || !contract) return false;
  return sameContract(chain, pair.baseToken?.address, contract)
    || sameContract(chain, pair.quoteToken?.address, contract);
}

export function chooseDexPair(rows = [], chain, contract) {
  const exact = [...rows]
    .filter((pair) => normalizeChain(pair.chainId) === normalizeChain(chain))
    .filter((pair) => pairMatchesContract(pair, chain, contract));
  const baseMatches = exact.filter((pair) => sameContract(chain, pair.baseToken?.address, contract));
  const baseFirst = baseMatches.length ? baseMatches : exact;
  const preferredQuotes = new Set([
    'USDC', 'USDT', 'USDG', 'SOL', 'WSOL', 'ETH', 'WETH', 'BNB', 'WBNB',
    'VIRTUAL', 'PONS', 'BONK',
  ]);
  const preferred = baseFirst.filter((pair) => preferredQuotes.has(String(pair.quoteToken?.symbol || '').toUpperCase()));
  return (preferred.length ? preferred : baseFirst)
    .sort((left, right) =>
      (Number(right?.liquidity?.usd) || 0) - (Number(left?.liquidity?.usd) || 0)
      || (Number(right?.volume?.h24) || 0) - (Number(left?.volume?.h24) || 0))[0] || null;
}

export function calculateMarketCapComparison(platformMarketCap, projectMarketCap) {
  if (!(platformMarketCap > 0) || !(projectMarketCap > 0)) return null;
  const platformToProjectMultiple = platformMarketCap / projectMarketCap;
  const projectToPlatformMultiple = projectMarketCap / platformMarketCap;
  return {
    platformToProjectMultiple,
    projectToPlatformMultiple,
    direction: platformToProjectMultiple >= 1 ? 'platform-larger' : 'project-larger',
  };
}

export function rankVerifiedLaunches(rows = [], { excludeIds = [], maximum = 10 } = {}) {
  const exclusions = new Set(excludeIds);
  const seen = new Set();
  return rows
    .filter((row) => row?.launchpadVerified === true)
    .filter((row) => row?.chain && row?.contract)
    .filter((row) => !exclusions.has(row.id))
    .sort((left, right) => {
      const leftHasMarket = Number.isFinite(left?.mcap) && left.mcap > 0;
      const rightHasMarket = Number.isFinite(right?.mcap) && right.mcap > 0;
      if (leftHasMarket !== rightHasMarket) return rightHasMarket ? 1 : -1;
      if (leftHasMarket) return right.mcap - left.mcap;
      return String(left?.name || left?.id || '').localeCompare(String(right?.name || right?.id || ''));
    })
    .filter((row) => {
      const key = registryKey(row.chain, row.contract);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.min(10, Math.max(0, maximum)));
}
