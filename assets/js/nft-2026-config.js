/* ============================================================
   nft-2026-config.js — NFT collections that broke 0.1 ETH in 2026.

   Inclusion rule: the collection launched in 2026 and its floor is publicly
   documented above THRESHOLD_2026_ETH. The 2026 story is almost entirely
   Robinhood Chain: the Arbitrum-based L2 opened its public mainnet on July 1,
   2026 and its NFT market went from nothing to competing with CryptoPunks on
   the OpenSea rankings inside three weeks.

   Collections screened and excluded are listed at the bottom with their floors,
   so the threshold is visible as a filter rather than a claim.
   ============================================================ */

export const THRESHOLD_2026_ETH = 0.1;

export const RESEARCH_CUTOFF_2026 = '2026-08-08';

export const NFT_2026 = [
  {
    id: 'stonkbrokers',
    slug: 'stonkbrokers',
    name: 'StonkBrokers',
    short: 'STONK',
    chain: 'Robinhood Chain',
    supply: 4444,
    launch: '2026-07-17',
    launchNote: 'Free mint on the Robinhood Chain mainnet, sixteen days after the network opened',
    mint: 'Free mint',
    creator: 'StonkBrokers team; pixel-art collection native to Robinhood Chain',
    official: 'https://www.stonkbrokers.vip/home/',
    marketplace: 'https://opensea.io/collection/stonkbrokers-434284142',
    coingecko: 'https://www.coingecko.com/en/nft/stonkbrokers-434284142',
    logo: '/assets/img/nft/stonkbrokers.svg',
    logoFallback: '/assets/img/nft/stonkbrokers.svg',
    peakFloor: { eth: 7.69, label: '≈7.69 ETH', at: '2026-08', note: 'OpenSea floor; Forbes recorded 6.63 ETH in the same window' },
    standfirst: 'The largest new NFT launch of 2026. Free to mint on a chain that was two weeks old, and trading multiple ETH a month later on a market cap near $55M.',
    narrative: 'Free mint on a brand-new chain',
    thesis: 'StonkBrokers priced the chain, not the art. Being the defining collectible on a network that Robinhood itself was pushing meant the floor tracked belief in Robinhood Chain’s future more than anything specific to 4,444 pixel brokers.',
    whyItPumped: 'Robinhood Chain opened its public mainnet on July 1, 2026, and for a few weeks it had users, incentives, and almost no native culture. StonkBrokers minted free on July 17 into that vacuum and became the collection people bought to express a view on the chain. With no mint cost to recover, every holder was in profit from the first trade, so early supply came off the book fast. Within weeks the floor was multiple ETH against a market cap near $55M held by only 576 owners — extreme concentration that cuts both ways.',
    success: {
      claim: 'Success here is scale from a standing start: a free mint on a two-week-old chain reached a floor most 2021 blue chips no longer hold.',
      markers: [
        'Floor between 6.63 and 7.69 ETH within roughly three weeks of a free mint.',
        'Collection market cap near $55M on 4,444 pieces.',
        'One of seven Robinhood Chain projects to clear 1,500 ETH in combined volume in the first month.',
        'Became the reference collectible for the chain rather than one project among many.',
      ],
    },
    factors: [
      { label: 'A chain with no native culture yet', detail: 'Robinhood Chain had users and incentives from day one but nothing to collect, so the first credible collection absorbed all of that attention.' },
      { label: 'Zero cost basis', detail: 'A free mint means no holder needs a price to break even, which removes the overhang that a paid mint creates.' },
      { label: 'Robinhood’s own distribution', detail: 'The network is operated by Robinhood Crypto, so the audience arriving on-chain came through a mainstream broker rather than crypto Twitter.' },
      { label: 'Only 576 owners', detail: 'Concentration that thin amplifies the floor in both directions; a handful of sellers can reprice the collection.' },
    ],
    triggers: [
      { d: '2026-07-01', t: 'Robinhood Chain opens its public mainnet, an Arbitrum-based Ethereum L2 operated by Robinhood Crypto.' },
      { d: '2026-07-17', t: 'StonkBrokers free-mints 4,444 pixel brokers on the new mainnet.' },
      { d: '2026-07', t: 'Seven Robinhood Chain NFT projects clear 1,500 ETH in combined trading volume; StonkBrokers is among the largest.' },
      { d: '2026-08', t: 'Floor documented between 6.63 and 7.69 ETH, with a collection market cap near $55M across 576 owners.' },
    ],
    floorMilestones: [
      { d: '2026-07', eth: 0, label: 'Free mint' },
      { d: '2026-08', eth: 7.69, label: 'Documented floor' },
      { d: '2026-08', eth: null, label: 'Live floor', live: true },
    ],
    sources: [
      ['StonkBrokers official', 'https://www.stonkbrokers.vip/home/'],
      ['OpenSea collection', 'https://opensea.io/collection/stonkbrokers-434284142'],
      ['CoinGecko floor record', 'https://www.coingecko.com/en/nft/stonkbrokers-434284142'],
      ['Forbes · floor and market cap', 'https://www.forbes.com/digital-assets/nfts/stonkbrokers-stonkbrokers/'],
      ['Airdrop Alert · launch background', 'https://airdropalert.com/blogs/what-are-stonkbrokers-nfts-robinhood/'],
    ],
  },
  {
    id: 'chain-mancers',
    slug: 'chain-mancers',
    name: 'Chain Mancers',
    short: 'MANCER',
    chain: 'Robinhood Chain',
    supply: 5000,
    launch: '2026-07',
    launchNote: 'One per allowlist spot; the burn was the price, and the art is fully on-chain',
    mint: 'Free mint via burn',
    creator: 'Clutch Markets with Michael Hirsch of Blockhash',
    official: 'https://chainmancers.com/',
    marketplace: 'https://opensea.io/collections/chain/robinhood',
    coingecko: 'https://www.coingecko.com/en/nft/chains/robinhood',
    logo: '/assets/img/nft/chain-mancers.svg',
    logoFallback: '/assets/img/nft/chain-mancers.svg',
    peakFloor: { eth: null, label: '≈$2,648 documented', at: '2026-08', note: 'quoted in USD by the sources; $1,684 and $2,222 were also recorded in the same window' },
    standfirst: 'The only 2026 collection in this set with a cash-flow story: holding a Mancer earns a share of the trading that runs through Robinhood Chain’s aggregator.',
    narrative: 'An NFT that earns from a DEX aggregator',
    thesis: 'Chain Mancers is closer to equity than to a profile picture. Mancer is being built as the trading and liquidity hub of Robinhood Chain — the Jupiter of that network — and the NFT is the instrument that receives a share of the flow. That gives the floor something to be valued against, which almost no PFP collection has.',
    whyItPumped: 'The mint cost nothing but a burn, one per allowlist spot, with the artwork sealed until reveal and stored fully on-chain. What repriced it was the utility: 3,750 pieces mint through the burn mechanic while 1,250 back the $MANCER liquidity pool, and holders earn from trading routed through the aggregator. As Robinhood Chain’s DEX volume grew past $3B, that claim became worth more, and the floor was documented rising 39.5% and 66.3% on consecutive readings.',
    success: {
      claim: 'Success here is a working revenue link: the collection is priced on trading volume it actually receives a share of, not on hope of a future airdrop.',
      markers: [
        'Floor documented around $2,648 after consecutive readings up 39.5% and 66.3%.',
        'Holders earn a share of flow through Robinhood Chain’s trading aggregator.',
        '3,750 of 5,000 minted through a burn; the remaining 1,250 back the $MANCER liquidity pool.',
        'Backed by a named team — Clutch Markets with Michael Hirsch of Blockhash — rather than an anonymous deployer.',
      ],
    },
    factors: [
      { label: 'Revenue share, not a roadmap', detail: 'The NFT receives a portion of aggregator trading flow, so it can be valued against a measurable number.' },
      { label: 'Infrastructure position', detail: 'Being the trading hub of a chain is a durable role; the collection benefits whenever the network is used at all.' },
      { label: 'Supply committed to liquidity', detail: '1,250 pieces back the token’s liquidity pool rather than sitting with flippers.' },
      { label: 'Chain-dependency is the risk', detail: 'The claim is only worth what Robinhood Chain routes through it; the collection has no value independent of that network.' },
    ],
    triggers: [
      { d: '2026-07-01', t: 'Robinhood Chain opens its public mainnet and DEX volume begins to build.' },
      { d: '2026-07', t: 'Chain Mancers mints free — one per allowlist spot, the burn serving as the price — fully on-chain on Robinhood Chain.' },
      { d: '2026-07', t: 'Clutch Markets and Blockhash’s Michael Hirsch position Mancer as the chain’s trading and liquidity aggregator.' },
      { d: '2026-08', t: 'Floor documented near $2,648 after consecutive readings up 39.5% and 66.3%.' },
    ],
    floorMilestones: [
      { d: '2026-07', eth: 0, label: 'Burn mint' },
      { d: '2026-08', eth: null, label: 'Live floor', live: true },
    ],
    sources: [
      ['Chain Mancers official', 'https://chainmancers.com/'],
      ['Chain Mancers · the collection', 'https://chainmancers.com/collection'],
      ['eGamers · Clutch Markets and Blockhash on Mancer', 'https://egamers.io/clutch-markets-teams-with-blockhashs-michael-hirsch-on-mancer-an-aggregator-built-for-robinhood-chain/'],
      ['OpenSea · Robinhood Chain collections', 'https://opensea.io/collections/chain/robinhood'],
    ],
  },
  {
    id: 'pyopyopyopyo',
    slug: 'pyopyopyopyo',
    name: 'pyopyopyopyo',
    short: 'PYO',
    chain: 'Robinhood Chain',
    supply: 4444,
    launch: '2026-07',
    launchNote: 'Minted at 0.0014 ETH on Robinhood Chain',
    mint: '0.0014 ETH',
    creator: 'Anonymous team; community-led cultural PFP',
    official: 'https://opensea.io/collections/chain/robinhood',
    marketplace: 'https://opensea.io/collections/chain/robinhood',
    coingecko: 'https://www.coingecko.com/en/nft/chains/robinhood',
    logo: '/assets/img/nft/pyopyopyopyo.svg',
    logoFallback: '/assets/img/nft/pyopyopyopyo.svg',
    peakFloor: { eth: 0.11, label: '0.11 ETH', at: '2026-08', note: 'up from 0.045 ETH in late July and 0.0014 ETH at mint' },
    standfirst: 'A 0.0014 ETH mint that finished a July day ranked second on OpenSea behind CryptoPunks — after the founders of OpenSea and Robinhood both bought in.',
    narrative: 'Founders bought it, the ranking followed',
    thesis: 'pyopyopyopyo is the clearest 2026 example of endorsement as the entire mechanism. Nothing about the collection changed between a 0.0014 ETH mint and an OpenSea top-two finish except who was seen holding it.',
    whyItPumped: 'The collection minted at 0.0014 ETH as a soft, deliberately niche cultural PFP with no utility claim. Its floor had reached about 0.045 ETH by late July — already a 32x — when Devin Finzer, co-founder of OpenSea, and Vlad Tenev, founder of Robinhood, both bought in. On July 22 it finished the day second on OpenSea by volume behind CryptoPunks, with cumulative volume approaching 356.9 ETH, and the floor later broke 0.1 ETH.',
    success: {
      claim: 'Success here is reach: a niche collection on a three-week-old chain outranked almost every established collection on the largest NFT marketplace for a day.',
      markers: [
        'Ranked second on OpenSea by volume on July 22, behind only CryptoPunks.',
        'Floor moved from 0.0014 ETH at mint to about 0.045 ETH, then past 0.11 ETH — roughly 78x.',
        'Cumulative trading volume approaching 356.9 ETH by July 23.',
        'Bought by the co-founder of OpenSea and the founder of Robinhood, the two platforms the collection depends on.',
      ],
    },
    factors: [
      { label: 'Endorsement from the platform owners', detail: 'Purchases by Devin Finzer and Vlad Tenev signalled approval from the marketplace and the chain at the same moment.' },
      { label: 'A near-zero mint', detail: 'At 0.0014 ETH the collection distributed widely and cheaply, so a small amount of buying moved the floor a long way.' },
      { label: 'Deliberately soft aesthetic', detail: 'A gentle, fantastical style stood apart from the pixel-art collections dominating the chain.' },
      { label: 'The endorsement is the risk', detail: 'A price built on who was seen buying can unwind as quickly as attention moves on; there is no revenue or roadmap underneath.' },
    ],
    triggers: [
      { d: '2026-07', t: 'pyopyopyopyo mints 4,444 pieces at 0.0014 ETH on Robinhood Chain.' },
      { d: '2026-07', t: 'Devin Finzer, co-founder of OpenSea, and Vlad Tenev, founder of Robinhood, buy into the collection.' },
      { d: '2026-07-22', t: 'Finishes the day ranked second on OpenSea by volume, behind only CryptoPunks.' },
      { d: '2026-07-23', t: 'Cumulative trading volume approaches 356.9 ETH with the floor around 0.045 ETH.' },
      { d: '2026-08', t: 'Floor documented at 0.11 ETH, clearing the threshold for this register.' },
    ],
    floorMilestones: [
      { d: '2026-07', eth: 0.0014, label: 'Mint' },
      { d: '2026-07', eth: 0.045, label: 'Late July' },
      { d: '2026-08', eth: 0.11, label: 'Documented floor' },
      { d: '2026-08', eth: null, label: 'Live floor', live: true },
    ],
    sources: [
      ['KuCoin · Robinhood Chain NFT surge', 'https://www.kucoin.com/news/flash/robinhood-chain-nfts-surge-in-activity-seven-projects-hit-1500-eth-in-trading-volume'],
      ['OpenSea · Robinhood Chain is live', 'https://opensea.io/blog/articles/robinhood-chain-is-live-on-opensea'],
      ['OpenSea · Robinhood Chain collections', 'https://opensea.io/collections/chain/robinhood'],
    ],
  },
];

