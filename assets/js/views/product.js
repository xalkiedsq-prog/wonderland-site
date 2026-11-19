import { PRODUCTS, byId, categoryOf, ageLabel, setValue, SHIPPING } from '../data.js';
import { cart } from '../store.js';
import { esc, money, photo, glyph, icon, productCard, toast, altFor } from '../ui.js';

export default function product({ params }) {
  const p = byId(params[0]);
  if (!p) return { redirect: '/shop' };
  const cat = categoryOf(p.category);
  const isSet = p.category === 'gift-sets';
  const related = [
    ...PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id),
    ...PRODUCTS.filter((x) => x.category !== p.category && x.featured && x.category !== 'gift-sets'),
  ].slice(0, 4);

  const optionId = `opt-${p.id}`;
  const options = p.options
    ? `<fieldset class="opt">
        <legend class="opt__legend">${esc(p.options.label)}: <span data-opt-current>${esc(p.options.values[0])}</span></legend>
        <div class="opt__list">
          ${p.options.values
            .map(
              (v, i) => `<label class="opt__item"><input type="radio" name="${optionId}" value="${esc(v)}" ${i === 0 ? 'checked' : ''}><span class="opt__swatch sw-${esc(v.toLowerCase().replace(/[^a-z]+/g, '-'))}" aria-hidden="true"></span><span>${esc(v)}</span></label>`,
            )
            .join('')}
        </div>
      </fieldset>`
    : '';

  const inside = isSet
    ? `<div class="inside">
        <h2 class="inside__title">What's inside</h2>
        <ul>${p.includes
          .map((id) => byId(id))
          .map((x) => `<li><a href="/product/${x.id}">${photo(x, 0, { sizes: '64px' })}<span>${esc(x.name)}</span><span class="inside__price">${money(x.price)}</span></a></li>`)
          .join('')}</ul>
        <p class="inside__note">${money(setValue(p))} if bought separately. The set is ${money(setValue(p) - p.price)} less.</p>
      </div>`
    : '';

  return {
    name: 'product',
    title: p.name,
    description: `${p.short} ${p.occasion ? p.occasion + '. ' : ''}Best for ${ageLabel(p.ages)}. ${money(p.price)}.`,
    html: `
    <div class="wrap pdp">
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/shop">Shop</a></li><li><a href="/shop/${cat.slug}">${esc(cat.name)}</a></li><li aria-current="page">${esc(p.name)}</li></ol></nav>

      <div class="pdp__grid">
        <div class="gallery" data-gallery>
          <div class="gallery__main" data-main>${photo(p, 0, { eager: true, sizes: '(min-width: 900px) 46vw, 100vw' })}</div>
          ${
            p.images.length > 1
              ? `<ul class="gallery__thumbs" aria-label="Product images">${p.images
                  .map(
                    (_, i) =>
                      `<li data-thumb><button type="button" class="thumb" data-index="${i}" aria-label="Show image ${i + 1}: ${esc(altFor(p, i))}" ${i === 0 ? 'aria-current="true"' : ''}>${photo(p, i, { sizes: '96px', inline: true })}</button></li>`,
                  )
                  .join('')}</ul>`
              : ''
          }
        </div>

        <div class="buy">
          <p class="buy__cat"><span class="dot tone-${cat.tone}"></span>${esc(p.occasion || cat.name)}</p>
          <h1 class="buy__name">${esc(p.name)}</h1>
          <p class="buy__price">${money(p.price)}</p>
          <p class="buy__short">${esc(p.short)}</p>
          <p class="buy__age">${glyph('key')}<span>Best for ${ageLabel(p.ages)}</span></p>

          <form class="buy__form" data-buy novalidate>
            ${options}
            <div class="buy__row">
              <div class="qty qty--lg" role="group" aria-label="Quantity">
                <button type="button" class="qty__btn" data-step="-1" aria-label="Decrease quantity" disabled>${icon('minus')}</button>
                <output class="qty__val" data-qty-val aria-live="polite">1</output>
                <button type="button" class="qty__btn" data-step="1" aria-label="Increase quantity">${icon('plus')}</button>
              </div>
              <button class="btn btn--lg buy__add" type="submit">Add to bag — <span data-line-price>${money(p.price)}</span></button>
            </div>
          </form>

          <ul class="perks">
            <li>${icon('truck')}Free standard shipping over ${money(SHIPPING.freeThreshold)}</li>
            <li>${icon('return')}30-day returns on unused items</li>
            <li>${icon('gift')}Gift wrap available at checkout</li>
          </ul>

          ${inside}

          <div class="buy__desc"><p>${esc(p.description)}</p></div>

          <div class="acc">
            <details open>
              <summary>Details &amp; care ${icon('plus', 'acc__icon')}</summary>
              <dl class="specs">${p.details.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}<div><dt>Age</dt><dd>${ageLabel(p.ages)}</dd></div></dl>
            </details>
            <details>
              <summary>Shipping &amp; returns ${icon('plus', 'acc__icon')}</summary>
              <p>Standard shipping is free on orders over ${money(SHIPPING.freeThreshold)} and ${money(SHIPPING.methods[0].price)} otherwise. Unused items can be returned within 30 days. <a href="/shipping-returns">Read the full policy</a>.</p>
            </details>
          </div>

          <p class="concept-note">${icon('info')}<span>This is a concept product from a portfolio project. Materials and dimensions are illustrative.</span></p>
        </div>
      </div>
    </div>

    <section class="section section--tight" aria-labelledby="rel-title">
      <div class="wrap">
        <div class="section__head"><h2 id="rel-title" class="h2">You may also like</h2></div>
        <div class="grid grid--4">${related.map((x) => productCard(x)).join('')}</div>
      </div>
    </section>`,
    mount(root) {
      let qty = 1;
      const form = root.querySelector('[data-buy]');
      const val = form.querySelector('[data-qty-val]');
      const minus = form.querySelector('[data-step="-1"]');
      const plus = form.querySelector('[data-step="1"]');
      const linePrice = form.querySelector('[data-line-price]');
      const sync = () => {
        val.textContent = qty;
        minus.disabled = qty <= 1;
        plus.disabled = qty >= cart.MAX_QTY;
        linePrice.textContent = money(p.price * qty);
      };
      form.addEventListener('click', (e) => {
        const b = e.target.closest('[data-step]');
        if (!b) return;
        qty = Math.max(1, Math.min(cart.MAX_QTY, qty + Number(b.dataset.step)));
        sync();
        if (b.disabled) (b === minus ? plus : minus).focus();
      });
      form.addEventListener('change', (e) => {
        if (e.target.type === 'radio') form.querySelector('[data-opt-current]').textContent = e.target.value;
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const opt = form.querySelector('input[type=radio]:checked')?.value || null;
        cart.add(p.id, opt, qty);
        toast(`${glyph('smile', 'toast__smile')}<span><strong>${esc(p.name)}</strong>${opt ? ` (${esc(opt)})` : ''} × ${qty} added to your bag.</span>`);
        qty = 1;
        sync();
        document.dispatchEvent(new CustomEvent('wl:open-cart'));
      });

      // Gallery
      const main = root.querySelector('[data-main]');
      root.querySelector('.gallery__thumbs')?.addEventListener('click', (e) => {
        const t = e.target.closest('.thumb');
        if (!t) return;
        const i = Number(t.dataset.index);
        main.innerHTML = photo(p, i, { eager: true, sizes: '(min-width: 900px) 46vw, 100vw' });
        root.querySelectorAll('.thumb').forEach((x) => x.removeAttribute('aria-current'));
        t.setAttribute('aria-current', 'true');
      });
      // If no photos exist at all, hide the thumbnail strip once loading settles.
      const thumbs = root.querySelector('.gallery__thumbs');
      if (thumbs) {
        const check = () => {
          const visible = [...thumbs.querySelectorAll('[data-thumb]')].filter((li) => !li.hidden);
          thumbs.hidden = visible.length < 2;
        };
        thumbs.addEventListener('load', check, true);
        thumbs.addEventListener('error', () => setTimeout(check), true);
        setTimeout(check, 1500);
      }
    },
  };
}
