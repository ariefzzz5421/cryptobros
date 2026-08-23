import { fmtClock, fmtUsd, el } from './utils.js';
import { tokenDetailHref } from './token-registry.js';
import { brandedSourceLink } from './source-brands.js';
import { rankBoard, rankCard } from './ranking-board.js';

const $ = (id) => document.getElementById(id);

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

function comparisonView(launchpad, project) {
  const comparison = project.platformComparison;
  const platformSymbol = launchpad.nativeToken?.symbol;
  if (!platformSymbol) {
    return el('div', { class: 'launchpad-ratio is-unavailable' },
      el('strong', {}, 'N/A'),
      el('small', {}, 'No verified native token'),
    );
  }
  if (!comparison) {
    return el('div', { class: 'launchpad-ratio is-unavailable' },
      el('strong', {}, 'N/A'),
      el('small', {}, 'Market cap comparison unavailable'),
    );
  }
  if (comparison.direction === 'platform-larger') {
    const multiple = comparison.platformToProjectMultiple;
    return el('div', { class: 'launchpad-ratio' },
      el('strong', { class: 'num' }, `1 : ${multiple.toFixed(2)}`),
      el('small', {}, `Project : ${platformSymbol} · ${platformSymbol} is ${multiple.toFixed(2)}× larger`),
    );
  }
  const multiple = comparison.projectToPlatformMultiple;
  return el('div', { class: 'launchpad-ratio' },
    el('strong', { class: 'num' }, `${multiple.toFixed(2)} : 1`),
    el('small', {}, `Project : ${platformSymbol} · project is ${multiple.toFixed(2)}× larger`),
  );
}

function metric(label, value, note = '') {
  return el('div', { class: 'launchpad-metric' },
    el('span', {}, label),
    el('strong', { class: 'num' }, value),
    note ? el('small', {}, note) : null,
  );
}

function tokenRow(launchpad, project, index) {
  const detailUrl = tokenDetailHref({
    ...project,
    coingeckoId: project.id,
  });
  return el('tr', {},
    el('td', { class: 'muted num' }, String(index + 1)),
    el('td', {}, el('a', { class: 'coin-cell launchpad-token-link', href: detailUrl },
      el('img', {
        class: 'row-logo', src: project.image || '/assets/img/brand/crypto-bros-hex.svg', alt: '',
        width: '30', height: '30', loading: 'lazy', decoding: 'async',
      }),
      el('span', {}, el('strong', {}, project.name), el('small', {}, project.sym)),
    )),
    el('td', { class: 'r num' },
      fmtUsd(project.mcap),
      project.marketSource ? el('small', { class: 'market-source-note' }, project.marketSource) : null),
    el('td', { class: 'r num' }, fmtUsd(project.vol)),
    el('td', {}, el('code', { class: 'contract-cell', title: project.contract }, project.contract)),
    el('td', {}, project.chain),
    el('td', {}, el('a', {
      class: 'provenance-badge', href: project.launchpadSource, target: '_blank', rel: 'noreferrer',
    }, 'Verified')),
    el('td', {}, comparisonView(launchpad, project)),
    el('td', { class: 'r' }, project.dexScreenerUrl
      ? brandedSourceLink({ label: 'DEX Screener', url: project.dexScreenerUrl, className: 'source-icon-link' })
      : el('span', { class: 'muted' }, '—')),
  );
}

/* The phone presentation of the same row. Market cap and 24h volume are what
   the page exists to show, so they are visible without any interaction; chain
   and platform ratio follow; contract, provenance and the chart link — the
   evidence a reader opens deliberately — sit behind a disclosure. */
function tokenCard(launchpad, project, index) {
  const detailUrl = tokenDetailHref({ ...project, coingeckoId: project.id });
  const platformSymbol = launchpad.nativeToken?.symbol;
  const comparison = project.platformComparison;
  const ratio = !platformSymbol || !comparison
    ? 'N/A'
    : comparison.direction === 'platform-larger'
      ? `1 : ${comparison.platformToProjectMultiple.toFixed(2)}`
      : `${comparison.projectToPlatformMultiple.toFixed(2)} : 1`;

  return rankCard({
    rank: String(index + 1),
    logo: el('img', {
      class: 'row-logo', src: project.image || '/assets/img/brand/crypto-bros-hex.svg', alt: '',
      width: '30', height: '30', loading: 'lazy', decoding: 'async',
    }),
    title: project.name,
    subtitle: `${project.sym} · ${project.chain}`,
    href: detailUrl,
    metrics: [
      { label: 'Market cap', value: fmtUsd(project.mcap), note: project.marketSource || null },
      { label: '24h volume', value: fmtUsd(project.vol) },
      {
        label: platformSymbol ? `Project : ${platformSymbol}` : 'Project : platform',
        value: ratio,
      },
    ],
    detailsLabel: 'Contract and provenance',
    details: [
      { label: 'Chain', value: project.chain },
      { label: 'Contract', value: el('code', { class: 'contract-cell' }, project.contract) },
      {
        label: 'Provenance',
        value: el('a', {
          class: 'provenance-badge', href: project.launchpadSource, target: '_blank', rel: 'noreferrer',
        }, 'Verified launch source'),
      },
      {
        label: 'Chart',
        value: project.dexScreenerUrl
          ? el('a', { href: project.dexScreenerUrl, target: '_blank', rel: 'noreferrer' }, 'DEX Screener')
          : el('span', { class: 'muted' }, 'Unavailable'),
      },
    ],
  });
}

