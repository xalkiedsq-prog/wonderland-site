// WONDERLAND concept catalog.
// All products are fictional and part of a portfolio concept store.
// Materials, sizes and care notes are illustrative, not verified specifications.

export const CATEGORIES = [
  {
    slug: 'teethers',
    name: 'Teethers',
    tone: 'lilac',
    icon: 'key',
    blurb: 'Smooth maple and soft silicone shaped for small hands and new teeth.',
  },
  {
    slug: 'wooden-toys',
    name: 'Wooden Toys',
    tone: 'ochre',
    icon: 'keyhole',
    blurb: 'Solid-wood classics built to be stacked, pulled and handed down.',
  },
  {
    slug: 'sensory-toys',
    name: 'Sensory Toys',
    tone: 'sage',
    icon: 'sparkle',
    blurb: 'Textures, sounds and reflections for the very first discoveries.',
  },
  {
    slug: 'baby-essentials',
    name: 'Baby Essentials',
    tone: 'plum',
    icon: 'spiral',
    blurb: 'Everyday pieces for sleep, play and mealtimes, chosen to last.',
  },
];

export const GIFTS = {
  slug: 'gift-sets',
  name: 'Gift Sets',
  tone: 'wine',
  icon: 'smile',
  blurb: 'Ready-to-give sets in our signature box, for welcomes, showers and first birthdays.',
};

export const AGES = [
  { slug: '0-6', label: '0–6 months', min: 0, max: 6 },
  { slug: '6-12', label: '6–12 months', min: 6, max: 12 },
  { slug: '12-36', label: '12–36 months', min: 12, max: 36 },
];

export const SHIPPING = {
  freeThreshold: 75,
  methods: [
    { id: 'standard', name: 'Standard', eta: '5–7 business days', price: 7.95 },
    { id: 'express', name: 'Express', eta: '2–3 business days', price: 18 },
  ],
  giftWrap: 6,
};

const P = (slug, n = 3) => Array.from({ length: n }, (_, i) => `/assets/img/products/${slug}-${i + 1}.webp`);

