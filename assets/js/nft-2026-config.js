/* 2026 NFT research register.

   Confirmed entries launched in 2026 and have a public marketplace record
   above 0.1 ETH. Context entries remain available as requested research, but
   are never counted as qualifiers when their launch year or quote currency is
   outside that rule. Values are observations, not invented conversions. */

export const THRESHOLD_2026_ETH = 0.1;
export const RESEARCH_CUTOFF_2026 = '2026-08-09';

export const NFT_2026 = [
  {
    id: 'stonkbrokers',
    slug: 'stonkbrokers',
    status: 'confirmed',
    statusLabel: 'Confirmed >0.1 ETH',
    name: 'StonkBrokers',
    short: 'STONK',
    chain: 'Robinhood Chain',
    supply: 4444,
    launch: '2026-07-17',
    launchNote: 'Free mainnet mint; fixed supply of 4,444 ERC-721s with ERC-6551 token-bound accounts',
    mint: 'Free mint',
    creator: 'Clutch Markets',
    contract: '0x539cdd042c2f3d93ebc5be7dfff0c79f3b4fabf0',
    official: 'https://www.stonkbrokers.cash/',
    officialX: 'https://x.com/ClutchMarkets',
    marketplace: 'https://opensea.io/collection/stonkbrokers-434284142',
    coingecko: 'https://www.coingecko.com/en/nft/stonkbrokers-434284142',
    logo: '/assets/img/nft/stonkbrokers.png',
    logoFallback: '/assets/img/nft/stonkbrokers.png',
    peakFloor: {
      eth: 9.7,
      label: '9.70 ETH',
      at: '2026-08-09',
      note: 'CoinGecko public API observation on 9 Aug 2026; live floor can change',
    },
    narrative: 'Robinhood Chain identity with on-chain stock-token utility',
    standfirst: 'A free mint became Robinhood Chain’s reference NFT by pairing first-mover culture with token-bound wallets funded by stock tokens.',
    thesis: 'The market priced StonkBrokers as both the chain’s native identity and an access object for the wider Stonk Exchange system—not only as pixel art.',
    whyItPumped: 'Robinhood Chain had distribution and speculative attention but little native culture when StonkBrokers minted. A free entry price widened participation, while the ERC-6551 wallets and stock-token rewards gave buyers a concrete utility story. Scarce listings and concentrated ownership then made each purchase move the visible floor quickly.',
    success: {
      claim: 'It counts as a 2026 success because it cleared the threshold, sustained meaningful secondary volume, and developed working on-chain utility after mint.',
      markers: [
        'CoinGecko recorded a 9.70 ETH floor and about $82.7M collection cap on 9 Aug 2026.',
        'The official documentation confirms 4,444 minted-out ERC-721 items with ERC-6551 wallets.',
        'Each broker can hold stock-token rewards and participate in the project’s on-chain distribution system.',
        'The move began from a free mint, making the repricing easy to measure.',
      ],
    },
    factors: [
      { label: 'First credible native collectible', detail: 'The collection absorbed attention that had few established alternatives on the new chain.' },
      { label: 'Free distribution', detail: 'No paid mint overhang lowered the initial barrier and created a clear zero-to-secondary-market story.' },
      { label: 'Utility users can verify', detail: 'ERC-6551 wallets and stock-token reward mechanics are documented on the official site and visible on-chain.' },
      { label: 'Thin ownership', detail: 'A relatively small owner set can push a floor higher, but it can also accelerate a reversal.' },
    ],
    triggers: [
      { d: '2026-07-01', t: 'Robinhood Chain opens its public mainnet.' },
      { d: '2026-07-17', t: 'The 4,444-piece StonkBrokers collection completes its free mint.' },
      { d: '2026-07', t: 'Secondary trading establishes it as one of the chain’s first reference collections.' },
      { d: '2026-08-09', t: 'CoinGecko’s public API records a 9.70 ETH floor and roughly $82.7M collection cap.' },
    ],
    floorMilestones: [
      { d: '2026-07-17', eth: 0, label: 'Free mint' },
      { d: '2026-08-09', eth: 9.7, label: 'Public snapshot' },
      { d: '2026-08-09', eth: null, label: 'Live floor', live: true },
    ],
    sources: [
      ['Official documentation', 'https://www.stonkbrokers.cash/docs'],
      ['Official X · Clutch Markets', 'https://x.com/ClutchMarkets'],
      ['Contract explorer', 'https://robinhoodchain.blockscout.com/address/0x539cdd042c2f3d93ebc5be7dfff0c79f3b4fabf0'],
      ['Robinhood Chain documentation', 'https://robinhood.com/us/en/support/articles/robinhood-chain-testnet/'],
    ],
    translations: {
      id: {
        statusLabel: 'Terkonfirmasi >0,1 ETH',
        narrative: 'Identitas Robinhood Chain dengan utilitas token saham on-chain',
        standfirst: 'Free mint ini menjadi NFT rujukan Robinhood Chain karena menggabungkan posisi awal, budaya komunitas, dan wallet token-bound berisi token saham.',
        thesis: 'Pasar menilai StonkBrokers sebagai identitas native chain sekaligus akses ke ekosistem Stonk Exchange, bukan sekadar pixel art.',
        whyItPumped: 'Saat koleksi ini mint, Robinhood Chain sudah memiliki distribusi dan perhatian spekulatif tetapi belum punya budaya native yang kuat. Harga mint gratis memperluas partisipasi, sedangkan wallet ERC-6551 dan reward token saham memberi cerita utilitas yang nyata. Listing yang tipis kemudian membuat setiap pembelian lebih cepat menggerakkan floor.',
      },
    },
  },
  {
    id: 'pyopyopyopyo',
    slug: 'pyopyopyopyo',
    status: 'confirmed',
    statusLabel: 'Confirmed >0.1 ETH',
    name: 'pyopyopyopyo',
    short: 'PYO',
    chain: 'Robinhood Chain',
    supply: 4444,
    launch: '2026-07',
    launchNote: '4,444-piece PFP mint on Robinhood Chain; OpenSea preserves the launch month',
    mint: '0.0014 ETH',
    creator: 'pyovault',
    contract: '0x08dc7cb3f4ccc8eea782e2924d151e2130f22b28',
    official: 'https://opensea.io/collection/py0py0py0py0',
    officialX: null,
    marketplace: 'https://opensea.io/collection/py0py0py0py0',
    coingecko: null,
    logo: '/assets/img/nft/pyopyopyopyo.png',
    logoFallback: '/assets/img/nft/pyopyopyopyo.png',
    peakFloor: {
      eth: 0.1998,
      label: '0.1998 ETH',
      at: '2026-08-09',
      note: 'OpenSea public collection observation on 9 Aug 2026; listings can change',
    },
    narrative: 'A low-cost cultural PFP amplified by marketplace visibility',
    standfirst: 'A 0.0014 ETH mint built a recognizable soft-character identity, accumulated hundreds of ETH in volume, and later displayed a floor above 0.1 ETH on OpenSea.',
    thesis: 'pyopyopyopyo succeeded through distribution, visual distinctiveness, and social proof. The collection did not need a complicated utility promise to become the chain’s most legible cultural PFP.',
    whyItPumped: 'The very low mint cost let a wide base participate before attention arrived. Its soft, immediately recognizable artwork contrasted with the chain’s financial branding. OpenSea visibility and public purchases by prominent ecosystem figures accelerated discovery; after the ranking improved, buyers increasingly treated the collection as a cultural proxy for Robinhood Chain itself.',
    success: {
      claim: 'It counts as a success because the public market moved far beyond mint, the collection built meaningful secondary volume, and OpenSea displayed a floor above the 0.1 ETH rule.',
      markers: [
        'OpenSea displayed a 0.1998 ETH floor on 9 Aug 2026.',
        'The collection moved from a 0.0014 ETH mint to a documented floor more than 100× higher.',
        'OpenSea identifies 4,444 items and preserves the official collection contract.',
        'The collection developed a distinct community identity instead of relying on a promised revenue stream.',
      ],
    },
    factors: [
      { label: 'Low entry price', detail: 'A 0.0014 ETH mint distributed the collection cheaply before the attention cycle accelerated.' },
      { label: 'Recognizable visual language', detail: 'The soft character design was easy to identify in feeds and visually different from finance-themed projects.' },
      { label: 'Marketplace discovery', detail: 'OpenSea ranking visibility reduced discovery friction and turned activity into more activity.' },
      { label: 'Attention-dependent floor', detail: 'Without cash-flow utility, continued value depends heavily on culture, liquidity, and social attention.' },
    ],
    triggers: [
      { d: '2026-07', t: 'The 4,444-piece collection mints at 0.0014 ETH on Robinhood Chain.' },
      { d: '2026-07', t: 'Public purchases by prominent OpenSea and Robinhood ecosystem figures increase discovery.' },
      { d: '2026-07', t: 'The collection rises near the top of OpenSea’s daily volume ranking.' },
      { d: '2026-08-09', t: 'OpenSea displays a 0.1998 ETH floor, confirming the threshold event.' },
    ],
    floorMilestones: [
      { d: '2026-07', eth: 0.0014, label: 'Mint' },
      { d: '2026-07', eth: 0.045, label: 'Late-July record' },
      { d: '2026-08-09', eth: 0.1998, label: 'OpenSea snapshot' },
      { d: '2026-08-09', eth: null, label: 'Live floor', live: true },
    ],
    sources: [
      ['OpenSea collection and market record', 'https://opensea.io/collection/py0py0py0py0'],
      ['Contract explorer', 'https://robinhoodchain.blockscout.com/token/0x08dc7cb3f4ccc8eea782e2924d151e2130f22b28'],
      ['OpenSea · Robinhood Chain launch', 'https://opensea.io/blog/articles/robinhood-chain-is-live-on-opensea'],
    ],
    translations: {
      id: {
        statusLabel: 'Terkonfirmasi >0,1 ETH',
        narrative: 'PFP budaya berbiaya rendah yang terdorong visibilitas marketplace',
        standfirst: 'Mint 0,0014 ETH ini membangun identitas karakter yang mudah dikenali, mengumpulkan volume besar, lalu menampilkan floor di atas 0,1 ETH di OpenSea.',
        thesis: 'pyopyopyopyo berhasil melalui distribusi, gaya visual yang berbeda, dan social proof. Koleksi ini menjadi PFP budaya Robinhood Chain tanpa janji utilitas yang rumit.',
        whyItPumped: 'Harga mint yang sangat rendah memperluas distribusi sebelum perhatian datang. Desain lembutnya berbeda dari branding finansial chain. Visibilitas OpenSea dan pembelian publik dari figur ekosistem mempercepat discovery, lalu aktivitas pasar menarik aktivitas berikutnya.',
      },
    },
  },
  {
    id: 'mancers',
    slug: 'mancers',
    legacySlug: 'chain-mancers',
    status: 'context',
    statusLabel: '2026 ATH · outside rule',
    name: 'Mancers',
    short: 'MANCERS',
    chain: 'HyperEVM',
    supply: 1489,
    launch: '2025-08-19',
    launchNote: 'OpenSea contract creation date; the collection predates the 2026 launch rule',
    mint: '2025 launch',
    creator: 'Mancers team · deployer 0xa366…4a7f',
    contract: '0x64550c0f6bf961628ee395ec9d2348f03a2a92f4',
    official: 'https://mancers.xyz/',
    officialX: 'https://x.com/Mancers_hl',
    marketplace: 'https://opensea.io/collection/mancers-hyperevm',
    coingecko: 'https://www.coingecko.com/en/nft/mancers-hyperevm',
    logo: '/assets/img/nft/mancers.png',
    logoFallback: '/assets/img/nft/mancers.png',
    peakFloor: {
      eth: 5,
      currency: 'HYPE',
      label: '5.0 HYPE',
      at: '2026-01-30',
      note: 'CoinGecko ATH; not an ETH-denominated 0.1 ETH qualification',
    },
    narrative: 'A deflationary HyperEVM experiment that peaked in 2026',
    standfirst: 'Mancers reached a 5 HYPE all-time-high floor in January 2026, but it launched in 2025 and therefore appears as a context case—not a 2026 qualifier.',
    thesis: 'Mancers priced experimentation: evolving artwork, deflationary burn rituals, and native HyperEVM culture. Its later retracement shows why an early floor spike is not the same as durable success.',
    whyItPumped: 'The collection arrived early in HyperEVM’s NFT cycle with a strong native identity and a deflationary mechanic that visibly reduced supply. That combination concentrated collectors around a simple narrative. CoinGecko recorded a 5 HYPE ATH on 30 January 2026; OpenSea later showed a much lower floor, making it a useful full-cycle case rather than a clean 2026 launch winner.',
    success: {
      claim: 'It is historically important because it achieved a measurable 2026 ATH and experimented with on-chain evolution, but it does not satisfy this route’s launch-year and ETH-quote rule.',
      markers: [
        'CoinGecko recorded a 5.0 HYPE floor ATH on 30 Jan 2026.',
        'OpenSea records the collection on HyperEVM with its official contract and creator profile.',
        'The project used burn rituals to reduce supply and make holder choices affect collection state.',
        'Its large drawdown is shown as part of the history, not hidden behind the peak.',
      ],
    },
    factors: [
      { label: 'Early HyperEVM identity', detail: 'The collection gave a new chain a recognizable native art project before the category became crowded.' },
      { label: 'Deflationary participation', detail: 'Burn rituals turned supply reduction into a visible community event.' },
      { label: 'Evolving collection story', detail: 'Holder actions were connected to transformation rather than a static reveal.' },
      { label: 'Durability warning', detail: 'A steep retracement from the ATH shows that novelty and scarcity did not guarantee sustained liquidity.' },
    ],
    triggers: [
      { d: '2025-08-19', t: 'OpenSea records the Mancers contract on HyperEVM.' },
      { d: '2025', t: 'Deflationary burn rituals and evolving-art mechanics become the project’s core narrative.' },
      { d: '2026-01-30', t: 'CoinGecko records the collection’s 5.0 HYPE floor ATH.' },
      { d: '2026-08-09', t: 'The article keeps the lower current market visible to avoid survivorship bias.' },
    ],
    floorMilestones: [
      { d: '2025-08-19', eth: null, label: 'Launch' },
      { d: '2026-01-30', eth: 5, label: 'ATH' },
      { d: '2026-08-09', eth: null, label: 'Live floor', live: true },
    ],
    sources: [
      ['Official X · Mancers', 'https://x.com/Mancers_hl'],
      ['OpenSea collection record', 'https://opensea.io/collection/mancers-hyperevm'],
      ['Contract explorer', 'https://hyperevmscan.io/address/0x64550c0f6bf961628ee395ec9d2348f03a2a92f4'],
      ['CoinGecko floor history', 'https://www.coingecko.com/en/nft/mancers-hyperevm'],
    ],
    translations: {
      id: {
        statusLabel: 'ATH 2026 · di luar aturan',
        narrative: 'Eksperimen deflasi HyperEVM yang mencapai puncak pada 2026',
        standfirst: 'Mancers mencapai ATH floor 5 HYPE pada Januari 2026, tetapi launch pada 2025 sehingga ditampilkan sebagai studi konteks, bukan kualifikasi 2026.',
        thesis: 'Mancers menilai eksperimen: artwork yang berkembang, ritual burn deflasi, dan budaya native HyperEVM. Penurunan setelah ATH menunjukkan bahwa lonjakan awal tidak sama dengan keberhasilan yang tahan lama.',
        whyItPumped: 'Koleksi ini hadir lebih awal dalam siklus NFT HyperEVM dengan identitas native dan mekanisme deflasi yang mengurangi supply. Kombinasi tersebut membentuk narasi sederhana bagi kolektor. CoinGecko mencatat ATH 5 HYPE pada 30 Januari 2026; floor OpenSea setelahnya jauh lebih rendah, sehingga ini lebih tepat dibaca sebagai studi satu siklus penuh.',
      },
    },
  },
];

