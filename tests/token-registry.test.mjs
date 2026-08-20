import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  TOKEN_REGISTRY,
  findToken,
  registryKey,
  tokenDetailHref,
  unresolvedToken,
} from '../assets/js/token-registry.js';

test('curated tokens use unique contract-first identities and sourced lore', () => {
  const identities = new Set();
  for (const token of TOKEN_REGISTRY) {
    assert.ok(token.id, 'token id is required');
    assert.ok(token.chain, `${token.id} needs a chain`);
    assert.ok(token.contract, `${token.id} needs a contract or native sentinel`);
    const key = registryKey(token.chain, token.contract);
    assert.ok(key, `${token.id} needs a canonical key`);
    assert.equal(identities.has(key), false, `duplicate identity ${key}`);
    identities.add(key);
    assert.ok(token.lore?.length >= 40, `${token.id} needs curated lore`);
    assert.ok(token.loreSources?.length > 0, `${token.id} needs lore sources`);
    assert.equal(findToken({ chain: token.chain, contract: token.contract })?.id, token.id);
  }
});

test('detail links preserve exact identity and never depend on ticker alone', () => {
  const first = tokenDetailHref({
    id: 'alpha', name: 'Alpha One', symbol: 'SAME', chain: 'solana', contract: 'AbC123',
  });
  const second = tokenDetailHref({
    id: 'beta', name: 'Alpha Two', symbol: 'SAME', chain: 'solana', contract: 'aBc123',
  });
  assert.notEqual(first, second, 'case-sensitive Solana contracts remain distinct');
  for (const href of [first, second, ...TOKEN_REGISTRY.map(tokenDetailHref)]) {
    const url = new URL(href, 'https://cryptobros.test');
    assert.equal(url.pathname, '/cases/detail/');
    assert.equal(href.includes('undefined'), false);
    assert.ok(url.searchParams.get('contract'));
    assert.ok(url.searchParams.get('chain'));
  }
});

test('unknown tokens still create a renderable unavailable-state record', () => {
  const token = unresolvedToken({ id: 'provider-only', symbol: 'TEST', name: 'Provider Only' });
  assert.equal(token.name, 'Provider Only');
  assert.equal(token.symbol, 'TEST');
  assert.equal(token.lore, null);
  const html = fs.readFileSync(new URL('../cases/detail/index.html', import.meta.url), 'utf8');
  assert.match(html, /id="tokenLore"/);
  assert.match(html, /id="tokenIdentity"/);
  assert.match(html, /id="dexScreenerChart"/);
});
