/* Airdrop research index.

   Two complementary rankings live on this page:
   1) the broad all-time board values distributed allocations at token ATH;
   2) the deep-case board defaults to what recipients received on distribution
      day. The labels stay explicit so the two numbers are never confused.
*/

import { el, fmtClock } from './utils.js';
import { rankBoard, rankCard } from './ranking-board.js';
import {
  loadAirdrops, RANKINGS, rankByDistributionValue, recipientCount, recipientCountLabel,
  fmtBigUsd, fmtWallets, fmtTokens, fmtAirdropDate,
} from './airdrop-config.js';
import {
  ALL_TIME_AIRDROP_TOP_30,
  AIRDROP_RESEARCH_CUTOFF,
  airdropLogoUrl,
  airdropInitials,
} from './airdrop-leaderboard.js';

const $ = (id) => document.getElementById(id);
const state = { data: null, ranking: 'distribution', top30Year: 'all' };

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

function top30Match(item = {}) {
  const symbol = String(item.symbol || item.tokenSymbol || '').toUpperCase();
  const project = String(item.project || '').toLowerCase();
  return ALL_TIME_AIRDROP_TOP_30.find((row) => row.symbol === symbol)
    || ALL_TIME_AIRDROP_TOP_30.find((row) => project && row.project.toLowerCase().includes(project))
    || null;
}

