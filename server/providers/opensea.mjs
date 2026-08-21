/* ============================================================
   opensea.mjs — server-side OpenSea V2 provider.

   The API key is read from process.env.OPENSEA_API_KEY and never leaves this
   module. Nothing here is imported by anything in assets/js, so the key cannot
   reach a browser bundle; the client only ever sees the normalised shape
   returned by normaliseStats().

   Missing key is a supported state, not a failure. Every function returns
   { available: false, reason } and the pages carry on with their sourced
   static research and the existing CoinGecko floors.

   TTLs match how fast each figure actually moves. A lifetime volume that has
   accumulated over five years does not need a 60-second refresh.
   ============================================================ */

const API = 'https://api.opensea.io/api/v2';

export const TTL = {
  floor: 5 * 60_000,
  volume24h: 5 * 60_000,
  lifetimeVolume: 15 * 60_000,
  floorHistory: 6 * 60 * 60_000,
};

const cache = new Map();
const inflight = new Map();

export const MISSING_KEY = Object.freeze({
  available: false,
  reason: 'OpenSea API key not configured',
});

function apiKey() {
  const key = process.env.OPENSEA_API_KEY;
  return typeof key === 'string' && key.trim() ? key.trim() : null;
}

export function isConfigured() {
  return apiKey() !== null;
}

/* One in-flight request per key, and a cached value served until its own TTL
   expires — so ten collections rendering at once cost one upstream call each,
   not ten apiece. */
async function cached(key, ttl, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.savedAt < ttl) return hit.value;
  if (inflight.has(key)) return inflight.get(key);

  const request = loader()
    .then((value) => {
      cache.set(key, { value, savedAt: Date.now() });
      return value;
    })
    .catch((error) => {
      /* A stale value beats an error page for a figure that changes slowly. */
      if (hit) return { ...hit.value, stale: true, staleReason: error.message };
      throw error;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, request);
  return request;
}

async function request(path, { timeout = 12_000 } = {}) {
  const key = apiKey();
  if (!key) throw new Error(MISSING_KEY.reason);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${API}${path}`, {
      headers: { accept: 'application/json', 'x-api-key': key },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`OpenSea HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

const numberOrNull = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/* OpenSea reports collection stats in the collection's native payment token.
   A collection priced in something other than ETH is reported as unavailable
   rather than having its figures silently treated as ETH — mixing a USD or
   alt-token volume into an ETH threshold would break the inclusion rule. */
export function normaliseStats(slug, payload) {
  const total = payload?.total || {};
  const intervals = Array.isArray(payload?.intervals) ? payload.intervals : [];
  const daily = intervals.find((row) => row?.interval === 'one_day');

  const symbol = String(
    total.floor_price_symbol || payload?.floor_price_symbol || '',
  ).toUpperCase();

  /* WETH and ETH are the same unit of account for a floor threshold. */
  const isEth = symbol === 'ETH' || symbol === 'WETH' || symbol === '';
  if (!isEth) {
    return {
      slug,
      available: false,
      reason: `Collection is priced in ${symbol}; ETH-denominated thresholds do not apply`,
      currency: symbol,
      source: 'OpenSea',
      fetchedAt: Date.now(),
    };
  }

  return {
    slug,
    available: true,
    floorEth: numberOrNull(total.floor_price),
    lifetimeVolumeEth: numberOrNull(total.volume),
    volume24hEth: numberOrNull(daily?.volume),
    owners: numberOrNull(total.num_owners),
    sales: numberOrNull(total.sales),
    marketCapEth: numberOrNull(total.market_cap),
    currency: 'ETH',
    fetchedAt: Date.now(),
    source: 'OpenSea',
  };
}

/**
 * GET /api/v2/collections/{slug}/stats
 * Floor price, lifetime volume, 24h volume, owners and sales.
 */
export async function getCollectionStats(slug) {
  if (!isConfigured()) return { ...MISSING_KEY, slug };
  try {
    const payload = await cached(
      `stats:${slug}`,
      TTL.lifetimeVolume,
      () => request(`/collections/${encodeURIComponent(slug)}/stats`),
    );
    return normaliseStats(slug, payload);
  } catch (error) {
    return { slug, available: false, reason: error.message, source: 'OpenSea', fetchedAt: Date.now() };
  }
}

/**
 * GET /api/v2/collections/{slug}/floor_prices?timeframe=all_time
 * Historical floor series, used to document a peak floor from data rather than
 * from a headline.
 */
export async function getCollectionFloorHistory(slug, timeframe = 'all_time') {
  if (!isConfigured()) return { ...MISSING_KEY, slug };
  try {
    const payload = await cached(
      `floors:${slug}:${timeframe}`,
      TTL.floorHistory,
      () => request(`/collections/${encodeURIComponent(slug)}/floor_prices?timeframe=${encodeURIComponent(timeframe)}`),
    );
    const points = (Array.isArray(payload?.floor_prices) ? payload.floor_prices : [])
      .map((row) => ({
        at: row?.timestamp ?? row?.date ?? null,
        floorEth: numberOrNull(row?.price ?? row?.floor_price),
      }))
      .filter((row) => Number.isFinite(row.floorEth));

    const peak = points.reduce(
      (best, row) => (best == null || row.floorEth > best.floorEth ? row : best),
      null,
    );

    return {
      slug,
      available: true,
      timeframe,
      points,
      peakFloorEth: peak?.floorEth ?? null,
      peakFloorAt: peak?.at ?? null,
      currency: 'ETH',
      fetchedAt: Date.now(),
      source: 'OpenSea',
    };
  } catch (error) {
    return { slug, available: false, reason: error.message, source: 'OpenSea', fetchedAt: Date.now() };
  }
}

/* Convenience for the NFT routes: many collections in one pass, each failure
   isolated so one bad slug never takes the page down. */
export async function getManyCollectionStats(slugs = []) {
  const results = await Promise.all(slugs.map((slug) => getCollectionStats(slug)));
  return Object.fromEntries(results.map((row) => [row.slug, row]));
}