export const NFT_2026_BY_SLUG = Object.fromEntries(NFT_2026.map((item) => [item.slug, item]));

/* Screened and excluded. Publishing the near-misses keeps the threshold
   readable as a filter instead of an unfalsifiable claim. */
export const SCREENED_OUT = [
  { name: 'Gremlin Cartel', chain: 'Robinhood Chain', floor: '0.0228 ETH', note: '5,000 pixel gremlins; strong volume, floor never documented above the line', url: 'https://opensea.io/collection/gremlin-cartel' },
  { name: 'OnChainHoodies', chain: 'Robinhood Chain', floor: '0.0319 ETH', note: 'CC0, 5,999 supply; rose from 0.001 ETH at mint but stopped short of 0.1 ETH', url: 'https://www.forbes.com/digital-assets/nfts/onchainhoodies-onchainhoodies/' },
  { name: 'Robinhood Pengs', chain: 'Robinhood Chain', floor: '0.00018 ETH', note: '9,366 minted across 3,873 owners; far below the threshold', url: 'https://www.coingecko.com/en/nft/robinhood-pengs' },
  { name: 'Robinhood Trees', chain: 'Robinhood Chain', floor: '0.00028 ETH', note: '581 owners; below the threshold', url: 'https://www.forbes.com/digital-assets/nfts/robinhood-trees-robinhoodtrees/' },
];
