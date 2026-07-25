# Playbook — e-commerce

Every craft detail here maps to money. This is the surface where design decisions are
most measurable.

---

## Product listing (PLP)

- **Grid:** `auto-fit` with `minmax(min(16rem, 100%), 1fr)`. 2 columns on mobile, not 1 — mobile shoppers scan
- **Card:** image (fixed `aspect-ratio`), title (2-line clamp), price, one badge maximum
- **Price:** prominent, `tabular-nums`, sale price with the original struck through and a labelled discount. Never a strike-through with no original context
- **Filters:** faceted, in a sidebar on desktop and a bottom sheet on mobile. Show result counts per facet. Persist in the URL so a filtered view is shareable
- **Applied filters** as removable chips above the grid, plus "Clear all"
- **Sort** as a real `<select>` — no custom listbox needed here
- **Images:** first row eager with `fetchpriority`, rest lazy. LQIP placeholders. This is the LCP surface
- **Pagination** or "load more" beats infinite scroll — infinite scroll breaks the footer, back navigation, and the ability to return to a position
- **Restore scroll position** when the user comes back from a product page. This is the most commonly broken and most commonly noticed detail in e-commerce
- **Empty results:** show what was filtered out and offer to relax the narrowest facet

---

## Product page (PDP)

**Above the fold:** gallery, title, price, variant selection, quantity, add-to-cart,
key info. Everything else below.

- **Gallery:** large primary image, thumbnails, zoom on desktop, swipe on mobile with real page indicators. Fixed `aspect-ratio` so nothing jumps. Real alt text per image
- **Variants:** swatches for colour (with a text label — never colour alone, SC 1.4.1), buttons for size. **Show unavailable combinations as unavailable**, do not hide them or fail after add-to-cart
- **Size guide** reachable without leaving the page
- **Price and stock** update when a variant changes, without a layout shift
- **Add to cart:** loading state with preserved width, then unambiguous confirmation — a slide-out cart or an inline confirmation, not a toast that vanishes
- **Trust signals** near the button: shipping estimate, returns policy, stock level if genuinely low
- **Reviews:** rating summary, distribution, sortable, with verified-purchase marks. Never fake
- **Structured data** (`Product`, `Offer`, `AggregateRating`) for search results

---

## Cart

- Line items with image, title, variant, quantity stepper, per-line price, remove
- **Quantity change updates the total immediately** with an optimistic update, and rolls back visibly on failure
- Totals broken down: subtotal, shipping, tax, discount, total. No surprises later
- Promo code field collapsed by default but discoverable — a prominent empty promo field makes buyers leave to hunt for codes
- Free-shipping progress if applicable ("£12 more for free shipping")
- **Never lose the cart.** Persist server-side for signed-in users, in storage for guests
- Empty cart: show recently viewed and a route back to browsing
- Remove → toast with **Undo**, not a confirmation dialog

---

## Checkout

The highest-stakes flow in the product. `playbooks/auth-and-forms.md` for field craft.

- **Guest checkout available.** Forced account creation is the single largest drop-off cause
- One page or clearly-stepped, with progress shown. Both work; ambiguity does not
- **Full total visible from step one**, including shipping and tax
- Address autocomplete, and a country-appropriate field order
- Card form: one column, autofill-friendly, format as typed, card-type detection, `autocomplete="cc-*"`
- Express payment options (Apple Pay, Google Pay, PayPal) at the **top** — they skip the whole form
- Order summary persistently visible (sidebar on desktop, collapsible on mobile)
- **Never lose entered data** on validation failure, session expiry, or a payment decline
- Payment errors translated into plain language with a clear next action
- Confirmation page with an order number, an itemised summary, a delivery estimate, and an emailed copy

---

## Performance

Directly tied to revenue.

- PLP and PDP images are the LCP. AVIF, correct `sizes`, `fetchpriority` on the hero image, capped dimensions
- Reserve every image slot with `aspect-ratio` — CLS on a PDP gallery is the classic mis-tap-to-buy cause
- Lazy-load reviews, recommendations, and the chat widget
- Defer third-party tags; they are usually the largest cost on an e-commerce page
- Prefetch the PDP on PLP card hover
- Measure the real funnel: LCP on PLP/PDP, INP on variant selection and add-to-cart

---

## Accessibility

- Variant swatches: real radio inputs or `aria-checked` buttons, keyboard operable, colour never the only encoding
- Quantity steppers: a real number input plus buttons, both keyboard-usable
- Gallery: keyboard navigable, arrow keys, alt text per image
- Price changes announced via a live region
- Cart count in the nav announced when it changes
- 44px targets throughout — this is a touch-first surface
- Full keyboard path from listing to completed order

---

## Gate

- [ ] Scroll position restored on back from PDP to PLP
- [ ] Filters and sort in the URL; shareable
- [ ] Unavailable variants shown as unavailable, never discovered at add-to-cart
- [ ] Full total including shipping and tax visible before checkout
- [ ] Guest checkout available
- [ ] Cart never lost; entered data never lost on failure
- [ ] Colour variants have text labels
- [ ] Every image slot has `aspect-ratio`; CLS <= 0.1 on PLP and PDP
- [ ] Add-to-cart confirmation is unambiguous and does not vanish
- [ ] Keyboard path from browse to order complete
- [ ] Structured data on PDP
- [ ] `commands/review.md` passed
