/* Data-integrity tests for the airdrop research set.

   These guard the distinctions the research exists to make: eligible wallets
   are not claimants, claimants are not recipients, and a value measured at the
   token's all-time high is never stored in the field that means "what was
   distributed on the day". */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const research = JSON.parse(readFileSync(
  fileURLToPath(new URL('../assets/data/airdrops.json', import.meta.url)),
  'utf8',
));

const { cases, candidatePool, methodology } = research;

test('every case has a unique slug and id', () => {
  const slugs = cases.map((item) => item.slug);
  const ids = cases.map((item) => item.id);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate slug');
  assert.equal(new Set(ids).size, ids.length, 'duplicate id');
  for (const slug of slugs) assert.match(slug, /^[a-z0-9-]+$/, `slug not url-safe: ${slug}`);
});

test('no numeric research field is negative', () => {
  const numeric = [
    'totalSupply', 'tokensAllocated', 'tokensActuallyDistributed', 'percentSupplyDistributed',
    'averageAllocation', 'medianAllocation', 'largestAllocation',
    'tokenPriceAtDistribution', 'valueAtDistributionUsd',
    'peakTokenPrice', 'peakValueOfDistributedTokensUsd',
  ];
  for (const item of cases) {
    for (const field of numeric) {
      const value = item[field];
      if (value == null) continue;
      assert.equal(typeof value, 'number', `${item.slug}.${field} must be a number or null`);
      assert.ok(Number.isFinite(value), `${item.slug}.${field} must be finite`);
      assert.ok(value >= 0, `${item.slug}.${field} is negative`);
    }
    for (const stage of ['eligibleWallets', 'initialClaimants', 'finalRecipientAddresses']) {
      const value = item[stage]?.value;
      if (value == null) continue;
      assert.ok(Number.isFinite(value) && value >= 0, `${item.slug}.${stage}.value is not a non-negative number`);
    }
  }
});

test('every wallet count carries a definition and a source', () => {
  for (const item of cases) {
    for (const stage of ['eligibleWallets', 'initialClaimants', 'finalRecipientAddresses']) {
      const entry = item[stage];
      assert.ok(entry, `${item.slug} is missing ${stage}`);
      if (entry.value == null) continue;
      assert.ok(
        typeof entry.definition === 'string' && entry.definition.length > 10,
        `${item.slug}.${stage} has a value but no definition of what it counts`,
      );
      assert.ok(entry.source?.url, `${item.slug}.${stage} has a value but no source`);
    }
  }
});

test('an eligible count is never silently the recipient count', () => {
  for (const item of cases) {
    const eligible = item.eligibleWallets?.value;
    const recipients = item.finalRecipientAddresses?.value;
    const claimants = item.initialClaimants?.value;
    if (eligible == null) continue;
    if (recipients != null) {
      assert.notEqual(
        eligible, recipients,
        `${item.slug}: eligibleWallets equals finalRecipientAddresses — a recipient count reused as eligibility`,
      );
    }
    if (claimants != null) {
      assert.notEqual(
        eligible, claimants,
        `${item.slug}: eligibleWallets equals initialClaimants — a claim count reused as eligibility`,
      );
    }
  }
});

test('an undisclosed eligible count says so instead of borrowing a number', () => {
  for (const item of cases) {
    if (item.eligibleWallets?.value != null) continue;
    const note = `${item.eligibleWallets?.note || ''} ${item.eligibleWallets?.definition || ''}`;
    assert.ok(
      note.trim().length > 10,
      `${item.slug}: eligible count is null with no explanation of why`,
    );
  }
});

test('claimants never exceed the eligible set they came from', () => {
  for (const item of cases) {
    const eligible = item.eligibleWallets?.value;
    const claimants = item.initialClaimants?.value;
    if (eligible == null || claimants == null) continue;
    assert.ok(
      claimants <= eligible,
      `${item.slug}: ${claimants} claimants out of ${eligible} eligible is impossible`,
    );
  }
});

test('valueAtDistributionUsd carries a price source and a basis', () => {
  for (const item of cases) {
    if (item.valueAtDistributionUsd == null) {
      assert.equal(
        item.rankingComparable, false,
        `${item.slug}: no distribution value but still marked rankingComparable`,
      );
      assert.ok(
        typeof item.rankingExclusionReason === 'string' && item.rankingExclusionReason.length > 20,
        `${item.slug}: excluded from ranking with no stated reason`,
      );
      continue;
    }
    assert.ok(
      item.valueAtDistributionSource?.url,
      `${item.slug}: valueAtDistributionUsd has no source`,
    );
    assert.ok(
      ['reported', 'computed', 'derived'].includes(item.valueAtDistributionBasis),
      `${item.slug}: valueAtDistributionBasis must say how the figure was obtained`,
    );
    /* A computed value needs the price it was computed from. */
    if (item.valueAtDistributionBasis === 'computed') {
      assert.ok(
        Number.isFinite(item.tokenPriceAtDistribution),
        `${item.slug}: value is computed but tokenPriceAtDistribution is missing`,
      );
      assert.ok(
        item.tokenPriceAtDistributionSource?.url,
        `${item.slug}: tokenPriceAtDistribution has no source`,
      );
    }
  }
});

