# WONDERLAND — фотографии товаров для GPT ImageGen

Все снимки должны выглядеть как одна фотосессия, поэтому у каждого промпта общий **стилевой блок** и меняется только **сюжет**.

## Как готовить и передавать файлы

1. Формат генерации: **вертикальный 1024 × 1536** (portrait). На сайте снимки показываются в пропорции **4:5**, края по высоте немного обрезаются, поэтому держите предмет в центре кадра с запасом сверху и снизу.
2. Сохраняйте файлы **точно под именами из таблицы** (`slug-1.png`, `slug-2.png`…), регистр букв важен.
3. Положите файлы в `incoming/` в корне проекта и запустите:
   ```
   npm install
   npm run images
   ```
   Скрипт обрежет их до 4:5, уменьшит до 1200 × 1500 и сохранит в `assets/img/products/*.webp` (а `hero.png` — в `assets/img/site/hero.webp`). Можно просто прислать файлы Claude — он сделает это сам.
4. Сайт подхватывает фото автоматически. Пока какого-то снимка нет, на его месте остаётся фирменная заглушка. Третий снимок (lifestyle) необязателен: если его нет, галерея покажет только первые два.

## Стилевой блок (вставлять в начало каждого промпта)

```
Premium product photography for a high-end baby boutique. Shot on a medium-format camera, 85mm lens, f/5.6. Soft, diffused north-window daylight from the left, gentle natural shadow falling to the right, no harsh highlights. Seamless warm cream paper backdrop (#E8DFD0) with a very subtle paper texture. Muted, earthy palette: cream, oat, dusty lilac (#9A879C), sage green (#596052), soft ochre (#A58B62), deep plum (#302333). Calm, minimal, editorial composition with generous negative space; the product is centered with clear margins on all sides. Realistic materials and true-to-life textures. No text, no logos, no labels, no watermarks, no props unless described. Vertical 2:3 frame.
```

**Для снимков `-2` (деталь)** добавьте: `Close-up macro detail, shallow depth of field, focus on texture and craftsmanship.`

**Для снимков `-3` (в использовании)** добавьте: `Lifestyle scene in a calm, sunlit Scandinavian-style nursery or living room with light oak floor and linen textiles. Only an adult's or baby's hands are visible; no faces. Natural, candid, unstaged feeling.`

---

## Главная

| Файл | Сюжет |
|---|---|
| `hero.png` | A styled still life on the floor of a sunlit room: a seven-piece wooden arch stacker in muted earthy colors, a soft cream cloud-shaped silicone teether and a folded sage-and-cream wavy checkerboard knit baby blanket. Arranged loosely, as if a child has just stepped away. Slightly higher camera angle. |

---

## Teethers

| Файл | Сюжет |
|---|---|
| `maple-ring-teether-1.png` | A single smooth ring teether turned from pale solid maple wood, about 2.75 inches across, lying flat, soft matte oiled finish, visible fine wood grain. |
| `maple-ring-teether-2.png` | Macro of the maple ring's surface showing the silky sanded grain and rounded edge. |
| `maple-ring-teether-3.png` | A baby's small hand gripping the maple ring teether on a cream linen blanket. |
| `cloud-silicone-teether-1.png` | Three flat cloud-shaped matte silicone teethers in oat, dusty lilac and sage, slightly overlapping, each with a cut-out handle and textured ridges and bumps on the edges. |
| `cloud-silicone-teether-2.png` | Macro of the cloud teether's textured edge: soft ridges and small bumps in matte lilac silicone. |
| `cloud-silicone-teether-3.png` | An adult hand offering the oat cloud teether to a baby's reaching hand, soft focus background. |
| `little-key-teether-1.png` | An oversized chunky wooden key teether made of pale maple with a rounded bow and simple bit, threaded on a soft dusty-lilac silicone loop. Charming, vintage key silhouette, smooth rounded edges. |
| `little-key-teether-2.png` | Close-up of where the maple key meets the lilac silicone loop. |
| `little-key-teether-3.png` | The key teether resting on an open linen-covered children's book on a nursery shelf. |
| `bunny-ear-teether-1.png` | A smooth beech wood ring with two soft, floppy oat-colored silicone bunny ears attached at the top, lying flat. |
| `bunny-ear-teether-2.png` | Macro of the silicone bunny ears showing the gentle bend and matte texture. |
| `bunny-ear-teether-3.png` | A baby's hand holding the bunny ear teether by the ears, cream knit blanket underneath. |

## Wooden Toys

| Файл | Сюжет |
|---|---|
| `rainbow-arch-stacker-1.png` | A seven-piece wooden rainbow arch stacker in muted earthy tones (deep plum, dusty lilac, sage, ochre, oat, cream), nested together and standing upright. Matte water-based paint, visible wood grain at the ends. |
| `rainbow-arch-stacker-2.png` | The arches separated and arranged in a playful row and a small tunnel, close-up on the painted edges. |
| `rainbow-arch-stacker-3.png` | A toddler's hands building a bridge with the arches on a light oak floor. |
| `pull-along-rabbit-1.png` | A handcrafted wooden pull-along rabbit toy in dark walnut and pale maple, with four maple wheels and long upright ears, a cotton cord ending in a round wooden bead. Simple, elegant, sculptural design. Side profile. |
| `pull-along-rabbit-2.png` | Close-up of the rabbit's off-center wheel axle and wood joinery. |
| `pull-along-rabbit-3.png` | The rabbit being pulled across a light oak floor by its cord, a toddler's feet and hand at the edge of the frame. |
| `walnut-push-car-1.png` | A small, rounded wooden toy car carved from dark walnut with pale maple wheels and natural rubber tires, no sharp corners, minimalist design. Three-quarter view. |
| `walnut-push-car-2.png` | Macro of the walnut grain and maple wheel with the rubber tire. |
| `walnut-push-car-3.png` | A baby's palm resting on top of the walnut car on a wooden floor. |
| `activity-cube-1.png` | A compact 10-inch birch plywood activity cube for toddlers: a bead maze on top in muted colors, wooden gears on one side, and a small wooden door with a keyhole-shaped latch on the front. Clean Scandinavian design. Three-quarter view. |
| `activity-cube-2.png` | Close-up of the small door slightly open, revealing a round mirror inside. |
| `activity-cube-3.png` | A toddler's hands moving beads along the wire maze on the cube, on a soft cream rug. |

