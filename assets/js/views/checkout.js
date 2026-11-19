import { cart, shippingCost } from '../store.js';
import { SHIPPING } from '../data.js';
import { esc, money, moneyExact, icon, glyph, photo } from '../ui.js';
import { emptyBag } from './cart.js';

const STATES = 'AL Alabama|AK Alaska|AZ Arizona|AR Arkansas|CA California|CO Colorado|CT Connecticut|DE Delaware|DC District of Columbia|FL Florida|GA Georgia|HI Hawaii|ID Idaho|IL Illinois|IN Indiana|IA Iowa|KS Kansas|KY Kentucky|LA Louisiana|ME Maine|MD Maryland|MA Massachusetts|MI Michigan|MN Minnesota|MS Mississippi|MO Missouri|MT Montana|NE Nebraska|NV Nevada|NH New Hampshire|NJ New Jersey|NM New Mexico|NY New York|NC North Carolina|ND North Dakota|OH Ohio|OK Oklahoma|OR Oregon|PA Pennsylvania|RI Rhode Island|SC South Carolina|SD South Dakota|TN Tennessee|TX Texas|UT Utah|VT Vermont|VA Virginia|WA Washington|WV West Virginia|WI Wisconsin|WY Wyoming'
  .split('|')
  .map((s) => [s.slice(0, 2), s.slice(3)]);

const KEY = 'wonderland.checkout.v1';
const load = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};
const save = (s) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
};

const STEPS = ['Information', 'Delivery', 'Review & pay'];

