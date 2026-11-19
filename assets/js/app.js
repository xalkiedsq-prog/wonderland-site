import { cart } from './store.js';
import { renderDrawer, bindCartControls } from './views/cart.js';
import home from './views/home.js';
import shop from './views/shop.js';
import product from './views/product.js';
import cartPage from './views/cart-page.js';
import checkout from './views/checkout.js';
import complete from './views/complete.js';
import { about, shipping, contact, notFound } from './views/pages.js';

const routes = [
  [/^\/$/, home],
  [/^\/shop\/?$/, shop],
  [/^\/shop\/([\w-]+)\/?$/, shop],
  [/^\/product\/([\w-]+)\/?$/, product],
  [/^\/cart\/?$/, cartPage],
  [/^\/checkout\/?$/, checkout],
  [/^\/checkout\/complete\/?$/, complete],
  [/^\/about\/?$/, about],
  [/^\/shipping-returns\/?$/, shipping],
  [/^\/contact\/?$/, contact],
];

const main = document.getElementById('main');
let cleanup = null;
let firstRender = true;

function resolve(pathname) {
  for (const [re, view] of routes) {
    const m = pathname.match(re);
    if (m) return { view, params: m.slice(1) };
  }
  return { view: notFound, params: [] };
}

export function navigate(url, { replace = false } = {}) {
  const u = new URL(url, location.origin);
  if (replace) history.replaceState({}, '', u);
  else history.pushState({}, '', u);
  render();
}

function render() {
  cleanup?.();
  cleanup = null;
  const url = new URL(location.href);
  const { view, params } = resolve(url.pathname);
  const result = view({ params, query: url.searchParams, navigate });
  if (result.redirect) return navigate(result.redirect, { replace: true });

  document.title = result.title ? `${result.title} — WONDERLAND` : 'WONDERLAND — Curiously good things for little ones';
  setMeta(url, result);
  main.innerHTML = result.html;
  main.dataset.view = result.name || '';
  cleanup = result.mount?.(main) || null;

  setActiveNav(url.pathname);
  closeMobileNav();

  if (url.hash) {
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (target) {
      target.scrollIntoView();
      target.setAttribute('tabindex', '-1');
      if (!firstRender) target.focus({ preventScroll: true });
    }
  } else if (!result.keepScroll) {
    window.scrollTo(0, 0);
  }
  // Move focus to the new page heading so screen-reader and keyboard users land on fresh content.
  if (!firstRender && !url.hash) {
    const h1 = main.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }
  firstRender = false;
}

// Per-page metadata for search engines and link previews.
const SITE = 'https://wonderlandbabyshop.pages.dev';
const DEFAULT_DESC = document.querySelector('meta[name="description"]').content;
function setMeta(url, result) {
  const desc = result.description || DEFAULT_DESC;
  const canonical = SITE + url.pathname + (url.pathname.startsWith('/shop') && url.searchParams.get('age') ? `?age=${url.searchParams.get('age')}` : '');
  const set = (sel, attr, val) => document.querySelector(sel)?.setAttribute(attr, val);
  set('meta[name="description"]', 'content', desc);
  set('meta[property="og:description"]', 'content', desc);
  set('meta[property="og:title"]', 'content', document.title);
  set('meta[property="og:url"]', 'content', canonical);
  set('link[rel="canonical"]', 'href', canonical);
  let robots = document.querySelector('meta[name="robots"]');
  if (result.noindex) {
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.append(robots);
    }
    robots.content = 'noindex';
  } else robots?.remove();
}

function setActiveNav(path) {
  const key = path.startsWith('/shop/gift-sets')
    ? 'gifts'
    : path.startsWith('/shop') || path.startsWith('/product')
      ? 'shop'
      : path.startsWith('/about')
        ? 'about'
        : path.startsWith('/shipping') || path.startsWith('/contact')
          ? 'help'
          : '';
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === key) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ── Link interception ─────────────────────────────────────────
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (a.target && a.target !== '_self') return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || /\.\w+$/.test(url.pathname)) return;
  e.preventDefault();
  closeDrawer({ restoreFocus: false });
  if (url.pathname === location.pathname && url.search === location.search && url.hash) {
    history.pushState({}, '', url);
    const t = document.getElementById(url.hash.slice(1));
    if (t) {
      t.setAttribute('tabindex', '-1');
      t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      t.focus({ preventScroll: true });
    }
    return;
  }
  navigate(url.href);
});
window.addEventListener('popstate', render);

