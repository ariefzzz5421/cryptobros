/* UI upgrades shared by every Crypto Bros route.
   Uiverse references:
   - switch: Bodyhc / light-lion-39 (MIT)
   - site search input: OnlyCodeChannel / ugly-penguin-43 (MIT)
   - route loader: andrew-manzyk / fast-vampirebat-53 (MIT)
   Markup and motion are adapted to the site's existing accessible shell. */

const STYLE_ID = 'crypto-bros-ui-upgrades';
const GLOBE_STYLE_ID = 'crypto-bros-dashboard-globe';
/* A compact open-in-place glyph rather than the previous oversized arrow: it
   is inlined instead of loaded through <img> so it inherits currentColor and
   costs no request. */
const RESEARCH_ICON_SVG = `<svg class="research-enter-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.5H19.5V10.5"/><path d="M19.5 4.5 11.25 12.75"/><path d="M18 14.25v3.9A2.85 2.85 0 0 1 15.15 21H5.85A2.85 2.85 0 0 1 3 18.15V8.85A2.85 2.85 0 0 1 5.85 6h3.9"/></svg>`;

const CHAIN_LOGOS = {
  Arbitrum: { src: '/assets/img/chains/arbitrum.png', alt: 'Arbitrum logo' },
  MegaETH: { src: '/assets/img/chains/megaeth.png', alt: 'MegaETH logo' },
  'X Layer': { src: '/assets/img/chains/xlayer.png', alt: 'X Layer logo' },
};

