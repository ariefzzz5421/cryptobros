import test from 'node:test';
import assert from 'node:assert/strict';
import { SUPPORTED_LOCALES, getLocale, localeTag, translate } from '../assets/js/i18n.js';

test('language support is limited to the four published locales with English fallback', () => {
  assert.deepEqual(SUPPORTED_LOCALES, ['en', 'id', 'zh-CN', 'ja']);
  assert.equal(getLocale(), 'en');
  assert.equal(localeTag(), 'en-US');
  assert.equal(translate('common.marketCap', 'unsupported'), 'Market cap');
});

test('key interface labels have localized text in every supported language', () => {
  for (const locale of SUPPORTED_LOCALES) {
    assert.ok(translate('route.airdrops', locale).length > 0, `${locale}: route label missing`);
    assert.ok(translate('common.marketCap', locale).length > 0, `${locale}: market-cap label missing`);
    assert.ok(translate('airdrop.readCase', locale).length > 0, `${locale}: airdrop action missing`);
  }
});

test('language control provides menu semantics, persistence, and keyboard handling', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../assets/js/i18n.js', import.meta.url), 'utf8');
  assert.match(source, /localStorage\.setItem\(STORAGE_KEY, locale\)/);
  assert.match(source, /role', 'menuitemradio'/);
  assert.match(source, /event\.key === 'Escape'/);
  assert.match(source, /event\.key === 'ArrowDown'/);
});

test('research indexes no longer force a tall minimum row and retain narrow-screen reflow', async () => {
  const { readFile } = await import('node:fs/promises');
  const css = await readFile(new URL('../assets/css/style.css', import.meta.url), 'utf8');
  assert.match(css, /\.research-card\s*\{\s*min-height:\s*0;/);
  assert.match(css, /\.airdrop-card\s*\{[^}]*min-height:\s*0;/s);
  assert.match(css, /@media\s*\(max-width:\s*800px\)[\s\S]*?\.airdrop-card\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\) auto;/);
});
