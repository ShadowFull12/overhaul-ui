# states — loading, empty, error, and every control state

**Route here when:** "add loading states", "add skeletons", "handle errors", or the
audit found missing states. Also the highest-value pass on almost any AI-generated
interface — this is where the "someone actually shipped this" quality comes from.

**Writes:** new state components and control styles.

---

## Procedure

### 1. Map the surfaces
List every place that fetches, mutates, or can be empty. For each, record the current
coverage:

| Surface | Loading | Empty | Error | Success |
|---|---|---|---|---|
| Invoice list | spinner | ✗ | ✗ | n/a |
| Create form | ✗ | n/a | ✗ | ✗ |

Every `✗` is a defect.

### 2. Control states first
Cheapest, most universal. For every interactive element:
`rest` · `hover` (gated behind `(hover: hover)`) · `focus-visible` (2px ring, 2px
offset, 3:1) · `active` (`scale(0.97)`) · `disabled` (with an explanation).
Plus, where relevant: `loading`, `selected`, `checked`/`indeterminate`, `expanded`,
`invalid`, `read-only`, `dragging`.

No layout shift from any state change. Never `outline: none` without a replacement.

### 3. Loading
Choose by wait length (`reference/interaction-states.md` §2):
- < 100ms → nothing. A flashed spinner makes it feel slower
- 100–300ms → optimistic, or a subtle inline indicator
- 300ms–1s → skeleton matching the final layout
- 1–5s → skeleton + progress hint, surrounding UI stays interactive
- \> 5s → real progress with an estimate

**Skeletons must match the shape they replace** — same line count, same widths (vary
them: 100%/92%/64%), same heights. A mismatched skeleton is a layout shift, which is
worse than a spinner.

**Button loading:** fixed width (grid-stack the spinner over the label), `aria-busy`,
disabled. A button that shrinks while submitting is a layout shift on the most
important control on the page.

**Anti-flicker:** delay showing the loading state ~150ms, and keep it for a 300ms
minimum once shown.

### 4. Empty — four different screens
| Type | Content |
|---|---|
| First run | What belongs here + primary CTA + a sample or template |
| Cleared | Positive acknowledgement |
| No results | Echo the query + a way to relax the filter |
| No access | What is missing + how to request it |

Never "No data available". Keep the surrounding chrome so the page does not look broken.
Do not make the empty state taller than the filled state.

### 5. Error — three tiers, three placements
- **Field**: inline below the input, icon + text, `aria-describedby`, `aria-invalid`
- **Form**: summary block at the top, focus moved to it, links to each bad field
- **Page**: error boundary with a retry

Formula: what happened → why → what to do. Never a toast for an error the user must act
on. Never clear the user's input on failure.

Validation timing: on `blur` first, then on `input` once invalid so it clears as soon as
it is fixed; everything on submit with focus moved to the first invalid field.

### 6. Success
Acknowledge within 100ms. Prefer **undo** over a confirm dialog — undo interrupts
nobody and is strictly safer. Reserve confirmation for the genuinely irreversible, and
require typing the resource name for the truly dangerous.

### 7. Announce it
`aria-busy` on loading regions. A polite live region for results and status. A visual
spinner announces nothing. `role="alert"` for blocking errors only.

### 8. Run the full matrix
`reference/interaction-states.md` §7. Zero/one/many items · very long strings · missing
avatar and `null` dates · offline and reconnecting · stale-while-revalidating ·
read-only role · RTL · longest translation · slow 3G · 200% zoom · keyboard only.

### 9. Verify
Throttle the network to Slow 3G and walk the flow. Force each error path (block the
request in DevTools). Empty the data. Then keyboard-only pass.

---

## Output

```
Surfaces: 7 mapped
Added
  loading   5 skeletons (shape-matched), 3 button loading states
  empty     6 states across 4 types (2 first-run, 2 no-results, 1 cleared, 1 no-access)
  error     4 field-level, 2 form-level, 1 page boundary
  success   3 toasts with undo (replacing 2 confirm dialogs)
Control states: focus-visible added to 14 elements; :active to 9; 3 disabled states explained
A11y: aria-busy on 5 regions, 2 live regions, aria-invalid + describedby on 8 fields
Verified: Slow 3G walkthrough, forced error paths, emptied data, keyboard pass
```

---

## Gate

- [ ] Every async surface has all four states
- [ ] Every control has all five states, no layout shift
- [ ] Skeletons match the shape they replace
- [ ] Button loading preserves width
- [ ] No spinner under 100ms; no flicker
- [ ] No empty state says "No data"
- [ ] No error uses a toast when action is required
- [ ] User input preserved on every failure
- [ ] Live regions announce results
- [ ] Tested with the network throttled and errors forced

## See also
`reference/interaction-states.md`, `reference/copywriting.md`, `commands/harden.md`
