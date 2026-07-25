# Data visualization

---

## 1. Pick the chart from the question

The question determines the chart. Not the other way round.

| Question | Chart | Notes |
|---|---|---|
| How did it change over time? | **Line** | Time on x, always. Multi-series max ~5 lines |
| How did it change, and what is the total? | **Area** (stacked) | Only when the total is meaningful |
| How do categories compare? | **Bar** (horizontal if labels are long) | Sort by value, not alphabetically, unless order is inherent |
| How do parts compose a whole, over time? | **Stacked bar** | Max 4–5 segments |
| What share of the total? | **Bar** or **stacked single bar** | Pie only for 2–3 slices, never for precise comparison |
| Where is the relationship between two measures? | **Scatter** | Add a trend line only if it is statistically honest |
| Three variables at once? | **Bubble** | Area encodes the third, never radius |
| Distribution shape? | **Histogram** or **density** | Show the bin width |
| Distribution + outliers across groups? | **Box plot** or **violin** | Label the quartiles for non-technical audiences |
| Where do users drop off? | **Funnel** | Show both absolute and % of previous step |
| Retention over cohorts? | **Cohort heatmap** | Diverging or sequential scale, never rainbow |
| Two dimensions of density? | **Heatmap** | Sequential scale, legend mandatory |
| Progress to a target? | **Bullet** or a **progress bar** | Gauges waste enormous space |
| Flow between stages? | **Sankey** | Only when the flow genuinely branches |
| A single key number? | **Big number** + sparkline + delta | Most "dashboard chart" requests are actually this |
| Ranked list? | **Table** with an inline bar | A table is a valid visualization |
| Change between two points? | **Slope chart** or **dumbbell** | Clearer than two grouped bars |
| Hierarchy of magnitudes? | **Treemap** | Hard to compare precisely; label generously |
| Multi-attribute comparison? | **Small multiples** | Almost always better than a radar chart |
| Schedule / duration? | **Gantt** or timeline | — |
| Geographic? | **Choropleth** (rates) or **symbol map** (counts) | Never a choropleth of raw counts — that just maps population |
| Correlation across many measures? | **Correlation matrix** | Diverging scale centred on zero |
| Live system state? | **Sparkline row** or **status grid** | Fixed y-axis so the shape means something |

**Do not use:** 3D anything, radar/spider for more than one series, dual y-axes
(the visual correlation is an artifact of the scale choice), donut charts with 8
slices, or a rainbow colour scale for ordered data.

---

## 2. Encoding accuracy

Human perceptual accuracy, most accurate first: **position → length → angle → area →
colour value → colour hue**. Encode the most important variable in position or length.

- **Bar charts must start at zero.** Truncating the axis exaggerates differences and is the most common chart lie.
- **Line charts may truncate**, because they encode change rather than magnitude. Label the axis clearly.
- **Never encode magnitude with radius** — area grows as the square. Scale by area.
- **Aspect ratio changes the story.** A trend can be flattened or dramatised by height alone. Bank the slopes near 45°.
- **Ordering is an encoding.** Sort bars by value unless the categories have inherent order (days, sizes, stages).
- **Aggregation is an argument.** Daily vs weekly rollup can hide or reveal the point. Say which you used.

---

## 3. Colour for data

Colour is a **data** channel here, not a brand channel. See `reference/color.md` for
the palette work.

- **Categorical:** max 6–7 distinguishable hues. Beyond that, use direct labels, small multiples, or grouping. Vary lightness as well as hue so the series survive greyscale.
- **Sequential:** one hue, ascending lightness. Generate in OKLCH so the steps are perceptually even.
- **Diverging:** two hues meeting at a neutral midpoint. Only when there is a meaningful centre (zero, a target, an average).
- **Never rainbow** for ordered data — it creates false boundaries and reads out of order.
- **Semantic consistency:** if green means "up" in one chart, it means "up" in all of them. In finance, check the locale — red means up in some markets.
- **Colour-blind safe:** verify with a deuteranopia simulator. Red/green is the most common failure. Always pair colour with a second channel: direct labels, shape, dash pattern, position, or a value.
- **Grey is a colour.** Grey out everything except the series you are making a point about. A chart where one line is coloured and four are grey communicates more than five coloured lines.
- **Dark mode:** desaturate and lighten series colours; drop gridline contrast; never leave a white chart background in a dark theme.

---

## 4. Chart chrome

Strip everything that is not information.

