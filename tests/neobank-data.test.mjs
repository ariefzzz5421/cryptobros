/* Data-integrity tests for the neobank research set.

   The distinctions these guard: a registered-account count is not an active
   customer count, revenue is not volume, and a figure nobody published is null
   rather than zero. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const research = JSON.parse(readFileSync(
  fileURLToPath(new URL('../assets/data/neobanks.json', import.meta.url)),
  'utf8',
));
const { neobanks, methodology } = research;

test('the set holds exactly twenty neobanks with unique ids and ranks', () => {
  assert.equal(neobanks.length, 20);
  const ids = neobanks.map((bank) => bank.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate id');
  const ranks = neobanks.map((bank) => bank.rank);
  assert.deepEqual([...ranks].sort((a, b) => a - b), Array.from({ length: 20 }, (_, i) => i + 1));
  for (const id of ids) assert.match(id, /^[a-z0-9-]+$/, `id not url-safe: ${id}`);
});

test('every entry carries a name, country and official site', () => {
  for (const bank of neobanks) {
    assert.ok(bank.name?.length > 1, `${bank.id} has no name`);
    assert.ok(bank.country?.length > 1, `${bank.id} has no country`);
    assert.match(bank.site, /^https:\/\//, `${bank.id} has no https official site`);
    assert.ok(Number.isInteger(bank.founded) && bank.founded > 1990, `${bank.id} has no plausible founding year`);
    assert.ok(bank.model?.length > 5, `${bank.id} does not state its licensing model`);
  }
});

test('no numeric figure is negative or zero-as-unknown', () => {
  for (const bank of neobanks) {
    for (const [field, value] of [
      ['customers', bank.customers?.value],
      ['revenue', bank.revenue?.value],
      ['volume', bank.volumeUsd?.value],
      ['volumeOriginal', bank.volumeUsd?.valueOriginal],
    ]) {
      if (value == null) continue;
      assert.equal(typeof value, 'number', `${bank.id}.${field} must be a number or null`);
      assert.ok(Number.isFinite(value), `${bank.id}.${field} must be finite`);
      assert.ok(value > 0, `${bank.id}.${field} is zero or negative — unknown must be null, not 0`);
    }
  }
});

test('a customer count states its basis and carries a source', () => {
  for (const bank of neobanks) {
    if (bank.customers?.value == null) {
      assert.equal(bank.customers?.basis ?? null, null, `${bank.id} has a basis but no count`);
      continue;
    }
    assert.ok(
      ['registered', 'active'].includes(bank.customers.basis),
      `${bank.id}: customer basis must say registered or active, got ${bank.customers.basis}`,
    );
    assert.ok(bank.customers.asOf, `${bank.id}: customer count has no as-of date`);
    assert.ok(bank.customers.source?.url, `${bank.id}: customer count has no source`);
  }
});

test('revenue names its currency and period, and is never reused as volume', () => {
  for (const bank of neobanks) {
    if (bank.revenue?.value == null) continue;
    assert.ok(bank.revenue.currency, `${bank.id}: revenue has no currency`);
    assert.ok(bank.revenue.period, `${bank.id}: revenue has no reporting period`);
    assert.ok(bank.revenue.source?.url, `${bank.id}: revenue has no source`);
    const volume = bank.volumeUsd?.valueOriginal ?? bank.volumeUsd?.value;
    if (volume != null) {
      assert.notEqual(
        volume, bank.revenue.value,
        `${bank.id}: volume and revenue are identical — one has been copied from the other`,
      );
    }
  }
});

test('a reported volume carries a period and a source', () => {
  for (const bank of neobanks) {
    const volume = bank.volumeUsd?.valueOriginal ?? bank.volumeUsd?.value;
    if (volume == null) continue;
    assert.ok(bank.volumeUsd.period, `${bank.id}: volume has no period`);
    assert.ok(bank.volumeUsd.source?.url, `${bank.id}: volume has no source`);
    if (bank.volumeUsd.valueOriginal != null) {
      assert.ok(bank.volumeUsd.currencyOriginal, `${bank.id}: original-currency volume does not name its currency`);
    }
  }
});

test('every entry lists at least one source, and every source is absolute and labelled', () => {
  const kinds = new Set(['official', 'press', 'research', 'on-chain', 'derived']);
  const check = (source, where) => {
    if (!source) return;
    assert.match(source.url, /^https?:\/\//, `${where}: source url is not absolute`);
    assert.ok(kinds.has(source.kind), `${where}: unknown source kind "${source.kind}"`);
    assert.ok(source.label?.length > 3, `${where}: source has no label`);
  };
  for (const bank of neobanks) {
    assert.ok(Array.isArray(bank.sources) && bank.sources.length, `${bank.id} has no sources`);
    bank.sources.forEach((source, i) => check(source, `${bank.id}.sources[${i}]`));
    check(bank.customers?.source, `${bank.id}.customers.source`);
    check(bank.revenue?.source, `${bank.id}.revenue.source`);
    check(bank.volumeUsd?.source, `${bank.id}.volume.source`);
    assert.ok(
      bank.sources.some((source) => source.kind === 'official'),
      `${bank.id}: no official source among its sources`,
    );
  }
});

test('an entry with no attributable figure explains why', () => {
  for (const bank of neobanks) {
    if (bank.customers?.value != null) continue;
    assert.ok(
      typeof bank.note === 'string' && bank.note.length > 20,
      `${bank.id}: no customer count and no note explaining the gap`,
    );
  }
});

test('the ranking metric is customers, and the caveats are stated', () => {
  assert.equal(methodology.rankingMetric, 'customers.value');
  for (const field of ['rankingRule', 'customerCaveat', 'volumeCaveat', 'revenueCaveat']) {
    assert.ok(methodology[field]?.length > 40, `methodology.${field} is missing or too thin`);
  }
});

test('the largest entry by customers is ranked first', () => {
  const withCounts = neobanks.filter((bank) => Number.isFinite(bank.customers?.value));
  const largest = [...withCounts].sort((a, b) => b.customers.value - a.customers.value)[0];
  assert.equal(largest.rank, 1, `rank 1 should be the largest by customers, got ${largest.name}`);
});
