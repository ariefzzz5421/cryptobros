/* ============================================================
   airdrop-config.js — access layer for the airdrop research set.

   The data itself lives in assets/data/airdrops.json so that the browser, the
   static page generator and the tests all read the same bytes. Nothing in this
   module invents a value: a field the research could not source is null in the
   JSON and stays null here.

   Two measurements are kept strictly apart throughout:

     valueAtDistributionUsd            what recipients received on the day
     peakValueOfDistributedTokensUsd   the same tokens at the token's ATH

   They are never summed together, never substituted for each other, and never
   share a label.
   ============================================================ */

import { localeTag, t } from './i18n.js';

const DATA_URL = '/assets/data/airdrops.json';

let snapshot = null;
let inflight = null;

/* One request per page, shared by every caller. */
export async function loadAirdrops() {
  if (snapshot) return snapshot;
  if (inflight) return inflight;
  inflight = fetch(DATA_URL, { headers: { accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Airdrop research HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data?.cases)) throw new Error('Airdrop research payload malformed');
      snapshot = data;
      return data;
    })
    .finally(() => { inflight = null; });
  return inflight;
}

export function findCase(data, slug) {
  return data?.cases?.find((item) => item.slug === slug) || null;
}

/* --- Ranking ------------------------------------------------------------ */

/* The strict ranking. A case only appears here when a distribution-day
   valuation could actually be reconstructed from a source; everything else is
   excluded rather than filled in with the peak value. */
export function rankByDistributionValue(cases = []) {
  return cases
    .filter((item) => item.rankingComparable && Number.isFinite(item.valueAtDistributionUsd))
    .sort((a, b) => b.valueAtDistributionUsd - a.valueAtDistributionUsd);
}

/* The separate, differently-labelled ranking: the same distributed tokens
   valued at the token's all-time high. This is never "value distributed". */
export function rankByPeakValue(cases = []) {
  return cases
    .filter((item) => Number.isFinite(item.peakValueOfDistributedTokensUsd))
    .sort((a, b) => b.peakValueOfDistributedTokensUsd - a.peakValueOfDistributedTokensUsd);
}

export function rankByRecipients(cases = []) {
  return cases
    .filter((item) => Number.isFinite(recipientCount(item)))
    .sort((a, b) => recipientCount(b) - recipientCount(a));
}

export function rankByYear(cases = []) {
  return [...cases].sort((a, b) => String(b.airdropDate).localeCompare(String(a.airdropDate)));
}

export const RANKINGS = [
  {
    id: 'distribution',
    label: 'Value at distribution',
    note: 'Tokens distributed × a sourced distribution-day price',
    rank: rankByDistributionValue,
  },
  {
    id: 'peak',
    label: 'Peak value',
    note: 'The same tokens at the token’s all-time high — not the value distributed',
    rank: rankByPeakValue,
  },
  {
    id: 'recipients',
    label: 'Recipient wallets',
    note: 'Recipients where measured, otherwise the eligible set',
    rank: rankByRecipients,
  },
  {
    id: 'year',
    label: 'Year',
    note: 'Most recent distribution first',
    rank: rankByYear,
  },
];

/* --- Wallet-count discipline -------------------------------------------- */

/* Three different populations, deliberately not collapsed into one number.
   A caller asking for "how many wallets" has to say which one it means. */
export function walletFunnel(item) {
  return [
    {
      id: 'eligible',
      label: 'Eligible wallets',
      value: item.eligibleWallets?.value ?? null,
      qualifier: item.eligibleWallets?.qualifier ?? null,
      definition: item.eligibleWallets?.definition ?? null,
      note: item.eligibleWallets?.note ?? null,
      source: item.eligibleWallets?.source ?? null,
      fallback: 'Exact eligible-wallet count not publicly disclosed.',
    },
    {
      id: 'claimants',
      label: 'Claimed in the initial window',
      value: item.initialClaimants?.value ?? null,
      qualifier: item.initialClaimants?.qualifier ?? null,
      definition: item.initialClaimants?.definition ?? null,
      asOf: item.initialClaimants?.asOf ?? null,
      source: item.initialClaimants?.source ?? null,
      fallback: 'Initial claimant count not separately reported.',
    },
    {
      id: 'recipients',
      label: 'Observed recipient addresses',
      value: item.finalRecipientAddresses?.value ?? null,
      qualifier: item.finalRecipientAddresses?.qualifier ?? null,
      definition: item.finalRecipientAddresses?.definition ?? null,
      asOf: item.finalRecipientAddresses?.asOf ?? null,
      source: item.finalRecipientAddresses?.source ?? null,
      fallback: 'Final on-chain recipient count not published.',
    },
  ];
}

/* The best available wallet figure for sorting only — it carries its own label
   so the UI never presents a recipient count as an eligibility count. */
export function recipientCount(item) {
  return item.finalRecipientAddresses?.value
    ?? item.initialClaimants?.value
    ?? item.eligibleWallets?.value
    ?? null;
}

export function recipientCountLabel(item) {
  if (Number.isFinite(item.finalRecipientAddresses?.value)) return 'observed recipients';
  if (Number.isFinite(item.initialClaimants?.value)) return 'initial claimants';
  if (Number.isFinite(item.eligibleWallets?.value)) return 'eligible wallets';
  return 'not disclosed';
}

/* --- Formatting --------------------------------------------------------- */

export function fmtTokens(value) {
  if (!Number.isFinite(value)) return t('common.unavailable');
  const format = (number, digits) => number.toLocaleString(localeTag(), { minimumFractionDigits: digits, maximumFractionDigits: digits });
  if (value >= 1e9) return `${format(value / 1e9, 2)}B`;
  if (value >= 1e6) return `${format(value / 1e6, 1)}M`;
  if (value >= 1e3) return `${format(value / 1e3, 0)}K`;
  return value.toLocaleString(localeTag());
}

export function fmtWallets(value, qualifier) {
  if (!Number.isFinite(value)) return t('common.notDisclosed');
  const text = value.toLocaleString(localeTag());
  if (qualifier === 'at-least') return `${text}+`;
  if (qualifier === 'approximate') return `~${text}`;
  return text;
}

export function fmtBigUsd(value, qualifier) {
  if (!Number.isFinite(value)) return t('common.unavailable');
  const number = (amount, digits) => amount.toLocaleString(localeTag(), { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const text = value >= 1e9
    ? `$${number(value / 1e9, 2)}B`
    : value >= 1e6
      ? `$${number(value / 1e6, 0)}M`
      : `$${value.toLocaleString(localeTag())}`;
  return qualifier === 'at-least' ? `${text}+` : qualifier === 'approximate' ? `~${text}` : text;
}

export function fmtAirdropDate(value) {
  if (!value) return t('common.unavailable');
  const parts = String(value).split('-');
  if (parts.length === 1) return parts[0];
  const options = parts.length === 2
    ? { month: 'short', year: 'numeric', timeZone: 'UTC' }
    : { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' };
  const iso = parts.length === 2 ? `${value}-01` : value;
  return new Intl.DateTimeFormat(localeTag(), options).format(new Date(`${iso}T00:00:00Z`));
}
