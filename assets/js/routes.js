/* Single source of truth for the site routes.
   The shell renders these as topic columns inside the navigation drawer.
   Each route carries a small mark so a topic is recognisable at a glance;
   labels stay topic names with no numbering.

   Icons are 24x24 stroked paths drawn on currentColor. */

export const ROUTE_COLUMNS = [
  {
    id: 'market',
    label: 'Live market',
    labelId: 'Pasar langsung',
    routes: [
      {
        href: '/',
        label: 'Dashboard',
        labelId: 'Dasbor',
        note: 'Volume map, trading hours, heatmap',
        noteId: 'Peta volume, jam perdagangan, heatmap',
        /* stacked bars — the shape of the heatmap and volume panels */
        icon: 'M4 19V11M9 19V5M14 19V14M19 19V8',
      },
      {
        href: '/maps/',
        label: 'Maps',
        labelId: 'Peta',
        note: 'Volume by legal jurisdiction',
        noteId: 'Volume berdasarkan yurisdiksi hukum',
        /* globe with a meridian */
        icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
      },
      {
        href: '/sentiment/',
        label: 'Sentiment',
        labelId: 'Sentimen',
        note: 'Launchpads, chains, protocol activity',
        noteId: 'Launchpad, chain, dan aktivitas protokol',
        /* pulse line — protocol activity over time */
        icon: 'M3 12h4l3 7 4-14 3 7h4',
      },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    labelId: 'Riset',
    routes: [
      {
        href: '/cases/',
        label: 'Memecoin cases',
        labelId: 'Kasus memecoin',
        note: 'Sourced long-form case studies',
        noteId: 'Studi kasus panjang dengan sumber',
        /* article page with text lines */
        icon: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7',
      },
      {
        href: '/2026-memecoins/',
        label: 'Breakouts',
        labelId: 'Memecoin 2026',
        note: 'Verified $100M crossings',
        noteId: 'Peristiwa $100 juta yang terverifikasi',
        /* rising line breaking through a threshold */
        icon: 'M3 17l6-6 4 4 8-8M15 7h6v6',
      },
      {
        href: '/nft/',
        label: 'NFT history',
        labelId: 'Sejarah NFT',
        note: 'Collections whose floor broke 0.5 ETH',
        noteId: 'Koleksi yang menembus floor 0,5 ETH',
        /* ETH-style diamond */
        icon: 'M12 2 5 12l7 4 7-4zM5 14l7 8 7-8-7 4z',
      },
      {
        href: '/nft-2026/',
        label: 'NFT 2026',
        labelId: 'NFT 2026',
        note: 'This year’s launches past 0.1 ETH',
        noteId: 'Peluncuran tahun ini yang melewati 0,1 ETH',
        /* diamond with a spark — a new mint */
        icon: 'M11 3 5 11l6 4 6-4zM5 13l6 7 6-7-6 4zM19 2v4M21 4h-4',
      },
    ],
  },
];

export const ROUTES = ROUTE_COLUMNS.flatMap((column) => column.routes);

/* The deepest matching route wins so article endpoints highlight their parent
   topic (for example /cases/doge/ highlights Memecoin cases). */
export function activeRoute(pathname = window.location.pathname) {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  let best = null;
  for (const route of ROUTES) {
    if (route.href === '/' ? path === '/' : path.startsWith(route.href)) {
      if (!best || route.href.length > best.href.length) best = route;
    }
  }
  return best;
}
