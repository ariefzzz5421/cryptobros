/* ============================================================
   treemap.js — heatmap volume memecoin
   Luas ubin  = pangsa volume 24 jam (magnitude)
   Warna ubin = perubahan harga (diverging biru=naik / merah=turun)
   Setiap ubin membawa label persen langsung, jadi identitas tidak
   pernah bergantung pada warna saja.
   ============================================================ */

import { squarify } from './analytics.js';
import {
  PALETTE, divColor, inkOn, fmtUsd, fmtPct, fmtPrice, el,
} from './utils.js';
import { positionTip } from './hours.js';
import { escapeHtml } from './worldmap.js';
import { getLocale } from './i18n.js';

export const CHANGE_FIELDS = {
  '1h': { key: 'ch1h', label: '1 hour', cap: 8 },
  '24h': { key: 'ch24h', label: '24 hours', cap: 20 },
  '7d': { key: 'ch7d', label: '7 days', cap: 40 },
};

const isId = () => getLocale() === 'id';
const periodLabel = (field) => isId()
  ? ({ '1 hour': '1 jam', '24 hours': '24 jam', '7 days': '7 hari' }[field.label] || field.label)
  : field.label;

export function renderTreemap(container, coins, {
  tooltip, changeField = '24h', limit = 40, onSelect,
} = {}) {
  container.innerHTML = '';
  const field = CHANGE_FIELDS[changeField] || CHANGE_FIELDS['24h'];

  const w = Math.max(320, container.clientWidth || 800);
  const h = Math.max(320, container.clientHeight || 460);

  const items = coins
    .filter((c) => c.vol > 0)
    .slice(0, limit)
    .map((c) => ({ value: c.vol, coin: c }));

  if (!items.length) {
    container.append(el('p', { class: 'note' }, isId() ? 'Data volume memecoin tidak tersedia.' : 'Memecoin volume data is unavailable.'));
    return;
  }

  const totalVol = items.reduce((s, i) => s + i.value, 0);
  const tiles = squarify(items, 0, 0, w, h);

  for (const t of tiles) {
    const c = t.coin;
    const image = /^https?:\/\//i.test(c.image || '') ? c.image : '';
    const pct = c[field.key];
    const bg = divColor(pct, field.cap);
    const fg = inkOn(bg);
    const share = c.vol / totalVol;

    const node = el('div', {
      class: 'tile',
      style: {
        left: `${t.x}px`, top: `${t.y}px`,
        width: `${Math.max(0, t.w - 2)}px`, height: `${Math.max(0, t.h - 2)}px`,
        background: bg, color: fg,
      },
      tabindex: '0',
      role: 'listitem',
      'aria-label': isId()
        ? `${c.name}, volume ${fmtUsd(c.vol)}, perubahan ${periodLabel(field)} ${fmtPct(pct)}`
        : `${c.name}, volume ${fmtUsd(c.vol)}, ${field.label} change ${fmtPct(pct)}`,
    });

    const big = t.w > 78 && t.h > 52;
    const mid = t.w > 52 && t.h > 34;

    if (big) {
      node.append(...[
        image ? el('img', {
          class: 'tile-logo',
          src: image,
          alt: '',
          width: '30',
          height: '30',
          loading: 'lazy',
          onerror: (event) => { event.currentTarget.hidden = true; },
        }) : null,
        el('span', { class: 'tile-sym' }, c.sym),
        el('span', { class: 'tile-pct' }, fmtPct(pct, 1)),
        el('span', { class: 'tile-vol' }, fmtUsd(c.vol, 1)),
      ].filter(Boolean));
    } else if (mid) {
      node.append(...[
        image && t.w > 66 && t.h > 42 ? el('img', {
          class: 'tile-logo sm',
          src: image,
          alt: '',
          width: '18',
          height: '18',
          loading: 'lazy',
          onerror: (event) => { event.currentTarget.hidden = true; },
        }) : null,
        el('span', { class: 'tile-sym sm' }, c.sym),
        el('span', { class: 'tile-pct sm' }, fmtPct(pct, 0)),
      ].filter(Boolean));
    } else if (t.w > 26 && t.h > 16) {
      node.append(el('span', { class: 'tile-sym xs' }, c.sym));
    }

    const show = (evt) => {
      if (!tooltip) return;
      tooltip.innerHTML = `
        <div class="tip-head">
          ${image
    ? `<img class="tip-logo" src="${escapeHtml(image)}" alt="" width="24" height="24">`
    : `<span class="tip-dot" style="background:${bg}"></span>`}
          <strong>${escapeHtml(c.name)}</strong>
          <span class="tip-rank">${escapeHtml(c.sym)}</span>
        </div>
        <dl class="tip-grid">
          <dt>${isId() ? 'Harga' : 'Price'}</dt><dd class="num">${fmtPrice(c.price)}</dd>
          <dt>${isId() ? 'Volume 24 jam' : '24h volume'}</dt><dd class="num">${fmtUsd(c.vol)}</dd>
          <dt>${isId() ? 'Pangsa keranjang' : 'Basket share'}</dt><dd class="num">${(share * 100).toFixed(2)}%</dd>
          <dt>${isId() ? 'Kapitalisasi pasar' : 'Market cap'}</dt><dd class="num">${fmtUsd(c.mcap)}</dd>
          <dt>Vol / Kap</dt><dd class="num">${c.mcap ? (c.vol / c.mcap).toFixed(3) : '—'}</dd>
          <dt>${isId() ? 'Perubahan 1 jam' : '1h change'}</dt><dd class="num ${sign(c.ch1h)}">${fmtPct(c.ch1h)}</dd>
          <dt>${isId() ? 'Perubahan 24 jam' : '24h change'}</dt><dd class="num ${sign(c.ch24h)}">${fmtPct(c.ch24h)}</dd>
          <dt>${isId() ? 'Perubahan 7 hari' : '7d change'}</dt><dd class="num ${sign(c.ch7d)}">${fmtPct(c.ch7d)}</dd>
        </dl>`;
      tooltip.hidden = false;
      positionTip(tooltip, container, evt);
    };

    node.addEventListener('mousemove', show);
    node.addEventListener('focus', show);
    node.addEventListener('mouseleave', () => { if (tooltip) tooltip.hidden = true; });
    node.addEventListener('blur', () => { if (tooltip) tooltip.hidden = true; });
    if (onSelect) {
      node.setAttribute('role', 'link');
      node.addEventListener('click', () => onSelect(c));
      node.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onSelect(c);
      });
    }

    container.append(node);
  }
}