## Sensory Toys

| Файл | Сюжет |
|---|---|
| `linen-crinkle-book-1.png` | A soft fabric baby book in natural linen with six pages, open, showing simple high-contrast shapes in deep plum and cream, a soft fabric loop on the spine. |
| `linen-crinkle-book-2.png` | Macro of the linen texture and stitched edge of a page. |
| `linen-crinkle-book-3.png` | The crinkle book tied to the handle of a cream stroller. |
| `textured-sensory-balls-1.png` | Four soft natural-rubber sensory balls in muted oat, lilac, sage and ochre, each with a different texture: ridges, dots, waves, petals. Arranged in a loose cluster. |
| `textured-sensory-balls-2.png` | Macro of two balls showing the petal and dot textures side by side. |
| `textured-sensory-balls-3.png` | A baby's hand squeezing the sage ball on a cream play mat. |
| `wooden-bell-rattle-1.png` | A turned beech wood rattle with a long handle and a round open cage containing a small brass bell. Elegant, minimal. Standing on its end. |
| `wooden-bell-rattle-2.png` | Close-up of the bell inside the wooden cage. |
| `wooden-bell-rattle-3.png` | An adult hand gently shaking the rattle above a baby lying on a linen blanket (only the baby's hands visible reaching up). |
| `soft-play-mirror-1.png` | A soft standing baby play mirror: a round acrylic mirror set in a quilted cream cotton frame with subtle lilac piping, standing upright like a little easel. |
| `soft-play-mirror-2.png` | Macro of the quilted cotton frame stitching. |
| `soft-play-mirror-3.png` | The mirror standing on a cream play mat at a baby's eye level during tummy time; only the baby's hands are visible. |

## Baby Essentials

| Файл | Сюжет |
|---|---|
| `muslin-swaddle-set-1.png` | Two large cotton muslin swaddle blankets folded neatly in a soft stack: one solid oat, one with a small sage check. Airy, slightly crinkled texture. |
| `muslin-swaddle-set-2.png` | Macro of the open-weave muslin texture with soft light passing through. |
| `muslin-swaddle-set-3.png` | The muslin draped over the edge of a wooden crib. |
| `checkerboard-knit-blanket-1.png` | A soft cotton knit baby blanket with a gently wavy, slightly distorted sage-green and cream checkerboard pattern, folded loosely. |
| `checkerboard-knit-blanket-2.png` | Macro of the knit stitches where sage and cream squares meet along a wavy line. |
| `checkerboard-knit-blanket-3.png` | The blanket spread over a cream stroller in a sunlit park path, soft background. |
| `silicone-bowl-set-1.png` | A low, wide silicone baby bowl with a suction base in matte oat, with two soft-tipped silicone spoons in sage and lilac beside it. |
| `silicone-bowl-set-2.png` | Close-up of the suction base and the spoon tips. |
| `silicone-bowl-set-3.png` | The bowl on a light oak high-chair tray with a little mashed sweet potato, a baby's hand holding a spoon. |

## Gift Sets (2 снимка)

| Файл | Сюжет |
|---|---|
| `hello-little-one-set-1.png` | An open premium gift box in deep plum with cream tissue paper, containing a folded oat muslin swaddle, a linen crinkle book and a maple ring teether, plus a small blank cream card. |
| `hello-little-one-set-2.png` | The same plum gift box closed, tied with a cream cotton ribbon. |
| `baby-shower-box-1.png` | An open deep plum gift box with cream tissue, containing a folded sage-and-cream wavy checkerboard knit blanket, an oat cloud silicone teether and a beech bell rattle. |
| `baby-shower-box-2.png` | The closed plum box tied with a cream ribbon, next to a small blank card. |
| `first-birthday-set-1.png` | An open deep plum gift box with cream tissue, containing a nested wooden arch stacker in muted colors, a walnut-and-maple pull-along rabbit and an oat silicone bowl with spoons. |
| `first-birthday-set-2.png` | The closed plum box with a cream ribbon and a single small sprig of dried flowers on top. |

---

### Советы для единого стиля

- Генерируйте сначала `hero.png` и 2–3 главных снимка. Если свет и фон нравятся, используйте удачный снимок как референс («match the lighting and backdrop of this image») для остальных.
- Проверяйте, что фон тёплый кремовый, а не белый или серый, и тень падает вправо.
- Перегенерируйте кадры с текстом, логотипами, лишними руками или пальцами.
- Цвета вариантов (Oat, Lilac, Sage, Plum) на главном снимке лучше показывать как в описании, чтобы фото совпадали с переключателем цвета.
