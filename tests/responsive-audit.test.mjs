/* Automated responsive audit.

   Two checks, because one alone can be satisfied by hiding the problem:

     1. documentElement.scrollWidth <= innerWidth
     2. no element is LAID OUT wider than the viewport unless it sits inside a
        deliberate horizontal scroller

   Check 2 exists because style.css keeps `overflow-x: clip` on html and body as
   a guard against a stray element creating body-level horizontal scrolling. That
   clip makes check 1 pass even when a card is 1534px wide inside a 390px phone —
   which is exactly the bug this suite was written for. The test therefore
   neutralises the clip before measuring, so it sees the real layout.

   Playwright is an optional dependency. Without it the suite skips rather than
   failing, so `npm test` stays runnable on a machine that has not installed a
   browser:  npm i -D playwright  (Chromium is already present in CI images at
   PLAYWRIGHT_BROWSERS_PATH).
*/

import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

let chromium = null;
try {
  ({ chromium } = await import('playwright'));
} catch {
  /* optional */
}

/* A CI image often ships a Chromium build that does not match the revision the
   installed Playwright pins, and Playwright then refuses to launch. Where a
   usable binary exists under PLAYWRIGHT_BROWSERS_PATH, point at it directly
   rather than telling the run to download one. */
function resolveChromium() {
  const home = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!home || !existsSync(home)) return undefined;
  const candidates = [];
  for (const entry of readdirSync(home)) {
    if (!entry.startsWith('chromium')) continue;
    candidates.push(
      join(home, entry, 'chrome-linux', 'chrome'),
      join(home, entry, 'chrome-headless-shell-linux64', 'chrome-headless-shell'),
      join(home, entry, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
    );
  }
  return candidates.find((candidate) => existsSync(candidate));
}

const ROUTES = [
  '/',
  '/maps/',
  '/sentiment/',
  '/launchpads/',
  '/cases/',
  '/cases/doge/',
  '/2026-memecoins/',
  '/2026-memecoins/troll/',
  '/nft/',
  '/nft/cryptopunks/',
  '/nft-2026/',
  '/nft-2026/mancers/',
  '/airdrops/',
  '/airdrops/arkham/',
];

const WIDTHS = [360, 390, 430, 768, 1440];

/* The three routes the brief calls out specifically. */
const CRITICAL = ['/launchpads/', '/nft/', '/airdrops/'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};

/* Static only, and every /api/market call answers with a well-formed empty
   payload — the audit measures layout, not upstream availability, and a page
   that renders nothing is exactly the case where overflow hides. */
function startServer() {
  const server = createServer(async (request, response) => {
    let pathname = new URL(request.url, 'http://localhost').pathname;

    if (pathname.startsWith('/api/market')) {
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({
        ok: true, fetchedAt: Date.now(), partial: true,
        collections: {}, launchpads: [], platforms: [], over100m: [], memecoins: [],
        candidateCount: 0, methodology: 'audit fixture',
      }));
      return;
    }

    if (pathname === '/') pathname = '/index.html';
    else if (!extname(pathname)) pathname = `${pathname.replace(/\/$/, '')}/index.html`;

    const file = resolve(root, `.${pathname}`);
    if (!file.startsWith(root)) { response.writeHead(403).end(); return; }
    try {
      await stat(file);
      response.writeHead(200, { 'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end('not found');
    }
  });
  return new Promise((done) => server.listen(0, () => done(server)));
}

const measure = () => {
  const viewport = window.innerWidth;

  /* An ancestor contains its child's width when it both confines overflow on
     the inline axis and fits in the viewport itself. Requiring the second half
     is what makes this test catch the /launchpads/ bug: that card carried
     `overflow: clip` and was still laid out at 1534px, so it confined nothing.
     A marquee track inside a 100%-wide `overflow: hidden` viewport, by
     contrast, is genuinely contained. */
  const containers = new Set(
    [...document.querySelectorAll('*')].filter((node) => {
      if (!/auto|scroll|hidden|clip/.test(getComputedStyle(node).overflowX)) return false;
      return node.getBoundingClientRect().width <= viewport + 1;
    }),
  );

  const wide = [];
  for (const node of document.querySelectorAll('body *')) {
    const box = node.getBoundingClientRect();
    if (box.width <= viewport + 1) continue;
    if (getComputedStyle(node).position === 'fixed') continue;
    let contained = false;
    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
      if (containers.has(parent)) { contained = true; break; }
    }
    if (contained) continue;
    const cls = typeof node.className === 'string' ? node.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    wide.push(`${node.tagName.toLowerCase()}${cls ? `.${cls}` : ''} (${Math.round(box.width)}px)`);
  }

  /* A heading or KPI whose text is cut off with no way to reveal it. */
  const clipped = [];
  for (const node of document.querySelectorAll('h1, h2, h3, .kpi-val, .hero-kpis strong, .evidence-value, .valuation-value, .rank-card-metrics dd, .flow-value')) {
    if (node.scrollWidth <= node.clientWidth + 1 || node.clientWidth === 0) continue;
    const style = getComputedStyle(node);
    if (style.overflowX === 'visible' && style.overflow === 'visible') continue;
    clipped.push(`${node.tagName.toLowerCase()}: "${node.textContent.trim().slice(0, 30)}"`);
  }

  /* A logo that failed to load renders as a broken box. */
  const brokenLogos = [...document.querySelectorAll('.platform-logo, .brand-mark, .nft-card-logo, .row-logo')]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => img.getAttribute('src'));

  return {
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: viewport,
    bodyScrolls: document.body.scrollWidth > document.body.clientWidth + 1,
    wide: [...new Set(wide)].slice(0, 6),
    clipped: [...new Set(clipped)].slice(0, 6),
    brokenLogos: [...new Set(brokenLogos)].slice(0, 6),
  };
}; // eslint-disable-line

