import { BRAND } from './brand-paths.js';
import { categoryOf, ageLabel } from './data.js';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const money = (n) => {
  const s = usd.format(n);
  return Number.isInteger(n) ? s.replace(/\.00$/, '') : s;
};
export const moneyExact = (n) => usd.format(n);

/** Brand glyph traced from the identity sheet. */
export function glyph(name, cls = '') {
  const g = BRAND[name];
  if (!g) return '';
  return `<svg class="glyph ${cls}" viewBox="${g.vb}" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="${g.d}"/></svg>`;
}

// Interface icons: drawn to sit next to the brand glyphs (round caps, soft joins).
const UI = {
  bag: '<path d="M5.5 8.5h13l-1 11a1.5 1.5 0 0 1-1.5 1.4H8a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 6v12M6 12h12"/>',
  minus: '<path d="M6 12h12"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3.5 9h17M12 9v11M12 9c-1.5-3-5-4-5-1.5S10 9 12 9zm0 0c1.5-3 5-4 5-1.5S14 9 12 9z"/>',
  truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  return: '<path d="M8 8H15a5 5 0 0 1 0 10H9"/><path d="M11 5L8 8l3 3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
};
export function icon(name, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${UI[name]}</svg>`;
}

/**
 * Product image frame. A branded placeholder is always rendered underneath;
 * the photo covers it once it loads, and is removed if the file is missing.
 */
export function photo(p, index = 0, { cls = '', eager = false, sizes = '(min-width: 900px) 30vw, 50vw', inline = false } = {}) {
  const cat = categoryOf(p.category);
  const src = p.images?.[index];
  // Inside buttons only phrasing content is allowed, so use <span> wrappers there.
  const tag = inline ? 'span' : 'div';
  const srcset = src ? [480, 768].map((w) => `${src.replace(/\.webp$/, `-${w}.webp`)} ${w}w`).concat(`${src} 1024w`).join(', ') : '';
  return `<${tag} class="photo tone-${cat.tone} ${cls}" data-photo>
    <${tag} class="photo__ph" aria-hidden="true">
      ${glyph(cat.icon, 'photo__glyph')}
      <span class="photo__name">${esc(p.name)}</span>
    </${tag}>
    ${src ? `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${esc(altFor(p, index))}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="1024" height="1280">` : ''}
  </${tag}>`;
}
export function altFor(p, i) {
  return [`${p.name}`, `${p.name}, close-up detail`, `${p.name} in use`][i] || p.name;
}

export function productCard(p, { headingLevel = 3 } = {}) {
  const cat = categoryOf(p.category);
  const h = `h${headingLevel}`;
  return `<article class="card">
    <a class="card__link" href="/product/${p.id}">
      ${photo(p, 0, { sizes: '(min-width: 1100px) 300px, (min-width: 640px) 45vw, 48vw' })}
      <div class="card__body">
        <p class="card__meta"><span class="dot tone-${cat.tone}"></span>${esc(p.occasion || cat.name)}</p>
        <${h} class="card__title">${esc(p.name)}</${h}>
        <p class="card__price">${money(p.price)}</p>
      </div>
    </a>
    ${p.isNew ? `<span class="badge">${glyph('sparkle')}New</span>` : ''}
    <p class="card__age">${ageLabel(p.ages)}</p>
  </article>`;
}

/** Remove broken product photos so the placeholder shows through. */
document.addEventListener(
  'error',
  (e) => {
    const img = e.target;
    if (img?.tagName === 'IMG' && img.closest('[data-photo]')) {
      const thumb = img.closest('[data-thumb]');
      img.remove();
      if (thumb) thumb.hidden = true;
    }
  },
  true,
);
document.addEventListener(
  'load',
  (e) => {
    const img = e.target;
    if (img?.tagName === 'IMG') img.closest('[data-photo]')?.classList.add('is-loaded');
  },
  true,
);

let toastTimer;
export function toast(html) {
  const el = document.getElementById('toast');
  el.innerHTML = html;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 3600);
}

export function announce(msg) {
  const el = document.getElementById('sr-status');
  el.textContent = '';
  requestAnimationFrame(() => (el.textContent = msg));
}

export function qtyStepper(key, qty, max, label) {
  return `<div class="qty" role="group" aria-label="Quantity for ${esc(label)}">
    <button type="button" class="qty__btn" data-qty="${esc(key)}" data-delta="-1" aria-label="Decrease quantity">${icon('minus')}</button>
    <span class="qty__val" aria-live="polite">${qty}</span>
    <button type="button" class="qty__btn" data-qty="${esc(key)}" data-delta="1" aria-label="Increase quantity" ${qty >= max ? 'disabled' : ''}>${icon('plus')}</button>
  </div>`;
}
