// Converts generated photos in ./incoming into web-ready 4:5 WebP files.
//   incoming/<slug>-1.png  ->  assets/img/products/<slug>-1.webp
//   incoming/hero.png      ->  assets/img/site/hero.webp
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'incoming';
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)) : [];
if (!files.length) {
  console.log('No images in ./incoming');
  process.exit(0);
}
for (const f of files) {
  const base = path.parse(f).name.toLowerCase();
  const dir = base === 'hero' ? 'assets/img/site' : 'assets/img/products';
  const out = path.join(dir, `${base}.webp`);
  await sharp(path.join(SRC, f))
    .resize(1200, 1500, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
  console.log('✓', out);
}
