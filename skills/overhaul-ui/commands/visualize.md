# visualize — charts and dashboards

**Route here when:** "add a chart", "build a dashboard", "visualize this data", "the
chart is unreadable".

**Writes:** chart components and dashboard layout.

---

## Procedure

### 1. Ask what question the chart answers
Not "what data do we have" — what question does the reader have? The question picks the
chart. `reference/data-viz.md` §1.

Most "add a chart" requests are actually **one big number with a delta and a
sparkline**. Check before building a chart.

### 2. Pick the chart type
From the question table. Then apply the encoding rules: position and length beat angle
and area; bars start at zero; never encode magnitude with radius; sort by value unless
the categories have inherent order.

Reject outright: 3D anything, dual y-axes, radar with multiple series, donut charts with
8 slices, rainbow scales for ordered data.

### 3. Pick the library
Recharts (standard React) · visx (full control) · ECharts (dense/large) · Observable
Plot (exploratory) · uPlot (realtime) · hand-rolled SVG (sparklines).
Lazy-load it — chart bundles are usually the heaviest thing on a dashboard route.

### 4. Colour as data, not brand
Categorical: max 6–7 hues, varying lightness too so it survives greyscale.
Sequential: one hue, ascending lightness, generated in OKLCH.
Diverging: only with a meaningful midpoint.
**Grey out everything except the series you are making a point about** — this single move
communicates more than adding colours.
Verify with a deuteranopia simulator; always pair colour with a second channel.

### 5. Strip the chrome
Horizontal gridlines only, very low contrast, or none · 3–5 y-ticks, abbreviated ·
direct labels at the end of lines instead of a legend · data labels only on the values
that matter · `tabular-nums` everywhere · title states the *finding*, not the fields.

### 6. Annotate
Mark the deploy, the outage, the campaign, the target. Context is what makes a chart
useful rather than decorative.

### 7. Interaction
Crosshair with a shared tooltip across series · hover is never the only way to read a
value · keyboard navigation between points · legend items as real toggle buttons ·
animate on first load only (300–600ms, staggered), never on every refresh.

### 8. Accessibility
Text summary naming the trend and the outliers · the underlying data available as a
table (`<details><summary>View data</summary>`) · 3:1 contrast on lines and bars ·
never colour-only · reduced motion honoured. `reference/data-viz.md` §6.

### 9. Dashboard composition (if applicable)
Answer at the top: one or two big numbers with deltas · then trend, then breakdown, then
detail table · max 6–8 tiles · one metric per tile · one shared, visible time range ·
always show a comparison · state the data freshness · loading/empty/error per tile.

### 10. Verify
Render with: real data, zero data, one point, a thousand points, negative values, nulls,
and a failed query. Then 320px, both themes, keyboard, reduced motion.

---

## Output

```
Question:  "Which onboarding step loses the most users?"
Chart:     horizontal funnel (was requested as a pie)
Library:   Recharts, lazy-loaded (-58KB from the initial route)
Colour:    single hue sequential; the drop-off step highlighted, rest grey
Chrome:    no gridlines, direct labels, tabular-nums, title states the finding
Annotated: the 12 Mar copy change marked on the timeline
A11y:      text summary + data table, 3:1 contrast, keyboard point navigation
States:    loading skeleton at final height, empty, query-failed
Verified:  0/1/1000 points, nulls, negatives, 320px, both themes, reduced motion
```

---

## Gate

- [ ] The chart answers a stated question
- [ ] Encoding is honest (bars from zero, area not radius, aspect ratio not misleading)
- [ ] Colour is a data channel; not colour-only; colour-blind safe
- [ ] Chrome minimised; numbers tabular; title states the finding
- [ ] Text summary + data table available
- [ ] Loading, empty and error states per chart
- [ ] Chart bundle lazy-loaded
- [ ] Verified with edge-case datasets

## See also
`reference/data-viz.md`, `reference/color.md`, `commands/optimize.md`
