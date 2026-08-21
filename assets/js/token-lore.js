import { CASES } from './cases-config.js';
import { brandedSourceLink, sourceBrand } from './source-brands.js';
import { el } from './utils.js';

const TOKEN_POLISH_STYLES = '/assets/css/token-polish.css';

function ensureTokenPolishStyles() {
  if (document.querySelector(`link[href="${TOKEN_POLISH_STYLES}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = TOKEN_POLISH_STYLES;
  document.head.append(link);
}

function sourceLabel(url) {
  let host = '';
  try { host = new URL(url).hostname; } catch { return 'Source'; }
  if (host === 'x.com') return 'X';
  if (host.includes('coingecko.com')) return 'CoinGecko';
  if (host.includes('dexscreener.com')) return 'DEX Screener';
  if (host.includes('scan') || host.includes('blockchair') || host.includes('blockscout')) return 'Explorer';
  return host.replace(/^www\./, '');
}

function matchingCase(token) {
  const ids = new Set([
    token?.id,
    token?.coingeckoId,
  ].filter(Boolean).map((value) => String(value)));
  return CASES.find((item) => ids.has(String(item.id)) || ids.has(String(item.slug))) || null;
}

function creatorInfo(token) {
  const caseDef = matchingCase(token);
  const raw = String(token?.creator || caseDef?.creator || '').trim();
  const profiles = [
    ...(Array.isArray(token?.creatorProfiles) ? token.creatorProfiles : []),
    ...(Array.isArray(caseDef?.creatorProfiles) ? caseDef.creatorProfiles : []),
  ]
    .filter((profile) => profile?.url)
    .filter((profile, index, rows) => rows.findIndex((row) => row.url === profile.url) === index);
  const anonymous = !raw || /anonymous|not publicly verified|unknown deployer|unknown creator/i.test(raw);

  return {
    label: anonymous ? 'Anon' : raw,
    note: anonymous && raw ? raw : '',
    profiles,
  };
}

function creatorBlock(token) {
  const creator = creatorInfo(token);
  const socials = creator.profiles.length
    ? creator.profiles.map((profile) => brandedSourceLink({
      label: profile.label || sourceLabel(profile.url),
      url: profile.url,
      className: 'creator-social-chip',
    }))
    : [el('span', { class: 'creator-anon-chip', title: 'No verified creator social profile' },
      el('img', {
        src: '/assets/img/sources/anon.svg',
        alt: '',
        width: '22',
        height: '22',
        'aria-hidden': 'true',
      }),
      el('strong', {}, 'Anon'),
    )];

  return el('div', { class: 'token-lore-creator' },
    el('div', { class: 'token-lore-creator-copy' },
      el('span', {}, 'Creator'),
      el('strong', {}, creator.label),
      creator.note ? el('small', {}, creator.note) : null,
    ),
    el('div', { class: 'token-lore-creator-socials', 'aria-label': 'Creator social profiles' }, ...socials),
  );
}

function loreSourceLink(url, token) {
  const brand = sourceBrand(url);
  const fallbackLogo = brand.logo
    ? ''
    : url === token?.officialSite && token?.logo
      ? token.logo
      : '/assets/img/sources/link.svg';
  const label = sourceLabel(url);
  const link = brandedSourceLink({
    label,
    url,
    logo: fallbackLogo,
    className: 'lore-source-chip is-icon-only',
  });
  link.title = label;
  return link;
}

export function renderTokenLore(holder, token) {
  if (!holder) return;
  ensureTokenPolishStyles();
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
    creatorBlock(token),
    el('footer', { class: 'token-lore-foot' },
      el('div', { class: 'token-lore-sources', 'aria-label': 'Lore sources' },
        ...sourceUrls.map((url) => loreSourceLink(url, token)),
      ),
      el('small', {}, 'Source-backed summary · Always verify the contract.'),
    ),
  );
  holder.replaceChildren(card);
}