test('peak value never overwrites distribution value', () => {
  for (const item of cases) {
    const distribution = item.valueAtDistributionUsd;
    const peak = item.peakValueOfDistributedTokensUsd;
    if (distribution == null || peak == null) continue;
    assert.notEqual(
      distribution, peak,
      `${item.slug}: distribution value and peak value are identical — one has overwritten the other`,
    );
    /* The same tokens at an all-time high cannot be worth less than they were
       on the day, or the "peak" is not a peak. */
    assert.ok(
      peak >= distribution,
      `${item.slug}: peak value ${peak} is below distribution value ${distribution}`,
    );
    assert.ok(
      item.peakValueSource?.url,
      `${item.slug}: peak value has no source`,
    );
  }
});

test('a peak price, where stated, is at least the distribution price', () => {
  for (const item of cases) {
    if (item.peakTokenPrice == null || item.tokenPriceAtDistribution == null) continue;
    assert.ok(
      item.peakTokenPrice >= item.tokenPriceAtDistribution,
      `${item.slug}: peakTokenPrice is below tokenPriceAtDistribution`,
    );
  }
});

test('every source carries a labelled kind and a url', () => {
  const kinds = new Set(Object.keys(methodology.sourceKinds));
  const check = (source, where) => {
    if (!source) return;
    assert.ok(source.url, `${where}: source has no url`);
    assert.match(source.url, /^https?:\/\//, `${where}: source url is not absolute`);
    assert.ok(kinds.has(source.kind), `${where}: unknown source kind "${source.kind}"`);
    assert.ok(source.label?.length > 3, `${where}: source has no label`);
  };

  for (const item of cases) {
    assert.ok(Array.isArray(item.sources) && item.sources.length, `${item.slug} has no sources`);
    item.sources.forEach((source, index) => check(source, `${item.slug}.sources[${index}]`));
    check(item.valueAtDistributionSource, `${item.slug}.valueAtDistributionSource`);
    check(item.tokenPriceAtDistributionSource, `${item.slug}.tokenPriceAtDistributionSource`);
    check(item.peakValueSource, `${item.slug}.peakValueSource`);
    for (const stage of ['eligibleWallets', 'initialClaimants', 'finalRecipientAddresses']) {
      check(item[stage]?.source, `${item.slug}.${stage}.source`);
    }
    for (const entry of item.weaknesses || []) check(entry.source, `${item.slug}.weaknesses`);
    for (const entry of item.allocationShape || []) check(entry.source, `${item.slug}.allocationShape`);
  }
});

test('share of supply agrees with the token counts it is derived from', () => {
  for (const item of cases) {
    const tokens = item.tokensActuallyDistributed ?? item.tokensAllocated;
    if (tokens == null || item.totalSupply == null || item.percentSupplyDistributed == null) continue;
    const computed = (tokens / item.totalSupply) * 100;
    assert.ok(
      Math.abs(computed - item.percentSupplyDistributed) < 0.6,
      `${item.slug}: percentSupplyDistributed ${item.percentSupplyDistributed} does not match ${computed.toFixed(2)} from the token counts`,
    );
  }
});

test('the candidate pool accounts for every published case', () => {
  const published = new Set(cases.map((item) => item.slug));
  const pooled = new Set(candidatePool.filter((row) => row.slug).map((row) => row.slug));
  for (const slug of published) {
    assert.ok(pooled.has(slug), `${slug} is published but missing from the candidate pool`);
  }
  for (const row of candidatePool) {
    if (row.status === 'researched') {
      assert.ok(row.slug && published.has(row.slug), `${row.project} is marked researched but has no case`);
    } else {
      assert.ok(
        typeof row.reason === 'string' && row.reason.length > 20,
        `${row.project} was excluded with no stated reason`,
      );
    }
  }
});

test('the ranking metric is distribution value, not peak value', () => {
  assert.equal(methodology.rankingMetric, 'valueAtDistributionUsd');
  assert.equal(methodology.secondaryMetric, 'peakValueOfDistributedTokensUsd');
});

test('no case describes a peak-based figure as value distributed at launch', () => {
  /* The peak fields exist to be labelled differently. Any prose that puts an
     all-time-high phrase next to a "distributed at launch" phrase is the exact
     conflation this research set is built to avoid. */
  const forbidden = /(all-time high|ATH|peak)[^.]{0,60}(distributed at launch|value distributed at launch)/i;
  for (const item of cases) {
    const prose = JSON.stringify(item);
    assert.ok(!forbidden.test(prose), `${item.slug}: peak value described as value distributed at launch`);
  }
});
