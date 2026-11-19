import { CATEGORIES, PRODUCTS, AGES, GIFTS } from '../data.js';
import { esc, glyph, icon, productCard, money, photo } from '../ui.js';

export default function home() {
  const featured = PRODUCTS.filter((p) => p.featured && p.category !== 'gift-sets').slice(0, 6);
  const gifts = PRODUCTS.filter((p) => p.category === 'gift-sets');
  const count = (slug) => PRODUCTS.filter((p) => p.category === slug).length;

  return {
    name: 'home',
    title: '',
    html: `
    <section class="hero">
      <div class="wrap hero__grid">
        <div class="hero__copy">
          <p class="eyebrow">For babies from birth to three</p>
          <h1 class="hero__title">Curiously good things for little ones.</h1>
          <p class="lede">A small, carefully chosen collection of teethers, wooden toys and everyday essentials, picked for how they feel in the hand and how they look at home.</p>
          <div class="hero__actions">
            <a class="btn" href="/shop">Shop the collection ${icon('arrow')}</a>
            <a class="btn btn--ghost" href="/shop/gift-sets">${icon('gift')} Find a gift</a>
          </div>
        </div>
        <div class="hero__art">
          <div class="arch arch--hero">
            <div class="arch__checker" aria-hidden="true"></div>
            <img class="arch__img" src="/assets/img/site/hero.webp" alt="A wooden arch stacker and a cloud teether on a cream knit blanket" fetchpriority="high" width="1600" height="2000" data-optional>
            <span class="arch__smile" aria-hidden="true">${glyph('smile')}</span>
          </div>
          <span class="hero__sticker" aria-hidden="true">${glyph('rabbit')}</span>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="cat-title">
      <div class="wrap">
        <div class="section__head">
          <h2 id="cat-title" class="h2">Four ways in</h2>
          <a class="text-link" href="/shop">View all products ${icon('chevron')}</a>
        </div>
        <ul class="tiles">
          ${CATEGORIES.map(
            (c) => `<li>
            <a class="tile tone-${c.tone}" href="/shop/${c.slug}">
              <span class="tile__cut" aria-hidden="true">${glyph(c.icon)}</span>
              <span class="tile__name">${esc(c.name)}</span>
              <span class="tile__blurb">${esc(c.blurb)}</span>
              <span class="tile__count">${count(c.slug)} pieces ${icon('arrow')}</span>
            </a>
          </li>`,
          ).join('')}
        </ul>
      </div>
    </section>

    <section class="section section--cream" aria-labelledby="age-title">
      <div class="wrap age">
        <div class="age__intro">
          <span class="age__key" aria-hidden="true">${glyph('key')}</span>
          <h2 id="age-title" class="h2">Shop by age</h2>
          <p>Not sure where to begin? Start with how old they are. Every piece lists the ages it suits best.</p>
        </div>
        <ul class="age__list">
          ${AGES.map(
            (a, i) => `<li><a class="age__card" href="/shop?age=${a.slug}">
              <span class="age__num">${['0–6', '6–12', '12–36'][i]}</span>
              <span class="age__unit">months</span>
              <span class="age__desc">${['Soft textures, high contrast, first grips', 'Teething, reaching, sitting up', 'Stacking, pulling, first steps'][i]}</span>
              ${icon('arrow', 'age__arrow')}
            </a></li>`,
          ).join('')}
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="fav-title">
      <div class="wrap">
        <div class="section__head">
          <h2 id="fav-title" class="h2">A few favorites</h2>
          <a class="text-link" href="/shop">Shop all ${icon('chevron')}</a>
        </div>
        <div class="grid">${featured.map((p) => productCard(p)).join('')}</div>
      </div>
    </section>

    <section class="section principles" aria-labelledby="pr-title">
      <div class="wrap">
        <h2 id="pr-title" class="h2 principles__title">How we choose</h2>
        <ul class="principles__list">
          <li>${glyph('sparkle', 'principles__glyph tone-text-sage')}<h3>Made to be handled</h3><p>We look for natural woods, soft cottons and simple silicone: materials that feel good to small hands and age gracefully.</p></li>
          <li>${glyph('spiral', 'principles__glyph tone-text-plum')}<h3>Quiet by design</h3><p>Muted colors, honest shapes and no flashing lights. Toys that invite play instead of demanding attention.</p></li>
          <li>${glyph('keyhole', 'principles__glyph tone-text-ochre')}<h3>Fewer, better things</h3><p>A short list on purpose. Each piece earns its place by being useful, lasting and lovely to live with.</p></li>
        </ul>
      </div>
    </section>

    <section class="gifts-band" aria-labelledby="gift-title">
      <div class="wrap gifts-band__grid">
        <div class="gifts-band__copy">
          <p class="eyebrow eyebrow--light">${esc(GIFTS.name)}</p>
          <h2 id="gift-title" class="h2">Ready to give, beautifully boxed.</h2>
          <p>Three sets for the moments that call for something special: a new arrival, a baby shower and a first birthday. Each one comes in our signature box with a blank card.</p>
          <a class="btn btn--cream" href="/shop/gift-sets">Explore gift sets ${icon('arrow')}</a>
        </div>
        <ul class="gifts-band__list">
          ${gifts
            .map(
              (g) => `<li><a class="mini" href="/product/${g.id}">
              ${photo(g, 0, { sizes: '200px' })}
              <span class="mini__occ">${esc(g.occasion)}</span>
              <span class="mini__name">${esc(g.name)}</span>
              <span class="mini__price">${money(g.price)}</span>
            </a></li>`,
            )
            .join('')}
        </ul>
      </div>
    </section>`,
    mount(root) {
      // Hero photo is optional until the shoot is ready.
      const img = root.querySelector('[data-optional]');
      const drop = () => img.remove();
      if (img.complete && img.naturalWidth === 0) drop();
      img.addEventListener('error', drop);
      img.addEventListener('load', () => img.classList.add('is-loaded'));
    },
  };
}
