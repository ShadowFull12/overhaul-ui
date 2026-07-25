# optimize — the frontend performance pass

**Route here when:** "it's slow", "fix CLS", "improve INP", "the bundle is huge", "it
feels laggy".

**Writes:** loading strategy, code-splitting, image and font handling, animation paths.

Scope: frontend delivery and interaction performance. Not server or database work.

---

## Procedure

### 1. Measure first
```bash
npx lighthouse http://localhost:3000 --view
npx unlighthouse --site http://localhost:3000   # every route
```
Chrome DevTools → Performance, **4× CPU throttle, Fast 3G**. Your machine is not the
user's. Never optimise by guess — record the numbers before you change anything.

Get field data if it exists (CrUX, RUM, the `web-vitals` library). Lab data barely
sees INP.

### 2. Fix CLS — usually five causes
| Cause | Fix |
|---|---|
| Images without dimensions | `width`+`height` or `aspect-ratio` |
| Font swap | Metric-matched fallback (`size-adjust`, `ascent-override`) or `next/font` |
| Injected banners/alerts | Reserve with `min-height` |
| Late-loading components | Skeleton at the exact final height |
| Scrollbar appearing | `scrollbar-gutter: stable` |

Also: never animate layout properties, and never insert content above existing content
after paint.

### 3. Fix LCP
- `fetchpriority="high"` on the hero image; **never** `loading="lazy"` on it
- Preload the hero image and the above-fold font
- Server-render above-the-fold content — a spinner cannot be an LCP element
- AVIF/WebP, correct `srcset`+`sizes`, capped dimensions
- Inline critical CSS, defer the rest
- Remove or `async` render-blocking third-party scripts

### 4. Fix INP
- Break long tasks; `await scheduler.yield()` between chunks
- Paint the pressed state before doing the work
- Debounce input (150–250ms), throttle scroll/resize
- Never read layout in a loop — batch reads, then writes
- `content-visibility: auto` + `contain-intrinsic-size` on long lists and below-fold sections
- Virtualise lists past ~100 rows
- React: `useDeferredValue` for filter results, `useTransition` for non-urgent updates, stable keys, no context value that changes every render
- Hydrate islands, stream the shell

### 5. Fix animation cost
`reference/motion.md` §7. Animate only `transform`/`opacity`/`filter`/`clip-path` ·
CSS over JS for predetermined motion · `will-change` added and removed, never permanent ·
no animated `backdrop-filter` or large `blur()` · no CSS custom property writes on a
parent during a gesture.

### 6. Cut weight
```bash
npx source-map-explorer 'dist/**/*.js'      # or vite-bundle-visualizer
```
Look for: a date library where `Intl` would do, a full lodash import, an animation
library used for one hover, duplicate React copies, unused polyfills, a chart library on
a route with no chart. Code-split by route; lazy-load modals, editors, charts and maps.

### 7. Fonts
Self-host, subset, `font-display: swap`, metric-matched fallbacks, <= 2 families and
<= 3 weights, preload only the above-fold face.

### 8. Perceived performance
Often cheaper than real gains: optimistic UI · shape-matched skeletons · faster spinners ·
`ease-out` over `ease-in` · prefetch on hover · stream partial results · progressive
detail (text, then images, then decoration).

### 9. Re-measure and guard
Re-run the same measurement. Report before/after. Add a budget check to CI (Lighthouse
CI or a bundle-size gate) so the gains do not erode.

---

## Output

```
                Before   After   Target
LCP              4.1s    1.9s    <= 2.5s
INP              340ms   120ms   <= 200ms
CLS              0.24    0.01    <= 0.1
JS (gzip)        487KB   198KB
Requests         64      31

Changes
  CLS   aspect-ratio on 18 images; next/font metric fallback; scrollbar-gutter
  LCP   hero fetchpriority=high (was lazy!); AVIF; critical CSS inlined
  INP   yielded the 280ms filter task; virtualised the 2,400-row table;
        useDeferredValue on search
  Bundle moment.js → Intl (-71KB); lodash → 3 named imports (-24KB);
        charts + editor lazy-loaded (-142KB)
  Motion 3 height animations → transform; removed permanent will-change on 40 cards

Measured: 4× CPU throttle, Fast 3G, Chrome 3 runs median
Not measured: real-device field data, Safari, low-end Android
```

---

## Gate

- [ ] Before and after numbers from the same conditions
- [ ] All three Core Web Vitals in the "good" band, or the gap explained
- [ ] No functional or visual regression (the fastest page is a blank one)
- [ ] Animations still hit 60fps at 4× throttle
- [ ] Build and tests pass
- [ ] A budget guard added, or its absence noted

## See also
`reference/performance.md`, `reference/motion.md`, `commands/motion-audit.md`
