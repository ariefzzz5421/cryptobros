/* Regenerate 2026-memecoins/{id}/index.html from sourced event research. */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const events = [
  {
    id: 'the-white-whale',
    name: 'The White Whale',
    symbol: 'WHITEWHALE',
    chain: 'Solana',
    cohort: 'Prior launch · crossed in 2026',
    launchAt: '2025-10-13',
    crossedAt: '2026-01-07',
    peak: '$200M',
    logo: '/assets/img/coins/the-white-whale.jpg',
    creator: 'Anonymous original deployer; later community takeover',
    contract: 'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump',
    explorer: 'https://solscan.io/token/a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump',
    narrative: 'Community-takeover revival',
    thesis: 'The event shows that attention can reprice an older launch when a community gives it a new identity. It does not prove that community takeovers are repeatable or liquid.',
    reason: 'The sourced crossing followed a fast speculative repricing and renewed community attention. Crypto Briefing documented the $100M event and 50x gains; that timing is evidence of correlation, not a single proven cause.',
    success: {
      claim: "Success here is a second life: an October 2025 launch that the market had largely forgotten was repriced to $100M three months later by its own holders.",
      markers: [
        "Documented $100M market-cap crossing on January 7, 2026.",
        "Crypto Briefing recorded roughly 50x gains around the threshold event.",
        "Survived the handover from an absent deployer to a community-run project.",
        "The counterweight: a quoted market cap is not exit capacity, and no verified issuer stands behind it.",
      ],
    },
    factors: [
      { label: "Attention can reprice an old launch", detail: "The token launched in October 2025; the documented crossing came on January 7, 2026, so the event was a repricing rather than a launch." },
      { label: "Community takeover as the story", detail: "After the original anonymous deployer stepped back the project ran as a community takeover, which became the narrative buyers traded." },
      { label: "Speed of the move", detail: "Crypto Briefing documented roughly 50x gains around the $100M event — a compressed move, not an accumulation." },
      { label: "Attribution stays qualified", detail: "No verified issuer is claimed, so the record separates the public narrative from proof of control." },
    ],
    triggers: [
      { d: "2025-10-13", t: "The White Whale launches on Solana under an anonymous deployer." },
      { d: "2026-01", t: "Renewed community attention reframes the token as a community-owned asset." },
      { d: "2026-01-07", t: "Documented $100M market-cap crossing; Crypto Briefing reports roughly 50x gains around the event." },
    ],
    article: [
      'The White Whale launched on Solana in October 2025. It belongs in this register because the documented $100M market-cap crossing happened on January 7, 2026—not because it was a new 2026 launch.',
      'Its market path was led by culture and community ownership rather than a product release. The original deployer remained anonymous and the project later operated as a community takeover, so issuer attribution stays qualified.',
      'The important research signal is the gap between launch and breakout. An older token can return to the market’s attention, but a quoted market cap does not reveal how much liquidity was available to buyers and sellers.',
    ],
    sources: [
      ['CoinGecko market record', 'https://www.coingecko.com/en/coins/the-white-whale'],
      ['Crypto Briefing · $100M event', 'https://cryptobriefing.com/whitewhale-memecoin-hits-100mn-with-50x-gains/'],
      ['Contract explorer', 'https://solscan.io/token/a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump'],
      ['X', 'https://x.com/WhiteWhaleMeme'],
    ],
  },
  {
    id: 'nietzschean-penguin',
    name: 'Nietzschean Penguin',
    symbol: 'PENGUIN',
    chain: 'Solana',
    cohort: '2026 launch',
    launchAt: '2026-01-17',
    crossedAt: '2026-01-24',
    peak: '$160M',
    logo: '/assets/img/coins/nietzschean-penguin.png',
    creator: 'Anonymous Pump.fun deployer; community-led token',
    contract: '8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump',
    explorer: 'https://solscan.io/token/8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump',
    narrative: 'Viral image meme meets anti-herd philosophy',
    thesis: 'PENGUIN converted a broadly understood visual meme into a liquid ticker during a concentrated attention window. The narrative was instantly legible, but the attention cycle was exceptionally fast.',
    reason: 'The crossing coincided with a viral social-media wave and a widely shared White House penguin post. Cointelegraph reported a market cap above $136M and $244M in 24-hour volume; the higher peak in this record comes from the linked market-history sources.',
    success: {
      claim: "Success here is reach per day alive: a January launch turned an image into a nine-figure ticker inside a week.",
      markers: [
        "Crossed $100M seven days after launching on Pump.fun.",
        "Cointelegraph documented a market cap above $136M against $244M of 24-hour volume.",
        "Carried by a meme legible without explanation, amplified through a White House social post.",
        "The counterweight: turnover larger than market cap is a crowd passing through, not holders arriving.",
      ],
    },
    factors: [
      { label: "An instantly legible image", detail: "A lone penguin walking away from its colony needed no explanation, so the story travelled faster than the contract." },
      { label: "A borrowed philosophical frame", detail: "Communities read the clip as a symbol of individualism, which gave the ticker a meaning beyond the picture." },
      { label: "Amplification from an unexpected account", detail: "A penguin image shared through a White House social account pushed the meme far outside crypto timelines." },
      { label: "A very short attention window", detail: "Cointelegraph recorded a market cap above $136M against $244M of 24-hour volume — turnover on that scale is not accumulation." },
    ],
    triggers: [
      { d: "2026-01-17", t: "Nietzschean Penguin launches on Pump.fun around a viral penguin clip." },
      { d: "2026-01", t: "A penguin image circulated through a White House social account accelerates attention." },
      { d: "2026-01-24", t: "Documented $100M market-cap crossing; Cointelegraph reports a market cap above $136M and $244M in 24-hour volume." },
    ],
    article: [
      'Nietzschean Penguin launched on Pump.fun in January 2026 around a viral clip of a lone penguin walking away from its colony. Online communities reframed the image as a symbol of individualism, which gave the token a clear story before most buyers ever saw its contract.',
      'Attention accelerated after a penguin image was shared through a White House social account. Public reporting recorded a sharp move in both market cap and trading volume, while exchange listings made the ticker easier to access.',
      'No single verified issuer account was found. The research therefore treats PENGUIN as a community-led market event and separates the public narrative from proof of who deployed or controlled the contract.',
    ],
    sources: [
      ['CoinGecko market record', 'https://www.coingecko.com/en/coins/nietzschean-penguin'],
      ['Cointelegraph · breakout report', 'https://cointelegraph.com/news/penguin-memecoin-surge-564-white-house'],
      ['CoinMarketCap Academy · breakout', 'https://coinmarketcap.com/academy/article/meme-coin-news-meme-coin-volumes-hit-2026-high-as-penguin-meme-sparks-breakout-and-more'],
      ['Contract explorer', 'https://solscan.io/token/8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump'],
    ],
  },
  {
    id: 'the-black-bull',
    name: 'The Black Bull',
    symbol: 'ANSEM',
    chain: 'Solana',
    cohort: '2026 launch',
    launchAt: '2026-06-16',
    crossedAt: '2026-06-29',
    peak: '$185M',
    logo: '/assets/img/coins/the-black-bull.jpg',
    creator: 'Anonymous deployer; community tribute to Ansem',
    contract: '9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump',
    explorer: 'https://solscan.io/token/9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump',
    narrative: 'Influencer-adjacent community tribute',
    thesis: 'ANSEM shows how a public persona can become a market narrative without proving that the referenced person created the token. That distinction is central to the dossier.',
    reason: 'The crossing coincided with intense community attention around Ansem and rapid Pump.fun distribution. Crypto Times documented the surge and also raised concentration concerns, so momentum and ownership risk must be read together.',
    success: {
      claim: "Success here is distribution speed — a tribute token with no product reached the threshold in under two weeks.",
      markers: [
        "Documented $100M crossing thirteen days after launch.",
        "Pump.fun distribution took it from a niche launch to a widely traded ticker.",
        "A first-in-market exchange listing widened access beyond on-chain venues.",
        "The counterweight: Crypto Times reported concentrated ownership alongside the surge.",
      ],
    },
    factors: [
      { label: "A public persona as the narrative", detail: "The token traded on its association with the trader known as Ansem, without any claim that he issued it." },
      { label: "Launchpad distribution speed", detail: "Pump.fun took the token from a niche launch to a widely discussed ticker in under two weeks." },
      { label: "Exchange access extended the reach", detail: "A first-in-market listing widened the buyer base beyond on-chain traders." },
      { label: "Concentration is the counterweight", detail: "Public reporting raised concerns about concentrated ownership, so the market-cap milestone and exit capacity must be read separately." },
    ],
    triggers: [
      { d: "2026-06-16", t: "The Black Bull appears on Solana as an anonymous community tribute to Ansem." },
      { d: "2026-06", t: "A first-in-market exchange listing extends access beyond on-chain venues." },
      { d: "2026-06-29", t: "Documented $100M crossing; Crypto Times reports the surge alongside concentrated-ownership concerns." },
    ],
    article: [
      'The Black Bull appeared on Solana in June 2026 as a community tribute to the trader known online as Ansem. The deployer was anonymous; linking Ansem’s public X account provides narrative context, not proof that he issued the token.',
      'The token moved from a niche launch into a widely discussed ticker in less than two weeks. That speed made the public identity around the meme more important than a conventional product roadmap.',
      'Public reporting also raised questions about concentrated ownership. A market-cap milestone can be real while the exit capacity available to holders remains much smaller, so the event should not be read as a quality score.',
    ],
    sources: [
      ['CoinGecko market record', 'https://www.coingecko.com/en/coins/the-black-bull'],
      ['Crypto Times · threshold event', 'https://www.cryptotimes.io/2026/06/29/inside-the-ansem-memecoin-surge-community-spirit-or-concentrated-control/'],
      ['MEXC contract listing', 'https://www.mexc.co/en-NG/announcements/article/first-in-market-17827791536536'],
      ['Contract explorer', 'https://solscan.io/token/9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump'],
    ],
  },
  {
    id: 'cash-cat',
    name: 'Cash Cat',
    symbol: 'CASHCAT',
    chain: 'Robinhood Chain',
    cohort: '2026 launch',
    launchAt: '2026-07-02',
    crossedAt: '2026-07-08',
    peak: '$156M',
    logo: '/assets/img/coins/cash-cat.jpg',
    creator: 'Anonymous deployer; not affiliated with Robinhood',
    contract: '0x020bfC650A365f8BB26819deAAbF3E21291018b4',
    explorer: 'https://robinhoodchain.blockscout.com/token/0x020bfC650A365f8BB26819deAAbF3E21291018b4',
    narrative: 'First breakout meme on a new chain',
    thesis: 'CASHCAT benefited from first-mover attention on Robinhood Chain and a memorable connection to Robinhood’s early mascot history. The project itself remained independent.',
    reason: 'The crossing arrived during the network’s first speculative activity wave. CoinDesk documented a market value above $100M, strong trading activity, and thin liquidity—evidence that visibility and exit capacity were very different numbers.',
    success: {
      claim: "Success here is a land-grab: being the first memecoin the market noticed on a brand-new chain was worth more than anything about the token itself.",
      markers: [
        "Crossed $100M six days after launching on a chain that was days old.",
        "Documented peak of $156M.",
        "Became the reference memecoin for Robinhood Chain’s opening weeks.",
        "The counterweight: CoinDesk recorded roughly $6.6M of liquidity behind that $100M+ valuation.",
      ],
    },
    factors: [
      { label: "First-mover position on a new chain", detail: "Being the first widely reported memecoin on Robinhood Chain concentrated the network's early speculative attention on one ticker." },
      { label: "A recognisable origin story", detail: "The name referenced an early Robinhood mascot, which made the token memorable without any endorsement from Robinhood." },
      { label: "New trading support", detail: "Fresh venue support arrived while the network was still establishing its identity, so access widened as attention peaked." },
      { label: "Liquidity far below market cap", detail: "CoinDesk documented a value above $100M against roughly $6.6M in liquidity — the gap is the risk." },
    ],
    triggers: [
      { d: "2026-07-02", t: "Cash Cat launches independently on Robinhood Chain shortly after the network opens." },
      { d: "2026-07-08", t: "Documented $100M market-cap crossing." },
      { d: "2026-07-09", t: "CoinDesk reports a market value above $100M alongside roughly $6.6M in liquidity." },
      { d: "2026-07-17", t: "Blockstream Media documents the $156M peak." },
    ],
    article: [
      'Cash Cat launched independently on Robinhood Chain shortly after the network opened. Its name referenced an early Robinhood mascot, but the token was not created or endorsed by Robinhood.',
      'The ticker became the chain’s first widely reported memecoin breakout. Novelty, a recognizable origin story, and new trading support helped concentrate attention while the network itself was still establishing its identity.',
      'CoinDesk reported a market value above $100M alongside roughly $6.6M in liquidity at the time. That gap is the central risk: a large quoted market cap does not mean every holder can exit near the displayed valuation.',
    ],
    sources: [
      ['CoinGecko market record', 'https://www.coingecko.com/en/coins/cash-cat'],
      ['CoinDesk · breakout and liquidity', 'https://www.coindesk.com/tech/2026/07/09/cashcat-trader-turns-usd800-into-over-usd1-million-on-robinhood-s-brand-new-blockchain'],
      ['Blockstream Media · $156M peak', 'https://blockstreammedia.com/2026/07/17/what-is-cashcat-robinhood-chains-memecoin/'],
      ['Contract explorer', 'https://robinhoodchain.blockscout.com/token/0x020bfC650A365f8BB26819deAAbF3E21291018b4'],
    ],
  },
  {
    id: 'troll',
    name: 'TROLL',
    symbol: 'TROLL',
    chain: 'Solana',
    cohort: 'Prior launch · recrossed in 2026',
    launchAt: '2025-04-20',
    crossedAt: '2026-05-10',
    peak: '$100M+ in 2026',
    logo: '/assets/img/coins/troll.png',
    creator: 'Anonymous deployer; community-led token',
    contract: '5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2',
    explorer: 'https://solscan.io/token/5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2',
    narrative: 'A survivor meme returned above the threshold',
    thesis: 'TROLL is different from a fresh 2026 launch: the market repriced an older, already-proven meme after listings, broader distribution, and renewed Solana meme rotation.',
    reason: 'Phemex documented a 77% one-day move on May 10, 2026, a $100M market-cap recross, and roughly 14,000 new holders in the same week. CoinGecko preserves the token’s earlier 2025 ATH, so the article labels this a recross rather than a first-ever breakout.',
    success: {
      claim: 'Success here is survival: an April 2025 token returned above $100M in a later cycle while much of its launch cohort disappeared.',
      markers: [
        'Phemex documented the May 10, 2026 move above $100M.',
        'The same report recorded roughly 14,000 new holders during the move week.',
        'CoinGecko tracks the market across many venues and preserves the earlier 2025 ATH.',
        'The route explicitly distinguishes a 2026 recross from the token’s first-ever threshold event.',
      ],
    },
    factors: [
      { label: 'Meme survival became the narrative', detail: 'An older token returning with an active market offered a different story from the constant flow of new launches.' },
      { label: 'Listings widened access', detail: 'Centralized and on-chain venues let buyers participate without relying on one DEX pool.' },
      { label: 'Holder growth supported the move', detail: 'Phemex reported about 14,000 new holders during the week of the recross.' },
      { label: 'No fundamental cash flow', detail: 'The token has no protocol revenue; continued value depends on culture, liquidity, and market attention.' },
    ],
    triggers: [
      { d: '2025-04-20', t: 'The principal PumpSwap pair begins trading on Solana.' },
      { d: '2025-08-22', t: 'CoinGecko records the token’s all-time-high price in the earlier cycle.' },
      { d: '2026-05-10', t: 'Phemex documents a 77% daily move, roughly 14,000 new weekly holders, and a recross above $100M.' },
      { d: '2026-06-01', t: 'Phemex publishes its retrospective of the 2026 revival.' },
    ],
    article: [
      'TROLL launched on Solana in April 2025 and had already traded above the threshold in its first cycle. It belongs in the 2026 register because a separate public source documented the token crossing $100M again on May 10, 2026.',
      'The revival combined broader exchange access, renewed rotation into established Solana memes, and visible holder growth. Phemex reported a 77% one-day move and roughly 14,000 new holders in the same week.',
      'That makes TROLL a survivor case, not a clean launch case. CoinGecko’s history keeps the 2025 ATH visible, and the article does not rename the 2026 recross as a first-ever breakout.',
    ],
    sources: [
      ['CoinGecko market record', 'https://www.coingecko.com/en/coins/troll-2'],
      ['Phemex · May 2026 recross', 'https://phemex.com/blogs/what-is-troll-solana-memecoin'],
      ['Site', 'https://trololol.io/'],
      ['X', 'https://x.com/trololol_io'],
      ['Contract explorer', 'https://solscan.io/token/5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2'],
    ],
  },
];

