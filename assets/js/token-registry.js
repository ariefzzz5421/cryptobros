import { CASES } from './cases-config.js';

const CHAIN_ALIASES = new Map(Object.entries({
  dogecoin: 'dogecoin',
  Dogecoin: 'dogecoin',
  ethereum: 'ethereum',
  Ethereum: 'ethereum',
  solana: 'solana',
  Solana: 'solana',
  bsc: 'bsc',
  'BNB Chain': 'bsc',
  'binance-smart-chain': 'bsc',
  base: 'base',
  Base: 'base',
  robinhood: 'robinhood',
  Robinhood: 'robinhood',
  'Robinhood Chain': 'robinhood',
}));

const NETWORK_TO_CHAIN = {
  Dogecoin: 'dogecoin',
  Ethereum: 'ethereum',
  Solana: 'solana',
  'BNB Chain': 'bsc',
};

export const NATIVE_CONTRACT = 'native';

const EVM_CHAINS = new Set([
  'ethereum',
  'bsc',
  'base',
  'arbitrum',
  'polygon',
  'avalanche',
  'optimism',
  'robinhood',
]);

export function normalizeChain(value) {
  const chain = String(value || '').trim();
  return CHAIN_ALIASES.get(chain) || chain.toLowerCase();
}

export function registryKey(chain, contract) {
  const normalizedChain = normalizeChain(chain);
  const value = String(contract || '').trim();
  const normalizedContract = EVM_CHAINS.has(normalizedChain) ? value.toLowerCase() : value;
  return normalizedChain && normalizedContract ? `${normalizedChain}:${normalizedContract}` : '';
}

function caseLore(item) {
  return item.article.slice(0, 2).join(' ');
}

function caseSources(item, primaryContract) {
  return [
    item.officialX,
    item.officialSite,
    primaryContract?.explorer,
    item.coingecko,
    ...(item.researchSources || []).map((source) => source.url),
  ].filter(Boolean);
}

const CASE_TOKENS = CASES.map((item) => {
  const primaryContract = item.contracts[0];
  const chain = NETWORK_TO_CHAIN[primaryContract.network] || normalizeChain(primaryContract.network);
  const contract = primaryContract.address || NATIVE_CONTRACT;
  return {
    id: item.id,
    articlePath: `/cases/${item.slug}/`,
    symbol: item.sym,
    name: item.name,
    chain,
    contract,
    coingeckoId: item.id,
    logo: item.logo,
    officialSite: item.officialSite,
    officialX: item.officialX,
    explorer: primaryContract.explorer,
    launchpadId: null,
    launchpadVerifiedSource: null,
    lore: caseLore(item),
    loreSources: caseSources(item, primaryContract),
    dexScreener: item.dexScreener,
  };
});

