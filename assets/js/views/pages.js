import { SHIPPING, CATEGORIES } from '../data.js';
import { glyph, icon, money, moneyExact, esc } from '../ui.js';

const head = (title, lede, tone = 'paper', g = 'smile', crumb) => `
  <section class="page-head page-head--${tone}">
    <div class="wrap page-head__inner">
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${esc(crumb || title)}</li></ol></nav>
      <div class="page-head__row">
        <div><h1 class="h1">${esc(title)}</h1><p class="page-head__blurb">${lede}</p></div>
        <span class="page-head__glyph" aria-hidden="true">${glyph(g)}</span>
      </div>
    </div>
  </section>`;

export function about() {
  return {
    name: 'about',
    description: 'WONDERLAND brings together a short list of toys and everyday things for the first three years. Fewer pieces, chosen slowly.',
    title: 'Our Story',
    html: `${head('A small shop for the very beginning', 'WONDERLAND brings together a short list of toys and everyday things for the first three years. Fewer pieces, chosen slowly.', 'lilac', 'key', 'Our Story')}
    <div class="wrap prose-grid">
      <div class="prose">
        <h2 class="h2">Why we started</h2>
        <p>The first three years are full of firsts: first grip, first tooth, first steps. Most of what is sold for those years is loud, plastic and made to be replaced. We wanted a shop that felt more like a well-kept shelf at home, with things that are lovely to hold, easy to live with and good enough to pass on.</p>
        <p>So WONDERLAND keeps its collection short. Four categories, a handful of gift sets, and nothing that is there just to fill a page.</p>
        <h2 class="h2">What we look for</h2>
        <ul class="ticks">
          <li>${icon('check')}<span><strong>Honest materials.</strong> Solid woods, cotton, linen and simple silicone, chosen for how they feel and wear.</span></li>
          <li>${icon('check')}<span><strong>Thoughtful shapes.</strong> Sized for small hands, with rounded edges and no unnecessary parts.</span></li>
          <li>${icon('check')}<span><strong>A calm palette.</strong> Colors that sit quietly in a nursery or a living room.</span></li>
          <li>${icon('check')}<span><strong>Room to grow.</strong> Pieces that stay useful across months, not weeks.</span></li>
        </ul>
        <h2 class="h2">The name</h2>
        <p>Every child is a little explorer of a world that is new and slightly strange. We borrowed the name, and a curious grin, from the most famous explorer of them all.</p>
      </div>
      <div class="about-art" aria-hidden="true">
        <div class="arch arch--about"><div class="arch__checker arch__checker--plum"></div><span class="arch__smile">${glyph('smile')}</span></div>
      </div>
    </div>
    <section class="section section--cream" id="project" aria-labelledby="project-title">
      <div class="wrap project">
        <span class="project__glyph" aria-hidden="true">${glyph('sparkle')}</span>
        <div>
          <h2 id="project-title" class="h2">About this project</h2>
          <p>WONDERLAND is a concept store designed and built as a portfolio project. It shows a complete shopping experience for a premium baby brand: browsing, product pages, a working bag and a demonstration checkout.</p>
          <p>The products, prices, materials and policies are illustrative. Nothing can be bought, no payment is ever requested, and forms on this site do not send or store your details anywhere. There are no customer reviews or sales figures here, because there are no real customers yet.</p>
          <a class="btn btn--ghost" href="/shop">Explore the shop</a>
        </div>
      </div>
    </section>`,
  };
}

const FAQ = [
  ['Is this a real store?', 'Not yet. WONDERLAND is a concept store built for a design portfolio. You can browse, fill your bag and go through a demonstration checkout, but nothing is charged or shipped.'],
  ['How do I choose the right age?', 'Every product lists the ages it suits best, and the shop can be filtered by 0–6, 6–12 and 12–36 months. When a child sits between two ranges, the earlier range is usually the gentler choice.'],
  ['Can I send an order as a gift?', `Yes. Add gift wrapping at checkout for ${money(SHIPPING.giftWrap)}. It includes a handwritten-style note and you can leave prices off the packing slip. Gift sets always arrive in our signature box.`],
  ['Do you ship outside the United States?', 'The concept is designed for shipping within the United States only.'],
  ['How should I care for wooden toys?', 'Wipe them with a dry or slightly damp cloth and let them air-dry. Do not soak wood or put it in the dishwasher. Each product page lists its own care notes.'],
];

