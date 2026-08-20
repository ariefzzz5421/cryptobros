import assert from 'node:assert/strict';
import { TOKEN_REGISTRY, findToken, registryKey, tokenDetailHref } from '../assets/js/token-registry.js';
import { getMarketPayload } from '../server/market-service.mjs';
import { chooseDexPair, pairMatchesContract } from '../server/token-utils.mjs';

function payloadUrl(resource, params = {}) {
  const url = new URL('http://localhost/api/market/');
  url.searchParams.set('resource', resource);
  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, value);
  }
  return url;
}

async function loadPayload(resource, params = {}) {
  const base = process.env.AUDIT_BASE_URL;
  if (!base) return getMarketPayload(payloadUrl(resource, params));
  const url = new URL('/api/market/', base);
  url.searchParams.set('resource', resource);
  for (const [key, value] of Object.entries(params)) {
    if (value != null) url.searchParams.set(key, value);
  }
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  assert.ok(response.ok, `${resource} HTTP ${response.status}`);
  return response.json();
}

function validateLink(token) {
  const href = tokenDetailHref(token);
  const url = new URL(href, 'https://cryptobros.test');
  assert.equal(url.pathname, '/cases/detail/');
  assert.equal(href.includes('undefined'), false);
  assert.ok(url.searchParams.get('id') || (
    url.searchParams.get('chain') && url.searchParams.get('contract')
  ));
  return href;
}

async function auditStoredDexPairs() {
  const rows = TOKEN_REGISTRY.filter((token) => token.dexScreener?.pairAddress && token.contract !== 'native');
  const failures = [];
  for (const token of rows) {
    try {
      const endpoint = `https://api.dexscreener.com/latest/dex/pairs/${encodeURIComponent(token.dexScreener.chain)}/${encodeURIComponent(token.dexScreener.pairAddress)}`;
      const response = await fetch(endpoint, { headers: { accept: 'application/json' } });
      assert.ok(response.ok, `HTTP ${response.status}`);
      const payload = await response.json();
      const pair = payload.pair || payload.pairs?.[0];
      assert.ok(pairMatchesContract(pair, token.chain, token.contract), 'pair does not contain exact contract');
    } catch (error) {
      failures.push(`${token.id}: ${error.message}`);
    }
  }
  assert.deepEqual(failures, [], `DEX pair audit failed:\n${failures.join('\n')}`);
  return rows.length;
}

async function auditAllOverviewDexPairs(tokens) {
  const candidates = tokens.filter((token) => token.identityVerified && token.contract !== 'native');
  const verified = [];
  const noPair = [];
  const errors = [];
  for (let index = 0; index < candidates.length; index += 4) {
    const chunk = candidates.slice(index, index + 4);
    await Promise.all(chunk.map(async (token) => {
      try {
        const endpoint = `https://api.dexscreener.com/token-pairs/v1/${encodeURIComponent(token.chain)}/${encodeURIComponent(token.contract)}`;
        const response = await fetch(endpoint, { headers: { accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const rows = await response.json();
        const pair = chooseDexPair(Array.isArray(rows) ? rows : [], token.chain, token.contract);
        (pair ? verified : noPair).push(token.id);
      } catch (error) {
        errors.push(`${token.id}: ${error.message}`);
      }
    }));
    if (index + 4 < candidates.length) await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return { checked: candidates.length, verified: verified.sort(), noPair: noPair.sort(), errors: errors.sort() };
}

const overview = await loadPayload('overview');
assert.equal(overview.ok, true);
assert.ok(overview.memecoins?.length > 0, 'homepage market basket is empty');
for (const token of overview.memecoins) validateLink(token);
for (const token of TOKEN_REGISTRY) validateLink(token);

const registryKeys = TOKEN_REGISTRY.map((token) => registryKey(token.chain, token.contract));
assert.equal(new Set(registryKeys).size, registryKeys.length, 'duplicate registry identities');

const launchpads = await loadPayload('launchpads');
assert.equal(launchpads.ok, true);
assert.equal(launchpads.metric?.key, 'fees30d');
assert.ok(launchpads.launchpads.length <= 5);
assert.deepEqual(
  launchpads.launchpads.map((row) => row.metrics.fees30d),
  [...launchpads.launchpads].map((row) => row.metrics.fees30d).sort((a, b) => b - a),
);
for (const launchpad of launchpads.launchpads) {
  assert.ok(launchpad.projects.length <= 10);
  if (process.env.AUDIT_REQUIRE_COVERAGE === '1') {
    assert.ok(launchpad.projects.length > 0, `${launchpad.id} has no verified project coverage`);
  }
  assert.deepEqual(
    launchpad.projects.map((row) => row.mcap),
    [...launchpad.projects].map((row) => row.mcap).sort((a, b) => b - a),
  );
  const keys = launchpad.projects.map((row) => registryKey(row.chain, row.contract));
  assert.equal(new Set(keys).size, keys.length, `${launchpad.id} has duplicate contracts`);
  assert.equal(launchpad.projects.some((row) => row.id === launchpad.nativeToken?.id), false);
  for (const row of launchpad.projects) {
    assert.equal(row.launchpadVerified, true);
    assert.ok(row.launchpadSource);
    validateLink(row);
  }
}

const dexPairs = await auditStoredDexPairs();
const loreMissing = overview.memecoins
  .filter((row) => !findToken(row)?.lore)
  .map((row) => row.id)
  .sort();
const identityUnavailable = overview.memecoins
  .filter((row) => !row.identityVerified)
  .map((row) => row.id)
  .sort();
const overviewDex = process.env.AUDIT_ALL_DEX === '1'
  ? await auditAllOverviewDexPairs(overview.memecoins)
  : null;
console.log(JSON.stringify({
  homepageTokens: overview.memecoins.length,
  homepageContractVerified: overview.memecoins.filter((row) => row.identityVerified).length,
  curatedTokens: TOKEN_REGISTRY.length,
  storedDexPairsVerified: dexPairs,
  loreMissing,
  identityUnavailable,
  overviewDex,
  launchpads: launchpads.launchpads.map((row) => ({
    rank: row.rank,
    name: row.name,
    fees30d: row.metrics.fees30d,
    verifiedProjects: row.projects.length,
  })),
}, null, 2));