export const PRODUCTS = [
  // ── Teethers ──────────────────────────────────────────────
  {
    id: 'maple-ring-teether',
    name: 'Maple Ring Teether',
    category: 'teethers',
    price: 18,
    ages: [3, 12],
    short: 'A single ring of smooth maple, easy to grip from every side.',
    description:
      'One continuous ring turned from solid maple and sanded until it feels like a pebble. It is light enough for a three-month-old to lift and wide enough to pass from hand to hand.',
    details: [
      ['Material', 'Solid maple, finished with oil and beeswax'],
      ['Size', '2.75 in diameter'],
      ['Care', 'Wipe with a damp cloth and let air-dry. Do not soak.'],
    ],
    images: P('maple-ring-teether'),
  },
  {
    id: 'cloud-silicone-teether',
    name: 'Cloud Silicone Teether',
    category: 'teethers',
    price: 22,
    ages: [3, 12],
    short: 'A soft cloud with three textures, one on each edge.',
    description:
      'A flat, soft-edged cloud in matte silicone with ridges, bumps and a smooth face to explore. The cut-out handle makes it easy to hold and easy to clip.',
    options: { label: 'Color', values: ['Oat', 'Lilac', 'Sage'] },
    details: [
      ['Material', 'Silicone'],
      ['Size', '3.5 × 2.5 in'],
      ['Care', 'Wash in warm, soapy water. Top-rack dishwasher friendly.'],
    ],
    images: P('cloud-silicone-teether'),
    isNew: true,
    featured: true,
  },
  {
    id: 'little-key-teether',
    name: 'Little Key Teether',
    category: 'teethers',
    price: 24,
    ages: [3, 18],
    short: 'An oversized wooden key on a soft silicone loop.',
    description:
      'A chunky maple key, much too big to fit anywhere but small hands, threaded on a silicone loop that gives a second texture to chew on. A small nod to the doors waiting to be opened.',
    details: [
      ['Material', 'Maple and silicone'],
      ['Size', '4.25 in long'],
      ['Care', 'Wipe the wood clean; wash the loop in warm, soapy water.'],
    ],
    images: P('little-key-teether'),
  },
  {
    id: 'bunny-ear-teether',
    name: 'Bunny Ear Teether',
    category: 'teethers',
    price: 26,
    ages: [3, 12],
    short: 'Two soft silicone ears on a smooth wooden ring.',
    description:
      'A wooden ring topped with two floppy silicone ears that bend and squish. Babies tend to start with the ears and finish with the ring.',
    options: { label: 'Color', values: ['Oat', 'Plum'] },
    details: [
      ['Material', 'Beech wood and silicone'],
      ['Size', '4 × 3 in'],
      ['Care', 'Wipe the wood clean; wash the ears in warm, soapy water.'],
    ],
    images: P('bunny-ear-teether'),
  },

  // ── Wooden Toys ───────────────────────────────────────────
  {
    id: 'rainbow-arch-stacker',
    name: 'Arch Stacker',
    category: 'wooden-toys',
    price: 58,
    ages: [12, 36],
    short: 'Seven nesting arches in quiet, earthy colors.',
    description:
      'Seven hand-finished arches that nest, stack, rock and turn into tunnels, bridges and whatever else is needed today. Painted in muted tones that sit easily in a living room.',
    details: [
      ['Material', 'Basswood, water-based paint'],
      ['Size', '9.5 × 5 in when nested'],
      ['Care', 'Wipe with a dry or slightly damp cloth.'],
    ],
    images: P('rainbow-arch-stacker'),
    featured: true,
  },
  {
    id: 'pull-along-rabbit',
    name: 'Pull-Along Rabbit',
    category: 'wooden-toys',
    price: 64,
    ages: [12, 36],
    short: 'A wooden rabbit on wheels that hops as it rolls.',
    description:
      'An off-center axle makes this walnut-and-maple rabbit bob up and down as it follows new walkers around the house. The cotton cord ends in a wooden bead that is easy to hold.',
    details: [
      ['Material', 'Walnut, maple, cotton cord'],
      ['Size', '6.5 × 5.5 in, 24 in cord'],
      ['Care', 'Wipe with a dry cloth.'],
    ],
    images: P('pull-along-rabbit'),
    featured: true,
    isNew: true,
  },
  {
    id: 'walnut-push-car',
    name: 'Walnut Push Car',
    category: 'wooden-toys',
    price: 42,
    ages: [9, 36],
    short: 'A palm-sized car with a rounded body and natural rubber tires.',
    description:
      'Shaped to fit a small palm, with no sharp corners and wheels that roll straight and quietly on wooden floors. Simple enough to be the first car, good enough to be the favorite one.',
    details: [
      ['Material', 'Walnut, maple wheels, natural rubber tires'],
      ['Size', '4.5 × 2.5 in'],
      ['Care', 'Wipe with a dry cloth.'],
    ],
    images: P('walnut-push-car'),
  },
  {
    id: 'activity-cube',
    name: 'Little Wonders Activity Cube',
    category: 'wooden-toys',
    price: 95,
    ages: [12, 36],
    short: 'Five faces of play: beads, gears, a mirror, a sorter and a tiny door.',
    description:
      'A compact birch cube with something different on every side, including a small door with a keyhole latch that opens onto a hidden mirror. Made to sit on the floor between a parent and child.',
    details: [
      ['Material', 'Birch plywood, beech, acrylic mirror'],
      ['Size', '10 × 10 × 10 in'],
      ['Care', 'Wipe with a dry or slightly damp cloth.'],
    ],
    images: P('activity-cube'),
    featured: true,
  },

  // ── Sensory Toys ──────────────────────────────────────────
  {
    id: 'linen-crinkle-book',
    name: 'Linen Crinkle Book',
    category: 'sensory-toys',
    price: 32,
    ages: [0, 12],
    short: 'Six soft pages in high-contrast prints, with a crinkle in each.',
    description:
      'A fabric book with bold, simple shapes for newborn eyes and a crinkly layer in every page. It folds flat for the diaper bag and ties to a stroller with a soft loop.',
    details: [
      ['Material', 'Linen-cotton blend, polyester crinkle layer'],
      ['Size', '6 × 6 in, 6 pages'],
      ['Care', 'Hand wash cold and lay flat to dry.'],
    ],
    images: P('linen-crinkle-book'),
  },
  {
    id: 'textured-sensory-balls',
    name: 'Textured Sensory Balls',
    category: 'sensory-toys',
    price: 34,
    ages: [3, 24],
    short: 'Four soft balls, four textures, one muted palette.',
    description:
      'A set of four squeezable balls with ridges, dots, waves and petals. Easy to grab, slow to roll away, and calm enough in color to leave out on a shelf.',
    details: [
      ['Material', 'Soft natural rubber'],
      ['Size', 'Set of 4, 3–3.5 in each'],
      ['Care', 'Wipe clean with a damp cloth.'],
    ],
    images: P('textured-sensory-balls'),
    isNew: true,
  },
  {
    id: 'wooden-bell-rattle',
    name: 'Wooden Bell Rattle',
    category: 'sensory-toys',
    price: 28,
    ages: [3, 18],
    short: 'A soft, clear chime inside a turned wooden frame.',
    description:
      'A small bell enclosed in a cage of turned beech, with a long handle for tiny fists. The sound is gentle and bright, not a jangle.',
    details: [
      ['Material', 'Beech wood, metal bell'],
      ['Size', '5.5 in long'],
      ['Care', 'Wipe with a dry cloth.'],
    ],
    images: P('wooden-bell-rattle'),
    featured: true,
  },
  {
    id: 'soft-play-mirror',
    name: 'Soft Play Mirror',
    category: 'sensory-toys',
    price: 38,
    ages: [0, 12],
    short: 'A padded mirror for tummy time, framed in quilted cotton.',
    description:
      'A shatter-resistant acrylic mirror set into a quilted cotton frame that stands on its own. Place it at eye level during tummy time and let them meet the most interesting face in the room.',
    details: [
      ['Material', 'Cotton, polyester fill, acrylic mirror'],
      ['Size', '9 × 7 in'],
      ['Care', 'Spot clean with a damp cloth.'],
    ],
    images: P('soft-play-mirror'),
  },

  // ── Baby Essentials ───────────────────────────────────────
  {
    id: 'muslin-swaddle-set',
    name: 'Muslin Swaddle Set',
    category: 'baby-essentials',
    price: 48,
    ages: [0, 6],
    short: 'Two airy cotton muslins: one solid, one in a small check.',
    description:
      'Large, breathable muslin squares that get softer with every wash. Use them to swaddle, shade a stroller, cover a shoulder or lay out a clean spot anywhere.',
    details: [
      ['Material', 'Cotton muslin'],
      ['Size', 'Set of 2, 47 × 47 in each'],
      ['Care', 'Machine wash cold, tumble dry low.'],
    ],
    images: P('muslin-swaddle-set'),
  },
  {
    id: 'checkerboard-knit-blanket',
    name: 'Checkerboard Knit Blanket',
    category: 'baby-essentials',
    price: 78,
    ages: [0, 36],
    short: 'A soft cotton knit in our signature wavy check.',
    description:
      'A generous knit blanket with a gentle, slightly wavy checkerboard, made for strollers, nap time and the floor of every room. Heavy enough to feel cozy, light enough for every season.',
    options: { label: 'Color', values: ['Sage & Oat', 'Plum & Lilac'] },
    details: [
      ['Material', 'Cotton knit'],
      ['Size', '32 × 40 in'],
      ['Care', 'Machine wash cold on a gentle cycle, lay flat to dry.'],
    ],
    images: P('checkerboard-knit-blanket'),
    featured: true,
  },
  {
    id: 'silicone-bowl-set',
    name: 'First Meals Bowl Set',
    category: 'baby-essentials',
    price: 36,
    ages: [6, 36],
    short: 'A suction bowl and two soft-tipped spoons for first meals.',
    description:
      'A low, wide silicone bowl with a suction base, paired with two spoons sized for the first months of solid food. Simple shapes, muted colors, very few pieces to wash.',
    options: { label: 'Color', values: ['Oat', 'Sage', 'Lilac'] },
    details: [
      ['Material', 'Silicone'],
      ['Size', 'Bowl 5.5 in; spoons 5 in'],
      ['Care', 'Dishwasher friendly.'],
    ],
    images: P('silicone-bowl-set'),
  },

  // ── Gift Sets ─────────────────────────────────────────────
  {
    id: 'hello-little-one-set',
    name: 'Hello, Little One',
    category: 'gift-sets',
    occasion: 'For a newborn',
    price: 92,
    ages: [0, 12],
    includes: ['muslin-swaddle-set', 'linen-crinkle-book', 'maple-ring-teether'],
    short: 'A welcome set for the first months: swaddles, a first book and a first teether.',
    description:
      'Everything a brand-new baby can actually use in the first months, packed in our signature box with a handwritten-style card. The kind of gift that gets used every day, not saved for later.',
    details: [
      ['Includes', 'Muslin Swaddle Set, Linen Crinkle Book, Maple Ring Teether'],
      ['Packaging', 'Signature WONDERLAND box with a blank card'],
    ],
    images: P('hello-little-one-set', 2),
  },
  {
    id: 'baby-shower-box',
    name: 'The Baby Shower Box',
    category: 'gift-sets',
    occasion: 'For a baby shower',
    price: 118,
    ages: [0, 36],
    includes: ['checkerboard-knit-blanket', 'cloud-silicone-teether', 'wooden-bell-rattle'],
    short: 'Our checkerboard blanket, a cloud teether and a bell rattle.',
    description:
      'A shower gift that stands out on the table and earns its place at home: our signature knit blanket with two first toys tucked inside. Colors are chosen to go together.',
    details: [
      ['Includes', 'Checkerboard Knit Blanket, Cloud Silicone Teether, Wooden Bell Rattle'],
      ['Packaging', 'Signature WONDERLAND box with a blank card'],
    ],
    images: P('baby-shower-box', 2),
    featured: true,
  },
  {
    id: 'first-birthday-set',
    name: 'First Birthday Set',
    category: 'gift-sets',
    occasion: 'For a first birthday',
    price: 148,
    ages: [12, 36],
    includes: ['rainbow-arch-stacker', 'pull-along-rabbit', 'silicone-bowl-set'],
    short: 'For a brand-new one-year-old: stacking, walking and a first proper bowl.',
    description:
      'Three pieces for the year when everything changes: an arch stacker to build with, a rabbit to follow across the room, and a bowl set for the meals in between.',
    details: [
      ['Includes', 'Arch Stacker, Pull-Along Rabbit, First Meals Bowl Set'],
      ['Packaging', 'Signature WONDERLAND box with a blank card'],
    ],
    images: P('first-birthday-set', 2),
  },
];

export const byId = (id) => PRODUCTS.find((p) => p.id === id);
export const categoryOf = (slug) => (slug === GIFTS.slug ? GIFTS : CATEGORIES.find((c) => c.slug === slug));

export function ageLabel([min, max]) {
  const f = (m) => (m >= 12 && m % 12 === 0 ? `${m / 12} yr${m > 12 ? 's' : ''}` : `${m} mo`);
  if (min === 0) return `Birth – ${f(max)}`;
  return `${f(min)} – ${f(max)}`;
}

export function matchesAge(p, ageSlug) {
  const a = AGES.find((x) => x.slug === ageSlug);
  if (!a) return true;
  return p.ages[0] < a.max && p.ages[1] > a.min;
}

/** Sum of individual prices of a gift set's contents. */
export function setValue(p) {
  return (p.includes || []).reduce((s, id) => s + (byId(id)?.price || 0), 0);
}
