/* Airdrop case article.

   The distribution flow is drawn from the case data in HTML and CSS — a
   population narrows into claimants and then into observed recipients, and a
   stage the research could not source says so instead of borrowing the number
   from the stage below it. That substitution is the specific error this page
   exists to prevent: an on-chain recipient count is not an eligibility count.
*/

import { el, fmtClock } from './utils.js';
import { brandedSourceLink } from './source-brands.js';
import {
  loadAirdrops, findCase, walletFunnel,
  fmtBigUsd, fmtWallets, fmtTokens, fmtAirdropDate,
} from './airdrop-config.js';

const $ = (id) => document.getElementById(id);

function setStatus(text, kind = 'busy') {
  const dot = $('statusDot');
  const label = $('statusText');
  if (label) label.textContent = text;
  if (dot) dot.className = `dot ${kind}`;
}

function sourceTag(source) {
  if (!source) return null;
  return el('a', {
    class: `source-kind is-${source.kind}`,
    href: source.url,
    target: '_blank',
    rel: 'noreferrer',
    title: source.label,
  }, source.kind === 'on-chain' ? 'on-chain estimate' : source.kind);
}

function statCard({ label, value, sub, source, tone }) {
  return el('article', { class: `evidence-card${tone ? ` is-${tone}` : ''}` },
    el('h3', {}, label),
    el('p', { class: 'evidence-value num' }, value),
    sub ? el('p', { class: 'evidence-sub' }, sub) : null,
    source ? el('p', { class: 'evidence-source' }, sourceTag(source)) : null,
  );
}

function renderTopCards(item) {
  const criteria = item.eligibilityCriteria?.length
    ? `${item.eligibilityCriteria.length} published criteria`
    : 'Not published';
  const funnel = walletFunnel(item);
  const claimants = funnel.find((stage) => stage.id === 'claimants');
  const recipients = funnel.find((stage) => stage.id === 'recipients');

  $('evidenceCards').replaceChildren(
    statCard({
      label: 'Eligibility criteria',
      value: criteria,
      sub: item.eligibilityCriteria?.[0] || 'No eligibility rules were published for this distribution.',
    }),
    statCard({
      label: 'Claimants',
      value: fmtWallets(claimants.value, claimants.qualifier),
      sub: claimants.value == null ? claimants.fallback : `${claimants.definition}${claimants.asOf ? ` As of ${fmtAirdropDate(claimants.asOf)}.` : ''}`,
      source: claimants.source,
    }),
    statCard({
      label: 'Tokens distributed',
      value: fmtTokens(item.tokensActuallyDistributed ?? item.tokensAllocated),
      sub: item.tokensDistributedNote || null,
      tone: 'accent',
    }),
    statCard({
      label: 'Recipient addresses',
      value: fmtWallets(recipients.value, recipients.qualifier),
      sub: recipients.value == null ? recipients.fallback : recipients.definition,
      source: recipients.source,
    }),
    statCard({
      label: 'Supply allocation',
      value: Number.isFinite(item.percentSupplyDistributed) ? `${item.percentSupplyDistributed}%` : 'Unavailable',
      sub: Number.isFinite(item.totalSupply) ? `of ${fmtTokens(item.totalSupply)} total supply` : null,
    }),
  );
}

/* Four stages, drawn as a narrowing funnel. A stage with no sourced number
   keeps its place in the flow and states that the number is not disclosed —
   it is never filled in from the stage after it. */
function renderFlow(item) {
  const funnel = walletFunnel(item);
  const stages = [
    {
      label: 'Qualifying population',
      value: item.eligibilityCriteria?.length
        ? item.eligibilityCriteria.slice(0, 2).join(' · ')
        : 'Eligibility rules not published',
      kind: 'text',
    },
    {
      label: funnel[0].label,
      value: fmtWallets(funnel[0].value, funnel[0].qualifier),
      note: funnel[0].value == null ? funnel[0].fallback : funnel[0].definition,
      source: funnel[0].source,
      unknown: funnel[0].value == null,
    },
    {
      label: funnel[1].label,
      value: fmtWallets(funnel[1].value, funnel[1].qualifier),
      note: funnel[1].value == null ? funnel[1].fallback : funnel[1].definition,
      source: funnel[1].source,
      unknown: funnel[1].value == null,
    },
    {
      label: funnel[2].label,
      value: fmtWallets(funnel[2].value, funnel[2].qualifier),
      note: funnel[2].value == null ? funnel[2].fallback : funnel[2].definition,
      source: funnel[2].source,
      unknown: funnel[2].value == null,
    },
  ];

  $('distributionFlow').replaceChildren(...stages.map((stage, index) => el('li', {
    class: `flow-stage${stage.unknown ? ' is-unknown' : ''}${stage.kind === 'text' ? ' is-copy' : ''}`,
    style: { '--flow-step': String(index) },
  },
    el('p', { class: 'flow-label' }, stage.label),
    el('p', { class: `flow-value${stage.kind === 'text' ? ' is-copy' : ' num'}` }, stage.value),
    stage.note ? el('p', { class: 'flow-note' }, stage.note) : null,
    stage.source ? el('p', { class: 'flow-source' }, sourceTag(stage.source)) : null,
  )));
}

/* The two valuations, side by side and named differently, so the page can be
   read at a glance without confusing them. */
