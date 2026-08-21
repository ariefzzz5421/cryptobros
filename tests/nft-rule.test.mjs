/* The historical NFT inclusion rule, and the guarantee that the OpenSea key
   never reaches the client bundle or breaks a page by its absence. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { HISTORICAL_RULE, nftMetrics, NFT_CASES } from '../assets/js/nft-config.js';
import * as openSea from '../server/providers/opensea.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

test('the historical rule is peak floor >= 0.1 ETH and lifetime volume >= 25 ETH', () => {
  assert.equal(HISTORICAL_RULE.peakFloorEth, 0.1);
  assert.equal(HISTORICAL_RULE.lifetimeVolumeEth, 25);
});

test('both conditions are required — neither alone qualifies', () => {
  const item = { peakFloor: { eth: 40 } };

  assert.equal(
    nftMetrics(item, { lifetimeVolumeEth: 900_000 }).qualifiesHistoricalRule,
    'qualified',
    'peak floor and lifetime volume both above the line should qualify',
  );
  assert.equal(
    nftMetrics(item, { lifetimeVolumeEth: 24 }).qualifiesHistoricalRule,
    'excluded',
    'a peak floor above the line with volume below it must not qualify',
  );
  assert.equal(
    nftMetrics({ peakFloor: { eth: 0.05 } }, { lifetimeVolumeEth: 900_000 }).qualifiesHistoricalRule,
    'excluded',
    'huge volume with a peak floor below the line must not qualify',
  );
});

test('the rule tests the peak floor, never the current floor', () => {
  /* A collection whose floor has collapsed to 0.01 ETH but whose documented
     peak was 40 ETH is still a historical qualifier. */
  const metrics = nftMetrics(
    { peakFloor: { eth: 40 } },
    { floorNative: 0.01, lifetimeVolumeEth: 900_000 },
  );
  assert.equal(metrics.currentFloorEth, 0.01);
  assert.equal(metrics.documentedPeakFloorEth, 40);
  assert.equal(metrics.qualifiesHistoricalRule, 'qualified');
});

test('an unsourced lifetime volume is pending, never assumed either way', () => {
  const metrics = nftMetrics({ peakFloor: { eth: 40 } }, { floorNative: 30 });
  assert.equal(metrics.lifetimeVolumeEth, null);
  assert.equal(metrics.volumeMeets, null);
  assert.equal(metrics.qualifiesHistoricalRule, 'pending');
});

test('a 24h volume is never promoted into a lifetime volume', () => {
  const metrics = nftMetrics({ peakFloor: { eth: 40 } }, { volume24hEth: 5000 });
  assert.equal(metrics.volume24hEth, 5000);
  assert.equal(metrics.lifetimeVolumeEth, null, '24h volume leaked into lifetime volume');
  assert.equal(metrics.qualifiesHistoricalRule, 'pending');
});

test('current floor, peak floor and lifetime volume stay separate fields', () => {
  const metrics = nftMetrics(
    { peakFloor: { eth: 123.99 } },
    { floorNative: 31.5, lifetimeVolumeEth: 1_600_000, volume24hEth: 42 },
  );
  assert.equal(metrics.currentFloorEth, 31.5);
  assert.equal(metrics.documentedPeakFloorEth, 123.99);
  assert.equal(metrics.lifetimeVolumeEth, 1_600_000);
  assert.equal(metrics.volume24hEth, 42);
});

test('every researched collection clears the peak-floor condition or says why not', () => {
  for (const item of NFT_CASES) {
    const metrics = nftMetrics(item, null);
    if (metrics.documentedPeakFloorEth == null) {
      assert.ok(
        item.peakFloor?.label && item.peakFloor?.note,
        `${item.slug}: no sourced peak floor and no explanation of the high-water event`,
      );
      continue;
    }
    assert.ok(
      metrics.documentedPeakFloorEth >= HISTORICAL_RULE.peakFloorEth,
      `${item.slug}: documented peak floor is below the 0.1 ETH condition`,
    );
  }
});

/* --- OpenSea provider ---------------------------------------------------- */

test('a missing OpenSea key degrades instead of throwing', async () => {
  const previous = process.env.OPENSEA_API_KEY;
  delete process.env.OPENSEA_API_KEY;
  try {
    assert.equal(openSea.isConfigured(), false);
    const stats = await openSea.getCollectionStats('cryptopunks');
    assert.equal(stats.available, false);
    assert.equal(stats.reason, 'OpenSea API key not configured');
    const floors = await openSea.getCollectionFloorHistory('cryptopunks', 'all_time');
    assert.equal(floors.available, false);
    assert.equal(floors.reason, 'OpenSea API key not configured');
  } finally {
    if (previous === undefined) delete process.env.OPENSEA_API_KEY;
    else process.env.OPENSEA_API_KEY = previous;
  }
});

test('OpenSea stats normalise into the shared NFT metric shape', () => {
  const normalised = openSea.normaliseStats('cryptopunks', {
    total: {
      volume: 1_600_000.5,
      sales: 24_000,
      num_owners: 3_700,
      floor_price: 31.5,
      floor_price_symbol: 'ETH',
      market_cap: 315_000,
    },
    intervals: [
      { interval: 'one_day', volume: 42.25 },
      { interval: 'seven_day', volume: 300 },
    ],
  });

  assert.equal(normalised.available, true);
  assert.equal(normalised.slug, 'cryptopunks');
  assert.equal(normalised.floorEth, 31.5);
  assert.equal(normalised.lifetimeVolumeEth, 1_600_000.5);
  assert.equal(normalised.volume24hEth, 42.25);
  assert.equal(normalised.owners, 3_700);
  assert.equal(normalised.sales, 24_000);
  assert.equal(normalised.currency, 'ETH');
  assert.equal(normalised.source, 'OpenSea');
  assert.ok(Number.isFinite(normalised.fetchedAt));
});

test('a non-ETH collection is reported unavailable rather than mislabelled', () => {
  const normalised = openSea.normaliseStats('some-solana-collection', {
    total: { volume: 90_000, floor_price: 12, floor_price_symbol: 'SOL' },
    intervals: [],
  });
  assert.equal(normalised.available, false);
  assert.equal(normalised.currency, 'SOL');
  assert.match(normalised.reason, /SOL/);
});

test('the OpenSea key never appears in anything the browser downloads', () => {
  const clientDirs = ['assets/js', 'assets/css', 'assets/data'];
  const offenders = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) { walk(full); continue; }
      if (!/\.(js|mjs|css|json|html)$/.test(entry)) continue;
      const body = readFileSync(full, 'utf8');
      if (body.includes('OPENSEA_API_KEY') || /x-api-key/i.test(body)) offenders.push(full);
    }
  };

  for (const dir of clientDirs) walk(join(repoRoot, dir));

  /* Route HTML is downloaded too. */
  for (const entry of readdirSync(repoRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    if (['server', 'scripts', 'tests', 'dist', 'reports'].includes(entry.name)) continue;
    walk(join(repoRoot, entry.name));
  }

  assert.deepEqual(offenders, [], 'OpenSea API key reference found in a client-downloadable file');
});

test('provider TTLs match how fast each figure actually moves', () => {
  assert.equal(openSea.TTL.floor, 5 * 60_000);
  assert.equal(openSea.TTL.volume24h, 5 * 60_000);
  assert.equal(openSea.TTL.lifetimeVolume, 15 * 60_000);
  assert.ok(
    openSea.TTL.floorHistory >= 6 * 60 * 60_000,
    'historical floor data should not be refreshed more than a few times a day',
  );
});
