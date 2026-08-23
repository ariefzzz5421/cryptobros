/* NeoBank research index.

   Three measurements are kept apart and never substituted for one another:

     customers.value   accounts, on a stated basis (registered vs active)
     volume            transaction throughput, only where a company reports it
     revenue           reported top line, in the currency it was reported in

   A neobank that never published a figure gets null, sorts last, and says so.
   Nothing here is back-filled: revenue is not inferred from customers, and a
   registered-account count is never presented as an active one. */

import { el, fmtClock } from './utils.js';
import { rankBoard, rankCard } from './ranking-board.js';

const $ = (id) => document.getElementById(id);
const state = { data: null, ranking: 'customers' };

function setStatus(text, kind = 'busy') {
  $('statusText').textContent = text;
  $('statusDot').className = `dot ${kind}`;
}

/* --- formatting --------------------------------------------------------- */

function fmtCount(value, qualifier) {
  if (!Number.isFinite(value)) return 'Unavailable';
  const text = value >= 1e9 ? `${(value / 1e9).toFixed(2)}B`
    : value >= 1e6 ? `${(value / 1e6).toFixed(value >= 1e7 ? 0 : 1)}M`
      : value >= 1e3 ? `${(value / 1e3).toFixed(0)}K`
        : String(value);
  return qualifier === 'at-least' ? `${text}+` : text;
}

const SYMBOL = { USD: '$', GBP: '£', EUR: '€', KRW: '₩' };

function fmtMoney(value, currency) {
  if (!Number.isFinite(value)) return 'Unavailable';
  const sign = SYMBOL[currency] || `${currency} `;
  const text = value >= 1e9 ? `${(value / 1e9).toFixed(2)}B`
    : value >= 1e6 ? `${(value / 1e6).toFixed(0)}M`
      : value.toLocaleString('en-US');
  return `${sign}${text}`;
}

function revenueText(bank) {
  const { value, currency } = bank.revenue || {};
  if (!Number.isFinite(value)) return 'Unavailable';
  return fmtMoney(value, currency);
}

/* Volume is reported in the company's own currency where one exists, so the
   original figure is shown rather than a converted one. */
function volumeText(bank) {
  const v = bank.volumeUsd || {};
  if (Number.isFinite(v.valueOriginal)) return fmtMoney(v.valueOriginal, v.currencyOriginal || 'USD');
  if (Number.isFinite(v.value)) return fmtMoney(v.value, 'USD');
  return 'Unavailable';
}

function customerBasis(bank) {
  const basis = bank.customers?.basis;
  if (!basis) return 'not disclosed';
  const asOf = bank.customers?.asOf;
  return asOf ? `${basis} · ${asOf}` : basis;
}

function sourceTag(source) {
  if (!source?.url) return null;
  return el('a', {
    class: `source-kind is-${source.kind}`, href: source.url,
    target: '_blank', rel: 'noreferrer', title: source.label,
  }, source.kind);
}

/* --- rankings ----------------------------------------------------------- */

/* A null figure sorts last in every ranking rather than being treated as zero,
   which would read as "this bank has no customers" instead of "not published". */
const byNumber = (pick) => (a, b) => {
  const av = pick(a);
  const bv = pick(b);
  if (!Number.isFinite(av) && !Number.isFinite(bv)) return 0;
  if (!Number.isFinite(av)) return 1;
  if (!Number.isFinite(bv)) return -1;
  return bv - av;
};