const sign = (v) => (!Number.isFinite(v) ? '' : v >= 0 ? 'up' : 'down');

/* ---------------- Legenda diverging ---------------- */

export function renderDivLegend(container, changeField = '24h') {
  const field = CHANGE_FIELDS[changeField] || CHANGE_FIELDS['24h'];
  container.innerHTML = '';
  const bar = el('div', { class: 'legend-bar' });
  for (const c of [...PALETTE.divDown].reverse()) bar.append(el('span', { style: { background: c } }));
  bar.append(el('span', { style: { background: PALETTE.divMid } }));
  for (const c of PALETTE.divUp) bar.append(el('span', { style: { background: c } }));

  container.append(
    el('span', { class: 'legend-title' }, isId() ? `Perubahan ${periodLabel(field)}` : `${field.label} change`),
    el('span', { class: 'legend-end' }, `≤ −${field.cap}%`),
    bar,
    el('span', { class: 'legend-end' }, `≥ +${field.cap}%`),
    el('span', { class: 'legend-note' }, isId() ? 'biru = naik · merah = turun' : 'blue = up · red = down'),
  );
}

/* ---------------- Tampilan tabel (kanal pemulihan a11y) ---------------- */

export function renderCoinTable(container, coins, limit = 40, { onSelect, hrefFor } = {}) {
  container.innerHTML = '';
  const rows = coins.slice(0, limit);
  const total = rows.reduce((s, c) => s + c.vol, 0);

  const table = el('table', { class: 'data-table' });
  table.append(el('caption', {}, isId() ? `${rows.length} memecoin teratas berdasarkan volume 24 jam` : `Top ${rows.length} memecoins by 24h volume`));
  const thead = el('thead', {}, el('tr', {},
    el('th', { scope: 'col' }, '#'),
    el('th', { scope: 'col' }, isId() ? 'Koin' : 'Coin'),
    el('th', { scope: 'col', class: 'r' }, isId() ? 'Harga' : 'Price'),
    el('th', { scope: 'col', class: 'r' }, isId() ? 'Volume 24 jam' : '24h volume'),
    el('th', { scope: 'col', class: 'r' }, isId() ? 'Pangsa' : 'Share'),
    el('th', { scope: 'col', class: 'r' }, isId() ? 'Kapitalisasi pasar' : 'Market cap'),
    el('th', { scope: 'col', class: 'r' }, '1h'),
    el('th', { scope: 'col', class: 'r' }, '24h'),
    el('th', { scope: 'col', class: 'r' }, '7d'),
  ));
  const tbody = el('tbody');
  rows.forEach((c, i) => {
    const image = /^https?:\/\//i.test(c.image || '') ? c.image : '';
    const href = hrefFor ? hrefFor(c) : '';
    const row = el('tr', {
      class: onSelect ? 'clickable' : '',
      tabindex: onSelect ? '0' : null,
      onclick: onSelect ? () => onSelect(c) : null,
      onkeydown: onSelect ? (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onSelect(c);
      } : null,
    },
      el('td', { class: 'muted' }, String(i + 1)),
      el('td', {}, el(href ? 'a' : 'span', href ? {
        class: 'coin-cell compact-coin-cell table-token-link', href,
      } : { class: 'coin-cell compact-coin-cell' },
        image ? el('img', {
          class: 'row-logo',
          src: image,
          alt: '',
          width: '24',
          height: '24',
          loading: 'lazy',
          onerror: (event) => { event.currentTarget.hidden = true; },
        }) : null,
        el('span', {},
          el('strong', {}, c.sym),
          el('small', {}, c.name),
        ),
      )),
      el('td', { class: 'r num' }, fmtPrice(c.price)),
      el('td', { class: 'r num' }, fmtUsd(c.vol)),
      el('td', { class: 'r num' }, `${((c.vol / total) * 100).toFixed(2)}%`),
      el('td', { class: 'r num' }, fmtUsd(c.mcap)),
      el('td', { class: `r num ${sign(c.ch1h)}` }, fmtPct(c.ch1h, 1)),
      el('td', { class: `r num ${sign(c.ch24h)}` }, fmtPct(c.ch24h, 1)),
      el('td', { class: `r num ${sign(c.ch7d)}` }, fmtPct(c.ch7d, 1)),
    );
    tbody.append(row);
  });
  table.append(thead, tbody);
  container.append(table);
}
