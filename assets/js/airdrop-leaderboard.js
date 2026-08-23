/* All-time airdrop leaderboard.

   Metric discipline matters here: this is NOT a distribution-day ranking.
   It ranks the tokens actually allocated to an airdrop at the token's ATH
   price (or the broadest documented distributed-allocation bucket where the
   source defines the airdrop that way). The existing case ranking remains the
   stricter distribution-day view.

   Legacy rows use CoinGecko's published historical ranking. 2024-2025 rows
   are reconstructed from official allocation disclosures plus CoinGecko ATH
   prices, with the formula visible per row. Research cutoff: 2026-08-21.
*/

export const AIRDROP_RESEARCH_CUTOFF = '2026-08-21';
export const AIRDROP_LEADERBOARD_SOURCE = 'https://www.coingecko.com/research/publications/biggest-crypto-airdrops';

const legacy = (rank, project, symbol, valueUsd, year, site, slug = null, round = null) => ({
  legacyRank: rank,
  project,
  symbol,
  valueUsd,
  year,
  site,
  slug,
  round,
  basis: 'CoinGecko historical peak-allocation value',
  sourceLabel: 'CoinGecko historical ranking',
  sourceHref: AIRDROP_LEADERBOARD_SOURCE,
});

const reconstructed = ({
  project, symbol, valueUsd, year, site, slug = null, round = null,
  allocation, ath, formula, sourceHref, marketHref,
}) => ({
  project,
  symbol,
  valueUsd,
  year,
  site,
  slug,
  round,
  allocation,
  ath,
  formula,
  basis: 'Distributed allocation × token ATH',
  sourceLabel: 'Allocation + ATH reconstruction',
  sourceHref,
  marketHref,
});

const rows = [
  reconstructed({
    project: 'Hyperliquid', symbol: 'HYPE', valueUsd: 23_829_700_000, year: 2024,
    site: 'hyperfoundation.org', slug: 'hyperliquid', allocation: '310M HYPE', ath: '$76.87',
    formula: '310M HYPE × $76.87 ATH',
    sourceHref: 'https://www.theblock.co/news/markets/2024-11-29-hyperliquid-airdrops-over-1-2-billion-worth-of-tokens-to-users-as-hype-crosses-4-billion-fdv-328769',
    marketHref: 'https://www.coingecko.com/en/coins/hyperliquid',
  }),
  legacy(1, 'Uniswap', 'UNI', 6_432_614_493, 2020, 'uniswap.org', 'uniswap'),
  legacy(2, 'ApeCoin', 'APE', 3_544_345_703, 2022, 'apecoin.com', 'apecoin'),
  reconstructed({
    project: 'Starknet', symbol: 'STRK', valueUsd: 3_201_660_000, year: 2024,
    site: 'starknet.io', slug: 'starknet', allocation: '726M STRK', ath: '$4.41',
    formula: '726M STRK × $4.41 ATH',
    sourceHref: 'https://www.starknet.io/faqs/',
    marketHref: 'https://www.coingecko.com/en/coins/starknet',
  }),
  reconstructed({
    project: 'Pudgy Penguins', symbol: 'PENGU', valueUsd: 3_043_439_111, year: 2024,
    site: 'pudgypenguins.com', slug: 'pudgy-penguins', allocation: '50.02% of 88.89B PENGU community buckets', ath: '$0.06845',
    formula: '44.46B PENGU × $0.06845 ATH',
    sourceHref: 'https://www.coingecko.com/learn/what-is-pengu-pudgy-penguins-token',
    marketHref: 'https://www.coingecko.com/en/coins/pudgy-penguins',
  }),
  legacy(3, 'dYdX', 'DYDX', 2_009_935_493, 2021, 'dydx.trade', 'dydx'),
  reconstructed({
    project: 'Jupiter', symbol: 'JUP', valueUsd: 2_000_000_000, year: 2024,
    site: 'jup.ag', slug: 'jupiter', allocation: '1B JUP', ath: '$2.00',
    formula: '1B JUP × $2.00 ATH',
    sourceHref: 'https://www.coingecko.com/learn/what-is-jupiter-crypto-solana',
    marketHref: 'https://www.coingecko.com/en/coins/jupiter',
  }),
  legacy(4, 'Arbitrum', 'ARB', 1_969_296_101, 2023, 'arbitrum.io', 'arbitrum'),
  legacy(5, 'Ethereum Name Service', 'ENS', 1_878_605_813, 2021, 'ens.domains', 'ens'),
  legacy(6, 'Internet Computer', 'ICP', 1_737_391_583, 2021, 'internetcomputer.org'),
  reconstructed({
    project: 'Story', symbol: 'IP', valueUsd: 1_478_000_000, year: 2025,
    site: 'story.foundation', allocation: '100M IP', ath: '$14.78 documented 2025 peak',
    formula: '100M IP × $14.78 peak',
    sourceHref: 'https://airdropalert.com/blogs/crypto-airdrop-data-2025/',
    marketHref: 'https://www.coingecko.com/en/coins/story',
  }),
  legacy(7, 'Bonk', 'BONK', 1_325_428_015, 2022, 'bonkcoin.com'),
  reconstructed({
    project: 'ZKsync', symbol: 'ZK', valueUsd: 1_179_675_000, year: 2024,
    site: 'zksync.io', allocation: '3.675B ZK', ath: '$0.3210',
    formula: '3.675B ZK × $0.3210 ATH',
    sourceHref: 'https://blog.zknation.io/introducing-the-zk-token/',
    marketHref: 'https://www.coingecko.com/en/coins/zksync',
  }),
  reconstructed({
    project: 'Berachain', symbol: 'BERA', valueUsd: 1_171_570_000, year: 2025,
    site: 'berachain.com', allocation: '~79M BERA', ath: '$14.83',
    formula: '~79M BERA × $14.83 ATH',
    sourceHref: 'https://airdropalert.com/blogs/crypto-airdrop-data-2025/',
    marketHref: 'https://www.coingecko.com/en/coins/berachain',
  }),
  reconstructed({
    project: 'Ethena', symbol: 'ENA', valueUsd: 1_140_000_000, year: 2024,
    site: 'ethena.fi', allocation: '750M ENA', ath: '$1.52',
    formula: '750M ENA × $1.52 ATH',
    sourceHref: 'https://www.theblock.co/news/defi/2024-03-27-ethena-labs-to-airdrop-750-million-ena-tokens-on-april-2-285212',
    marketHref: 'https://www.coingecko.com/en/coins/ethena',
  }),
  reconstructed({
    project: 'Wormhole', symbol: 'W', valueUsd: 1_024_718_000, year: 2024,
    site: 'wormhole.com', slug: 'wormhole', allocation: '617.3M W', ath: '$1.66',
    formula: '617.3M W × $1.66 ATH',
    sourceHref: 'https://wormhole.com/blog/w-tokenomics',
    marketHref: 'https://www.coingecko.com/en/coins/wormhole',
  }),
  legacy(8, 'Celestia', 'TIA', 728_380_235, 2023, 'celestia.org', 'celestia'),
  legacy(9, 'LooksRare', 'LOOKS', 712_335_336, 2022, 'looksrare.org'),
  legacy(10, '1inch Network', '1INCH', 670_872_722, 2020, '1inch.io', null, 1),
  legacy(11, 'Optimism', 'OP', 666_493_792, 2022, 'optimism.io', null, 1),
  reconstructed({
    project: 'EigenLayer', symbol: 'EIGEN', valueUsd: 638_450_000, year: 2024,
    site: 'eigenfoundation.org', allocation: '~113M EIGEN Season 1', ath: '$5.65',
    formula: '113M EIGEN × $5.65 ATH',
    sourceHref: 'https://blog.eigenfoundation.org/claims-s1-p1/',
    marketHref: 'https://www.coingecko.com/en/coins/eigencloud',
  }),
  reconstructed({
    project: 'LayerZero', symbol: 'ZRO', valueUsd: 634_950_000, year: 2024,
    site: 'layerzero.foundation', allocation: '85M ZRO', ath: '$7.47',
    formula: '85M ZRO × $7.47 ATH',
    sourceHref: 'https://www.theblock.co/news/ecosystems/2024-06-20-layerzero-foundation-to-begin-zro-token-airdrop-claims-today-300951',
    marketHref: 'https://www.coingecko.com/en/coins/layerzero',
  }),
  reconstructed({
    project: 'Blast', symbol: 'BLAST', valueUsd: 496_060_000, year: 2024,
    site: 'blast.io', allocation: '17B BLAST Phase 1', ath: '$0.02918',
    formula: '17B BLAST × $0.02918 ATH',
    sourceHref: 'https://assets.blast.io/en/q2-2024.pdf',
    marketHref: 'https://www.coingecko.com/en/coins/blast',
  }),
  legacy(12, 'Blur', 'BLUR', 446_197_003, 2023, 'blur.io', null, 1),
  legacy(13, 'Aptos', 'APT', 431_977_140, 2022, 'aptosfoundation.org'),
  legacy(14, 'Loot', 'AGLD', 387_786_055, 2021, 'lootproject.com'),
  legacy(15, 'Blur', 'BLUR', 371_830_836, 2023, 'blur.io', null, 2),
  legacy(16, 'Jito', 'JTO', 311_634_115, 2023, 'jito.network'),
  legacy(17, 'Gitcoin', 'GTC', 283_807_338, 2021, 'gitcoin.co'),
  legacy(18, 'ParaSwap', 'PSP', 232_604_859, 2021, 'paraswap.io'),
];

