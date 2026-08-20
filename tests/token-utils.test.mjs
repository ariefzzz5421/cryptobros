import test from 'node:test';
import assert from 'node:assert/strict';
import { LAUNCHPAD_DEFINITIONS } from '../server/launchpad-config.mjs';
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
    assert.ok(definition.categoryUrl);
    assert.ok(definition.feeSlugs.length);
    assert.ok(definition.verifiedCoinIds?.length, `${definition.id} needs a sourced fallback set`);
    if (definition.nativeToken) {
      assert.ok(definition.excludeProjectIds.includes(definition.nativeToken.id));
    }
  }
});
