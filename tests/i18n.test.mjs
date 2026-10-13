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
    assert.ok(translate('brand.homeSub', locale).length > 0, `${locale}: brand subtitle missing`);
    assert.ok(translate('label.thesis', locale).length > 0, `${locale}: case section label missing`);
    assert.ok(translate('lore.origin', locale).length > 0, `${locale}: token lore label missing`);
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

test('research indexes use compact rows and stack cleanly on narrow screens', async () => {
  const { readFile } = await import('node:fs/promises');
  const css = await readFile(new URL('../assets/css/style.css', import.meta.url), 'utf8');
  const airdrops = await readFile(new URL('../assets/js/airdrops-page.js', import.meta.url), 'utf8');
  assert.match(css, /\.research-card\s*\{\s*min-height:\s*0;/);
  assert.match(css, /\.airdrop-card\s*\{[^}]*min-height:\s*0;/s);
  assert.match(css, /\.airdrop-project-copy\s*\{\s*display:\s*grid;/);
  assert.match(css, /\.airdrop-grid \.airdrop-card-head\s*\{\s*justify-content:\s*flex-start;/);
  assert.match(css, /@media\s*\(max-width:\s*800px\)[\s\S]*?\.airdrop-card,\s*#neobankGrid \.airdrop-card\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\);/);
  assert.doesNotMatch(airdrops, /airdrop-card-sources/);
  assert.match(await readFile(new URL('../scripts/generate-airdrop-pages.cjs', import.meta.url), 'utf8'), /id="caseSources"/);
});
