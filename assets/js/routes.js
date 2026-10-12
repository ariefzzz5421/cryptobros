/* Single source of truth for the site routes.
   The drawer keeps one top-to-bottom route order for every viewport.

   Icons are 24x24 stroked paths drawn on currentColor. */

export const ROUTE_COLUMNS = [
  {
    id: 'market',
    label: 'Markets',
    labelId: 'Pasar',
    routes: [
      {
        href: '/',
        label: 'Dashboard',
        labelId: 'Dasbor',
        /* stacked bars — the shape of the heatmap and volume panels */
        icon: 'M4 19V11M9 19V5M14 19V14M19 19V8',
      },
      {
        href: '/maps/',
        label: 'Maps',
        labelId: 'Peta',
        /* globe with a meridian */
        icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
      },
      {
        href: '/sentiment/',
        label: 'Sentiment',
        labelId: 'Sentimen',
        /* pulse line — protocol activity over time */
        icon: 'M3 12h4l3 7 4-14 3 7h4',
      },
      {
        href: '/launchpads/',
        label: 'Launchpads',
        labelId: 'Launchpad',
        icon: 'M5 15 9 6l4-3 6 6-3 4-3-3-3 8zM7 17l-2 3M14 16l3 3',
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
        /* article page with text lines */
        icon: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7',
      },
      {
        href: '/airdrops/',
        label: 'Airdrops',
        labelId: 'Airdrop',
        /* a parachute — tokens dropped to a wide set of wallets */
        icon: 'M12 3a8 8 0 0 0-8 8h16a8 8 0 0 0-8-8zM4 11l5 4M20 11l-5 4M12 3v12M9 15h6l-1.5 6h-3z',
      },
      {
        href: '/neobank/',
        label: 'NeoBank',
        labelId: 'NeoBank',
        /* a card over a phone — banking without a branch */
        icon: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 8h6M9 12h6M11 17h2',
      },
      {
        href: '/2026-memecoins/',
        label: 'Breakouts',
        labelId: 'Memecoin 2026',
        /* rising line breaking through a threshold */
        icon: 'M3 17l6-6 4 4 8-8M15 7h6v6',
      },
      {
        href: '/nft/',
        label: 'NFT history',
        labelId: 'Sejarah NFT',
        /* ETH-style diamond */
        icon: 'M12 2 5 12l7 4 7-4zM5 14l7 8 7-8-7 4z',
      },
      {
        href: '/nft-2026/',
        label: 'NFT 2026',
        labelId: 'NFT 2026',
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
