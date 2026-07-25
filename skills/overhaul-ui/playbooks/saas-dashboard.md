# Playbook — SaaS dashboard / product UI

A daily driver. Everything is subordinate to speed and clarity. This is the surface where
motion is most often wrong and states are most often missing.

---

## First principles

- **Frequency changes everything.** Users see this dozens of times a day. Animation is a
  tax, decoration is noise, and a 200ms transition on tab switching costs real time.
- **Density is a feature.** Compact or default tier (`reference/layout.md` §4), not
  comfortable. Dashboards designed like marketing pages waste the screen.
- **Direction:** Quiet Product, Technical Dark, or Data Dense (`reference/direction.md`).
- **The answer goes at the top.** Most users read only the first two numbers.

---

## Shell

```
┌─ top bar (56px): logo · breadcrumb/context · search (⌘K) · notifications · avatar ─┐
│ sidebar 240px │  main content                                                      │
│ nav groups    │  page header: title · description · primary action                 │
│ collapsible   │  content                                                           │
└───────────────┴────────────────────────────────────────────────────────────────────┘
```

- Sidebar 240–280px expanded, 56–64px collapsed. **Persist the state.**
- Nav groups labelled, 5–7 items each. Active item: accent text + a 2–3px leading bar. `aria-current="page"`
- Command palette (`⌘K` / `Ctrl+K`) — the single highest-value addition to any dashboard. **No open/close animation**
- Page header consistent across every route: title, optional description, one primary action
- Never animate route transitions here
- Mobile: sidebar becomes a drawer; consider a 4–5 item bottom tab bar

---

## Overview page

1. **2–4 metric tiles** — big number, `tabular-nums`, delta vs previous period, sparkline
2. **One primary chart** — the trend that matters
3. **A breakdown** — table or bar chart
4. **Recent activity** — a list, with an empty state

Rules: one metric per tile · always show a comparison (a number with no reference point is
not information) · one shared time range control, visible at the top · state the data
freshness ("Updated 4 min ago") · max 6–8 tiles before splitting into tabs or routes.

Every tile needs its own loading, empty and error state. A tile silently showing zero
because its query failed is actively harmful.

---

## Tables — the core of most dashboards

`reference/components.md` → Table. The essentials:

- Row 32px compact / 40px default. Header sticky, 12–13px, muted
- `tabular-nums` everywhere; numbers right-aligned; header alignment matches the column
- **Either** zebra striping **or** row hairlines, never both
- Column widths fixed or fractional, never `auto` — `auto` reflows the whole table on data change
- Sortable headers are `<button>`s with `aria-sort`
- Sticky first column on wide tables, with a shadow to signal the overlap
- Virtualise past ~100 rows; reserve the scroll height so the bar does not jump
- Truncate with `title`; never wrap unpredictably
- Row selection: leading checkbox, a bulk-action bar that does **not** shift the table
- Filters persist in the URL so a view is shareable and survives a refresh
- Skeleton rows at exactly the real row height
- Empty state distinguishes "no data yet" from "no results for this filter"

---

## Forms and settings

- Grouped into sections with headings, 32–40px between groups
- Labels above inputs. Inline validation on blur, cleared on input
- **Switches apply immediately; checkboxes stage until save.** Choosing wrong is a real bug
- Save bar appears only when dirty, sticky at the bottom, with a Discard option
- Destructive actions in a separate, visually distinct section at the end
- Never a modal for a settings form — use a route or an inline panel

---

## States

Dashboards live in their non-happy paths. Run every surface through
`reference/interaction-states.md` §7, with particular attention to:

- Loading vs refetching-with-stale-data-visible (do not blank the screen on refetch)
- Empty: first-run (needs onboarding) vs filtered-to-nothing (needs a filter reset)
- Partial failure: 3 of 5 tiles loaded
- Offline and reconnecting
- Permission-limited read-only view
- 0 / 1 / 10,000 rows

---

## Motion — mostly none

| Element | Verdict |
|---|---|
| Command palette | **No animation** |
| Route/tab change | **No animation** |
| Sidebar collapse | 150ms width, or none |
| Dropdown / menu | 150ms ease-out, origin at trigger |
| Modal | 200ms, centre origin |
| Toast | 300ms in, 200ms out |
| Table row insert | 150ms opacity, no movement |
| Chart | On first load only. **Never** on refresh |
| Skeleton shimmer | 1.4s linear, disabled under reduced motion |

If the animation count on a dashboard exceeds about six, something is wrong.

---

## Performance

- Virtualise long lists and tables
- `content-visibility: auto` on below-fold panels
- Lazy-load chart and editor bundles — usually the heaviest thing on the route
- Debounce filter input 150–250ms; keep the input responsive while results lag
- Optimistic updates for toggles, renames and reorders
- Prefetch the detail route on row hover
- INP is the metric that matters here, not LCP

---

## Gate

- [ ] Command palette present, with no animation
- [ ] Density tier compact or default, held consistently
- [ ] Every table: sticky header, tabular numbers, one separation mechanism, virtualised if long
- [ ] Every tile and table has loading, empty and error states
- [ ] Filters and view state in the URL
- [ ] Every metric shows a comparison; freshness stated
- [ ] <= ~6 animations total; none on route change or the palette
- [ ] Keyboard-only pass through the primary flow
- [ ] Sidebar collapse state persists; mobile drawer works
- [ ] INP <= 200ms at 4× throttle
- [ ] `commands/review.md` passed