| Element | Rule |
|---|---|
| **Gridlines** | Horizontal only, 1px, very low contrast. Or none. Never both axes gridded |
| **Axis lines** | Usually removable. Keep the baseline on bar charts |
| **Y-axis** | 3–5 ticks. Abbreviate (`1.2k`, `4.5M`). Include the unit once, in the label |
| **X-axis** | Thin the labels rather than rotating them. Rotated labels are a layout failure |
| **Legend** | Prefer **direct labels** at the end of each line. If you must, put it top-left, horizontal |
| **Data labels** | Only on the values that matter — first, last, max, min, or the highlighted one |
| **Title** | State the finding, not the fields. "Signups fell 18% after the pricing change", not "Signups by month" |
| **Tooltip** | All series at that x, formatted values, aligned to a crosshair. Never a raw JSON dump |
| **Annotations** | Mark the deploy, the outage, the campaign. Context is what makes a chart useful |
| **Numbers** | `tabular-nums`, consistent decimal places, `Intl.NumberFormat` for locale |

---

## 5. Interaction

- **Hover** shows detail; it must never be the *only* way to read a value. Touch and keyboard users get nothing from hover.
- **Crosshair + shared tooltip** across series beats per-point tooltips.
- **Click to filter** should be discoverable (cursor change, hover affordance) and reversible.
- **Zoom/brush** only for genuinely dense series. Always provide a reset.
- **Keyboard:** arrow keys move between data points, `Enter` selects, `Esc` exits. Focus visible on the current point.
- **Legend items as toggles** is a good pattern — make them real buttons with `aria-pressed`.
- **Animate on load once**, 300–600ms, staggered per series. Never animate on every data refresh — a live chart that re-animates every 5s is unreadable. Update values with a short transition instead.

---

## 6. Accessibility

Charts are the most commonly inaccessible part of a product.

```html
<figure role="group" aria-labelledby="c1-title" aria-describedby="c1-desc">
  <h3 id="c1-title">Monthly active users, 2025</h3>
  <p id="c1-desc" class="sr-only">
    Line chart. MAU rose from 12,400 in January to 31,900 in December,
    with a dip to 11,200 in April following the outage.
  </p>
  <svg aria-hidden="true"><!-- visual --></svg>
  <details>
    <summary>View data table</summary>
    <table><!-- the same data, accessible --></table>
  </details>
</figure>
```

- Every chart gets a text summary naming the **trend and the outliers**, not the encoding.
- Always offer the underlying data as a table. This is the single most effective accommodation and it also helps sighted users who want exact values.
- 3:1 contrast for lines, bars and any essential graphic (SC 1.4.11).
- Never colour-only encoding.
- Respect `prefers-reduced-motion` for load animation.
- Interactive charts need the keyboard model in §5.

---

## 7. Library selection

| Need | Pick | Why |
|---|---|---|
| Standard charts, React, fast | **Recharts** | Composable, sane defaults, small enough |
| Full design control | **visx** + d3 scales | Primitives, not charts. You own every pixel |
| Exploratory / grammar-of-graphics | **Observable Plot** | Concise, excellent defaults |
| Large datasets, dense dashboards | **Apache ECharts** | Canvas rendering, handles 100k+ points |
| Sparklines, tiny inline charts | Hand-rolled SVG | A library is overkill for a 60px path |
| Streaming / realtime | **uPlot** | Extremely fast, minimal |
| Full control of maths and rendering | **d3** | Use its scales and shapes even inside other libraries |
| React Native | **victory-native** (Skia) | — |

Lazy-load the chart bundle — it is usually the heaviest thing on a dashboard route and
often below the fold.

---

## 8. Dashboard composition

- **Answer the question at the top.** One or two big numbers with a delta and a sparkline. Most people read only these.
- **Then trend, then breakdown, then detail table.** In that order, top to bottom.
- **Max 6–8 tiles per view.** Beyond that nobody reads any of them. Group into tabs or separate views.
- **One primary metric per tile.** A tile with four numbers has no message.
- **Consistent time range across the view**, controlled once at the top, and visible.
- **Show comparison always** — vs previous period, vs target, vs cohort. A number without a reference point is not information.
- **State the freshness**: "Updated 4 minutes ago". Stale dashboards destroy trust.
- **Every tile needs a loading, empty and error state.** A dashboard where one tile silently shows zero because the query failed is actively harmful.
- **Tabular numbers, aligned decimal points, consistent units.** This is most of what makes a dashboard look professional.