const RANKINGS = [
  {
    id: 'customers', label: 'Customers',
    note: 'Reported customer accounts. Registered and active are labelled per row and never mixed.',
    sort: byNumber((bank) => bank.customers?.value),
  },
  {
    id: 'revenue', label: 'Revenue',
    note: 'Reported top line, in the currency the company reported it in — figures are not currency-converted, so this ordering is indicative across currencies.',
    sort: byNumber((bank) => bank.revenue?.value),
  },
  {
    id: 'volume', label: 'Volume',
    note: 'Transaction throughput, shown only for companies that publish one.',
    sort: byNumber((bank) => bank.volumeUsd?.valueOriginal ?? bank.volumeUsd?.value),
  },
  {
    id: 'country', label: 'Country',
    note: 'Grouped alphabetically by home market.',
    sort: (a, b) => a.country.localeCompare(b.country) || (b.customers?.value ?? 0) - (a.customers?.value ?? 0),
  },
];

/* --- rendering ---------------------------------------------------------- */

function renderRanking() {
  const definition = RANKINGS.find((entry) => entry.id === state.ranking) || RANKINGS[0];
  const rows = [...state.data.neobanks].sort(definition.sort);
  $('rankingTitle').textContent = `Ranked by ${definition.label.toLowerCase()}`;
  $('rankingNote').textContent = definition.note;

  const missing = rows.filter((bank) => !Number.isFinite(bank.customers?.value));
  $('rankingNulls').textContent = missing.length
    ? `${missing.length} of ${rows.length} entries publish no attributable customer count in this pass: ${missing.map((b) => b.name).join(', ')}. They keep their place in the set and sort last rather than being given an estimated figure.`
    : '';

  const table = el('table', { class: 'data-table neobank-table' });
  table.append(el('thead', {}, el('tr', {},
    el('th', { scope: 'col' }, '#'),
    el('th', { scope: 'col' }, 'Neobank'),
    el('th', { scope: 'col' }, 'Country'),
    el('th', { class: 'r', scope: 'col' }, 'Customers'),
    el('th', { scope: 'col' }, 'Basis'),
    el('th', { class: 'r', scope: 'col' }, 'Volume'),
    el('th', { class: 'r', scope: 'col' }, 'Revenue'),
    el('th', { scope: 'col' }, 'Model'),
    el('th', { class: 'r', scope: 'col' }, 'Site'),
  )));
  const body = el('tbody');
  rows.forEach((bank, index) => body.append(el('tr', {},
    el('td', { class: 'muted num' }, String(index + 1)),
    el('td', {}, el('strong', {}, bank.name)),
    el('td', {}, bank.country),
    el('td', { class: 'r num' }, fmtCount(bank.customers?.value, bank.customers?.qualifier)),
    el('td', { class: 'muted' }, customerBasis(bank)),
    el('td', { class: 'r num' }, volumeText(bank)),
    el('td', { class: 'r num' }, revenueText(bank)),
    el('td', { class: 'muted' }, bank.model),
    el('td', { class: 'r' }, el('a', {
      class: 'table-link', href: bank.site, target: '_blank', rel: 'noreferrer',
    }, 'Official')),
  )));
  table.append(body);

  const cards = rows.map((bank, index) => rankCard({
    rank: String(index + 1),
    title: bank.name,
    subtitle: `${bank.country} · founded ${bank.founded}`,
    href: bank.site,
    metrics: [
      { label: 'Customers', value: fmtCount(bank.customers?.value, bank.customers?.qualifier), note: customerBasis(bank) },
      { label: 'Revenue', value: revenueText(bank), note: bank.revenue?.period || null },
    ],
    detailsLabel: 'Volume, model and sources',
    details: [
      { label: 'Volume', value: volumeText(bank) },
      { label: 'Model', value: bank.model },
      { label: 'Note', value: bank.note },
      { label: 'Official', value: el('a', { href: bank.site, target: '_blank', rel: 'noreferrer' }, bank.site.replace(/^https?:\/\//, '').replace(/\/$/, '')) },
    ],
  }));

  $('neobankTable').replaceChildren(rankBoard({
    table, cards, label: `Neobanks ranked by ${definition.label.toLowerCase()}`,
  }));
}

function renderControls() {
  $('rankingControls').replaceChildren(...RANKINGS.map((entry) => el('button', {
    class: `seg-btn${entry.id === state.ranking ? ' is-on' : ''}`,
    type: 'button',
    'aria-pressed': String(entry.id === state.ranking),
    onclick: () => { state.ranking = entry.id; renderControls(); renderRanking(); },
  }, entry.label)));
}

function renderGrid() {
  $('neobankGrid').replaceChildren(...state.data.neobanks.map((bank) => el('a', {
    class: 'airdrop-card research-card',
    href: bank.site,
    target: '_blank',
    rel: 'noreferrer',
  },
    el('div', { class: 'airdrop-card-head' },
      el('strong', {}, bank.name),
      el('span', { class: 'airdrop-card-sym num' }, bank.country),
    ),
    el('p', { class: 'research-summary' }, bank.note),
    el('dl', { class: 'airdrop-card-stats' },
      el('div', {},
        el('dt', {}, 'Customers'),
        el('dd', { class: 'num' }, fmtCount(bank.customers?.value, bank.customers?.qualifier)),
      ),
      el('div', {},
        el('dt', {}, 'Revenue'),
        el('dd', { class: 'num' }, revenueText(bank)),
      ),
    ),
    el('p', { class: 'evidence-source' },
      ...[bank.customers?.source, bank.revenue?.source]
        .filter(Boolean)
        .map(sourceTag)
        .filter(Boolean),
    ),
    el('span', { class: 'case-card-cta' }, 'Open official site'),
  )));
}

function renderMethod() {
  const method = state.data.methodology;
  $('methodList').replaceChildren(
    el('li', {}, method.rankingRule),
    el('li', {}, method.customerCaveat),
    el('li', {}, method.volumeCaveat),
    el('li', {}, method.revenueCaveat),
  );
}

function renderKpis() {
  const banks = state.data.neobanks;
  const withCustomers = banks.filter((bank) => Number.isFinite(bank.customers?.value));
  const totalCustomers = withCustomers.reduce((sum, bank) => sum + bank.customers.value, 0);
  /* Only USD-reported revenue is summed: adding GBP and KRW figures into one
     total would invent an exchange rate this research has not sourced. */
  const usdRevenue = banks.filter((bank) => bank.revenue?.currency === 'USD' && Number.isFinite(bank.revenue.value));
  const totalRevenue = usdRevenue.reduce((sum, bank) => sum + bank.revenue.value, 0);
  const largest = [...withCustomers].sort((a, b) => b.customers.value - a.customers.value)[0];

  $('kpiCount').textContent = String(banks.length);
  $('kpiCountSub').textContent = `${withCustomers.length} publish a customer count`;
  $('kpiCustomers').textContent = fmtCount(totalCustomers);
  $('kpiCustomersSub').textContent = `across ${withCustomers.length} of ${banks.length} entries`;
  $('kpiRevenue').textContent = fmtMoney(totalRevenue, 'USD');
  $('kpiRevenueSub').textContent = `${usdRevenue.length} entries reporting in USD; other currencies are not converted`;
  $('kpiLargest').textContent = largest ? largest.name : 'Unavailable';
  $('kpiLargestSub').textContent = largest
    ? `${fmtCount(largest.customers.value)} ${largest.customers.basis} accounts`
    : 'no sourced customer count';
  $('researchCutoff').textContent = state.data.researchCutoff;
  $('updatedAt').textContent = fmtClock(Date.now());
}

async function init() {
  try {
    const response = await fetch('/assets/data/neobanks.json', { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`Neobank research HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data?.neobanks)) throw new Error('Neobank research payload malformed');
    state.data = data;
    renderKpis();
    renderControls();
    renderRanking();
    renderGrid();
    renderMethod();
    setStatus('Neobank research ready · every figure sourced', 'ok');
  } catch (error) {
    console.error(error);
    setStatus(`Neobank research unavailable: ${error.message}`, 'err');
    $('neobankTable').replaceChildren(el('p', { class: 'error' }, error.message));
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
