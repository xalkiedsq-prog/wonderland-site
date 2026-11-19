import { SHIPPING } from '../data.js';
import { esc, moneyExact, glyph, icon } from '../ui.js';

export default function complete() {
  let o = null;
  try {
    o = JSON.parse(sessionStorage.getItem('wonderland.lastOrder'));
  } catch {
    o = null;
  }
  if (!o) {
    return {
      name: 'complete',
      title: 'Order',
      noindex: true,
      html: `<div class="wrap page"><div class="empty">${glyph('smile', 'empty__smile')}<h1 class="empty__title">No recent demo order</h1><p class="empty__text">Orders placed in this demo are kept only for the current browser tab.</p><a class="btn" href="/shop">Browse the shop</a></div></div>`,
    };
  }
  const m = SHIPPING.methods.find((x) => x.id === o.method) || SHIPPING.methods[0];
  return {
    name: 'complete',
    title: 'Demo order complete',
    noindex: true,
    html: `<section class="done">
      <div class="done__bg" aria-hidden="true"></div>
      <div class="wrap">
        <div class="done__card">
          <span class="done__smile" aria-hidden="true">${glyph('smile')}</span>
          <p class="eyebrow">Demo order ${esc(o.id)}</p>
          <h1 class="h1">Thank you${o.firstName ? `, ${esc(o.firstName)}` : ''}.</h1>
          <p class="done__lede">You've reached the end of the WONDERLAND checkout.</p>
          <div class="demo-pay">
            <span class="demo-pay__glyph" aria-hidden="true">${glyph('keyhole')}</span>
            <div><p class="demo-pay__title">This was a demonstration.</p><p>No payment was taken, nothing will be shipped and no confirmation email has been sent. Your details were kept only in this browser tab.</p></div>
          </div>
          <h2 class="done__sub">What you would have received</h2>
          <ul class="done__lines">${o.lines
            .map((l) => `<li><span>${esc(l.name)}${l.option ? ` <span class="muted">(${esc(l.option)})</span>` : ''} × ${l.qty}</span><span>${moneyExact(l.price * l.qty)}</span></li>`)
            .join('')}</ul>
          <dl class="done__totals">
            <div class="sum-row"><dt>Subtotal</dt><dd>${moneyExact(o.sub)}</dd></div>
            <div class="sum-row"><dt>${esc(m.name)} shipping (${esc(m.eta)})${o.city ? ` to ${esc(o.city)}, ${esc(o.state)}` : ''}</dt><dd>${o.ship === 0 ? 'Free' : moneyExact(o.ship)}</dd></div>
            ${o.giftWrap ? `<div class="sum-row"><dt>Gift wrap${o.giftMsg ? ` with note: “${esc(o.giftMsg)}”` : ''}</dt><dd>${moneyExact(o.wrap)}</dd></div>` : ''}
            <div class="sum-row sum-row--total"><dt>Total (not charged)</dt><dd>${moneyExact(o.total)}</dd></div>
          </dl>
          <div class="done__actions">
            <a class="btn" href="/shop">Back to the shop ${icon('arrow')}</a>
            <a class="btn btn--ghost" href="/about#project">About this project</a>
          </div>
        </div>
      </div>
    </section>`,
  };
}