export function shipping() {
  const [std, exp] = SHIPPING.methods;
  return {
    name: 'help',
    description: 'Shipping options, 30-day returns, gift wrapping and answers to common questions at the WONDERLAND concept store.',
    title: 'Shipping & Returns',
    html: `${head('Shipping & Returns', 'Clear, simple policies, written for the concept. They show how the store would work; no orders are actually shipped.', 'sage', 'rabbit')}
    <div class="wrap help">
      <div class="help__cards">
        <article class="info-card">
          ${icon('truck')}
          <h2>Shipping</h2>
          <table class="table">
            <caption class="visually-hidden">Shipping options</caption>
            <thead><tr><th scope="col">Method</th><th scope="col">Delivery</th><th scope="col">Cost</th></tr></thead>
            <tbody>
              <tr><th scope="row">${std.name}</th><td>${std.eta}</td><td>${moneyExact(std.price)}<br><span class="muted">Free over ${money(SHIPPING.freeThreshold)}</span></td></tr>
              <tr><th scope="row">${exp.name}</th><td>${exp.eta}</td><td>${moneyExact(exp.price)}</td></tr>
            </tbody>
          </table>
          <p>Orders ship within the contiguous United States. Processing takes one to two business days before your package leaves us.</p>
        </article>
        <article class="info-card">
          ${icon('return')}
          <h2>Returns</h2>
          <p>Changed your mind? Unused items in their original packaging can be returned within <strong>30 days</strong> of delivery for a full refund to the original payment method.</p>
          <p>For hygiene reasons, teethers and feeding items can only be returned unopened. Gift recipients can return items for store credit.</p>
        </article>
        <article class="info-card">
          ${icon('gift')}
          <h2>Gift wrapping</h2>
          <p>Add wrapping at checkout for ${money(SHIPPING.giftWrap)} per order: cream paper, a cotton ribbon and your note. Gift sets already come in our signature box.</p>
        </article>
      </div>

      <section class="faq" id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title" class="h2">Questions, answered</h2>
        <div class="acc">
          ${FAQ.map(([q, a]) => `<details><summary>${esc(q)} ${icon('plus', 'acc__icon')}</summary><p>${esc(a)}</p></details>`).join('')}
        </div>
        <p class="help__more">Still curious? <a href="/contact">Send us a note</a>.</p>
      </section>
    </div>`,
  };
}

export function contact() {
  return {
    name: 'contact',
    description: 'Questions about a product, a gift or the WONDERLAND project itself? Leave a note.',
    title: 'Contact',
    html: `${head('Say hello', 'Questions about a product, a gift or the project itself? Leave a note below.', 'ochre', 'spiral', 'Contact')}
    <div class="wrap contact">
      <form class="contact__form" data-demo-form="contact" novalidate>
        <div class="fields">
          <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" type="text" autocomplete="name" required data-label="name"></div>
          <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" autocomplete="email" required data-label="email"></div>
          <div class="field field--wide"><label for="c-topic">Topic</label>
            <select id="c-topic" name="topic"><option>A product question</option><option>Gifting</option><option>Shipping &amp; returns</option><option>About the project</option><option>Something else</option></select></div>
          <div class="field field--wide"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="6" required data-label="message"></textarea></div>
        </div>
        <button class="btn btn--lg" type="submit">Send note ${icon('arrow')}</button>
        <p class="field-msg" data-msg aria-live="polite"></p>
      </form>
      <aside class="contact__aside" aria-label="About this form">
        <div class="info-card">
          ${icon('info')}
          <h2>A note on this form</h2>
          <p>This is a concept store, so the form is a demonstration. It checks what you type, but your message is not sent or stored anywhere.</p>
        </div>
        <div class="info-card">
          ${glyph('sparkle', 'info-card__glyph')}
          <h2>Before you write</h2>
          <p>Many answers are already in our <a href="/shipping-returns#faq">FAQ</a>, including how to choose the right age and how gift wrapping works.</p>
        </div>
      </aside>
    </div>`,
  };
}

export function notFound() {
  return {
    name: 'notfound',
    noindex: true,
    title: 'Page not found',
    html: `<section class="lost">
      <div class="lost__bg" aria-hidden="true"></div>
      <div class="wrap"><div class="lost__card">
        <span class="lost__glyph" aria-hidden="true">${glyph('rabbit')}</span>
        <h1 class="h1">This page has gone down a rabbit hole.</h1>
        <p>The link may be old or mistyped. Let's get you somewhere real.</p>
        <div class="done__actions"><a class="btn" href="/">Back home</a><a class="btn btn--ghost" href="/shop">Browse the shop</a></div>
        <ul class="lost__cats">${CATEGORIES.map((c) => `<li><a href="/shop/${c.slug}">${esc(c.name)}</a></li>`).join('')}</ul>
      </div></div>
    </section>`,
  };
}
