// Converts generated photos in ./incoming into web-ready 4:5 WebP files.
//   incoming/<slug>-1.png  ->  assets/img/products/<slug>-1.webp
//   incoming/hero.png      ->  assets/img/site/hero.webp
// Source files may be PNG, JPEG or WebP (whatever the extension says).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = process.argv[2] || 'incoming';

// Vertical crop position per file: 0 = keep the top, 0.5 = centre (default), 1 = keep the bottom.
// Used when the default centre crop would cut into the product.
const CROP_Y = {
  'activity-cube-1': 0.3, // bead maze sits close to the top edge
};

const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)) : [];
if (!files.length) {
  console.log(`No images in ./${SRC}`);
  process.exit(0);
}
for (const f of files) {
  const base = path.parse(f).name.toLowerCase();
  const dir = base === 'hero' ? 'assets/img/site' : 'assets/img/products';
  const out = path.join(dir, `${base}.webp`);
  const img = sharp(path.join(SRC, f));
  const { width, height } = await img.metadata();
  // Crop to 4:5 (or narrower if the source is wider than 4:5).
  let cw = width;
  let ch = Math.round((width * 5) / 4);
  if (ch > height) {
    ch = height;
    cw = Math.round((height * 4) / 5);
  }
  const top = Math.round((height - ch) * (CROP_Y[base] ?? 0.5));
  const left = Math.round((width - cw) / 2);
  await img
    .extract({ left, top, width: cw, height: ch })
    .resize(1024, 1280, { kernel: 'lanczos3', withoutEnlargement: true })
    .webp({ quality: 84, effort: 6, smartSubsample: true })
    .toFile(out);
  // Smaller variants for srcset (product photos only).
  if (base !== 'hero') {
    for (const w of [480, 768]) {
      await sharp(out).resize(w, Math.round(w * 1.25), { kernel: 'lanczos3' }).webp({ quality: 82, effort: 6 }).toFile(out.replace(/\.webp$/, `-${w}.webp`));
    }
  }
  console.log('✓', out);
}
