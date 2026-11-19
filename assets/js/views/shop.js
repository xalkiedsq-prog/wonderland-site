import { CATEGORIES, GIFTS, PRODUCTS, AGES, categoryOf, matchesAge } from '../data.js';
import { esc, glyph, productCard, announce } from '../ui.js';

const SORTS = [
  ['featured', 'Featured'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
  ['name', 'Name: A–Z'],
];

function filtered(cat, age, sort) {
  let list = PRODUCTS.filter((p) => (cat ? p.category === cat : p.category !== 'gift-sets'));
  if (age) list = list.filter((p) => matchesAge(p, age));
  const s = [...list];
  if (sort === 'price-asc') s.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') s.sort((a, b) => b.price - a.price);
  else if (sort === 'name') s.sort((a, b) => a.name.localeCompare(b.name));
  else s.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  return s;
}

export default function shop({ params, query }) {
  const slug = params[0] || '';
  const cat = slug ? categoryOf(slug) : null;
  if (slug && !cat) return { redirect: '/shop' };

  const isGifts = slug === GIFTS.slug;
  let age = AGES.some((a) => a.slug === query.get('age')) ? query.get('age') : '';
  let sort = SORTS.some(([k]) => k === query.get('sort')) ? query.get('sort') : 'featured';

  const title = cat ? cat.name : 'Shop all';
  const blurb = cat ? cat.blurb : 'The whole WONDERLAND collection: fifteen pieces for babies from birth to three, chosen one by one.';
  const tone = cat ? cat.tone : 'paper';
  const ageName = AGES.find((a) => a.slug === age)?.label;

  const pill = (href, label, current, toneName) =>
    `<li><a class="pill ${toneName ? `pill--${toneName}` : ''}" href="${href}" ${current ? 'aria-current="page"' : ''}>${toneName ? `<span class="dot tone-${toneName}"></span>` : ''}${esc(label)}</a></li>`;

  const grid = () => {
    const list = filtered(slug, age, sort);
    return list.length
      ? `<div class="grid ${isGifts ? '' : 'grid--4'}">${list.map((p) => productCard(p, { headingLevel: 2 })).join('')}</div>`
      : `<div class="empty">${glyph('rabbit', 'empty__smile')}<p class="empty__title">Nothing here for that age yet.</p><p class="empty__text">Try another age range, or see everything in this category.</p><button type="button" class="btn" data-clear-age>Show all ages</button></div>`;
  };
  const countText = () => {
    const n = filtered(slug, age, sort).length;
    return `${n} ${n === 1 ? 'piece' : 'pieces'}${age ? ` for ${AGES.find((a) => a.slug === age).label}` : ''}`;
  };

  return {
    name: 'shop',
    title: ageName && !cat ? `Shop ${ageName}` : title,
    html: `
    <section class="page-head page-head--${tone} ${isGifts ? 'page-head--gifts' : ''}">
      <div class="wrap page-head__inner">
        <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${cat ? `<li><a href="/shop">Shop</a></li><li aria-current="page">${esc(cat.name)}</li>` : '<li aria-current="page">Shop</li>'}</ol></nav>
        <div class="page-head__row">
          <div>
            <h1 class="h1">${esc(title)}</h1>
            <p class="page-head__blurb">${esc(blurb)}</p>
            ${isGifts ? '<p class="page-head__note">Each set arrives in our signature box. Gift wrapping for any order can be added at checkout.</p>' : ''}
          </div>
          <span class="page-head__glyph" aria-hidden="true">${glyph(cat ? cat.icon : 'smile')}</span>
        </div>
      </div>
    </section>

    <div class="wrap shop">
      <nav class="shop__cats" aria-label="Categories">
        <ul class="pills">
          ${pill('/shop' + (age ? `?age=${age}` : ''), 'All', !slug)}
          ${CATEGORIES.map((c) => pill(`/shop/${c.slug}` + (age ? `?age=${age}` : ''), c.name, slug === c.slug, c.tone)).join('')}
          ${pill('/shop/gift-sets', 'Gift Sets', isGifts, 'wine')}
        </ul>
      </nav>

      <div class="shop__bar">
        <fieldset class="seg">
          <legend class="seg__legend">Age</legend>
          <div class="seg__opts">
            <label><input type="radio" name="age" value="" ${!age ? 'checked' : ''}><span>All ages</span></label>
            ${AGES.map((a) => `<label><input type="radio" name="age" value="${a.slug}" ${age === a.slug ? 'checked' : ''}><span>${esc(a.label)}</span></label>`).join('')}
          </div>
        </fieldset>
        <div class="shop__right">
          <p class="shop__count" data-count>${countText()}</p>
          <label class="select">
            <span>Sort</span>
            <select name="sort">${SORTS.map(([k, l]) => `<option value="${k}" ${k === sort ? 'selected' : ''}>${l}</option>`).join('')}</select>
          </label>
        </div>
      </div>

      <div data-results>${grid()}</div>
    </div>`,
    mount(root) {
      const results = root.querySelector('[data-results]');
      const count = root.querySelector('[data-count]');
      const update = () => {
        const u = new URL(location.href);
        age ? u.searchParams.set('age', age) : u.searchParams.delete('age');
        sort !== 'featured' ? u.searchParams.set('sort', sort) : u.searchParams.delete('sort');
        history.replaceState({}, '', u);
        results.innerHTML = grid();
        count.textContent = countText();
        // Keep category links in sync with the active age filter.
        root.querySelectorAll('.shop__cats a').forEach((a) => {
          const href = new URL(a.href);
          if (href.pathname === '/shop/gift-sets') return;
          age ? href.searchParams.set('age', age) : href.searchParams.delete('age');
          a.setAttribute('href', href.pathname + href.search);
        });
        announce(`Showing ${countText()}.`);
      };
      root.addEventListener('change', (e) => {
        if (e.target.name === 'age') {
          age = e.target.value;
          update();
        } else if (e.target.name === 'sort') {
          sort = e.target.value;
          update();
        }
      });
      root.addEventListener('click', (e) => {
        if (e.target.closest('[data-clear-age]')) {
          age = '';
          root.querySelector('input[name="age"][value=""]').checked = true;
          update();
          root.querySelector('input[name="age"][value=""]').focus();
        }
      });
    },
  };
}
