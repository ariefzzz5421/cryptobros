/* ============================================================
   ranking-board.js — one dataset, two presentations.

   A dense research table is the right shape on a desktop and the wrong shape
   on a phone: the reader has to drag sideways past four identity columns to
   reach the market number the page exists to show. So a board renders both a
   table and a stack of cards, and CSS picks one at the 640px line.

   Only one of the two is ever displayed, so the hidden branch is out of the
   accessibility tree as well as out of the layout — no aria-hidden bookkeeping
   and no duplicate announcement.
   ============================================================ */

import { el } from './utils.js';

/* A table wide enough to need scrolling is a scrollable region, and a
   scrollable region has to be reachable from the keyboard. */
export function tableScroll(table, label) {
  return el('div', {
    class: 'table-scroll',
    role: 'region',
    tabindex: '0',
    'aria-label': label || 'Scrollable table',
  }, table);
}

/* metrics are the numbers a reader came for and stay visible.
   details are secondary — contract, provenance, chart link — and sit behind a
   disclosure so the card stays short. */
export function rankCard({
  rank,
  logo,
  title,
  subtitle,
  href,
  metrics = [],
  details = [],
  detailsLabel = 'More detail',
  footer = null,
}) {
  const head = el('div', { class: 'rank-card-head' },
    rank == null ? null : el('span', { class: 'rank-card-rank num' }, rank),
    logo || null,
    el('div', { class: 'rank-card-ident' },
      href
        ? el('a', { class: 'rank-card-title', href }, title)
        : el('strong', { class: 'rank-card-title' }, title),
      subtitle ? el('small', { class: 'rank-card-sub' }, subtitle) : null,
    ),
  );

  /* Each pair is wrapped so a grid column holds a label with its own value
     rather than splitting labels and values into separate columns. */
  const grid = el('dl', { class: 'rank-card-metrics' },
    ...metrics.map(({ label, value, tone, note }) => el('div', { class: 'rank-card-metric' },
      el('dt', {}, label),
      el('dd', { class: `num${tone ? ` ${tone}` : ''}` },
        value,
        note ? el('small', {}, note) : null),
    )),
  );

  const extra = details.length
    ? el('details', { class: 'rank-card-more' },
      el('summary', {}, detailsLabel),
      el('dl', { class: 'rank-card-details' },
        ...details.flatMap(({ label, value }) => [
          el('dt', {}, label),
          el('dd', {}, value),
        ]),
      ),
    )
    : null;

  return el('li', { class: 'rank-card' }, head, grid, extra, footer);
}

/**
 * @param {object} options
 * @param {HTMLTableElement} options.table dense presentation, desktop only
 * @param {Node[]} options.cards rank cards, mobile only
 * @param {string} options.label accessible name for the scroll region
 * @param {string} [options.cardsLabel] accessible name for the card list
 */
export function rankBoard({ table, cards, label, cardsLabel }) {
  return el('div', { class: 'rank-board' },
    tableScroll(table, label),
    el('ul', { class: 'rank-cards', 'aria-label': cardsLabel || label }, ...cards),
  );
}