export const ALL_TIME_AIRDROP_TOP_30 = rows
  .sort((a, b) => b.valueUsd - a.valueUsd)
  .slice(0, 30)
  .map((item, index) => ({ ...item, rank: index + 1 }));

/* Use the user's supplied project artwork where available, then reuse existing
   repo-native token art. Projects without a stored image fall back to their
   official-domain favicon and finally to a compact symbol badge. */
const LOCAL_LOGOS = new Map(Object.entries({
  UNI: '/assets/img/airdrops/uniswap.webp',
  APE: '/assets/img/airdrops/apecoin.webp',
  /* the stored arbitrum.webp decodes at 64x64 but is entirely transparent */
  ARB: '/assets/img/airdrops/arbitrum.svg',
  ENS: '/assets/img/airdrops/ens.webp',
  HYPE: '/assets/img/airdrops/hyperliquid.webp',
  TIA: '/assets/img/airdrops/celestia.webp',
  '1INCH': '/assets/img/airdrops/1inch.webp',
  BONK: '/assets/img/coins/bonk.jpg',
  PENGU: '/assets/img/coins/pengu.png',
}));

export function airdropLogoUrl(item = {}) {
  const local = LOCAL_LOGOS.get(String(item.symbol || item.tokenSymbol || '').toUpperCase());
  if (local) return local;
  const domain = String(item.site || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  return domain ? `https://www.google.com/s2/favicons?domain_url=https://${domain}&sz=128` : '';
}

export function airdropInitials(item = {}) {
  const symbol = String(item.symbol || item.tokenSymbol || '').trim();
  if (symbol) return symbol.slice(0, 3).toUpperCase();
  return String(item.project || '?').split(/\s+/).map((word) => word[0]).join('').slice(0, 3).toUpperCase();
}