const SEARCH_SEED = [
  { title: 'Dashboard', href: '/', type: 'Live market', keywords: 'crypto volume heatmap trading hours memecoin' },
  { title: 'Maps', href: '/maps/', type: 'Live market', keywords: '3d globe jurisdiction exchange volume' },
  { title: 'Sentiment', href: '/sentiment/', type: 'Live market', keywords: 'platform volume revenue chains protocol' },
  { title: 'Launchpads', href: '/launchpads/', type: 'Live market', keywords: 'launchpad fees tokens' },
  { title: 'Memecoin cases', href: '/cases/', type: 'Research', keywords: 'case study token dossier lore' },
  { title: 'Airdrops', href: '/airdrops/', type: 'Research', keywords: 'airdrop distribution wallets allocation' },
  { title: '2026 Breakouts', href: '/2026-memecoins/', type: 'Research', keywords: '100m market cap threshold event memecoin' },
  { title: 'NFT history', href: '/nft/', type: 'Research', keywords: 'nft floor volume collection history' },
  { title: 'NFT 2026', href: '/nft-2026/', type: 'Research', keywords: 'nft launches 2026 floor volume' },
  { title: 'The White Whale', href: '/2026-memecoins/the-white-whale/', type: 'Threshold research', keywords: 'whitewhale solana 100m' },
  { title: 'Nietzschean Penguin', href: '/2026-memecoins/nietzschean-penguin/', type: 'Threshold research', keywords: 'penguin solana 100m' },
  { title: 'The Black Bull', href: '/2026-memecoins/the-black-bull/', type: 'Threshold research', keywords: 'ansem black bull solana 100m' },
  { title: 'Cash Cat', href: '/2026-memecoins/cash-cat/', type: 'Threshold research', keywords: 'cashcat robinhood chain 100m' },
  { title: 'Troll', href: '/2026-memecoins/troll/', type: 'Threshold research', keywords: 'troll memecoin 100m' },
];

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
  if (subtitle) subtitle.textContent = 'Reported 24h exchange volume grouped by legal jurisdiction · drag to rotate, scroll or pinch to zoom.';

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
    if (image && image.dataset.logoErrorBound !== 'true') {
      image.dataset.logoErrorBound = 'true';
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

function cleanSearchLabel(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function collectSiteSearchEntries() {
  const entries = new Map();
  const add = (entry) => {
    if (!entry?.href || !entry?.title) return;
    let url;
    try { url = new URL(entry.href, location.origin); } catch { return; }
    if (url.origin !== location.origin) return;
    const key = `${url.pathname}${url.search}`;
    const next = {
      title: cleanSearchLabel(entry.title),
      href: key || '/',
      type: cleanSearchLabel(entry.type || 'Page'),
      keywords: cleanSearchLabel(entry.keywords || ''),
    };
    if (!next.title || next.title.length > 120) return;
    const previous = entries.get(key);
    if (!previous || next.title.length < previous.title.length) entries.set(key, next);
  };

  SEARCH_SEED.forEach(add);
  document.querySelectorAll('a[href]').forEach((anchor) => {
    let url;
    try { url = new URL(anchor.href, location.href); } catch { return; }
    if (url.origin !== location.origin || url.hash && url.pathname === location.pathname) return;
    if (/\.(?:png|jpe?g|gif|webp|svg|pdf|zip|json|xml|txt)$/i.test(url.pathname)) return;
    const card = anchor.closest('.research-card, .breakout-preview-card, .nft-card, .airdrop-card, .case-card');
    const heading = card?.querySelector('h2, h3, strong, .nft-card-title, .case-card-name');
    const label = cleanSearchLabel(
      anchor.getAttribute('aria-label')
      || heading?.textContent
      || anchor.querySelector('strong, h2, h3')?.textContent
      || anchor.textContent,
    );
    if (!label || label.length < 2) return;
    const section = anchor.closest('main')?.querySelector('.eyebrow')?.textContent || '';
    add({
      title: label.replace(/^(open|read|view)\s+(research|dossier|case|detail)\s*/i, ''),
      href: `${url.pathname}${url.search}`,
      type: card ? 'Research' : 'Page',
      keywords: `${section} ${card?.textContent || ''}`.slice(0, 500),
    });
  });

  return [...entries.values()];
}

function searchEntries(entries, query) {
  const terms = cleanSearchLabel(query).toLowerCase().split(' ').filter(Boolean);
  if (!terms.length) return entries.slice(0, 8);
  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = `${entry.title} ${entry.type} ${entry.keywords} ${entry.href}`.toLowerCase();
      if (!terms.every((term) => haystack.includes(term))) return null;
      let score = 0;
      terms.forEach((term) => {
        if (title === term) score += 12;
        else if (title.startsWith(term)) score += 7;
        else if (title.includes(term)) score += 4;
        else score += 1;
      });
      return { entry, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 8)
    .map((item) => item.entry);
}

function createSearchResult(entry) {
  const link = document.createElement('a');
  link.className = 'site-search-result';
  link.href = entry.href;
  link.setAttribute('role', 'option');
  const copy = document.createElement('span');
  copy.className = 'site-search-result-copy';
  const title = document.createElement('strong');
  title.textContent = entry.title;
  const meta = document.createElement('small');
  meta.textContent = entry.type;
  copy.append(title, meta);
  const arrow = document.createElement('span');
  arrow.className = 'site-search-result-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = '↗';
  link.append(copy, arrow);
  return link;
}

function installSiteSearch() {
  const actions = document.querySelector('.head-actions');
  if (!actions || actions.querySelector('[data-site-search]')) return;

  const shell = document.createElement('div');
  shell.className = 'site-search';
  shell.dataset.siteSearch = '';
  shell.innerHTML = `
    <button class="site-search-trigger" type="button" aria-label="Search Crypto Bros" aria-expanded="false">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.2 4.2"></path></svg>
    </button>
    <div class="site-search-panel" hidden>
      <div class="site-search-input-wrap">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.2 4.2"></path></svg>
        <input class="site-search-input" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Search research, tokens, pages…" aria-label="Search this site">
        <kbd>Esc</kbd>
      </div>
      <div class="site-search-results" role="listbox" aria-label="Search results"></div>
    </div>`;

  const theme = actions.querySelector('[data-theme-toggle]');
  if (theme) theme.before(shell);
  else actions.prepend(shell);

  const trigger = shell.querySelector('.site-search-trigger');
  const panel = shell.querySelector('.site-search-panel');
  const input = shell.querySelector('.site-search-input');
  const results = shell.querySelector('.site-search-results');
  let entries = collectSiteSearchEntries();

  const render = () => {
    const matches = searchEntries(entries, input.value);
    results.replaceChildren(...matches.map(createSearchResult));
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'site-search-empty';
      empty.textContent = 'No matching page';
      results.append(empty);
    }
  };

  const setOpen = (open) => {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    shell.classList.toggle('is-open', open);
    if (open) {
      entries = collectSiteSearchEntries();
      render();
      requestAnimationFrame(() => input.focus());
    }
  };

  trigger.addEventListener('click', () => setOpen(panel.hidden));
  input.addEventListener('input', render);
  document.addEventListener('pointerdown', (event) => {
    if (!panel.hidden && !shell.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      setOpen(false);
      trigger.focus({ preventScroll: true });
      return;
    }
    const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target?.isContentEditable;
    if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      setOpen(true);
    }
  });
}

function researchTitle(card) {
  return cleanSearchLabel(
    card.querySelector('h2, h3, .nft-card-title, .case-card-name, .airdrop-project-copy strong, strong')?.textContent
    || card.getAttribute('aria-label')
    || 'research',
  );
}

