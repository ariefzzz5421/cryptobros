/* Airdrop research index. The ranking metric defaults to value at
   distribution, never to peak value — the two are labelled differently
   everywhere they appear. */

import { el, fmtClock } from './utils.js';
import { rankBoard, rankCard } from './ranking-board.js';
import {
  loadAirdrops, RANKINGS, rankByDistributionValue, recipientCount, recipientCountLabel,
  fmtBigUsd, fmtWallets, fmtTokens, fmtAirdropDate,
} from './airdrop-config.js';

const $ = (id) => document.getElementById(id);
const state = { data: null, ranking: 'distribution' };

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
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
    el('td', {}, el('a', { class: 'table-link', href: `/airdrops/${item.slug}/` },
      el('strong', {}, item.project), ' ', el('small', { class: 'muted' }, item.tokenSymbol))),
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
    el('div', { class: 'airdrop-card-head' },
      el('strong', {}, item.project),
      el('span', { class: 'airdrop-card-sym num' }, item.tokenSymbol),
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
  $('researchCutoff').textContent = fmtAirdropDate(state.data.researchCutoff);
  $('updatedAt').textContent = fmtClock(Date.now());
}

async function init() {
  try {
    state.data = await loadAirdrops();
    renderKpis();
    renderControls();
    renderRanking();
    renderGrid();
    renderMethod();
    renderPool();
    setStatus('Airdrop research ready · every figure sourced', 'ok');
  } catch (error) {
    console.error(error);
    setStatus(`Airdrop research unavailable: ${error.message}`, 'err');
    $('airdropTable').replaceChildren(el('p', { class: 'error' }, error.message));
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