function field({ name, label, type = 'text', auto, required = true, pattern, hint, value = '', wide = false, inputmode, maxlength }) {
  const id = `co-${name}`;
  return `<div class="field ${wide ? 'field--wide' : ''}">
    <label for="${id}">${esc(label)}${required ? '' : ' <span class="field__opt">(optional)</span>'}</label>
    <input id="${id}" name="${name}" type="${type}" ${auto ? `autocomplete="${auto}"` : ''} ${required ? 'required' : ''} ${pattern ? `pattern="${pattern}"` : ''} ${inputmode ? `inputmode="${inputmode}"` : ''} ${maxlength ? `maxlength="${maxlength}"` : ''} value="${esc(value)}" aria-describedby="${id}-err${hint ? ` ${id}-hint` : ''}" data-label="${esc(label.toLowerCase())}">
    ${hint ? `<p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}
    <p class="field__err" id="${id}-err"></p>
  </div>`;
}

export function totals(state) {
  const sub = cart.subtotal();
  const ship = shippingCost(state.method || 'standard', sub);
  const wrap = state.giftWrap ? SHIPPING.giftWrap : 0;
  return { sub, ship, wrap, total: sub + ship + wrap };
}

function summary(state) {
  const t = totals(state);
  return `<h2 class="summary__title" id="co-sum">Order summary</h2>
    <ul class="mini-lines">${cart
      .lines()
      .map(
        (l) => `<li>${photo(l.product, 0, { sizes: '56px' })}<span class="mini-lines__qty" aria-hidden="true">${l.qty}</span>
          <div><p class="mini-lines__name">${esc(l.product.name)}</p><p class="mini-lines__meta">${l.option ? `${esc(l.option)} · ` : ''}Qty ${l.qty}</p></div>
          <p class="mini-lines__price">${moneyExact(l.product.price * l.qty)}</p></li>`,
      )
      .join('')}</ul>
    <dl>
      <div class="sum-row"><dt>Subtotal</dt><dd>${moneyExact(t.sub)}</dd></div>
      <div class="sum-row"><dt>Shipping (${esc(SHIPPING.methods.find((m) => m.id === (state.method || 'standard')).name)})</dt><dd>${t.ship === 0 ? 'Free' : moneyExact(t.ship)}</dd></div>
      ${t.wrap ? `<div class="sum-row"><dt>Gift wrap</dt><dd>${moneyExact(t.wrap)}</dd></div>` : ''}
      <div class="sum-row sum-row--muted"><dt>Sales tax</dt><dd>Not charged in this demo</dd></div>
      <div class="sum-row sum-row--total"><dt>Total</dt><dd>${moneyExact(t.total)}</dd></div>
    </dl>
    <a class="text-link summary__edit" href="/cart">Edit bag</a>`;
}

export default function checkout({ navigate }) {
  if (!cart.count()) {
    return {
      name: 'checkout',
      title: 'Checkout',
    noindex: true,
      html: `<div class="wrap page"><h1 class="h1 page__title">Checkout</h1>${emptyBag()}</div>`,
    };
  }
  const state = Object.assign({ step: 0, method: 'standard', giftWrap: false }, load());

  const progress = () =>
    `<ol class="steps">${STEPS.map(
      (s, i) =>
        `<li class="${i < state.step ? 'is-done' : ''} ${i === state.step ? 'is-current' : ''}" ${i === state.step ? 'aria-current="step"' : ''}><span class="steps__n" aria-hidden="true">${i < state.step ? icon('check') : i + 1}</span>${s}${i < state.step ? '<span class="visually-hidden"> (completed)</span>' : ''}</li>`,
    ).join('')}</ol>`;

  const recap = () => {
    const parts = [];
    if (state.step > 0)
      parts.push(`<div class="recap__row"><dt>Contact</dt><dd>${esc(state.email)}</dd><dd><button type="button" class="link-btn" data-goto="0">Change<span class="visually-hidden"> contact and address</span></button></dd></div>
      <div class="recap__row"><dt>Ship to</dt><dd>${esc(`${state.firstName} ${state.lastName}, ${state.address1}${state.address2 ? ', ' + state.address2 : ''}, ${state.city}, ${state.state} ${state.zip}`)}</dd><dd></dd></div>`);
    if (state.step > 1) {
      const m = SHIPPING.methods.find((x) => x.id === state.method);
      parts.push(`<div class="recap__row"><dt>Delivery</dt><dd>${esc(m.name)}, ${esc(m.eta)}${state.giftWrap ? ' · Gift wrapped' : ''}</dd><dd><button type="button" class="link-btn" data-goto="1">Change<span class="visually-hidden"> delivery</span></button></dd></div>`);
    }
    return parts.length ? `<dl class="recap">${parts.join('')}</dl>` : '';
  };

  const stepHtml = () => {
    if (state.step === 0)
      return `<form class="co-form" data-step-form novalidate>
        <h2 class="co-form__title">Contact</h2>
        <div class="fields">
          ${field({ name: 'email', label: 'Email', type: 'email', auto: 'email', value: state.email, wide: true, hint: 'Only used on this page. Nothing is sent.' })}
        </div>
        <h2 class="co-form__title">Shipping address</h2>
        <div class="fields">
          ${field({ name: 'firstName', label: 'First name', auto: 'given-name', value: state.firstName })}
          ${field({ name: 'lastName', label: 'Last name', auto: 'family-name', value: state.lastName })}
          ${field({ name: 'address1', label: 'Address', auto: 'address-line1', value: state.address1, wide: true })}
          ${field({ name: 'address2', label: 'Apartment, suite, etc.', auto: 'address-line2', value: state.address2, required: false, wide: true })}
          ${field({ name: 'city', label: 'City', auto: 'address-level2', value: state.city })}
          <div class="field">
            <label for="co-state">State</label>
            <select id="co-state" name="state" autocomplete="address-level1" required aria-describedby="co-state-err" data-label="state">
              <option value="">Select</option>
              ${STATES.map(([c, n]) => `<option value="${c}" ${state.state === c ? 'selected' : ''}>${n}</option>`).join('')}
            </select>
            <p class="field__err" id="co-state-err"></p>
          </div>
          ${field({ name: 'zip', label: 'ZIP code', auto: 'postal-code', value: state.zip, pattern: '\\d{5}(-\\d{4})?', inputmode: 'numeric', maxlength: 10 })}
          ${field({ name: 'phone', label: 'Phone', type: 'tel', auto: 'tel', value: state.phone, required: false })}
        </div>
        <div class="co-form__actions">
          <a class="text-link" href="/cart">${icon('back')} Back to bag</a>
          <button class="btn btn--lg" type="submit">Continue to delivery ${icon('arrow')}</button>
        </div>
      </form>`;
    if (state.step === 1) {
      const sub = cart.subtotal();
      return `<form class="co-form" data-step-form novalidate>
        <fieldset class="choice">
          <legend class="co-form__title">Shipping method</legend>
          ${SHIPPING.methods
            .map((m) => {
              const cost = shippingCost(m.id, sub);
              return `<label class="choice__item"><input type="radio" name="method" value="${m.id}" ${state.method === m.id ? 'checked' : ''}>
              <span class="choice__main"><span class="choice__name">${m.name}</span><span class="choice__sub">${m.eta}</span></span>
              <span class="choice__price">${cost === 0 ? 'Free' : moneyExact(cost)}</span></label>`;
            })
            .join('')}
          ${sub < SHIPPING.freeThreshold ? `<p class="fine">Add ${moneyExact(SHIPPING.freeThreshold - sub)} more for free standard shipping.</p>` : ''}
        </fieldset>
        <fieldset class="choice">
          <legend class="co-form__title">Gifting</legend>
          <label class="choice__item choice__item--check"><input type="checkbox" name="giftWrap" ${state.giftWrap ? 'checked' : ''} aria-controls="gift-extra">
            <span class="choice__main"><span class="choice__name">${glyph('smile', 'choice__smile')}Add gift wrapping</span><span class="choice__sub">Wrapped in our cream paper, tied with a ribbon, with your note inside.</span></span>
            <span class="choice__price">+${money(SHIPPING.giftWrap)}</span></label>
          <div class="gift-extra" id="gift-extra" ${state.giftWrap ? '' : 'hidden'}>
            <div class="field field--wide">
              <label for="co-giftMsg">Gift note <span class="field__opt">(optional)</span></label>
              <textarea id="co-giftMsg" name="giftMsg" rows="3" maxlength="200" aria-describedby="co-giftMsg-hint">${esc(state.giftMsg || '')}</textarea>
              <p class="field__hint" id="co-giftMsg-hint"><span data-chars>${(state.giftMsg || '').length}</span>/200 characters</p>
            </div>
            <label class="check"><input type="checkbox" name="hidePrices" ${state.hidePrices ? 'checked' : ''}><span>Leave prices off the packing slip</span></label>
          </div>
        </fieldset>
        <div class="co-form__actions">
          <button type="button" class="text-link" data-goto="0">${icon('back')} Back</button>
          <button class="btn btn--lg" type="submit">Continue to review ${icon('arrow')}</button>
        </div>
      </form>`;
    }
    return `<form class="co-form" data-step-form novalidate>
      <h2 class="co-form__title">Payment</h2>
      <div class="demo-pay">
        <span class="demo-pay__glyph" aria-hidden="true">${glyph('keyhole')}</span>
        <div>
          <p class="demo-pay__title">This is a demonstration checkout.</p>
          <p>WONDERLAND is a concept store. There is no payment step: no card details are requested, nothing will be charged and no order will be shipped.</p>
        </div>
      </div>
      <fieldset class="choice">
        <legend class="visually-hidden">Payment method</legend>
        <label class="choice__item"><input type="radio" name="pay" value="demo" checked>
          <span class="choice__main"><span class="choice__name">Demo payment</span><span class="choice__sub">Simulates a successful payment. Nothing is charged.</span></span>
          <span class="choice__price">$0.00</span></label>
      </fieldset>
      <div class="field">
        <label class="check check--req"><input type="checkbox" name="ack" required aria-describedby="co-ack-err" data-label="confirmation"><span>I understand this is a demo and no real purchase will be made.</span></label>
        <p class="field__err" id="co-ack-err"></p>
      </div>
      <div class="co-form__actions">
        <button type="button" class="text-link" data-goto="1">${icon('back')} Back</button>
        <button class="btn btn--lg" type="submit">Place demo order — <span data-total>${moneyExact(totals(state).total)}</span></button>
      </div>
    </form>`;
  };

  const errorText = (el) => {
    const v = el.validity;
    const name = el.dataset.label || 'this field';
    if (el.type === 'checkbox') return 'Please tick this box to continue.';
    if (v.valueMissing) return el.tagName === 'SELECT' ? `Please select a ${name}.` : `Please enter your ${name}.`;
    if (v.typeMismatch && el.type === 'email') return 'Please enter an email like name@example.com.';
    if (v.patternMismatch && el.name === 'zip') return 'Please enter a 5-digit ZIP code.';
    return 'Please check this field.';
  };

  return {
    name: 'checkout',
    title: 'Checkout',
    noindex: true,
    html: `<div class="wrap page checkout">
      <div class="checkout__head">
        <h1 class="h1 page__title">Checkout</h1>
        <p class="demo-note">${icon('info')}<span><strong>Demo checkout.</strong> No payment is taken and no order is placed.</span></p>
      </div>
      <div class="checkout__grid">
        <div class="checkout__main">
          <nav aria-label="Checkout progress" data-progress>${progress()}</nav>
          <div data-recap>${recap()}</div>
          <div data-step-wrap>${stepHtml()}</div>
        </div>
        <aside class="summary summary--sticky" aria-labelledby="co-sum" data-summary>${summary(state)}</aside>
      </div>
    </div>`,
    mount(root) {
      const wrap = root.querySelector('[data-step-wrap]');
      const sum = root.querySelector('[data-summary]');
      const rerender = (focusTitle = true) => {
        save(state);
        root.querySelector('[data-progress]').innerHTML = progress();
        root.querySelector('[data-recap]').innerHTML = recap();
        wrap.innerHTML = stepHtml();
        sum.innerHTML = summary(state);
        if (focusTitle) {
          const t = wrap.querySelector('.co-form__title');
          t.setAttribute('tabindex', '-1');
          t.focus({ preventScroll: true });
          root.querySelector('.checkout__main').scrollIntoView({ block: 'start', behavior: 'auto' });
        }
      };
      const refreshTotals = () => {
        save(state);
        sum.innerHTML = summary(state);
        const t = wrap.querySelector('[data-total]');
        if (t) t.textContent = moneyExact(totals(state).total);
      };

      root.addEventListener('click', (e) => {
        const g = e.target.closest('[data-goto]');
        if (g) {
          state.step = Number(g.dataset.goto);
          rerender();
        }
      });
      root.addEventListener('input', (e) => {
        const el = e.target;
        if (el.name === 'giftMsg') {
          state.giftMsg = el.value;
          wrap.querySelector('[data-chars]').textContent = el.value.length;
          save(state);
        }
        if (el.getAttribute('aria-invalid') === 'true' && el.checkValidity()) {
          el.setAttribute('aria-invalid', 'false');
          const err = root.querySelector(`#${el.id || 'co-' + el.name}-err`);
          if (err) err.textContent = '';
        }
      });
      root.addEventListener('change', (e) => {
        const el = e.target;
        if (el.name === 'method') {
          state.method = el.value;
          refreshTotals();
        } else if (el.name === 'giftWrap') {
          state.giftWrap = el.checked;
          wrap.querySelector('#gift-extra').hidden = !el.checked;
          refreshTotals();
        } else if (el.name === 'hidePrices') {
          state.hidePrices = el.checked;
          save(state);
        } else if (el.name === 'ack' && el.checked) {
          el.setAttribute('aria-invalid', 'false');
          root.querySelector('#co-ack-err').textContent = '';
        }
      });
      root.addEventListener('submit', (e) => {
        const form = e.target.closest('[data-step-form]');
        if (!form) return;
        e.preventDefault();
        const els = [...form.querySelectorAll('input, select, textarea')];
        let first = null;
        for (const el of els) {
          if (el.name === 'zip') el.value = el.value.trim();
          const ok = el.checkValidity();
          const err = root.querySelector(`#${el.id || 'co-' + el.name}-err`);
          if (err) err.textContent = ok ? '' : errorText(el);
          if (el.required || el.value) el.setAttribute('aria-invalid', String(!ok));
          if (!ok && !first) first = el;
        }
        if (first) {
          first.focus();
          return;
        }
        if (state.step === 0) {
          for (const el of els) state[el.name] = el.value.trim();
          state.step = 1;
          rerender();
        } else if (state.step === 1) {
          state.step = 2;
          rerender();
        } else {
          const t = totals(state);
          const order = {
            id: 'WL-DEMO-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
            date: new Date().toISOString(),
            lines: cart.lines().map((l) => ({ id: l.id, name: l.product.name, option: l.option, qty: l.qty, price: l.product.price })),
            ...t,
            method: state.method,
            giftWrap: state.giftWrap,
            giftMsg: state.giftWrap ? state.giftMsg || '' : '',
            firstName: state.firstName,
            city: state.city,
            state: state.state,
            email: state.email,
          };
          try {
            sessionStorage.setItem('wonderland.lastOrder', JSON.stringify(order));
            sessionStorage.removeItem(KEY);
          } catch {
            /* ignore */
          }
          cart.clear();
          navigate('/checkout/complete');
        }
      });
      return cart.subscribe(() => {
        if (!cart.count()) return;
        refreshTotals();
      });
    },
  };
}

