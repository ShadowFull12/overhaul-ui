# Performance

Performance is design. A beautiful interface that responds in 400ms feels worse than a
plain one that responds in 40ms.

---

## 1. Budgets

Core Web Vitals thresholds (75th percentile of real users):

| Metric | Good | Needs work | Poor |
|---|---|---|---|
| **LCP** — Largest Contentful Paint | <= 2.5s | 2.5–4.0s | > 4.0s |
| **INP** — Interaction to Next Paint | <= 200ms | 200–500ms | > 500ms |
| **CLS** — Cumulative Layout Shift | <= 0.1 | 0.1–0.25 | > 0.25 |

Supporting: TTFB <= 800ms, FCP <= 1.8s. INP replaced FID in March 2024 and measures
the *full* interaction — input delay, processing, and the next paint — so it is a
direct measure of how responsive the UI feels.

Practical budgets for a marketing page: < 150KB JS gzipped, < 100KB CSS, < 200KB of
above-fold images, < 3 font files. For an app shell: < 250KB JS gzipped for the
initial route.

Reference: <https://web.dev/articles/inp>, <https://web.dev/articles/vitals>.

---

## 2. LCP

The LCP element is usually the hero image or the headline. Make it arrive first.

```html
<!-- the hero image: never lazy, always prioritised -->
<img src="/hero.avif" width="1600" height="900" alt="…"
     fetchpriority="high" decoding="sync">
<!-- everything below the fold -->
<img src="/thumb.avif" width="640" height="360" alt="…"
     loading="lazy" decoding="async">
```

- `fetchpriority="high"` on the LCP image; `loading="lazy"` on it is a common and costly mistake.
- Preload the hero and the critical font. Preconnect to any third-party origin you cannot remove.
- Inline critical CSS for above-the-fold; defer the rest.
- Serve AVIF with a WebP fallback. Correct `sizes` and `srcset` so mobile does not download the desktop asset.
- Server-render above-the-fold content. A spinner cannot be an LCP element.
- Fonts: `font-display: swap` plus metric-matched fallbacks, or `optional` if you would rather never swap.
- Avoid render-blocking third-party scripts. Analytics goes `async`/`defer`, or in a worker.

---

## 3. INP

INP is where "feels laggy" lives.

- **Yield to the main thread.** Break long tasks; anything over 50ms blocks input.
```js
async function yieldToMain() {
  if ("scheduler" in window && "yield" in scheduler) return scheduler.yield();
  return new Promise(r => setTimeout(r, 0));
}
for (const chunk of chunks) { process(chunk); await yieldToMain(); }
```
- **Acknowledge before you compute.** Paint the pressed state, then do the work in the next frame. Users forgive slow *results*; they do not forgive a dead control.
- **Debounce input, throttle scroll/resize.** Search-as-you-type at 150–250ms. Never run layout-reading code on every scroll event.
- **Never read layout in a loop.** `offsetHeight`/`getBoundingClientRect` after a write forces synchronous layout. Batch reads, then writes.
- **`content-visibility: auto`** with `contain-intrinsic-size` on long lists and below-fold sections skips their rendering work entirely.
- **Virtualise** lists past ~100 rows.
- **React specifics:** memoise expensive subtrees, `useTransition` for non-urgent updates, `useDeferredValue` for filter results, keys that are stable IDs (never array index), and avoid context values that change every render. React Compiler removes most manual memo work if available.
- **Hydration:** stream, and hydrate islands rather than the whole page. A fully interactive-looking page that ignores clicks for 3s is worse than a visibly loading one.

---

## 4. CLS

Almost always one of five causes.

| Cause | Fix |
|---|---|
| Images without dimensions | `width` + `height` attributes, or `aspect-ratio` |
| Web font swap | Metric-matched fallback (`size-adjust`, `ascent-override`) or `font-display: optional` |
| Injected content (banners, ads, alerts) | Reserve the space with `min-height` |
| Late-loading component | Skeleton with the exact final height |
| Scrollbar appearing | `scrollbar-gutter: stable` on `html` |