// ── Header: cart count, mobile nav ────────────────────────────
const countEl = document.querySelector('[data-cart-count]');
const countSr = document.querySelector('[data-cart-sr]');
function syncCount() {
  const n = cart.count();
  countEl.textContent = n;
  countEl.classList.toggle('is-empty', n === 0);
  countSr.textContent = `, ${n} item${n === 1 ? '' : 's'}`;
}

const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMobileNav() {
  mobileNav.hidden = true;
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('nav-open');
}
navToggle.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('nav-open', open);
  if (open) mobileNav.querySelector('a')?.focus();
});

// ── Cart drawer ───────────────────────────────────────────────
const drawer = document.getElementById('cart-drawer');
const drawerPanel = drawer.querySelector('.drawer__panel');
const drawerBody = drawer.querySelector('[data-drawer-body]');
let lastFocus = null;

export function openDrawer() {
  lastFocus = document.activeElement;
  renderDrawer(drawerBody);
  drawer.hidden = false;
  document.body.classList.add('drawer-open');
  requestAnimationFrame(() => drawer.classList.add('is-open'));
  drawerPanel.focus();
}
function closeDrawer({ restoreFocus = true } = {}) {
  if (drawer.hidden) return;
  drawer.classList.remove('is-open');
  document.body.classList.remove('drawer-open');
  const done = () => (drawer.hidden = true);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) done();
  else setTimeout(done, 280);
  if (restoreFocus) lastFocus?.focus?.();
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-open-cart]')) openDrawer();
  else if (e.target.closest('[data-close-cart]')) closeDrawer();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!drawer.hidden) closeDrawer();
    else if (!mobileNav.hidden) {
      closeMobileNav();
      navToggle.focus();
    }
  }
  if (e.key === 'Tab' && !drawer.hidden) trapFocus(e, drawerPanel);
});
function trapFocus(e, container) {
  const f = [...container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
    (el) => el.offsetParent !== null,
  );
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === container)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
bindCartControls(drawerBody);
document.addEventListener('wl:open-cart', openDrawer);

cart.subscribe(() => {
  syncCount();
  if (!drawer.hidden) renderDrawer(drawerBody);
});

// ── Demo forms (newsletter, contact) ──────────────────────────
document.addEventListener('submit', (e) => {
  const form = e.target.closest('[data-demo-form]');
  if (!form) return;
  e.preventDefault();
  const msg = form.querySelector('[data-msg]');
  const fields = [...form.querySelectorAll('input, textarea, select')].filter((f) => f.required || f.value);
  let firstBad = null;
  for (const f of fields) {
    const bad = !f.checkValidity();
    f.setAttribute('aria-invalid', String(bad));
    if (bad && !firstBad) firstBad = f;
  }
  if (firstBad) {
    msg.className = 'field-msg is-error';
    msg.textContent =
      firstBad.type === 'email' ? 'Please enter a valid email address.' : `Please fill in the ${firstBad.dataset.label || 'highlighted'} field.`;
    firstBad.focus();
    return;
  }
  const kind = form.dataset.demoForm;
  msg.className = 'field-msg is-ok';
  msg.innerHTML =
    kind === 'newsletter'
      ? 'Thank you! This is a concept store, so your email was <strong>not</strong> saved or sent anywhere.'
      : 'Thank you! This is a concept store, so your message was <strong>not</strong> sent. Nothing you typed has left this page.';
  form.reset();
  form.querySelectorAll('[aria-invalid]').forEach((f) => f.removeAttribute('aria-invalid'));
});

syncCount();
render();

