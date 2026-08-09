/* Live NFT floor data. The same-origin backend caches the CoinGecko NFT
   collection endpoint; a collection the upstream cannot resolve stays absent
   rather than being filled with an estimate. */

const snapshots = new Map();
const inflight = new Map();

export async function fetchNftFloors({ force = false, slugs = [] } = {}) {
  const normalized = [...new Set(slugs)].sort();
  const key = normalized.join(',') || 'all';
  const cached = snapshots.get(key);
  if (!force && cached && Date.now() - cached.savedAt < 30_000) return cached.value;
  if (inflight.has(key)) return inflight.get(key);
  const query = new URLSearchParams({ resource: 'nft' });
  if (normalized.length) query.set('slugs', normalized.join(','));
  const request = fetch(`/api/market/?${query}`, { headers: { accept: 'application/json' } })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Floor data HTTP ${response.status}`);
      const data = await response.json();
      if (!data?.ok) throw new Error(data?.error || 'Floor data unavailable');
      snapshots.set(key, { value: data, savedAt: Date.now() });
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

export const fmtEth = (value, digits = 2, locale = 'en-US') =>
  (Number.isFinite(value) ? `${value.toLocaleString(locale, { maximumFractionDigits: digits })} ETH` : 'Unavailable');

export const fmtMonth = (value, locale = 'en-US') => {
  const [year, month] = String(value).split('-');
  if (!month) return year;
  return new Intl.DateTimeFormat(locale, {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${year}-${month}-01T00:00:00Z`));
};

/* Accepts YYYY, YYYY-MM, or YYYY-MM-DD and never invents a missing part. */
export const fmtResearchDate = (value, locale = 'en-US') => {
  const parts = String(value).split('-');
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return fmtMonth(value, locale);
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
};