function makeResearchIcon() {
  const holder = document.createElement('span');
  holder.innerHTML = RESEARCH_ICON_SVG;
  return holder.firstElementChild;
}

function decorateResearchCard(card) {
  if (!(card instanceof HTMLElement) || card.dataset.researchEnterReady === 'true') return;
  const href = card.matches('a[href]') ? card.getAttribute('href') : card.querySelector('a[href]')?.getAttribute('href');
  if (!href) return;

  card.dataset.researchEnterReady = 'true';
  card.classList.add('research-card-premium');
  const title = researchTitle(card);
  let ctas = [...card.querySelectorAll('.breakout-preview-cta, .case-card-cta, .nft-read-link')];

  if (!ctas.length && card.matches('a[href]')) {
    const cta = document.createElement('span');
    cta.className = 'research-enter-cta';
    cta.setAttribute('aria-hidden', 'true');
    card.append(cta);
    ctas = [cta];
  }
  /* The corner is where a reader looks for "open this", and it keeps the CTA
     out of the metric flow so cards of different heights still line up. */
  card.classList.add('has-corner-enter');

  ctas.forEach((cta) => {
    cta.classList.add('research-enter-cta');
    cta.replaceChildren(makeResearchIcon());
    if (cta.matches('a[href]')) {
      cta.setAttribute('aria-label', `Open ${title} research`);
      cta.removeAttribute('aria-hidden');
    } else {
      cta.setAttribute('aria-hidden', 'true');
    }
  });
}

function decorateResearchCards(root = document) {
  const selector = '.breakout-preview-card, .research-card, .nft-card';
  const cards = [
    ...(root.matches?.(selector) ? [root] : []),
    ...(root.querySelectorAll ? root.querySelectorAll(selector) : []),
  ];
  cards.forEach(decorateResearchCard);
}

/* The same glyph inside a research table's last column. The words it replaces
   ("Detail", "Case", "Open") carry no information a reader does not already
   have from the row they sit in, and a column of repeated words is noise —
   but the label still has to exist for anyone not reading the screen, so it
   moves to aria-label rather than being deleted. */
const DETAIL_LABELS = /^(detail|details|case|open|open case|read|read research|open dossier)$/i;

function detailRowLabel(link) {
  const row = link.closest('tr');
  const name = row?.querySelector('th, td')?.parentElement
    ?.querySelector('a, strong')?.textContent?.trim();
  return name ? `Open ${cleanSearchLabel(name)}` : 'Open research';
}

function decorateDetailLinks(root = document) {
  const scope = root.querySelectorAll ? root : document;
  scope.querySelectorAll('.data-table a.table-link').forEach((link) => {
    if (link.dataset.detailIconReady === 'true') return;
    const text = link.textContent.trim();
    if (!DETAIL_LABELS.test(text)) return;
    link.dataset.detailIconReady = 'true';
    link.classList.add('detail-enter-link');
    link.setAttribute('aria-label', detailRowLabel(link));
    link.title = text;
    link.replaceChildren(makeResearchIcon());
  });
}

function observeResearchCards() {
  decorateResearchCards();
  decorateDetailLinks();
  const observer = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      decorateResearchCards(node);
      decorateDetailLinks(node);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function routeTarget(anchor, event) {
  if (!anchor || anchor.hasAttribute('download') || anchor.dataset.noRouteTransition != null) return null;
  /* The drawer/sidebar deliberately navigates immediately: the transition is
     for page content and research entry points, not the navigation chrome. */
  if (anchor.closest('.primary-nav, [data-nav-panel], .nav-panel')) return null;
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
    <div class="peg-top-loader" role="status" aria-label="Opening page">
      <span class="peg-top-dot peg-top-dot-1" aria-hidden="true"></span>
      <span class="peg-top-dot peg-top-dot-2" aria-hidden="true"></span>
      <span class="peg-top-dot peg-top-dot-3" aria-hidden="true"></span>
      <span class="peg-top-dot peg-top-dot-4" aria-hidden="true"></span>
      <span class="peg-top-dot peg-top-dot-5" aria-hidden="true"></span>
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
    window.setTimeout(() => window.location.assign(url.href), reduced ? 0 : 185);
  });
}

export function initUiUpgrades() {
  ensureStylesheet(STYLE_ID, '/assets/css/ui-upgrades.css');
  decorateThemeToggle();
  enhanceDashboardGlobe();
  observeChainTable();
  installSiteSearch();
  observeResearchCards();
  installRouteTransitions();
}