const BREAKOUT_TOKENS = [
  {
    id: 'the-white-whale',
    articlePath: '/2026-memecoins/the-white-whale/',
    symbol: 'WHITEWHALE',
    name: 'The White Whale',
    chain: 'solana',
    contract: 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump',
    coingeckoId: 'the-white-whale',
    logo: '/assets/img/coins/the-white-whale.jpg',
    officialSite: null,
    officialX: 'https://x.com/WhiteWhaleMeme',
    explorer: 'https://solscan.io/token/a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump',
    lore: 'The White Whale is a Solana memecoin launched by an anonymous deployer in October 2025 and later presented as a community takeover. The takeover itself became the market narrative when attention returned in January 2026. Public sources document the community-led revival and market-cap event, but do not verify a named original creator.',
    loreSources: [
      'https://x.com/WhiteWhaleMeme',
      'https://solscan.io/token/a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump',
      'https://cryptobriefing.com/whitewhale-memecoin-hits-100mn-with-50x-gains/',
      'https://www.coingecko.com/en/coins/the-white-whale',
    ],
    launchpadId: null,
    launchpadVerifiedSource: null,
    dexScreener: { chain: 'solana', pairAddress: '4qxSqMh6iEdbdvtMp8r5MK2psAGKNk57PfGeVo2VhczQ', url: 'https://dexscreener.com/solana/4qxSqMh6iEdbdvtMp8r5MK2psAGKNk57PfGeVo2VhczQ' },
  },
  {
    id: 'nietzschean-penguin',
    articlePath: '/2026-memecoins/nietzschean-penguin/',
    symbol: 'PENGUIN',
    name: 'Nietzschean Penguin',
    chain: 'solana',
    contract: '8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump',
    coingeckoId: 'nietzschean-penguin',
    logo: '/assets/img/coins/nietzschean-penguin.png',
    officialSite: null,
    officialX: null,
    explorer: 'https://solscan.io/token/8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump',
    lore: 'Nietzschean Penguin is a community-led Solana token launched on Pump.fun around a viral clip of a lone penguin walking away from its colony. Online communities reframed the image as a symbol of individualism, creating a legible anti-herd narrative. No single verified issuer account has been found, so the meme origin and the anonymous deployer remain explicitly separated.',
    loreSources: [
      'https://solscan.io/token/8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump',
      'https://coinmarketcap.com/academy/article/meme-coin-news-meme-coin-volumes-hit-2026-high-as-penguin-meme-sparks-breakout-and-more',
      'https://www.kcex.com/support/articles/43234799829400',
      'https://www.coingecko.com/en/coins/nietzschean-penguin',
    ],
    launchpadId: 'pumpfun',
    launchpadVerifiedSource: 'https://www.coingecko.com/en/categories/pump-fun',
    dexScreener: { chain: 'solana', pairAddress: 'DRAf8QxQY86h7yeHdo9GytXAF6GoTTT8oZjknwXV6dCS', url: 'https://dexscreener.com/solana/DRAf8QxQY86h7yeHdo9GytXAF6GoTTT8oZjknwXV6dCS' },
  },
  {
    id: 'the-black-bull',
    articlePath: '/2026-memecoins/the-black-bull/',
    symbol: 'ANSEM',
    name: 'The Black Bull',
    chain: 'solana',
    contract: '9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump',
    coingeckoId: 'the-black-bull',
    logo: '/assets/img/coins/the-black-bull.jpg',
    officialSite: null,
    officialX: 'https://x.com/blknoiz06',
    explorer: 'https://solscan.io/token/9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump',
    lore: 'The Black Bull is an anonymous Solana community tribute to the trader known online as Ansem. The public person supplied the recognizable narrative, but the linked X account is context—not evidence that Ansem deployed or controlled the token. Attention grew as the tribute became a liquid market proxy for that public persona.',
    loreSources: [
      'https://x.com/blknoiz06',
      'https://solscan.io/token/9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump',
      'https://www.cryptotimes.io/2026/06/29/inside-the-ansem-memecoin-surge-community-spirit-or-concentrated-control/',
      'https://www.coingecko.com/en/coins/the-black-bull',
    ],
    launchpadId: 'pumpfun',
    launchpadVerifiedSource: 'https://www.coingecko.com/en/categories/pump-fun',
    dexScreener: { chain: 'solana', pairAddress: 'FnzKY6x7entQ1eR3D225dQyT7ybfka4PskBMQhb8L3CC', url: 'https://dexscreener.com/solana/FnzKY6x7entQ1eR3D225dQyT7ybfka4PskBMQhb8L3CC' },
  },
  {
    id: 'cash-cat',
    articlePath: '/2026-memecoins/cash-cat/',
    symbol: 'CASHCAT',
    name: 'Cash Cat',
    chain: 'robinhood',
    contract: '0x020bfC650A365f8BB26819deAAbF3E21291018b4',
    coingeckoId: 'cash-cat',
    logo: '/assets/img/coins/cash-cat.jpg',
    officialSite: null,
    officialX: 'https://x.com/cashcat_token',
    explorer: 'https://robinhoodchain.blockscout.com/token/0x020bfC650A365f8BB26819deAAbF3E21291018b4',
    lore: 'Cash Cat is an independently created Robinhood Chain memecoin that appeared shortly after the network opened. Its name referenced an early Robinhood mascot, giving the token an easy first-wave chain narrative. The project is not verified as created or endorsed by Robinhood, and the dossier keeps that distinction visible.',
    loreSources: [
      'https://x.com/cashcat_token',
      'https://robinhoodchain.blockscout.com/token/0x020bfC650A365f8BB26819deAAbF3E21291018b4',
      'https://www.coindesk.com/tech/2026/07/13/robinhood-built-a-blockchain-for-tokenized-stocks-memecoins-took-over',
      'https://www.coingecko.com/en/coins/cash-cat',
    ],
    launchpadId: null,
    launchpadVerifiedSource: null,
    dexScreener: { chain: 'robinhood', pairAddress: '0xA70fc67C9F69da90B63a0e4C05D229954574E313', url: 'https://dexscreener.com/robinhood/0xA70fc67C9F69da90B63a0e4C05D229954574E313' },
  },
  {
    id: 'troll-2',
    aliases: ['troll'],
    articlePath: '/2026-memecoins/troll/',
    symbol: 'TROLL',
    name: 'TROLL',
    chain: 'solana',
    contract: '5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2',
    coingeckoId: 'troll-2',
    logo: '/assets/img/coins/troll.png',
    officialSite: 'https://trololol.io/',
    officialX: 'https://x.com/trololol_io',
    explorer: 'https://solscan.io/token/5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2',
    lore: 'TROLL is an older Solana memecoin built around the long-running trollface internet meme. Its 2026 story was a recross above the research threshold rather than a fresh launch: renewed Solana meme attention and broader distribution revived an already traded asset. The deployer remains anonymous and the public project is community-led.',
    loreSources: [
      'https://trololol.io/',
      'https://x.com/trololol_io',
      'https://solscan.io/token/5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2',
      'https://www.coingecko.com/en/coins/troll-2',
    ],
    launchpadId: null,
    launchpadVerifiedSource: null,
    dexScreener: { chain: 'solana', pairAddress: '4w2cysotX6czaUGmmWg13hDpY4QEMG2CzeKYEQyK9Ama', url: 'https://dexscreener.com/solana/4w2cysotX6czaUGmmWg13hDpY4QEMG2CzeKYEQyK9Ama' },
  },
];