function date(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Trigger dates keep the granularity of their source: a month stays a month. */
function triggerDate(value) {
  const [year, month, day] = String(value).split('-');
  if (!month) return year;
  const name = MONTHS[Number(month) - 1] || month;
  return day ? `${name} ${Number(day)}, ${year}` : `${name} ${year}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function template(item) {
  const staticSources = item.sources.map(([label, url]) =>
    `<a class="source-button" href="${url}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`).join('');
  /* The first paragraph becomes the standfirst under the headline, so the
     body starts at the second one instead of repeating it. */
  const article = item.article.slice(1).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
  const markers = item.success.markers.map((marker) => `<li>${escapeHtml(marker)}</li>`).join('');
  const factors = item.factors.map((factor) =>
    `<li class="doc-factor"><strong>${escapeHtml(factor.label)}</strong><span>${escapeHtml(factor.detail)}</span></li>`).join('');
  const triggers = item.triggers.map((trigger) =>
    `<li class="doc-trigger"><time datetime="${trigger.d}">${triggerDate(trigger.d)}</time><p>${escapeHtml(trigger.t)}</p></li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${item.name} (${item.symbol}) — 2026 Memecoin Research</title>
<meta name="description" content="${item.name} research dossier: launch, $100M crossing, thesis, why it pumped, factors, dated triggers, contract attribution, and public market history.">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" type="image/png" href="/assets/img/brand/crypto-bros-favicon.png">
</head>
<body data-event="${item.id}">
<a class="skip" href="#article">Skip to research</a>
<header class="site-head">
  <div class="wrap head-inner">
    <a class="brand brand-link" href="/"><img class="brand-mark" src="/assets/img/brand/crypto-bros-mark.webp" alt="" width="44" height="44" decoding="async"><div><h1>Crypto Bros</h1><p class="brand-sub">Sourced market intelligence</p></div></a>
    <nav class="primary-nav"></nav>
    <div class="head-actions"><button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch theme"><span class="theme-icon theme-icon-sun" aria-hidden="true">☀</span><span class="theme-icon theme-icon-moon" aria-hidden="true">☾</span></button></div>
  </div>
  <div class="status-bar wrap"><span class="dot busy" id="statusDot"></span><span id="statusText">Article ready · loading market history</span></div>
</header>

<main class="wrap case-doc" id="article">
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/2026-memecoins/">Breakouts</a><span>/</span><span>${item.symbol}</span></nav>

  <header class="doc-masthead">
    <img class="doc-logo" id="eventLogo" src="${item.logo}" alt="${item.name} logo" width="104" height="104" decoding="async">
    <p class="doc-kicker">${escapeHtml(item.cohort)} · ${escapeHtml(item.chain)}</p>
    <h2 class="doc-title">${item.name} <span class="doc-sym">${item.symbol}</span></h2>
    <p class="doc-standfirst">${escapeHtml(item.article[0])}</p>
    <div class="doc-meta">
      <div><span>Launch</span><strong class="num">${date(item.launchAt)}</strong></div>
      <div class="is-emphasis"><span>$100M crossing</span><strong class="num">${date(item.crossedAt)}</strong></div>
      <div><span>Documented peak</span><strong class="num">${item.peak}</strong></div>
    </div>
    <div class="doc-meta" id="liveSnapshot" aria-live="polite"><div><span>Current snapshot</span><strong>Checking…</strong></div></div>
  </header>

  <section class="panel doc-section">
    <p class="eyebrow">Thesis</p>
    <h2>What this token actually priced</h2>
    <div class="doc-callouts">
      <div class="doc-callout is-accent"><h3>Thesis</h3><p>${escapeHtml(item.thesis)}</p></div>
      <div class="doc-callout"><h3>Narrative</h3><p>${escapeHtml(item.narrative)}</p></div>
    </div>
  </section>

  <section class="panel doc-section">
    <p class="eyebrow">Why it pumped</p>
    <h2>The move, and what was behind it</h2>
    <div class="doc-prose">${article}</div>
    <div class="doc-callout"><h3>Why it crossed $100M</h3><p>${escapeHtml(item.reason)}</p></div>
  </section>

  <section class="panel doc-section">
    <p class="eyebrow">Why it counts as a success</p>
    <h2>The case for calling this one a winner</h2>
    <p class="doc-lead">${escapeHtml(item.success.claim)}</p>
    <ul class="doc-markers">${markers}</ul>
  </section>

  <section class="panel doc-section">
    <p class="eyebrow">Reasons and factors</p>
    <h2>What carried the market cap</h2>
    <ul class="doc-factors">${factors}</ul>
  </section>

  <section class="panel doc-section event-history-panel">
    <div class="panel-head"><div><p class="eyebrow">Market history</p><h2>Launch-to-market chart</h2><p class="panel-sub">Public time-series data loads after the article. Missing data becomes a sourced event timeline; dates are never estimated.</p></div><span class="chart-load-state" id="chartLoadState">Loading chart…</span></div>
    <div class="market-history-chart" id="eventChart"><div class="chart-loading-shell"><span class="spinner"></span><p>Loading public market history…</p></div></div>
  </section>

  <section class="panel dex-panel" aria-label="On-chain DEX chart">
    <div id="eventDexChart"><div class="chart-loading-shell"><span class="spinner"></span><p>Checking the exact DEX pair…</p></div></div>
  </section>

  <section class="panel doc-section">
    <p class="eyebrow">Triggers</p>
    <h2>What triggered each move</h2>
    <ol class="doc-triggers">${triggers}</ol>
    <p class="doc-note">Triggers are publicly dated events correlated with the market-cap move — not proof of a single cause.</p>
  </section>

  <section class="panel doc-section">
    <p class="eyebrow">Identity</p>
    <h2>Creator and contract</h2>
    <div class="identity-grid">
      <div class="identity-item"><span>Creator / issuer</span><strong>${escapeHtml(item.creator)}</strong></div>
      <div class="identity-item"><span>Contract</span><a href="${item.explorer}" target="_blank" rel="noreferrer">${item.contract}</a></div>
    </div>
  </section>

  <section class="panel source-panel">
    <div><p class="eyebrow">Provenance</p><h2>Sources</h2></div>
    <div class="breakout-sources" id="eventSources">${staticSources}</div>
  </section>

  <p class="risk-line">⚠ A historical $100M market cap is not a liquidity guarantee or a repeatable trade setup. Avoid leverage and predefine a small position size.</p>
</main>
<footer class="site-foot wrap"><p>Research cutoff: 9 Aug 2026 · live snapshots: CoinGecko · <span id="updatedAt">—</span></p></footer>
<script type="module" src="/assets/js/theme.js"></script>
<script type="module" src="/assets/js/memecoin-2026-detail.js"></script>
</body>
</html>
`;
}

for (const event of events) {
  const directory = path.join(root, '2026-memecoins', event.id);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), template(event));
  console.log(`2026-memecoins/${event.id}/index.html`);
}
