import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_TIME_AIRDROP_TOP_30,
  AIRDROP_RESEARCH_CUTOFF,
  airdropInitials,
} from '../assets/js/airdrop-leaderboard.js';

test('all-time airdrop leaderboard contains exactly 30 ranked events', () => {
  assert.equal(ALL_TIME_AIRDROP_TOP_30.length, 30);
  assert.equal(AIRDROP_RESEARCH_CUTOFF, '2026-08-21');
  assert.deepEqual(ALL_TIME_AIRDROP_TOP_30.map((row) => row.rank),
    Array.from({ length: 30 }, (_, index) => index + 1));
});

test('all-time leaderboard is strictly sorted by comparable peak allocation value', () => {
  for (let index = 1; index < ALL_TIME_AIRDROP_TOP_30.length; index += 1) {
    assert.ok(
      ALL_TIME_AIRDROP_TOP_30[index - 1].valueUsd >= ALL_TIME_AIRDROP_TOP_30[index].valueUsd,
      `${ALL_TIME_AIRDROP_TOP_30[index - 1].project} should rank ahead of ${ALL_TIME_AIRDROP_TOP_30[index].project}`,
    );
  }
  for (const row of ALL_TIME_AIRDROP_TOP_30) {
    assert.ok(Number.isFinite(row.valueUsd) && row.valueUsd > 0, `${row.project} needs a numeric value`);
    assert.ok(row.project && row.symbol && row.year, `${row.project || row.symbol} is missing identity data`);
    assert.ok(row.sourceHref, `${row.project} is missing a source`);
  }
});

test('multi-round airdrops remain explicit rather than looking like accidental duplicates', () => {
  const identities = ALL_TIME_AIRDROP_TOP_30.map((row) => `${row.project}:${row.year}:${row.round || 1}`);
  assert.equal(new Set(identities).size, identities.length);
  const blur = ALL_TIME_AIRDROP_TOP_30.filter((row) => row.project === 'Blur');
  assert.equal(blur.length, 2);
  assert.deepEqual(blur.map((row) => row.round).sort(), [1, 2]);
});

test('reconstructed rows expose their arithmetic', () => {
  const reconstructed = ALL_TIME_AIRDROP_TOP_30.filter((row) => row.formula);
  assert.ok(reconstructed.length >= 8);
  for (const row of reconstructed) {
    assert.ok(row.allocation, `${row.project} reconstruction needs allocation context`);
    assert.ok(row.ath, `${row.project} reconstruction needs ATH context`);
    assert.match(row.formula, /×/u);
  }
});

test('logo fallbacks stay useful when a project image fails', () => {
  assert.equal(airdropInitials({ symbol: 'HYPE', project: 'Hyperliquid' }), 'HYP');
  assert.equal(airdropInitials({ project: 'Ethereum Name Service' }), 'ENS');
});