export const TOKEN_REGISTRY = Object.freeze([...CASE_TOKENS, ...BREAKOUT_TOKENS]);

const BY_KEY = new Map(TOKEN_REGISTRY.map((token) => [registryKey(token.chain, token.contract), token]));
const BY_ID = new Map();
for (const token of TOKEN_REGISTRY) {
  BY_ID.set(token.id, token);
  for (const alias of token.aliases || []) BY_ID.set(alias, token);
}

export function findToken({ chain, contract, id } = {}) {
  const exact = BY_KEY.get(registryKey(chain, contract));
  if (exact) return exact;
  return BY_ID.get(String(id || '').trim()) || null;
}

export function tokenDetailHref(token = {}) {
  const curated = findToken(token);
  const chain = normalizeChain(token.chain || curated?.chain);
  const contract = String(token.contract || curated?.contract || '').trim();
  const id = token.coingeckoId || token.id || curated?.coingeckoId || curated?.id;
  const params = new URLSearchParams();
  if (chain) params.set('chain', chain);
  if (contract) params.set('contract', contract);
  if (id) params.set('id', id);
  const symbol = token.symbol || token.sym || curated?.symbol;
  const name = token.name || curated?.name;
  if (symbol) params.set('symbol', symbol);
  if (name) params.set('name', name);
  return `/cases/detail/?${params}`;
}

export function unresolvedToken(input = {}) {
  return {
    id: input.id || null,
    symbol: String(input.symbol || input.sym || '').toUpperCase(),
    name: input.name || input.symbol || input.sym || 'Unknown token',
    chain: normalizeChain(input.chain),
    contract: input.contract || null,
    coingeckoId: input.coingeckoId || input.id || null,
    logo: input.logo || input.image || '/assets/img/brand/crypto-bros-mark.webp',
    officialSite: null,
    officialX: null,
    explorer: input.explorer || null,
    launchpadId: null,
    launchpadVerifiedSource: null,
    lore: null,
    loreSources: [],
    dexScreener: null,
  };
}
