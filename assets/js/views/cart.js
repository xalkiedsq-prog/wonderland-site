import { cart, shippingCost } from '../store.js';
import { SHIPPING, categoryOf } from '../data.js';
import { esc, money, moneyExact, photo, icon, glyph, qtyStepper, announce } from '../ui.js';

export function freeShippingMeter(subtotal) {
  const left = Math.max(0, SHIPPING.freeThreshold - subtotal);
  const pct = Math.min(100, (subtotal / SHIPPING.freeThreshold) * 100);
  return `<div class="meter">
    <p class="meter__text">${
      left > 0
        ? `You're <strong>${moneyExact(left)}</strong> away from free standard shipping.`
        : `${glyph('sparkle', 'meter__spark')} Your order ships free.`
    }</p>
    <div class="meter__track" role="progressbar" aria-label="Progress to free shipping" aria-valuemin="0" aria-valuemax="${SHIPPING.freeThreshold}" aria-valuenow="${Math.min(subtotal, SHIPPING.freeThreshold).toFixed(2)}"><span style="width:${pct}%"></span></div>
  </div>`;
}

export function lineItem(l, { compact = false } = {}) {
  const p = l.product;
  const cat = categoryOf(p.category);
  return `<li class="line ${compact ? 'line--compact' : ''}" data-line="${esc(l.key)}">
    <a class="line__img" href="/product/${p.id}" tabindex="-1" aria-hidden="true">${photo(p, 0, { sizes: '96px' })}</a>
    <div class="line__info">
      <p class="line__cat">${esc(p.occasion || cat.name)}</p>
      <h3 class="line__name"><a href="/product/${p.id}">${esc(p.name)}</a></h3>
      ${l.option ? `<p class="line__opt">${esc(p.options?.label || 'Option')}: ${esc(l.option)}</p>` : ''}
      <p class="line__unit">${money(p.price)} each</p>
    </div>
    <div class="line__controls">
      ${qtyStepper(l.key, l.qty, cart.MAX_QTY, p.name + (l.option ? `, ${l.option}` : ''))}
      <p class="line__total">${moneyExact(p.price * l.qty)}</p>
      <button type="button" class="link-btn line__remove" data-remove="${esc(l.key)}">Remove<span class="visually-hidden"> ${esc(p.name)}</span></button>
    </div>
  </li>`;
}

export function emptyBag(compact = false) {
  return `<div class="empty ${compact ? 'empty--compact' : ''}">
    ${glyph('smile', 'empty__smile')}
    <p class="empty__title">Your bag is empty.</p>
    <p class="empty__text">Nothing here yet but a smile. Start with a few of our favorites.</p>
    <a class="btn" href="/shop">Browse the shop</a>
  </div>`;
}

export function renderDrawer(root) {
  const lines = cart.lines();
  if (!lines.length) {
    root.innerHTML = emptyBag(true);
    return;
  }
  const sub = cart.subtotal();
  root.innerHTML = `
    ${freeShippingMeter(sub)}
    <ul class="lines">${lines.map((l) => lineItem(l, { compact: true })).join('')}</ul>
    <div class="drawer__foot">
      <dl class="sum-row"><dt>Subtotal</dt><dd>${moneyExact(sub)}</dd></dl>
      <p class="fine">Shipping and gift wrap are chosen at checkout.</p>
      <a class="btn btn--block" href="/checkout">Checkout ${icon('arrow')}</a>
      <a class="btn btn--ghost btn--block" href="/cart">View bag</a>
    </div>`;
}

/** Quantity and remove buttons; works for any container rendered with lineItem(). */
export function bindCartControls(root) {
  root.addEventListener('click', (e) => {
    const q = e.target.closest('[data-qty]');
    const r = e.target.closest('[data-remove]');
    if (q) {
      const key = q.dataset.qty;
      const line = cart.lines().find((l) => l.key === key);
      if (!line) return;
      const next = line.qty + Number(q.dataset.delta);
      const which = q.dataset.delta;
      cart.setQty(key, next);
      if (next <= 0) {
        announce(`${line.product.name} removed from your bag.`);
        root.querySelector('a, button')?.focus();
      } else {
        announce(`${line.product.name}: quantity ${Math.min(next, cart.MAX_QTY)}.`);
        // Keep focus on the same control after re-render.
        const sel = `[data-qty="${CSS.escape(key)}"][data-delta="${which}"]`;
        const btn = root.querySelector(sel);
        (btn && !btn.disabled ? btn : root.querySelector(`[data-qty="${CSS.escape(key)}"]`))?.focus();
      }
    } else if (r) {
      const key = r.dataset.remove;
      const line = cart.lines().find((l) => l.key === key);
      const lines = [...root.querySelectorAll('[data-line]')];
      const idx = lines.findIndex((el) => el.dataset.line === key);
      cart.remove(key);
      announce(`${line?.product.name || 'Item'} removed from your bag.`);
      const after = [...root.querySelectorAll('[data-line]')];
      const target = after[Math.min(idx, after.length - 1)];
      (target?.querySelector('[data-remove]') || root.querySelector('a.btn, a, button'))?.focus();
    }
  });
}

export { shippingCost };
