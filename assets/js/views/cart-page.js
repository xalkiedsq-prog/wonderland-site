import { cart, shippingCost } from '../store.js';
import { SHIPPING } from '../data.js';
import { moneyExact, money, icon } from '../ui.js';
import { lineItem, emptyBag, freeShippingMeter, bindCartControls } from './cart.js';

function body() {
  const lines = cart.lines();
  if (!lines.length) return emptyBag();
  const sub = cart.subtotal();
  const ship = shippingCost('standard', sub);
  return `<div class="bag">
    <div class="bag__lines">
      <h2 class="visually-hidden">Items in your bag</h2>
      ${freeShippingMeter(sub)}
      <ul class="lines">${lines.map((l) => lineItem(l)).join('')}</ul>
      <a class="text-link" href="/shop">${icon('back')} Continue shopping</a>
    </div>
    <aside class="summary" aria-labelledby="sum-title">
      <h2 id="sum-title" class="summary__title">Order summary</h2>
      <dl>
        <div class="sum-row"><dt>Subtotal (${cart.count()} item${cart.count() === 1 ? '' : 's'})</dt><dd>${moneyExact(sub)}</dd></div>
        <div class="sum-row"><dt>Standard shipping</dt><dd>${ship === 0 ? 'Free' : moneyExact(ship)}</dd></div>
        <div class="sum-row sum-row--muted"><dt>Sales tax</dt><dd>Not charged in this demo</dd></div>
        <div class="sum-row sum-row--total"><dt>Estimated total</dt><dd>${moneyExact(sub + ship)}</dd></div>
      </dl>
      <a class="btn btn--block btn--lg" href="/checkout">Continue to checkout ${icon('arrow')}</a>
      <p class="fine">${icon('gift')} Gift wrapping (${money(SHIPPING.giftWrap)}) and express shipping can be chosen at checkout.</p>
    </aside>
  </div>`;
}

export default function cartPage() {
  return {
    name: 'cart',
    title: 'Your bag',
    noindex: true,
    html: `<div class="wrap page">
      <h1 class="h1 page__title">Your bag</h1>
      <div data-bag>${body()}</div>
    </div>`,
    mount(root) {
      const box = root.querySelector('[data-bag]');
      bindCartControls(box);
      return cart.subscribe(() => {
        box.innerHTML = body();
      });
    },
  };
}
