# WONDERLAND — concept store

A portfolio project: a complete, interactive online store for a premium brand of toys and essentials for babies from birth to three. Built on the WONDERLAND identity (wordmark in Marcellus, the grin-and-heart mark, the wavy checkerboard and the five-color palette).

**This is a demonstration.** Products, prices and policies are illustrative. Nothing can be bought, no payment details are ever requested, and forms do not send or store data.

## What works

- Home, Shop (all / 4 categories / Gift Sets), age filter (0–6, 6–12, 12–36 months) and sorting, with shareable URLs
- Product pages with gallery, color options, quantity, gift-set contents
- Bag: slide-out drawer and full page, quantity changes, removal, free-shipping meter; saved in `localStorage`
- Three-step demo checkout (information → delivery & gift wrap → review) with validation and an honest confirmation page
- About, Shipping & Returns (with FAQ), Contact, 404
- Demo newsletter and contact forms that validate but never send

## Stack

Plain HTML, CSS and JavaScript modules. No framework and **no build step**: the repository root is the site.

```
index.html            app shell (header, footer, bag drawer)
_headers              Cloudflare Pages security & cache headers
assets/css/main.css   design system and all styles
assets/js/            router (app.js), catalog (data.js), bag (store.js), views/
assets/brand/         vector logo, mark, icons and patterns traced from the identity
assets/fonts/         Marcellus, Marcellus SC, Figtree (self-hosted, SIL OFL)
assets/img/           product photos (WebP, 4:5) and site imagery
docs/IMAGE_PROMPTS.md photography brief and per-file prompts
scripts/              image optimisation
tests/                local server with SPA fallback + end-to-end tests
```

## Run locally

```
npm install
npm start            # http://localhost:4173
npm test             # in a second terminal (needs: npx playwright install chromium)
```

## Product photos

See `docs/IMAGE_PROMPTS.md`. Drop generated files into `incoming/` using the exact names from that document and run `npm run images`. Missing photos fall back to branded placeholders automatically. Each product currently uses two photos (`-1` main, `-2` detail); to add the optional `-3` lifestyle shots, raise the count in `const P = (slug, n = 2)` in `assets/js/data.js`. Per-image crop tweaks live in `CROP_Y` inside `scripts/optimize-images.mjs`.

## Deploy (Cloudflare Pages)

Connect the GitHub repository in Cloudflare → Workers & Pages → Create → Pages → Connect to Git.

- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: **/** (root)

Pages serves `index.html` for every unknown path (there is no top-level `404.html`), so routes like `/shop/teethers` work on reload.

## Typography

- **Marcellus**: the logo face, used for headings and product names
- **Marcellus SC**: small-caps labels and eyebrows
- **Figtree**: body, interface and prices (tabular figures)

Fonts © their authors, licensed under the SIL Open Font License (see `assets/fonts/`).
