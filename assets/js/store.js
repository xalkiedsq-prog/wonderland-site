import { byId, SHIPPING } from './data.js';

const KEY = 'wonderland.cart.v1';
const MAX_QTY = 10;
const listeners = new Set();

function safeRead() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((l) => l && byId(l.id) && Number.isInteger(l.qty) && l.qty > 0).map((l) => ({ ...l, qty: Math.min(l.qty, MAX_QTY) }))
      : [];
  } catch {
    return [];
  }
}

let lines = safeRead();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable: cart still works for this visit */
  }
  listeners.forEach((fn) => fn());
}

export const lineKey = (id, option) => (option ? `${id}::${option}` : id);

export const cart = {
  MAX_QTY,
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  lines() {
    return lines.map((l) => ({ ...l, key: lineKey(l.id, l.option), product: byId(l.id) }));
  },
  count() {
    return lines.reduce((s, l) => s + l.qty, 0);
  },
  add(id, option = null, qty = 1) {
    const k = lineKey(id, option);
    const found = lines.find((l) => lineKey(l.id, l.option) === k);
    if (found) found.qty = Math.min(MAX_QTY, found.qty + qty);
    else lines.push({ id, option, qty: Math.min(MAX_QTY, qty) });
    persist();
  },
  setQty(key, qty) {
    const l = lines.find((x) => lineKey(x.id, x.option) === key);
    if (!l) return;
    if (qty <= 0) lines = lines.filter((x) => x !== l);
    else l.qty = Math.min(MAX_QTY, qty);
    persist();
  },
  remove(key) {
    lines = lines.filter((x) => lineKey(x.id, x.option) !== key);
    persist();
  },
  clear() {
    lines = [];
    persist();
  },
  subtotal() {
    return lines.reduce((s, l) => s + (byId(l.id)?.price || 0) * l.qty, 0);
  },
};

export function shippingCost(methodId, subtotal) {
  const m = SHIPPING.methods.find((x) => x.id === methodId) || SHIPPING.methods[0];
  if (m.id === 'standard' && subtotal >= SHIPPING.freeThreshold) return 0;
  return m.price;
}

// Keep tabs in sync.
window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    lines = safeRead();
    listeners.forEach((fn) => fn());
  }
});
