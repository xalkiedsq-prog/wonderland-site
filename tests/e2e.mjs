// End-to-end checks for the WONDERLAND concept store.
// Usage: node tests/server.mjs . 4173 &  then  node tests/e2e.mjs
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.env.BASE || 'http://localhost:4173';
let pass = 0;
let fail = 0;
const ok = (cond, msg) => {
  if (cond) pass++;
  else {
    fail++;
    console.log('  ✗', msg);
  }
};
const step = (t) => console.log('•', t);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && !/Failed to load resource|404/.test(m.text()) && errors.push(m.text()));
const count = () => page.locator('[data-cart-count]').innerText().then(Number);
const money = (s) => Number(s.replace(/[^0-9.]/g, ''));

step('Home');
await page.goto(BASE + '/');
ok((await page.locator('h1').innerText()).includes('Curiously good'), 'home h1');
ok((await page.locator('.demo-bar').innerText()).includes('A concept store — no real orders or payments'), 'demo bar text');
ok((await page.locator('.tiles li').count()) === 4, '4 category tiles');
ok((await page.locator('.grid .card').count()) === 6, '6 featured cards');

step('Navigation');
await page.click('.main-nav >> text=Shop');
ok(page.url().endsWith('/shop'), 'nav to /shop');
ok((await page.locator('.grid .card').count()) === 15, '15 products in shop all');
await page.click('.shop__cats >> text=Teethers');
ok(page.url().endsWith('/shop/teethers'), 'category url');
ok((await page.locator('.grid .card').count()) === 4, '4 teethers');
await page.click('.main-nav >> text=Gifts');
ok((await page.locator('.grid .card').count()) === 3, '3 gift sets');
await page.goBack();
ok(page.url().endsWith('/shop/teethers'), 'back button works');

step('Filters & sort');
await page.goto(BASE + '/shop');
await page.check('input[name=age][value="0-6"]', { force: true });
ok(page.url().includes('age=0-6'), 'age in url');
const n06 = await page.locator('.grid .card').count();
ok(n06 > 0 && n06 < 15, `age filter narrows (${n06})`);
await page.selectOption('select[name=sort]', 'price-asc');
const prices = await page.locator('.card__price').allInnerTexts();
ok(prices.map(money).every((p, i, a) => i === 0 || a[i - 1] <= p), 'sorted ascending');
await page.goto(BASE + '/shop/wooden-toys?age=0-6');
ok((await page.locator('.empty').count()) === 1, 'empty state for wooden 0–6');
await page.click('[data-clear-age]');
ok((await page.locator('.grid .card').count()) === 4, 'clear age shows all wooden');

step('Product + add to bag');
await page.goto(BASE + '/product/cloud-silicone-teether');
ok((await page.locator('h1').innerText()) === 'Cloud Silicone Teether', 'pdp h1');
await page.check('input[value="Sage"]', { force: true });
await page.click('[data-step="1"]');
ok((await page.locator('[data-line-price]').innerText()) === '$44', 'line price updates');
await page.click('.buy__add');
await page.waitForSelector('#cart-drawer.is-open');
ok((await count()) === 2, 'count 2 after add');
ok((await page.locator('#cart-drawer .line__opt').innerText()).includes('Sage'), 'option shown in drawer');
await page.keyboard.press('Escape');
await page.waitForTimeout(350);
ok(await page.locator('#cart-drawer').isHidden(), 'Esc closes drawer');

await page.goto(BASE + '/product/checkerboard-knit-blanket');
await page.click('.buy__add');
await page.waitForSelector('#cart-drawer.is-open');
ok((await count()) === 3, 'count 3');
ok((await page.locator('.meter__text').innerText()).includes('ships free'), 'free shipping reached ($122)');
await page.click('#cart-drawer [data-qty][data-delta="1"] >> nth=1');
ok((await count()) === 4, 'drawer + qty');
await page.click('#cart-drawer [data-remove] >> nth=1');
ok((await count()) === 2, 'drawer remove');
await page.click('#cart-drawer [data-close-cart] >> nth=1');

step('Persistence');
await page.reload();
ok((await count()) === 2, 'cart persists across reload');

step('Cart page');
await page.goto(BASE + '/cart');
ok((await page.locator('.line').count()) === 1, '1 line on cart page');
const sub = money(await page.locator('.summary .sum-row >> nth=0 >> dd').innerText());
ok(sub === 44, `subtotal 44 (${sub})`);
ok((await page.locator('.summary .sum-row >> nth=1 >> dd').innerText()) === '$7.95', 'shipping 7.95 under threshold');
ok(money(await page.locator('.sum-row--total dd').innerText()) === 51.95, 'estimated total');
await page.click('.line [data-qty][data-delta="-1"]');
ok((await count()) === 1, 'cart page minus');