function renderValuations(item) {
  $('valuationBoard').replaceChildren(
    el('article', { class: 'valuation is-primary' },
      el('p', { class: 'eyebrow' }, 'Ranking metric'),
      el('h3', {}, 'Value at distribution'),
      el('p', { class: 'valuation-value num' }, fmtBigUsd(item.valueAtDistributionUsd, item.valueAtDistributionQualifier)),
      el('p', { class: 'valuation-formula num' },
        `${fmtTokens(item.tokensActuallyDistributed ?? item.tokensAllocated)} tokens × `,
        Number.isFinite(item.tokenPriceAtDistribution)
          ? `$${item.tokenPriceAtDistribution} at distribution`
          : 'distribution-day price unavailable'),
      item.tokenPriceNote ? el('p', { class: 'valuation-note' }, item.tokenPriceNote) : null,
      item.valueAtDistributionSource ? el('p', { class: 'evidence-source' },
        `Basis: ${item.valueAtDistributionBasis} · `, sourceTag(item.valueAtDistributionSource)) : null,
    ),
    el('article', { class: 'valuation is-secondary' },
      el('p', { class: 'eyebrow' }, 'Separate measurement'),
      el('h3', {}, 'Peak value of distributed allocation'),
      el('p', { class: 'valuation-value num' }, fmtBigUsd(item.peakValueOfDistributedTokensUsd)),
      el('p', { class: 'valuation-formula num' },
        `the same ${fmtTokens(item.tokensActuallyDistributed ?? item.tokensAllocated)} tokens × `,
        Number.isFinite(item.peakTokenPrice) ? `$${item.peakTokenPrice} all-time high` : 'the token’s all-time high'),
      el('p', { class: 'valuation-note' },
        'This is what the distributed allocation would have been worth at the token’s peak. It is not the value distributed at launch, and no recipient received it.'),
      item.peakValueSource ? el('p', { class: 'evidence-source' }, sourceTag(item.peakValueSource)) : null,
    ),
  );
}

function factorList(id, entries, emptyCopy) {
  const host = $(id);
  if (!host) return;
  if (!entries?.length) {
    host.replaceChildren(el('p', { class: 'doc-note' }, emptyCopy));
    return;
  }
  host.replaceChildren(...entries.map((entry) => el('li', { class: 'doc-factor' },
    el('h3', {}, entry.factor),
    el('p', {}, entry.detail),
    entry.source ? el('p', { class: 'evidence-source' }, sourceTag(entry.source)) : null,
  )));
}

function renderAfter(item) {
  const rows = [];
  if (item.postAirdropOutcome) rows.push(el('p', { class: 'doc-lead' }, item.postAirdropOutcome));
  if (item.priceAfter?.length) {
    rows.push(el('dl', { class: 'price-after' }, ...item.priceAfter.flatMap((mark) => [
      el('dt', {}, mark.label),
      el('dd', { class: 'num' }, mark.value),
    ])));
  } else if (item.priceAfterNote) {
    rows.push(el('p', { class: 'doc-note' }, item.priceAfterNote));
  }
  $('afterBoard').replaceChildren(...rows);
}

function renderSources(item) {
  $('caseSources').replaceChildren(...item.sources.map((source) => brandedSourceLink({
    label: `${source.label} · ${source.kind}`,
    url: source.url,
    className: 'lore-source-chip',
  })));
}

function renderHero(item) {
  document.title = `${item.project} (${item.tokenSymbol}) — Airdrop Case Study`;
  $('docTitle').textContent = item.project;
  $('docSym').textContent = item.tokenSymbol;
  $('docKicker').textContent = `Airdrop case study · ${item.chain}`;
  $('docStandfirst').textContent = item.productBeforeToken;
  $('docMeta').replaceChildren(
    el('span', {}, 'Airdrop date ', el('strong', {}, fmtAirdropDate(item.airdropDate))),
    el('span', {}, 'Distribution value ', el('strong', {}, fmtBigUsd(item.valueAtDistributionUsd, item.valueAtDistributionQualifier))),
    el('span', {}, 'Tokens distributed ', el('strong', {}, fmtTokens(item.tokensActuallyDistributed ?? item.tokensAllocated))),
    el('span', {}, 'Initial claimants ', el('strong', {},
      fmtWallets(item.initialClaimants?.value, item.initialClaimants?.qualifier))),
  );
  if (!item.rankingComparable && item.rankingExclusionReason) {
    $('rankingFlag').replaceChildren(el('p', { class: 'note warn' },
      `Excluded from the value-at-distribution ranking. ${item.rankingExclusionReason}`));
  }
}

async function init() {
  const slug = document.body.dataset.airdrop;
  try {
    const data = await loadAirdrops();
    const item = findCase(data, slug);
    if (!item) throw new Error(`No airdrop case for “${slug}”`);
    renderHero(item);
    renderTopCards(item);
    renderFlow(item);
    renderValuations(item);
    factorList('whyList', item.whyItSucceeded, 'No success factors are documented for this distribution.');
    factorList('weaknessList', item.weaknesses, 'No weaknesses are documented for this distribution.');
    $('mechanism').textContent = item.distributionMechanism;
    $('antiSybil').replaceChildren(
      ...(item.antiSybilRules?.length
        ? item.antiSybilRules.map((rule) => el('li', {}, rule))
        : [el('li', { class: 'muted' }, item.antiSybilNote || 'No anti-sybil rules were published.')]),
    );
    renderAfter(item);
    $('lessonList').replaceChildren(...item.lessons.map((lesson) => el('li', {}, lesson)));
    renderSources(item);
    $('updatedAt').textContent = fmtClock(Date.now());
    setStatus('Case research ready · every figure sourced', 'ok');
  } catch (error) {
    console.error(error);
    setStatus(`Case research unavailable: ${error.message}`, 'err');
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
