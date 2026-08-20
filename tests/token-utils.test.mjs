import test from 'node:test';
import assert from 'node:assert/strict';
import { LAUNCHPAD_DEFINITIONS } from '../server/launchpad-config.mjs';
import { launchpadMetricWithFallback } from '../server/market-service.mjs';
import {
  buildCoinDirectory,
  calculateMarketCapComparison,
  chooseDexPair,
  rankVerifiedLaunches,
  resolveCoinIdentity,
  sameContract,
} from '../server/token-utils.mjs';

test('contract comparison follows chain rules', () => {
  assert.equal(sameContract('ethereum', '0xAbC', '0xabc'), true);
  assert.equal(sameContract('solana', 'AbC', 'abc'), false);
  assert.equal(sameContract('solana', 'AbC', 'AbC'), true);
});

test('Dex resolver rejects ticker matches and chooses deepest exact pair', () => {
  const rows = [
    { chainId: 'solana', baseToken: { symbol: 'SAME', address: 'spoof' }, liquidity: { usd: 9_000_000 }, volume: { h24: 9_000_000 } },
    { chainId: 'solana', baseToken: { symbol: 'SAME', address: 'ExactMint' }, liquidity: { usd: 50_000 }, volume: { h24: 2_000_000 }, pairAddress: 'lower' },
    { chainId: 'solana', baseToken: { symbol: 'OTHER', address: 'ExactMint' }, liquidity: { usd: 100_000 }, volume: { h24: 1 }, pairAddress: 'deepest' },
  ];
  assert.equal(chooseDexPair(rows, 'solana', 'ExactMint')?.pairAddress, 'deepest');
  assert.equal(chooseDexPair(rows, 'solana', 'exactmint'), null);
});

test('Dex resolver prefers a conventional quote over a deeper manipulated pool', () => {
  const rows = [
    {
      chainId: 'solana', pairAddress: 'manipulated',
      baseToken: { address: 'ExactMint' }, quoteToken: { symbol: 'UNKNOWN' },
      liquidity: { usd: 9_000_000 }, volume: { h24: 9_000_000 },
    },
    {
      chainId: 'solana', pairAddress: 'canonical',
      baseToken: { address: 'ExactMint' }, quoteToken: { symbol: 'USDC' },
      liquidity: { usd: 100_000 }, volume: { h24: 100_000 },
    },
  ];
  assert.equal(chooseDexPair(rows, 'solana', 'ExactMint')?.pairAddress, 'canonical');
});

test('exact contract wins over a conflicting provider id', () => {
  const directory = buildCoinDirectory([
    { id: 'real-token', symbol: 'real', name: 'Real Token', platforms: { ethereum: '0x123' } },
    { id: 'wrong-token', symbol: 'same', name: 'Wrong Token', platforms: { ethereum: '0x456' } },
  ]);
  const exact = resolveCoinIdentity(directory, { id: 'wrong-token', chain: 'ethereum', contract: '0x123' });
  assert.equal(exact.coingeckoId, 'real-token');
  const unknown = resolveCoinIdentity(directory, { id: 'wrong-token', chain: 'ethereum', contract: '0x999' });
  assert.equal(unknown.coingeckoId, null);
  assert.equal(unknown.verified, false);
});

test('launch rankings are verified, deduplicated, sorted, bounded and native-excluded', () => {
  const rows = Array.from({ length: 13 }, (_, index) => ({
    id: index === 0 ? 'native' : `token-${index}`,
    chain: 'ethereum',
    contract: index === 12 ? '0x1' : `0x${index}`,
    mcap: 1_000_000 - index,
    launchpadVerified: index !== 11,
  }));
  const ranked = rankVerifiedLaunches(rows, { excludeIds: ['native'], maximum: 10 });
  assert.equal(ranked.length, 10);
  assert.equal(ranked.some((row) => row.id === 'native'), false);
  assert.deepEqual(ranked, [...ranked].sort((a, b) => b.mcap - a.mcap));
  assert.equal(new Set(ranked.map((row) => `${row.chain}:${row.contract.toLowerCase()}`)).size, ranked.length);
});

test('verified identities remain visible when every market provider is unavailable', () => {
  const ranked = rankVerifiedLaunches([
    { id: 'b', name: 'Beta', chain: 'solana', contract: 'Beta', mcap: null, launchpadVerified: true },
    { id: 'a', name: 'Alpha', chain: 'solana', contract: 'Alpha', mcap: null, launchpadVerified: true },
  ]);
  assert.deepEqual(ranked.map((row) => row.id), ['a', 'b']);
});

test('platform/project ratios state the numerator unambiguously', () => {
  const platformLarger = calculateMarketCapComparison(1_000, 125);
  assert.equal(platformLarger.platformToProjectMultiple, 8);
  assert.equal(platformLarger.direction, 'platform-larger');
  const projectLarger = calculateMarketCapComparison(100, 125);
  assert.equal(projectLarger.projectToPlatformMultiple, 1.25);
  assert.equal(projectLarger.direction, 'project-larger');
  assert.equal(calculateMarketCapComparison(null, 125), null);
});

test('launchpad definitions exclude their own platform token and carry explicit provenance sets', () => {
  for (const definition of LAUNCHPAD_DEFINITIONS) {
    assert.ok(definition.officialUrl);
    assert.ok(Array.isArray(definition.feeSlugs));
    if (definition.rankingStatus !== 'unranked') {
      assert.ok(definition.feeSlugs.length, `${definition.id} needs a fee source`);
      assert.ok(Number.isFinite(definition.metricsFallback?.fees30d), `${definition.id} needs a fee fallback`);
      assert.ok(definition.metricsFallback?.asOf, `${definition.id} fallback needs an as-of timestamp`);
    }
    if (definition.provenanceMode === 'category') assert.ok(definition.categoryUrl);
    assert.ok(definition.verifiedCoinIds?.length, `${definition.id} needs a sourced fallback set`);
    assert.ok(definition.verifiedLaunches?.length, `${definition.id} needs exact-contract fallbacks`);
    for (const launch of definition.verifiedLaunches) {
      assert.ok(launch.chain, `${definition.id}/${launch.id} needs a chain`);
      assert.ok(launch.contract, `${definition.id}/${launch.id} needs a contract`);
    }
    if (definition.nativeToken) {
      assert.ok(definition.excludeProjectIds.includes(definition.nativeToken.id));
      assert.ok(definition.nativeToken.chain);
      assert.ok(definition.nativeToken.contract);
    }
  }
  const ansem = LAUNCHPAD_DEFINITIONS.find((row) => row.id === 'ansemio');
  assert.equal(ansem?.rankingStatus, 'unranked');
  assert.equal(ansem?.category, 'Pump.fun launch layer');
  assert.ok(ansem?.verifiedLaunches.every((row) => row.source?.startsWith('https://ansem.io/launch/coin/')));
});

test('launchpad fee snapshots prevent a blank ranking when DeFiLlama is unavailable', () => {
  const pump = LAUNCHPAD_DEFINITIONS.find((row) => row.id === 'pumpfun');
  const result = launchpadMetricWithFallback(pump, new Map(), new Map());
  assert.equal(result.metrics.fees30d, pump.metricsFallback.fees30d);
  assert.equal(result.metrics.revenue30d, pump.metricsFallback.revenue30d);
  assert.equal(result.metricsStale, true);
  assert.equal(result.metricsAsOf, pump.metricsFallback.asOf);
});
