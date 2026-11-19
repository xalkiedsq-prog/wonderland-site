import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:4173';
const pages = (process.argv[2] || '/,/shop,/product/pull-along-rabbit').split(',');
const widths = (process.argv[3] || '1440,390').split(',').map(Number);
const out = process.argv[4] || '/home/claude/wl/shots';
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && console.log('CONSOLE', m.text()));
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const name = (p === '/' ? 'home' : p.replace(/[\/?=&]/g, '_').replace(/^_/, '')) + '-' + w;
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
    console.log('shot', name);
  }
  await ctx.close();
}
await browser.close();