Also: never animate layout properties; never insert above existing content after paint
(unless in response to user interaction, which is exempt); use `min-height` rather than
`height: auto` on containers whose content arrives late.

---

## 5. Animation performance

Covered in `reference/motion.md` §7. The short version:

- Animate `transform`, `opacity`, `filter`, `clip-path`. Nothing else.
- CSS animations run off the main thread; JS `requestAnimationFrame` animations do not, and drop frames exactly when the page is busy.
- `will-change` before, removed after. Never permanent.
- Don't animate `backdrop-filter` or a large `blur()`. Both are paint-expensive, worst in Safari.
- Don't write CSS custom properties on a parent during a gesture — they invalidate style for all descendants. Write `element.style.transform` directly.
- Budget 16.7ms/frame at 60Hz, 8.3ms at 120Hz. Profile with CPU throttled 4×.

---

## 6. Images

- Format: AVIF → WebP → JPEG fallback. SVG for icons and line art. Never PNG for photographs.
- Responsive: `srcset` + `sizes`, or a framework image component (`next/image`, `astro:assets`, `nuxt/image`).
- Always `width`/`height` or `aspect-ratio`.
- `loading="lazy"` below the fold; **never** on the LCP element.
- `decoding="async"` except for the LCP image.
- Blur-up placeholders (a 20-byte inline blurhash / LQIP) beat a grey box, and cost nothing.
- Cap dimensions: a 4000px-wide source for a 600px slot is pure waste.
- Icons: inline SVG sprite or per-component SVG. Not an icon *font* — those FOIT, misalign, and break in high-contrast mode.

---

## 7. CSS and JS weight

- **CSS:** one system, no dead frameworks, no `!important` cascades. Tailwind's JIT output is small; a hand-written 4000-line stylesheet where 300 lines are used is not.
- **JS:** audit dependencies before adding. Common wins: `date-fns` scoped imports or `Intl` instead of moment; `Intl.NumberFormat` instead of a formatting library; native `fetch`; CSS instead of an animation library for predetermined motion.
- **Code-split by route,** and lazy-load anything below the fold or behind an interaction (modals, editors, charts, maps).
- Check what you shipped: `npx source-map-explorer`, `npx vite-bundle-visualizer`, or the framework's own analyzer. Do this before optimising by guess.
- Tree-shakeable imports only: `import { debounce } from "lodash-es"`, never `import _ from "lodash"`.
- Remove polyfills for browsers you do not support. Set `browserslist` honestly.

---

## 8. Perceived performance

Often cheaper than real performance and equally valuable.

- **Optimistic UI** — apply the change instantly, reconcile after.
- **Skeletons that match** the final layout, so nothing moves when data arrives.
- **Faster spinners feel faster.** Identical load time, different perception.
- **`ease-out` at 200ms feels quicker than `ease-in` at 200ms** because movement starts immediately.
- **Prefetch on hover/intent** for links the user is about to click (`<Link prefetch>`, or `IntersectionObserver` + `fetch`).
- **Stream results.** Showing the first 3 of 50 immediately beats showing 50 at once, later.
- **Never show a spinner for under ~100ms.** Flicker reads as a bug.
- **Progressive detail** — render text first, images second, decorations last.

---

## 9. Measuring

```bash
npx lighthouse https://example.com --view --preset=desktop
npx unlighthouse --site example.com     # every route at once
```
- Chrome DevTools → Performance, 4× CPU throttle, "Fast 3G". Your laptop is not the user.
- Web Vitals in the field, not just the lab: the `web-vitals` library, CrUX, or your RUM provider. Lab data misses INP almost entirely.
- Test on a real mid-range Android. It is 5–10× slower than a MacBook and it is what most of the world uses.
- Regression-guard in CI with Lighthouse CI or a bundle-size budget check, so gains do not quietly erode.
