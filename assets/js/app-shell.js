/* Shared route shell.
   Navigation lives in a drawer opened by the three-line button that sits in the
   header beside the theme toggle. Every page keeps an empty
   <nav class="primary-nav">; the shell fills it from routes.js so a new route
   appears site-wide at once. */

import { ROUTE_COLUMNS, activeRoute } from './routes.js';
import { getLocale, t } from './i18n.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/* Readiness reported in words as well as by the dot's colour, so the state is
   not carried by colour alone. Keys match the classes setStatus() already
   writes, and every page keeps its own setStatus() untouched. */
const STATUS_STATE = {
  ok: 'Ready',
  busy: 'Partial',
  err: 'Error',
  '': 'Loading',
};

function routeIcon(path) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'nav-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const shape = document.createElementNS(SVG_NS, 'path');
  shape.setAttribute('d', path);
  svg.append(shape);
  return svg;
}

/* The launcher and drawer sit under the header, whose height differs between
   pages that carry a status bar and those that do not. Measuring beats
   hard-coding it. */
function trackHeaderHeight() {
  const head = document.querySelector('.site-head');
  if (!head) return;
  const apply = () => {
    document.documentElement.style.setProperty('--head-h', `${Math.round(head.offsetHeight)}px`);
  };
  apply();
  if ('ResizeObserver' in window) new ResizeObserver(apply).observe(head);
  else window.addEventListener('resize', apply);
}

function buildLauncher(navId) {
  const button = document.createElement('button');
  button.className = 'nav-launcher';
  button.type = 'button';
  button.dataset.navToggle = '';
  button.setAttribute('aria-controls', navId);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', t('nav.open'));
  button.innerHTML =
    '<span class="nav-launcher-bars" aria-hidden="true"><span></span><span></span><span></span></span>';
  return button;
}

function buildColumns(nav, current) {
  const head = document.createElement('div');
  head.className = 'nav-panel-head';
  head.innerHTML = `<p class="nav-panel-title">${t('nav.routes')}</p><p class="nav-panel-sub">${t('nav.prompt')}</p>`;

  const columns = document.createElement('div');
  columns.className = 'nav-columns';

  for (const column of ROUTE_COLUMNS) {
    const section = document.createElement('section');
    section.className = 'nav-column';

    const heading = document.createElement('h2');
    heading.className = 'nav-column-title';
    heading.textContent = getLocale() === 'id' ? column.labelId : column.label;
    section.append(heading);

    for (const route of column.routes) {
      const link = document.createElement('a');
      link.href = route.href;
      if (current && route.href === current.href) {
        link.className = 'is-active';
        link.setAttribute('aria-current', 'page');
      }
      const copy = document.createElement('span');
      copy.className = 'nav-copy';
      const label = document.createElement('strong');
      label.textContent = getLocale() === 'id' ? route.labelId : route.label;
      const note = document.createElement('small');
      note.textContent = getLocale() === 'id' ? route.noteId : route.note;
      copy.append(label, note);
      link.append(routeIcon(route.icon), copy);
      section.append(link);
    }
    columns.append(section);
  }

  nav.replaceChildren(head, columns);
}

/* The readiness line used to sit under the brand, where it cost about 30px of
   a phone's first screen on every route. It belongs with provenance, so the
   shell moves the page's existing .status-bar into the footer instead of each
   page duplicating footer markup. Pages keep writing to #statusDot and
   #statusText exactly as before — the node simply lives somewhere else.

   The footer slot is created before the move and carries the row's height, so
   relocating the bar does not shift the layout on load. */
export function initSiteStatus() {
  const bar = document.querySelector('.status-bar');
  const foot = document.querySelector('.site-foot');
  if (!bar || !foot) return;
  if (bar.closest('.site-foot')) return;

  const slot = document.createElement('div');
  slot.className = 'site-foot-status';
  foot.append(slot);

  bar.classList.remove('wrap');
  slot.append(bar);

  const dot = bar.querySelector('.dot');
  if (!dot) return;

  /* One label element, kept in step with the dot's class by an observer, so a
     page that swaps the class through its own setStatus() stays described. */
  let label = bar.querySelector('.status-state');
  if (!label) {
    label = document.createElement('span');
    label.className = 'status-state';
    dot.after(label);
  }
  const sync = () => {
    const kind = ['ok', 'busy', 'err'].find((name) => dot.classList.contains(name)) || '';
    const text = STATUS_STATE[kind];
    label.textContent = text;
    bar.setAttribute('role', 'status');
    dot.setAttribute('aria-hidden', 'true');
  };
  sync();
  new MutationObserver(sync).observe(dot, { attributes: true, attributeFilter: ['class'] });
}

export function initAppShell() {
  const nav = document.querySelector('.primary-nav');
  if (!nav) return;

  nav.id ||= 'primaryNavigation';
  nav.setAttribute('aria-label', 'Primary navigation');
  buildColumns(nav, activeRoute());
  const brand = document.querySelector('.brand');
  const brandTitle = brand?.querySelector('h1');
  const brandMark = brand?.querySelector('.brand-mark');
  if (brandTitle) brandTitle.textContent = 'Crypto Bros';
  if (brandMark) {
    brandMark.src = '/assets/img/brand/crypto-bros-mark.webp';
    brandMark.alt = 'Crypto Bros';
  }
  initSiteStatus();
  trackHeaderHeight();
  /* The drawer is fixed to the viewport, so it is moved out of the header to
     stay clear of any ancestor that would become its containing block. */
  if (nav.parentElement !== document.body) document.body.append(nav);

  document.querySelectorAll('.nav-toggle').forEach((old) => old.remove());
  const toggle = document.querySelector('.nav-launcher') || buildLauncher(nav.id);
  /* Sits inside the header next to the theme toggle, falling back to the body
     on any page that somehow lacks the actions group. */
  if (!toggle.isConnected) (document.querySelector('.head-actions') || document.body).append(toggle);

  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('button');
    backdrop.className = 'nav-backdrop';
    backdrop.type = 'button';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'Close navigation');
    document.body.append(backdrop);
  }
  backdrop.hidden = true;

  const setOpen = (open, { returnFocus = false } = {}) => {
    document.body.toggleAttribute('data-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? t('nav.close') : t('nav.open'));
    backdrop.hidden = !open;
    if (open) {
      requestAnimationFrame(() => (nav.querySelector('[aria-current="page"]') || nav.querySelector('a'))?.focus());
    } else if (returnFocus) {
      toggle.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => setOpen(!document.body.hasAttribute('data-nav-open'), { returnFocus: true }));
  backdrop.addEventListener('click', () => setOpen(false, { returnFocus: true }));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.hasAttribute('data-nav-open')) {
      setOpen(false, { returnFocus: true });
    }
  });
  window.addEventListener('localechange', () => {
    buildColumns(nav, activeRoute());
    toggle.setAttribute('aria-label', document.body.hasAttribute('data-nav-open') ? t('nav.close') : t('nav.open'));
  });
}
