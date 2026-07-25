# Interaction and content states

The most common gap between "an AI built this" and "a product team built this" is
states. The happy path is maybe 30% of the work.

---

## 1. Every control needs five states

| State | Requirement |
|---|---|
| **Rest** | Legible, obviously interactive (or obviously not) |
| **Hover** | Visible change, 80–150ms, no layout shift. Gate behind `@media (hover: hover) and (pointer: fine)` |
| **Focus-visible** | 2px ring, 2px offset, >= 3:1 contrast against **both** the control and the page. Never `outline: none` alone |
| **Active / pressed** | `transform: scale(0.97)` or a darker fill. Instant (<= 100ms) |
| **Disabled** | Reduced emphasis, `aria-disabled` or `disabled`, no pointer events, cursor `not-allowed`, and an explanation of why |

Plus, where applicable: **loading**, **selected**, **checked/indeterminate**,
**expanded**, **invalid**, **read-only**, **dragging**, **drop-target**.

```css
.control {
  transition: background-color 120ms var(--ease-out),
              border-color 120ms var(--ease-out),
              transform 150ms var(--ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .control:hover { background: var(--bg-subtle); }
}
.control:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: inherit;   /* the ring should follow the shape */
}
.control:active { transform: scale(0.97); }
.control:disabled,
.control[aria-disabled="true"] { opacity: 0.55; cursor: not-allowed; }
```

**No layout shift from state.** Changing `padding`, `border-width`, `font-weight` or
`font-size` on hover moves neighbouring content. Use `outline` (which does not affect
layout), `box-shadow`, `transform`, colour, or a transparent border reserved at rest.

### Focus ring that works on any background
```css
:root { --ring: oklch(0.62 0.17 258); --ring-offset: var(--bg); }
.control:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px oklch(from var(--ring) l c h / 0.25);
}
```
On a coloured or image background, add a second contrasting ring (dark inner + light
outer) so it survives any backdrop. Also honour `forced-colors`:
```css
@media (forced-colors: active) { .control:focus-visible { outline: 2px solid Highlight; } }
```

### `:focus-visible` vs `:focus`
Style `:focus-visible` so mouse users don't see rings on click but keyboard users
always do. Keep `:focus-within` for containers (a card that highlights when a field
inside it is focused).

---

## 2. Loading

Choose by wait length and what is loading.

| Wait | Pattern |
|---|---|
| < 100ms | Nothing. Do not flash a spinner. Adding one makes it feel *slower*. |
| 100–300ms | Optimistic UI, or a subtle inline indicator |
| 300ms–1s | Skeleton matching the final layout, or an inline spinner in the control |
| 1–5s | Skeleton + a progress hint, keep the surrounding UI interactive |
| > 5s | Real progress with an estimate, and something else to do |
| Unknown, long | Explain the stage: "Analysing 1,240 rows…" |

**Skeletons must match the shape they replace.** A skeleton of three equal grey bars
replaced by a title + two lines of body causes a layout jump — worse than a spinner.
Match line count, widths, and heights. Vary widths (100% / 92% / 64%) so it reads as
text.

```css
.skeleton {
  background: linear-gradient(90deg,
    var(--bg-subtle) 25%, var(--bg-inset) 37%, var(--bg-subtle) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s var(--ease-linear) infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer { from { background-position: 100% 0; } to { background-position: 0 0; } }
@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
```

**Button loading state:** keep the button's width fixed (measure the label, or use
`grid` stacking so the spinner occupies the label's cell). A button that shrinks to fit
"…" while submitting is a layout shift on the most important control on the page.

```jsx
<button disabled={pending} aria-busy={pending} className="grid place-items-center">
  <span className="col-start-1 row-start-1" style={{opacity: pending ? 0 : 1}}>Save changes</span>
  {pending && <Spinner className="col-start-1 row-start-1" aria-hidden />}
  <span className="sr-only" aria-live="polite">{pending ? "Saving…" : ""}</span>
</button>
```

**Anti-flicker:** if the request may resolve in under ~200ms, delay showing the loading
state by 150–200ms, and once shown keep it for a 300ms minimum. Flicker reads as a bug.

**Announce it.** `aria-busy` on the region, and a polite live region for the result.

---

## 3. Empty states

The highest-value, most-skipped screen in software. There are four different empties
and they need different content.

| Type | Message | Action |
|---|---|---|
| **First run** (nothing yet) | What this will hold and why it is useful | Primary CTA to create the first one, plus a sample/template |
| **Cleared** (all done) | Positive acknowledgement | Nothing, or a link back |
| **No results** (filter/search) | Echo the query, suggest a relaxation | "Clear filters", spelling suggestion, broader scope |
| **No access / not available** | What is missing and who can grant it | Request access, or contact |