function projectsTable(launchpad) {
  if (!launchpad.projects.length) {
    return el('p', { class: 'empty-state' },
      launchpad.warning || 'No launched projects meet the exact-contract provenance rule yet.');
  }
  const table = el('table', { class: 'data-table launchpad-token-table' });
  table.append(el('thead', {}, el('tr', {},
    el('th', { scope: 'col' }, '#'),
    el('th', { scope: 'col' }, 'Token'),
    el('th', { class: 'r', scope: 'col' }, 'Market cap'),
    el('th', { class: 'r', scope: 'col' }, '24h volume'),
    el('th', { scope: 'col' }, 'Contract'),
    el('th', { scope: 'col' }, 'Chain'),
    el('th', { scope: 'col' }, 'Provenance'),
    el('th', { scope: 'col' }, 'Project : platform'),
    el('th', { class: 'r', scope: 'col' }, 'Chart'),
  )));
  table.append(el('tbody', {}, ...launchpad.projects.map((project, index) => tokenRow(launchpad, project, index))));
  return rankBoard({
    table,
    cards: launchpad.projects.map((project, index) => tokenCard(launchpad, project, index)),
    label: `Tokens launched on ${launchpad.name}`,
  });
}

function launchpadCard(launchpad, fetchedAt) {
  const native = launchpad.nativeToken;
  const isRanked = Number.isFinite(launchpad.rank);
  const metricNote = launchpad.metricsStale
    ? `fallback snapshot · ${fmtClock(launchpad.metricsAsOf)}`
    : isRanked ? 'ranking metric' : 'not separately indexed';
  return el('article', { class: 'panel launchpad-analytics-card' },
    el('header', { class: 'launchpad-card-header' },
      el('span', { class: `launchpad-rank num${isRanked ? '' : ' is-unranked'}` },
        isRanked ? String(launchpad.rank).padStart(2, '0') : 'TRACKED'),
      el('img', {
        class: 'platform-logo', src: launchpad.logo, alt: `${launchpad.name} logo`,
        width: '54', height: '54', loading: 'lazy', decoding: 'async',
        onerror: (event) => { event.currentTarget.src = '/assets/img/brand/crypto-bros-hex.svg'; },
      }),
      el('div', { class: 'launchpad-card-title' },
        el('p', { class: 'eyebrow' }, `${launchpad.chain} · ${launchpad.category}`),
        el('h2', {}, launchpad.name),
      ),
      el('time', { class: 'launchpad-asof', datetime: new Date(fetchedAt).toISOString() },
        `As of ${fmtClock(fetchedAt)}`),
    ),
    el('div', { class: 'launchpad-metric-grid' },
      metric('30d fees', fmtUsd(launchpad.metrics.fees30d), metricNote),
      metric('30d revenue', fmtUsd(launchpad.metrics.revenue30d), launchpad.metricsStale
        ? 'DeFiLlama fallback' : Number.isFinite(launchpad.metrics.revenue30d) ? '' : 'not separately indexed'),
      metric('Platform token', native ? native.symbol : 'None verified', native
        ? `${native.relationship} · ${fmtUsd(native.marketCap)}` : 'ratio disabled'),
      metric('Verified launches', String(launchpad.verifiedLaunchedTokens), 'current category coverage'),
      metric('Top launched token', launchpad.topLaunchedToken?.sym || 'Unavailable',
        Number.isFinite(launchpad.topLaunchedToken?.mcap)
          ? fmtUsd(launchpad.topLaunchedToken.mcap) : launchpad.topLaunchedToken ? 'market cap unavailable' : ''),
    ),
    el('div', { class: 'launchpad-table-head' },
      el('div', {}, el('p', { class: 'eyebrow' }, 'Contract-verified ranking'), el('h3', {}, 'Top tokens launched here')),
      el('span', { class: 'coverage-count' }, `${launchpad.projects.length} shown · max 10`),
    ),
    projectsTable(launchpad),
    el('footer', { class: 'launchpad-card-footer' },
      el('div', { class: 'launchpad-source-row' },
        ...launchpad.sources.map((source) => brandedSourceLink({ ...source, className: 'lore-source-chip' })),
      ),
      launchpad.warning ? el('p', { class: 'note warn' }, launchpad.warning) : null,
      launchpad.note ? el('p', { class: 'note' }, launchpad.note) : null,
    ),
  );
}

function render(data) {
  const verifiedCount = data.launchpads.reduce((sum, launchpad) => sum + launchpad.projects.length, 0);
  const leader = data.launchpads[0];
  $('launchpadLeader').textContent = leader?.name || 'Unavailable';
  $('launchpadLeaderFees').textContent = leader ? `${fmtUsd(leader.metrics.fees30d)} · 30d` : 'No fee coverage';
  $('launchpadCount').textContent = String(data.launchpads.length);
  $('candidateCount').textContent = `${data.candidateCount} candidates monitored`;
  $('verifiedProjectCount').textContent = String(verifiedCount);
  $('launchpadMethod').textContent = data.methodology;
  $('updatedAt').textContent = fmtClock(data.fetchedAt);
  $('launchpadRanking').replaceChildren(...data.launchpads.map((launchpad) => launchpadCard(launchpad, data.fetchedAt)));
  setStatus(data.partial ? 'Launchpad ranking ready · source coverage partial' : 'Launchpad ranking ready', data.partial ? 'busy' : 'ok');
}

async function load() {
  setStatus('Loading 30-day fees and verified projects…', 'busy');
  const response = await fetch('/api/market/?resource=launchpads', { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`Backend HTTP ${response.status}`);
  const payload = await response.json();
  if (!payload?.ok) throw new Error(payload?.error || 'Launchpad analytics unavailable');
  render(payload);
}

function init() {
  load().catch((error) => {
    console.error(error);
    setStatus('Launchpad analytics unavailable', 'err');
    $('launchpadRanking').replaceChildren(el('p', { class: 'error' }, error.message));
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