export const CONFIRMED_NFT_2026 = NFT_2026.filter((item) => item.status === 'confirmed');
export const CONTEXT_NFT_2026 = NFT_2026.filter((item) => item.status !== 'confirmed');
export const NFT_2026_BY_SLUG = Object.fromEntries(NFT_2026.flatMap((item) => [
  [item.slug, item],
  ...(item.legacySlug ? [[item.legacySlug, item]] : []),
]));

export const SCREENED_OUT = [
  { name: 'Gremlin Cartel', chain: 'Robinhood Chain', floor: '0.0228 ETH', note: 'Strong activity, but no public record above the line at the cutoff', url: 'https://opensea.io/collection/gremlin-cartel' },
  { name: 'OnChainHoodies', chain: 'Robinhood Chain', floor: '0.0319 ETH', note: 'Rose from a low mint but remained below 0.1 ETH', url: 'https://www.forbes.com/digital-assets/nfts/onchainhoodies-onchainhoodies/' },
  { name: 'Robinhood Pengs', chain: 'Robinhood Chain', floor: '0.00018 ETH', note: 'Public floor stayed far below the threshold', url: 'https://www.coingecko.com/en/nft/robinhood-pengs' },
];

export function localizeNft2026(item, locale = 'en') {
  return locale === 'id' ? { ...item, ...(item.translations?.id || {}) } : item;
}