```
Do:    "No invoices yet — create one and it'll show up here."   [New invoice] [Import CSV]
Don't: "No data available."
Don't: A centred grey box with a magnifying glass icon and nothing else.
```

Rules: never a bare "No data". Never blame the user. Keep the surrounding chrome
(filters, headers) so the page does not appear broken. Do not make the empty state
taller than the filled state — that jumps the layout when data arrives.

---

## 4. Error states

Three tiers, three placements.

| Tier | Placement | Example |
|---|---|---|
| **Field-level** | Inline, directly below the input, red + icon + text | "Card number must be 16 digits" |
| **Form/section-level** | A summary block at the top of the form, focus moved to it | "Couldn't save — 2 fields need attention" (with links to each) |
| **Page/app-level** | Full-region error boundary with a retry | "This page didn't load. [Try again]" |

**Never use a toast for an error the user must act on.** It disappears before it is
read, cannot be re-read, and is often placed far from the cause.

**Error message formula:** what happened → why (if useful) → what to do next. Plain
language, no codes as the primary text (keep an ID in small print for support).

```
Bad:   "Error 422: Unprocessable Entity"
Bad:   "Something went wrong. Please try again."
Good:  "Couldn't upload — files must be under 10MB. This one is 24MB."
Good:  "You're offline. We saved your draft and will retry automatically."
```

**Preserve the user's input.** Never clear a form on error. Never lose a long text
field on a failed submit. If the session expired, keep the draft and re-authenticate in
place.

**Validation timing:**
- Validate on `blur`, not per keystroke — per-keystroke validation shouts at people mid-typing.
- Once a field is invalid, re-validate on input so the error clears as soon as it is fixed.
- On submit, validate everything, move focus to the first invalid field, and announce the count.
- Wire it up: `aria-invalid="true"`, `aria-describedby` pointing at the message, `role="alert"` on the message for immediate cases.
- Never rely on colour alone — icon + text as well.

---

## 5. Success and confirmation

Every action gets acknowledged within 100ms, even if the result takes longer.

| Action | Acknowledgement |
|---|---|
| Inline edit saved | Subtle inline "Saved" that fades after ~2s, or a checkmark |
| Item created | The item appears in the list (that *is* the confirmation) |
| Destructive completed | Toast with **Undo**, 5–8s |
| Multi-step finished | A dedicated success view with the next action |
| Copied to clipboard | Icon morph on the button itself, ~1.5s |

**Prefer undo over confirm.** A confirm dialog interrupts every time, including the
99% of times the user meant it. Undo interrupts nobody and is strictly safer. Reserve
confirmation dialogs for genuinely irreversible actions, and make the user type the
resource name for the truly dangerous ones.

---

## 6. Optimistic UI

Apply the change immediately, reconcile on response.

Use when the action almost always succeeds and is cheap to reverse: likes, toggles,
reorders, adding to a list, marking read.

Do **not** use for: payments, irreversible deletes, anything with server-side
validation the client cannot replicate, or anything where a rollback would confuse.

Rollback needs to be visible and explained — a silently reverted toggle is worse than
a spinner. Show the item returning to its previous state plus a brief message with a
retry.

---

## 7. The full state matrix

Run every data-bearing surface through this. It is where most defects live.

- Loading (first load) / loading (refetch, with stale data shown)
- Empty: first-run / cleared / no results / no access
- Error: network / timeout / 4xx / 5xx / partial failure
- Offline, and reconnecting
- Success
- One item / a few / hundreds / paginated / virtualised
- Very long strings (a 200-character name with no spaces), very long numbers
- Missing data: no avatar, no description, `null` date
- Stale data being revalidated
- Permission-limited view (read-only)
- RTL, and the longest translation (German is ~30% longer than English)
- Slow 3G, 200% browser zoom, 320px width
- Keyboard-only, screen-reader-only

Text handling for the long cases:
```css
.truncate-1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.break-hard { overflow-wrap: anywhere; }   /* URLs, tokens, IDs */
```
Always give truncated text a `title` or a tooltip so the full value is reachable.

---

## 8. Disabled vs hidden vs read-only

| Situation | Choose |
|---|---|
| Action unavailable and the reason is fixable | Enabled + validate on submit, or disabled **with** a tooltip explaining why |
| Action unavailable for this role, permanently | Hide it |
| Value shown but not editable here | `readonly`, not `disabled` — `disabled` fields are skipped by keyboard and excluded from form submission |
| Action in progress | Disabled + `aria-busy`, with the loading state on the control |

A disabled submit button with no explanation is a dead end. Either explain it or let
the user press it and receive real validation feedback.
