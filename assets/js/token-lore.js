import { brandedSourceLink } from './source-brands.js';
import { el } from './utils.js';

function sourceLabel(url) {
  let host = '';
  try { host = new URL(url).hostname; } catch { return 'Source'; }
  if (host === 'x.com') return 'X';
  if (host.includes('coingecko.com')) return 'CoinGecko';
  if (host.includes('dexscreener.com')) return 'DEX Screener';
  if (host.includes('scan') || host.includes('blockchair') || host.includes('blockscout')) return 'Explorer';
  return host.replace(/^www\./, '');
}

export function renderTokenLore(holder, token) {
  if (!holder) return;
  const symbol = String(token?.symbol || token?.sym || 'TOKEN').toUpperCase();
  const lore = token?.lore || 'Lore not sufficiently verified yet.';
  const sourceUrls = [...new Set([
    token?.officialX,
    token?.officialSite,
    token?.explorer,
    token?.launchpadVerifiedSource,
    ...(token?.loreSources || []),
  ].filter(Boolean))].slice(0, 5);

  const card = el('article', { class: `token-lore-card${token?.lore ? ' is-verified' : ' is-pending'}` },
    el('header', { class: 'token-lore-head' },
      el('span', { class: 'token-lore-prompt', 'aria-hidden': 'true' }, '›_'),
      el('div', {},
        el('p', { class: 'eyebrow' }, `$${symbol} · Lore`),
        el('h2', {}, token?.lore ? 'Source-backed origin' : 'Research pending'),
      ),
      el('span', { class: 'token-lore-state' }, token?.lore ? 'Verified' : 'Unverified'),
    ),
    el('p', { class: 'token-lore-copy' }, lore),
    el('footer', { class: 'token-lore-foot' },
      el('div', { class: 'token-lore-sources', 'aria-label': 'Lore sources' },
        ...sourceUrls.map((url) => brandedSourceLink({
          label: sourceLabel(url),
          url,
          className: 'lore-source-chip',
        })),
      ),
      el('small', {}, 'Source-backed summary · Always verify the contract.'),
    ),
  );
  holder.replaceChildren(card);
}