test('responsive audit', { skip: chromium ? false : 'playwright not installed' }, async (suite) => {
  const server = await startServer();
  const base = `http://127.0.0.1:${server.address().port}`;
  const executablePath = resolveChromium();
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage();

  /* Reveal the true layout: the clip on html/body is a guard, not a fix, and a
     test that measures through it would pass on a broken page. */
  await page.addInitScript(() => {
    addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = 'html,body{overflow-x:visible !important}';
      document.head.append(style);
    });
  });

  try {
    for (const route of ROUTES) {
      for (const width of WIDTHS) {
        await suite.test(`${route} @ ${width}px`, async () => {
          await page.setViewportSize({ width, height: 900 });
          await page.goto(base + route, { waitUntil: 'load' });
          await page.waitForTimeout(400);
          const result = await page.evaluate(measure);

          assert.ok(
            result.scrollWidth <= result.innerWidth,
            `${route} @${width}: documentElement.scrollWidth ${result.scrollWidth} exceeds innerWidth ${result.innerWidth}`,
          );
          assert.equal(
            result.bodyScrolls, false,
            `${route} @${width}: body has horizontal overflow`,
          );
          assert.deepEqual(
            result.wide, [],
            `${route} @${width}: element(s) laid out wider than the viewport outside a scroll container: ${result.wide.join(', ')}`,
          );
          assert.deepEqual(
            result.clipped, [],
            `${route} @${width}: clipped heading or metric value: ${result.clipped.join(', ')}`,
          );
          assert.deepEqual(
            result.brokenLogos, [],
            `${route} @${width}: broken logo image(s): ${result.brokenLogos.join(', ')}`,
          );
        });
      }
    }

    /* Wide datasets are either card stacks or contained scrollers — never a
       table that pushes the page sideways. */
    for (const route of CRITICAL) {
      await suite.test(`${route} handles its wide data on a phone`, async () => {
        await page.setViewportSize({ width: 390, height: 900 });
        await page.goto(base + route, { waitUntil: 'load' });
        await page.waitForTimeout(400);
        const tables = await page.evaluate(() => [...document.querySelectorAll('table')]
          .filter((table) => table.getBoundingClientRect().width > 0)
          .map((table) => {
            const scroller = table.closest('.table-scroll');
            return {
              contained: Boolean(scroller) && /auto|scroll/.test(getComputedStyle(scroller).overflowX),
              width: Math.round(table.getBoundingClientRect().width),
            };
          }));
        for (const table of tables) {
          assert.ok(
            table.contained,
            `${route}: a ${table.width}px table is visible on a phone without a scroll container`,
          );
        }
      });
    }
  } finally {
    await browser.close();
    server.close();
  }
});
