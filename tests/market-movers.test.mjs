import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMemeMovers } from '../server/market-service.mjs';

const coin = (id, changes = {}, mcap = 25_000_000, vol = 1_000_000) => ({
  id,
  sym: id.toUpperCase(),
  name: id,
  mcap,
  vol,
  ...changes,
});

test('buildMemeMovers ranks positive and negative moves per timeframe', () => {
  const result = buildMemeMovers([
    coin('alpha', { ch24h: 12, ch7d: -3, ch30d: 8, ch1y: 50 }),
    coin('beta', { ch24h: 4, ch7d: 11, ch30d: -20, ch1y: -5 }),
    coin('gamma', { ch24h: -9, ch7d: -18, ch30d: 6, ch1y: 8 }),
  ]);

  assert.equal(result.frames['1d'].gainers[0].id, 'alpha');
  assert.equal(result.frames['1d'].losers[0].id, 'gamma');
  assert.equal(result.frames['1w'].gainers[0].id, 'beta');
  assert.equal(result.frames['1m'].losers[0].id, 'beta');
  assert.equal(result.frames['1y'].covered, 3);
});

test('buildMemeMovers excludes thin tokens and missing changes instead of coercing them to zero', () => {
  const result = buildMemeMovers([
    coin('valid', { ch24h: 3 }),
    coin('small-cap', { ch24h: 99 }, 9_999_999, 1_000_000),
    coin('thin-volume', { ch24h: -99 }, 25_000_000, 99_999),
    coin('missing', { ch24h: null }),
  ]);

  assert.equal(result.frames['1d'].eligible, 2);
  assert.equal(result.frames['1d'].covered, 1);
  assert.deepEqual(result.frames['1d'].gainers.map((row) => row.id), ['valid']);
  assert.deepEqual(result.frames['1d'].losers, []);
});
