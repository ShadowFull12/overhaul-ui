/**
 * overhaul-ui — colour maths. Zero dependencies.
 *
 * sRGB <-> linear <-> OKLab <-> OKLCH, plus WCAG 2.x contrast.
 * OKLab transforms follow Björn Ottosson's published matrices
 * (https://bottosson.github.io/posts/oklab/).
 */

/* ------------------------------------------------------------------ parsing */

/** "#0af" | "#00aaff" | "#00aaffcc" | "0,170,255" -> {r,g,b,a} in 0..1 */
export function parseColor(input) {
  if (typeof input !== 'string') throw new TypeError('parseColor: expected a string');
  let s = input.trim().toLowerCase();

  const named = NAMED[s];
  if (named) s = named;

  if (s.startsWith('#')) {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new Error(`bad hex: ${input}`);
    if (!/^[0-9a-f]+$/.test(h)) throw new Error(`bad hex: ${input}`);
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgb = s.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const p = rgb[1].split(/[\s,/]+/).filter(Boolean);
    const n = (v) => (v.endsWith('%') ? parseFloat(v) / 100 : parseFloat(v) / 255);
    return { r: n(p[0]), g: n(p[1]), b: n(p[2]), a: p[3] === undefined ? 1 : pct(p[3]) };
  }

  const okl = s.match(/^oklch\(([^)]+)\)$/);
  if (okl) {
    const p = okl[1].split(/[\s,/]+/).filter(Boolean);
    const L = p[0].endsWith('%') ? parseFloat(p[0]) / 100 : parseFloat(p[0]);
    const C = parseFloat(p[1]);
    const H = parseFloat(p[2]) || 0;
    const a = p[3] === undefined ? 1 : pct(p[3]);
    return { ...oklchToRgb(L, C, H), a };
  }

  const bare = s.match(/^(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)$/);
  if (bare) {
    return { r: +bare[1] / 255, g: +bare[2] / 255, b: +bare[3] / 255, a: 1 };
  }

  throw new Error(`unrecognised colour: ${input}`);
}

const pct = (v) => (String(v).endsWith('%') ? parseFloat(v) / 100 : parseFloat(v));

const NAMED = {
  black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000',
  blue: '#0000ff', gray: '#808080', grey: '#808080', transparent: '#00000000',
};

/* ------------------------------------------------------------- gamma / linear */

export const srgbToLinear = (c) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

export const linearToSrgb = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

/* ------------------------------------------------------------------- OKLab */

export function rgbToOklab(r, g, b) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
}

export function oklabToRgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;

  const lr =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return { r: linearToSrgb(lr), g: linearToSrgb(lg), b: linearToSrgb(lb) };
}

/* ------------------------------------------------------------------- OKLCH */

export function rgbToOklch(r, g, b) {
  const { L, a, b: bb } = rgbToOklab(r, g, b);
  const C = Math.sqrt(a * a + bb * bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

export function oklchToRgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  return oklabToRgb(L, C * Math.cos(h), C * Math.sin(h));
}

/** True when the OKLCH triple lands inside the sRGB gamut. */
export function inGamut(L, C, H, eps = 0.0005) {
  const { r, g, b } = oklchToRgb(L, C, H);
  return [r, g, b].every((v) => v >= -eps && v <= 1 + eps);
}

/** Reduce chroma until the colour fits sRGB. Binary search, 24 steps. */
export function clampChroma(L, C, H) {
  if (inGamut(L, C, H)) return { L, C, H };
  let lo = 0, hi = C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(L, mid, H)) lo = mid; else hi = mid;
  }
  return { L, C: lo, H };
}

/* ------------------------------------------------------------------ output */

const to255 = (v) => Math.max(0, Math.min(255, Math.round(v * 255)));

export function toHex({ r, g, b, a = 1 }) {
  const h = [r, g, b].map((v) => to255(v).toString(16).padStart(2, '0')).join('');
  return a >= 1 ? `#${h}` : `#${h}${to255(a).toString(16).padStart(2, '0')}`;
}

export const oklchToHex = (L, C, H) => toHex(oklchToRgb(L, C, H));

export function fmtOklch(L, C, H, precision = 3) {
  const p = (n, d) => Number(n.toFixed(d));
  return `oklch(${p(L, precision)} ${p(C, precision)} ${p(H, 1)})`;
}

/* ---------------------------------------------------------------- contrast */

/** WCAG 2.x relative luminance. */
export function luminance({ r, g, b }) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/**
 * WCAG 2.x contrast ratio, 1..21.
 * Composites a translucent foreground over the background first, because
 * `opacity: 0.6` text must be measured against what the user actually sees.
 */
export function contrastRatio(fg, bg) {
  const f = typeof fg === 'string' ? parseColor(fg) : fg;
  const b = typeof bg === 'string' ? parseColor(bg) : bg;
  const c = f.a !== undefined && f.a < 1 ? composite(f, b) : f;
  const L1 = luminance(c), L2 = luminance(b);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

export function composite(fg, bg) {
  const a = fg.a ?? 1;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

/** Pass/fail against every WCAG 2.2 threshold that applies. */
export function wcag(ratio) {
  const r = Math.round(ratio * 100) / 100;
  return {
    ratio: r,
    normalAA:  r >= 4.5,   // 1.4.3 body text
    normalAAA: r >= 7,     // 1.4.6
    largeAA:   r >= 3,     // 1.4.3 >=24px, or >=19px bold
    largeAAA:  r >= 4.5,
    uiAA:      r >= 3,     // 1.4.11 non-text contrast, focus indicators
    grade:
      r >= 7   ? 'AAA' :
      r >= 4.5 ? 'AA'  :
      r >= 3   ? 'AA-large/UI' : 'fail',
  };
}

/** Nudge lightness until `fg` reaches `target` contrast on `bg`, or give up. */
export function fixContrast(fg, bg, target = 4.5) {
  const f = typeof fg === 'string' ? parseColor(fg) : fg;
  const b = typeof bg === 'string' ? parseColor(bg) : bg;
  const { L, C, H } = rgbToOklch(f.r, f.g, f.b);
  const darker = luminance(b) > 0.35;

  let best = null;
  for (let i = 1; i <= 100; i++) {
    const nl = Math.max(0, Math.min(1, darker ? L - i * 0.01 : L + i * 0.01));
    const cand = clampChroma(nl, C, H);
    const rgb = oklchToRgb(cand.L, cand.C, cand.H);
    if (contrastRatio(rgb, b) >= target) {
      best = { ...cand, hex: toHex(rgb), ratio: contrastRatio(rgb, b) };
      break;
    }
    if (nl === 0 || nl === 1) break;
  }
  return best;
}
