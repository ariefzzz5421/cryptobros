/* UI upgrades shared by every Crypto Bros route.
   Uiverse references:
   - switch: Bodyhc / light-lion-39 (MIT)
   - loader: xXJollyHAKERXx / lucky-falcon-75 (MIT)
   The markup is adapted to the site's existing button semantics and route shell. */

const STYLE_ID = 'crypto-bros-ui-upgrades';
const GLOBE_STYLE_ID = 'crypto-bros-dashboard-globe';

const CHAIN_LOGOS = {
  Arbitrum: { src: '/assets/img/chains/arbitrum.png', alt: 'Arbitrum logo' },
  MegaETH: { src: '/assets/img/chains/megaeth.png', alt: 'MegaETH logo' },
  'X Layer': { src: '/assets/img/chains/xlayer.png', alt: 'X Layer logo' },
};

function ensureStylesheet(id, href) {
  if (document.getElementById(id) || document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.append(link);
}

function decorateThemeToggle() {
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    if (button.dataset.uiverseTheme === 'ready') return;
    button.dataset.uiverseTheme = 'ready';
    button.classList.add('theme-toggle-uiverse');
    button.innerHTML = `
      <span class="theme-switch-track" aria-hidden="true">
        <span class="theme-switch-icon theme-switch-sun">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path></svg>
        </span>
        <span class="theme-switch-icon theme-switch-moon">
          <svg viewBox="0 0 24 24"><path d="M20.2 15.2A8.2 8.2 0 0 1 8.8 3.8a8.5 8.5 0 1 0 11.4 11.4Z"></path></svg>
        </span>
        <span class="theme-switch-thumb"></span>
      </span>`;
  });
}

function enhanceDashboardGlobe() {
  const path = window.location.pathname.replace(/\/index\.html$/, '/');
  if (path !== '/') return;
  const panel = document.getElementById('map');
  const holder = panel?.querySelector('.map-holder');
  const canvas = holder?.querySelector('#mapCanvas');
  if (!panel || !holder || !canvas) return;

  ensureStylesheet(GLOBE_STYLE_ID, '/assets/css/globe-map.css');
  panel.classList.add('map-route-panel', 'is-globe', 'dashboard-globe-panel');
  holder.classList.add('globe-holder');

  const title = panel.querySelector('.panel-head h2');
  if (title && !title.closest('.globe-ranking-head')) {
    const row = document.createElement('div');
    row.className = 'globe-ranking-head';
    title.before(row);
    row.append(title);
    const pill = document.createElement('span');
    pill.className = 'map-mode-pill';
    pill.textContent = '3D interactive';
    row.append(pill);
  }

  const subtitle = panel.querySelector('.panel-sub');
  if (subtitle) {
    subtitle.textContent = 'Reported 24h exchange volume grouped by legal jurisdiction · drag to rotate, scroll or pinch to zoom.';
  }

  if (!holder.querySelector('.globe-hud')) {
    const hud = document.createElement('div');
    hud.className = 'globe-hud';
    hud.innerHTML = '<span>Jurisdiction field</span><span>3D live globe</span>';
    canvas.before(hud);
  }

  if (!holder.querySelector('.top-marker-legend')) {
    const legend = document.createElement('div');
    legend.className = 'top-marker-legend';
    legend.innerHTML = '<span>#1</span> largest volume';
    holder.append(legend);
  }

  if (!holder.querySelector('.globe-instruction')) {
    const instruction = document.createElement('div');
    instruction.className = 'globe-instruction';
    instruction.textContent = 'DRAG ROTATE · WHEEL / PINCH ZOOM · CLICK SIGNAL FOR EXCHANGE DETAIL';
    holder.append(instruction);
  }

  const loading = holder.querySelector('#mapLoading');
  if (loading) loading.innerHTML = '<span class="spinner"></span> Loading globe geometry…';
}

function patchChainTable() {
  const holder = document.getElementById('chainTable');
  const table = holder?.querySelector('table');
  if (!table) return;
  table.classList.add('chain-ranking-table');

  table.querySelectorAll('tbody tr').forEach((row) => {
    const cell = row.querySelector('.chain-cell');
    if (!cell) return;
    const nameNode = cell.querySelector('.table-link, strong');
    const name = nameNode?.textContent?.trim();
    if (!name) return;

    const meta = CHAIN_LOGOS[name];
    if (meta) {
      let image = cell.querySelector('img.chain-logo');
      if (!image) {
        image = document.createElement('img');
        image.className = 'chain-logo';
        image.width = 30;
        image.height = 30;
        image.loading = 'lazy';
        cell.prepend(image);
      }
      if (!image.src.endsWith(meta.src)) image.src = meta.src;
      image.alt = meta.alt;
      image.dataset.localChainMark = 'true';
    }

    const image = cell.querySelector('img.chain-logo');
    if (image) {
      image.width = 30;
      image.height = 30;
      image.addEventListener('error', () => {
        image.hidden = true;
        if (!cell.querySelector('.chain-logo-fallback')) {
          const fallback = document.createElement('span');
          fallback.className = 'chain-logo-fallback';
          fallback.textContent = name.slice(0, 1).toUpperCase();
          cell.prepend(fallback);
        }
      }, { once: true });
    }
  });
}

function observeChainTable() {
  const holder = document.getElementById('chainTable');
  if (!holder) return;
  patchChainTable();
  const observer = new MutationObserver(() => patchChainTable());
  observer.observe(holder, { childList: true, subtree: true });
}

function routeTarget(anchor, event) {
  if (!anchor || anchor.hasAttribute('download') || anchor.dataset.noRouteTransition != null) return null;
  if (anchor.target && anchor.target !== '_self') return null;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  let url;
  try { url = new URL(anchor.href, window.location.href); } catch { return null; }
  if (url.origin !== window.location.origin) return null;
  if (/\.(?:png|jpe?g|gif|webp|svg|pdf|zip|json|xml|txt)$/i.test(url.pathname)) return null;
  const sameDocument = url.pathname === location.pathname && url.search === location.search;
  if (sameDocument && url.hash) return null;
  if (url.href === location.href) return null;
  return url;
}

function createRouteTransition() {
  let overlay = document.querySelector('.route-transition');
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.className = 'route-transition';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="falcon-loader-shell" role="status" aria-label="Opening page">
      <div class="falcon-loader" aria-hidden="true">
        <span class="falcon-orbit falcon-orbit-a"></span>
        <span class="falcon-orbit falcon-orbit-b"></span>
        <span class="falcon-orbit falcon-orbit-c"></span>
        <span class="falcon-core"></span>
      </div>
      <span class="falcon-loader-label">Opening research endpoint</span>
    </div>`;
  document.body.append(overlay);
  return overlay;
}

function installRouteTransitions() {
  const overlay = createRouteTransition();
  let leaving = false;

  const reset = () => {
    leaving = false;
    overlay.classList.remove('is-visible');
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('is-route-leaving');
  };

  window.addEventListener('pageshow', reset);

  document.addEventListener('click', (event) => {
    if (leaving) return;
    const anchor = event.target.closest?.('a[href]');
    const url = routeTarget(anchor, event);
    if (!url) return;

    event.preventDefault();
    leaving = true;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('is-route-leaving');
    requestAnimationFrame(() => overlay.classList.add('is-visible'));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => window.location.assign(url.href), reduced ? 0 : 165);
  });
}

export function initUiUpgrades() {
  ensureStylesheet(STYLE_ID, '/assets/css/ui-upgrades.css');
  decorateThemeToggle();
  enhanceDashboardGlobe();
  observeChainTable();
  installRouteTransitions();
}