function officialDomain(item = {}) {
  const match = top30Match(item);
  if (match?.site) return match.site;
  const official = (item.sources || []).find((source) => source?.kind === 'official' && source?.url);
  if (!official?.url) return '';
  try { return new URL(official.url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function logoRecord(item = {}) {
  const match = top30Match(item);
  return match || {
    symbol: item.symbol || item.tokenSymbol,
    project: item.project,
    site: officialDomain(item),
  };
}

function projectLogo(item, { small = false } = {}) {
  const record = logoRecord(item);
  const src = airdropLogoUrl(record);
  const fallback = el('span', { class: 'airdrop-logo-fallback', 'aria-hidden': 'true' }, airdropInitials(record));
  const wrap = el('span', { class: `airdrop-logo${small ? ' is-sm' : ''}`, 'aria-hidden': 'true' }, fallback);
  if (!src) {
    wrap.classList.add('is-fallback');
    return wrap;
  }
  const img = el('img', {
    src,
    alt: '',
    width: small ? '32' : '42',
    height: small ? '32' : '42',
    loading: 'lazy',
    decoding: 'async',
    onerror: () => wrap.classList.add('is-fallback'),
  });
  wrap.prepend(img);
  return wrap;
}

function projectNameNode(item, { deepCase = false } = {}) {
  const href = item.slug ? `/airdrops/${item.slug}/` : null;
  if (href) return el('a', { href, class: deepCase ? 'table-link' : '' }, item.project);
  return el('strong', {}, item.project);
}

function top30Rows() {
  if (state.top30Year === 'all') return ALL_TIME_AIRDROP_TOP_30;
  return ALL_TIME_AIRDROP_TOP_30.filter((item) => String(item.year) === state.top30Year);
}

function renderTop30Controls() {
  const years = [...new Set(ALL_TIME_AIRDROP_TOP_30.map((item) => item.year))].sort((a, b) => b - a);
  const controls = [
    { id: 'all', label: 'All years' },
    ...years.map((year) => ({ id: String(year), label: String(year) })),
  ];
  $('top30Controls').replaceChildren(...controls.map((entry) => el('button', {
    class: `airdrop-filter-btn${state.top30Year === entry.id ? ' is-on' : ''}`,
    type: 'button',
    'aria-pressed': String(state.top30Year === entry.id),
    onclick: () => {
      state.top30Year = entry.id;
      renderTop30Controls();
      renderTop30();
    },
  }, entry.label)));
}

function renderTop30() {
  const rows = top30Rows();
  const table = el('table', { class: 'data-table airdrop-top30-table' });
  table.append(el('thead', {}, el('tr', {},
    el('th', { scope: 'col' }, '#'),
    el('th', { scope: 'col' }, 'Project'),
    el('th', { scope: 'col' }, 'Year'),
    el('th', { class: 'r', scope: 'col' }, 'Peak value of allocation'),
    el('th', { scope: 'col' }, 'Basis'),
    el('th', { class: 'r', scope: 'col' }, 'Source'),
  )));
  const body = el('tbody');

  rows.forEach((item) => {
    const projectCopy = el('span', { class: 'airdrop-project-copy' },
      projectNameNode(item),
      el('small', {}, `$${item.symbol}${item.round ? ` · round ${item.round}` : ''}`),
    );
    const sourceLinks = [
      item.sourceHref ? el('a', {
        class: 'airdrop-source-link', href: item.sourceHref, target: '_blank', rel: 'noreferrer',
        title: item.sourceLabel || 'Airdrop source', 'aria-label': `${item.project} airdrop source`,
      }, 'Source') : null,
      item.marketHref ? el('a', {
        class: 'airdrop-source-link', href: item.marketHref, target: '_blank', rel: 'noreferrer',
        title: 'Token ATH market record', 'aria-label': `${item.project} ATH market record`,
      }, 'ATH') : null,
    ].filter(Boolean);

    body.append(el('tr', {},
      el('td', { class: 'rank-cell num' }, String(item.rank)),
      el('td', {}, el('span', { class: 'airdrop-project-cell' }, projectLogo(item, { small: true }), projectCopy)),
      el('td', { class: 'num muted' }, String(item.year)),
      el('td', { class: 'r num' },
        el('span', { class: 'airdrop-value-main' }, fmtBigUsd(item.valueUsd)),
        item.formula ? el('small', { class: 'airdrop-formula' }, item.formula) : null,
      ),
      el('td', {},
        el('span', { class: 'airdrop-source-kind' }, item.formula ? 'Reconstructed' : 'Historical table'),
        item.allocation ? el('small', { class: 'airdrop-formula' }, item.allocation) : null,
      ),
      el('td', { class: 'r' }, ...sourceLinks),
    ));
  });
  table.append(body);

  const cards = el('div', { class: 'airdrop-top30-cards' }, ...rows.map((item) =>
    el('article', { class: 'airdrop-top30-card' },
      el('span', { class: 'rank-chip num' }, String(item.rank)),
      el('div', { class: 'airdrop-card-project' },
        projectLogo(item),
        el('span', { class: 'airdrop-project-copy' },
          projectNameNode(item),
          el('small', {}, `$${item.symbol}${item.round ? ` · round ${item.round}` : ''}`),
        ),
      ),
      el('div', { class: 'airdrop-card-value' },
        el('span', { class: 'airdrop-value-main num' }, fmtBigUsd(item.valueUsd)),
        item.formula ? el('small', { class: 'airdrop-formula' }, item.formula) : null,
      ),
      el('div', { class: 'airdrop-card-meta' },
        el('span', {}, String(item.year)),
        el('span', {}, '·'),
        el('span', { class: 'airdrop-source-kind' }, item.formula ? 'Reconstructed' : 'Historical table'),
        item.sourceHref ? el('a', {
          class: 'airdrop-source-link', href: item.sourceHref, target: '_blank', rel: 'noreferrer',
          'aria-label': `${item.project} source`,
        }, 'Source') : null,
      ),
    )));

  $('top30Board').replaceChildren(el('div', { class: 'table-scroll' }, table), cards);
}

/* The number a row is ranked on, plus the label that says what it measures.
   Peak value carries its own wording so it can never read as value
   distributed. */
function rankingValue(item, rankingId) {
  if (rankingId === 'peak') {
    return {
      value: fmtBigUsd(item.peakValueOfDistributedTokensUsd),
      label: 'Peak value of distributed allocation',
    };
  }
  if (rankingId === 'recipients') {
    return {
      value: fmtWallets(recipientCount(item)),
      label: recipientCountLabel(item),
    };
  }
  if (rankingId === 'year') {
    return { value: fmtAirdropDate(item.airdropDate), label: 'Airdrop date' };
  }
  return {
    value: fmtBigUsd(item.valueAtDistributionUsd, item.valueAtDistributionQualifier),
    label: 'Value at distribution',
  };
}

function renderRanking() {
  const definition = RANKINGS.find((entry) => entry.id === state.ranking) || RANKINGS[0];
  const rows = definition.rank(state.data.cases);
  $('rankingTitle').textContent = `Ranked by ${definition.label.toLowerCase()}`;
  $('rankingNote').textContent = definition.note;

  const excluded = state.data.cases.filter((item) => !item.rankingComparable);
  $('rankingExcluded').textContent = excluded.length
    ? `Excluded from the strict ranking: ${excluded.map((item) => item.tokenSymbol).join(', ')} — a distribution-day valuation could not be reconstructed from a source. Each still has a full case article.`
    : '';

  const table = el('table', { class: 'data-table airdrop-table' });
  table.append(el('thead', {}, el('tr', {},
    el('th', { scope: 'col' }, '#'),
    el('th', { scope: 'col' }, 'Project'),
    el('th', { scope: 'col' }, 'Date'),
    el('th', { class: 'r', scope: 'col' }, 'Value at distribution'),
    el('th', { class: 'r', scope: 'col' }, 'Peak value of allocation'),
    el('th', { class: 'r', scope: 'col' }, 'Tokens distributed'),
    el('th', { class: 'r', scope: 'col' }, 'Wallets'),
    el('th', { scope: 'col' }, 'Wallet basis'),
    el('th', { class: 'r', scope: 'col' }, ''),
  )));
  const body = el('tbody');
  rows.forEach((item, index) => body.append(el('tr', {},
    el('td', { class: 'muted num' }, String(index + 1)),
    el('td', {}, el('span', { class: 'airdrop-project-cell' },
      projectLogo(item, { small: true }),
      el('span', { class: 'airdrop-project-copy' },
        el('a', { class: 'table-link', href: `/airdrops/${item.slug}/` }, item.project),
        el('small', { class: 'muted' }, item.tokenSymbol),
      ),
    )),
    el('td', { class: 'num' }, fmtAirdropDate(item.airdropDate)),
    el('td', { class: 'r num' }, fmtBigUsd(item.valueAtDistributionUsd, item.valueAtDistributionQualifier)),
    el('td', { class: 'r num muted' }, fmtBigUsd(item.peakValueOfDistributedTokensUsd)),
    el('td', { class: 'r num' }, fmtTokens(item.tokensActuallyDistributed ?? item.tokensAllocated)),
    el('td', { class: 'r num' }, fmtWallets(recipientCount(item))),
    el('td', { class: 'muted' }, recipientCountLabel(item)),
    el('td', { class: 'r' }, el('a', { class: 'table-link', href: `/airdrops/${item.slug}/` }, 'Case')),
  )));
  table.append(body);

  const cards = rows.map((item, index) => {
    const primary = rankingValue(item, state.ranking);
    return rankCard({
      rank: String(index + 1),
      title: item.project,
      subtitle: `${item.tokenSymbol} · ${fmtAirdropDate(item.airdropDate)}`,
      href: `/airdrops/${item.slug}/`,
      metrics: [
        { label: primary.label, value: primary.value },
        {
          label: 'Wallets',
          value: fmtWallets(recipientCount(item)),
          note: recipientCountLabel(item),
        },
      ],
      detailsLabel: 'Both valuations and supply',
      details: [
        { label: 'Value at distribution', value: fmtBigUsd(item.valueAtDistributionUsd, item.valueAtDistributionQualifier) },
        { label: 'Peak value of distributed allocation', value: fmtBigUsd(item.peakValueOfDistributedTokensUsd) },
        { label: 'Tokens distributed', value: fmtTokens(item.tokensActuallyDistributed ?? item.tokensAllocated) },
        { label: 'Share of supply', value: Number.isFinite(item.percentSupplyDistributed) ? `${item.percentSupplyDistributed}%` : 'Unavailable' },
      ],
    });
  });

  $('airdropTable').replaceChildren(rankBoard({
    table,
    cards,
    label: `Airdrops ranked by ${definition.label.toLowerCase()}`,
  }));
}

function renderControls() {
  $('rankingControls').replaceChildren(...RANKINGS.map((entry) => {
    const button = el('button', {
      class: `seg-btn${entry.id === state.ranking ? ' is-on' : ''}`,
      type: 'button',
      'aria-pressed': String(entry.id === state.ranking),
      onclick: () => {
        state.ranking = entry.id;
        renderControls();
        renderRanking();
      },
    }, entry.label);
    return button;
  }));
}

function renderGrid() {
  $('airdropGrid').replaceChildren(...state.data.cases.map((item) => el('a', {
    class: `airdrop-card research-card${item.featured ? ' is-featured' : ''}`,
    href: `/airdrops/${item.slug}/`,
  },
    el('div', { class: 'airdrop-card-head has-logo' },
      projectLogo(item),
      el('span', { class: 'airdrop-project-copy' },
        el('strong', {}, item.project),
        el('small', { class: 'airdrop-card-sym num' }, item.tokenSymbol),
      ),
    ),
    el('p', { class: 'research-summary' }, item.productBeforeToken),
    el('dl', { class: 'airdrop-card-stats' },
      el('div', {},
        el('dt', {}, 'Value at distribution'),
        el('dd', { class: 'num' }, fmtBigUsd(item.valueAtDistributionUsd, item.valueAtDistributionQualifier)),
      ),
      el('div', {},
        el('dt', {}, recipientCountLabel(item) === 'not disclosed' ? 'Wallets' : recipientCountLabel(item)),
        el('dd', { class: 'num' }, fmtWallets(recipientCount(item))),
      ),
    ),
    el('span', { class: 'case-card-cta' }, item.featured ? 'Featured case' : 'Open case'),
  )));
}

function renderMethod() {
  const method = state.data.methodology;
  $('methodList').replaceChildren(
    el('li', {}, method.rankingRule),
    el('li', {}, method.secondaryRule),
    el('li', {}, 'Eligible wallets, initial claimants and observed recipient addresses are stored and displayed as three separate measurements. A recipient count is never presented as an eligibility count.'),
    el('li', {}, 'Every numeric claim carries a source, labelled official, on-chain, research, press or derived. A field the research could not source is shown as unavailable rather than estimated.'),
  );
  $('methodWhy').textContent = method.whyNotTheUsualList;
}

function renderPool() {
  $('candidatePool').replaceChildren(...state.data.candidatePool.map((entry) => el('li', {
    class: `candidate${entry.status === 'researched' ? ' is-published' : ''}`,
  },
    entry.slug
      ? el('a', { href: `/airdrops/${entry.slug}/` }, `${entry.project} · ${entry.symbol}`)
      : el('strong', {}, `${entry.project} · ${entry.symbol}`),
    el('small', {}, entry.status === 'researched' ? 'Published as a case' : entry.reason),
  )));
}

function renderKpis() {
  const ranked = rankByDistributionValue(state.data.cases);
  const total = ranked.reduce((sum, item) => sum + item.valueAtDistributionUsd, 0);
  const walletRows = state.data.cases.filter((item) => Number.isFinite(recipientCount(item)));
  const wallets = walletRows.reduce((sum, item) => sum + recipientCount(item), 0);

  $('kpiCases').textContent = String(state.data.cases.length);
  $('kpiCasesSub').textContent = `${state.data.candidatePool.length} candidates screened`;
  $('kpiValue').textContent = fmtBigUsd(total);
  $('kpiWallets').textContent = fmtWallets(wallets);
  $('kpiWalletsSub').textContent = `across ${walletRows.length} of ${state.data.cases.length} cases that published a count`;
  $('kpiLargest').textContent = ranked[0] ? ranked[0].tokenSymbol : 'Unavailable';
  $('kpiLargestSub').textContent = ranked[0]
    ? `${fmtBigUsd(ranked[0].valueAtDistributionUsd, ranked[0].valueAtDistributionQualifier)} at distribution`
    : 'by value at distribution';
  $('researchCutoff').textContent = fmtAirdropDate(state.data.researchCutoff || AIRDROP_RESEARCH_CUTOFF);
  $('updatedAt').textContent = fmtClock(Date.now());
}

async function init() {
  try {
    renderTop30Controls();
    renderTop30();
    state.data = await loadAirdrops();
    renderKpis();
    renderControls();
    renderRanking();
    renderGrid();
    renderMethod();
    renderPool();
    setStatus('Airdrop research ready · top 30 + sourced deep cases', 'ok');
  } catch (error) {
    console.error(error);
    setStatus(`Airdrop research unavailable: ${error.message}`, 'err');
    $('airdropTable').replaceChildren(el('p', { class: 'error' }, error.message));
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