step('Checkout');
await page.goto(BASE + '/checkout');
ok((await page.locator('.demo-note').innerText()).includes('No payment'), 'checkout demo note');
await page.click('button[type=submit]:has-text("Continue to delivery")');
ok((await page.locator('[aria-invalid=true]').count()) >= 6, 'required errors shown');
ok(await page.evaluate(() => document.activeElement.id === 'co-email'), 'focus first invalid');
await page.fill('#co-email', 'parent@example.com');
await page.fill('#co-firstName', 'Maya');
await page.fill('#co-lastName', 'Rivera');
await page.fill('#co-address1', '12 Elm Street');
await page.fill('#co-city', 'Portland');
await page.selectOption('#co-state', 'OR');
await page.fill('#co-zip', '972');
await page.click('button[type=submit]');
ok((await page.locator('#co-zip-err').innerText()).includes('ZIP'), 'zip validation');
await page.fill('#co-zip', '97201');
await page.click('button[type=submit]');
ok((await page.locator('.steps .is-current').innerText()).includes('Delivery'), 'step 2');
await page.check('input[value=express]');
await page.check('input[name=giftWrap]');
await page.fill('#co-giftMsg', 'Welcome, little one!');
const tot = money(await page.locator('[data-summary] .sum-row--total dd').innerText());
ok(tot === 22 + 18 + 6, `total with express + wrap (${tot})`);
await page.click('button[type=submit]');
ok((await page.locator('.demo-pay').innerText()).includes('no card details are requested'), 'demo payment notice');
ok((await page.locator('input[type=text], input[inputmode=numeric]').count()) === 0, 'no card number fields');
await page.click('button[type=submit]');
ok((await page.locator('#co-ack-err').innerText()).length > 0, 'ack required');
await page.check('input[name=ack]');
await page.click('button[type=submit]');
await page.waitForURL('**/checkout/complete');
ok((await page.locator('h1').innerText()).includes('Thank you, Maya'), 'confirmation');
ok((await page.locator('.done').innerText()).includes('WL-DEMO-'), 'demo order id');
ok((await page.locator('.done').innerText()).includes('No payment was taken'), 'honest confirmation');
ok((await count()) === 0, 'cart cleared after order');
await page.goto(BASE + '/checkout');
ok((await page.locator('.empty').count()) === 1, 'empty checkout state');

step('Forms');
await page.goto(BASE + '/contact');
await page.click('.contact__form button[type=submit]');
ok((await page.locator('.contact__form [data-msg]').innerText()).length > 0, 'contact validation');
await page.fill('#c-name', 'Sam');
await page.fill('#c-email', 'sam@example.com');
await page.fill('#c-msg', 'Hello!');
await page.click('.contact__form button[type=submit]');
ok((await page.locator('.contact__form [data-msg]').innerText()).includes('not'), 'contact honest demo message');
await page.fill('#nl-email', 'bad');
await page.click('.inline-form button');
ok((await page.locator('.inline-form [data-msg]').innerText()).includes('valid email'), 'newsletter validation');

step('Other pages');
for (const [path, text] of [
  ['/about', 'About this project'],
  ['/shipping-returns', 'Questions, answered'],
  ['/nope', 'rabbit hole'],
  ['/product/does-not-exist', 'Shop all'],
]) {
  await page.goto(BASE + path);
  ok((await page.locator('main').innerText()).includes(text), `${path} shows "${text}"`);
}

step('Mobile menu');
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + '/');
await page.click('.nav-toggle');
ok(await page.locator('#mobile-nav').isVisible(), 'mobile nav opens');
await page.click('#mobile-nav >> text=Sensory Toys');
ok(page.url().endsWith('/shop/sensory-toys') && (await page.locator('#mobile-nav').isHidden()), 'mobile nav navigates + closes');

step('Layout overflow & accessibility');
const routes = ['/', '/shop', '/shop/gift-sets', '/product/activity-cube', '/product/first-birthday-set', '/cart', '/about', '/shipping-returns', '/contact', '/nope'];
// put something in the bag so cart/checkout render full layouts
await page.goto(BASE + '/product/walnut-push-car');
await page.click('.buy__add');
routes.push('/checkout');
for (const w of [320, 390, 768, 1024, 1440]) {
  await page.setViewportSize({ width: w, height: 900 });
  for (const r of routes) {
    await page.goto(BASE + r);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 0, `no horizontal overflow ${r} @${w} (${over}px)`);
  }
}
await page.setViewportSize({ width: 1280, height: 900 });
for (const r of routes) {
  await page.goto(BASE + r);
  await page.waitForTimeout(200);
  await page.addScriptTag({ content: AXE });
  const res = await page.evaluate(async () => {
    const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] });
    return r.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} — ${v.nodes[0].target.join(' ')}`);
  });
  ok(res.length === 0, `axe ${r}: ${res.join('; ')}`);
}

ok(errors.length === 0, 'no JS errors: ' + errors.join(' | '));
await browser.close();
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
