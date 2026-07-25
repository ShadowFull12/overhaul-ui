# Playbook — landing page

The most-generated and most-generic surface on the web. Structure it deliberately or it
converges on the template.

---

## Section order

Not every page needs all of these. Six to eight sections is a good page; twelve is a
scroll dare.

1. **Nav** — logo, 3–5 links, one action. Sticky only if there is a reason
2. **Hero** — the claim, the proof, the action
3. **Social proof** — logos, a number, or one strong quote. Immediately after the hero
4. **The problem** — name the pain in the user's words (skip if the category is obvious)
5. **How it works** — 3 steps, or one strong product visual
6. **Features / capability** — 2–5 blocks, each earning its place
7. **Differentiation** — comparison, or the one thing only you do
8. **Deeper proof** — case study, metric, testimonial with a name and a face
9. **Pricing** — or a link to it
10. **FAQ** — the real objections, not marketing questions
11. **Closing CTA** — one action, generous space
12. **Footer** — links, legal, status, contact

**Composition rule:** at most two centred sections. Everything else uses a different
archetype from `reference/layout.md` §3. Five identical centred sections is the single
clearest tell of a generated page.

---

## Hero

The only section most visitors read. Three jobs, in order: what this is, why it matters,
what to do.

| Element | Rule |
|---|---|
| **Headline** | 4–10 words. Must be falsifiable. Specific to this product |
| **Subhead** | 1–2 sentences. Adds information; does not paraphrase the headline |
| **Primary CTA** | One. Verb + object. "Start a free project", not "Get Started" |
| **Secondary** | A text link at most. "See the 2-minute demo" |
| **Proof** | One line under the CTA: a number, a logo row, or a rating |
| **Visual** | The actual product, cropped and legible. Not a 3D abstract blob |

Three hero scales, pick one deliberately:
- **Giant type** — headline at 8–14vw, minimal else. Works when the claim is strong
- **Split** — text one side, product the other. The workhorse. Vary which side
- **Mini** — small centred headline, huge product visual below. Best when the product is beautiful

**Failure modes:** headline that could describe any product · 6-line headline wrap ·
four CTAs · a hero taller than the viewport so nothing below is discoverable · a
screenshot too small to read · an autoplay video that costs 4s of LCP.

---

## Social proof

Place it immediately after the hero — it is what makes the hero's claim credible.

- Logos: greyscale or single-tone, optically size-matched (a wide logo and a square one at the same width look different), max 6–8
- Never fake it. "Trusted by thousands" with no names is worse than nothing
- One specific number beats three vague ones: "1,240 teams", not "thousands of happy users"
- Testimonials need a name, a role, a company and a face. Anonymous quotes read as invented

---

## Features

The three-column icon-title-two-grey-lines grid is the most-generated block on the
internet. Alternatives, all better:

- **One feature, done properly** — a large visual with 2–3 supporting points beside it
- **Alternating rows** — feature, product visual, alternating sides. Vary the ratio, not just the side
- **Editorial list** — numbered, left-aligned, with real copy. No icons
- **Bento** — mixed spans, but only if the arithmetic yields no empty cells
- **Tabs** — when features are alternatives rather than additions

Feature copy rules: name the outcome, not the mechanism. Avoid two-word abstractions
("Smart Insights", "Seamless Sync"). If a feature title could belong to a different
product, rewrite it.

---

## Pricing

- Three tiers maximum. One recommended, marked by elevation and a label — not by being bigger
- Monthly/annual toggle showing the actual saving, not just a "-20%" badge
- Every plan lists what it *includes*, in the same order, so tiers are comparable
- Price prominent, currency localised, "per seat / per month" unambiguous
- The FAQ directly below pricing catches the objections that stop the click
- Enterprise: "Contact sales", not a fake number

---

## Motion

Landing pages are the one place motion is genuinely justified, and the one place it is
most abused.

**Justified:** one hero entrance · a product demo loop that shows a mechanism · a
scroll-driven sequence that explains something · hover on cards that are links.

**Not justified:** fade-up on every section (especially above the fold — never hide
content the visitor came for) · infinite floating blobs · parallax on everything · a
counter that animates every time it scrolls into view · anything that delays the CTA.

Use CSS scroll-driven animations (`animation-timeline: view()`) rather than
`IntersectionObserver` — off the main thread and simpler. Always gate behind
`prefers-reduced-motion`.

---

## Performance

The LCP element is the hero headline or hero image. Both must arrive fast.

- `fetchpriority="high"` on the hero image; never `loading="lazy"` on it
- Server-render the hero. A client-rendered hero cannot be a good LCP
- AVIF, correct `sizes`, capped dimensions
- Fonts: self-hosted, subset, metric-matched fallback. This is where landing-page CLS comes from
- Defer everything below the fold, including the chat widget and analytics
- Budget: < 150KB JS gzipped. A landing page should not need a framework runtime at all — consider Astro

---

## Gate

- [ ] Headline is falsifiable and specific to this product
- [ ] One primary CTA, repeated at most twice on the page, same label
- [ ] Max two centred sections; 4+ distinct archetypes
- [ ] No three-column icon-and-two-grey-lines grid
- [ ] Social proof is real and specific
- [ ] Zero banned phrases (`reference/copywriting.md` §1)
- [ ] Nothing above the fold hidden behind a scroll reveal
- [ ] LCP <= 2.5s, CLS <= 0.1 measured at 4× throttle
- [ ] 320px clean; both themes; reduced motion
- [ ] `commands/review.md` passed
