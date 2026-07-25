# typeset — the typography pass

**Route here when:** "fix the typography", "pick fonts", "the text looks wrong", or as
step 2 of a de-slopping pass. Also the single highest-leverage fix when an interface
feels generic.

**Writes:** font loading, type tokens, and every text style.

---

## Procedure

### 1. Inventory
Find every font family, size, weight, line-height and letter-spacing in use. Count the
distinct sizes. More than 8 means there is no scale; fewer than 4 means there is no
hierarchy.

### 2. Choose the faces
`reference/typography.md` §2. One display/heading face, one text face, a mono face only
if the product shows code, IDs or dense numbers.

Constraints: does the brand mandate a face? Is there a licence? Is the load budget
tight (then one variable family, not three statics)?

If the answer is "keep Inter", keep it — but pair it with a distinct display face, or
state explicitly that a single-family direction is the choice.

### 3. Generate the scale
```bash
node scripts/scale.mjs --base=16 --ratio=1.25 --steps=9 --fluid --css
```
Ratio by register: 1.2 dense product · 1.25 default · 1.333 marketing · 1.414+ display-led.
Fluid `clamp()` for display sizes only; body stays fixed. Always keep a `rem` term in
the clamp middle or you break user zoom.

### 4. Assign
Map every text role to a scale step and a weight. Write it down.

```
display   4xl / 700 / 1.05 / -0.03em
h1        3xl / 600 / 1.1  / -0.02em
h2        2xl / 600 / 1.15 / -0.02em
h3        xl  / 600 / 1.25 / -0.01em
body      base/ 400 / 1.55 / 0
body-sm   sm  / 400 / 1.5  / 0
label     sm  / 500 / 1.4  / 0
caption   xs  / 400 / 1.45 / 0
overline  xs  / 500 / 1.4  / +0.09em / uppercase
code      sm  / 400 / 1.6  / 0 / mono
```

Load only the weights this table uses. Two weights, three at most.

### 5. Fix the measure
Body prose 60–75ch. Narrow columns 45–60ch. Display headlines 20–40ch. Nothing past
90ch. This is usually where "hard to read" comes from.

### 6. Fix the wraps
`text-wrap: balance` on headings, `pretty` on body. But first widen the container — a
balanced 6-line headline is still a 6-line headline. Six-line headline wraps are the
clearest sign nobody looked at the render.

### 7. Optical detail
`tabular-nums` on changing numbers · negative tracking at display sizes · positive on
all-caps labels · `font-optical-sizing: auto` on variable fonts with `opsz` · curly
quotes and en dashes · heading leading down to 1.05–1.2 · icons on the cap-height
baseline.

### 8. Load it properly
Self-host, subset, `font-display: swap`, metric-matched fallbacks (`size-adjust`,
`ascent-override`) to kill the swap shift. Preload only the face used above the fold.
`next/font` or Fontsource does most of this for you.

### 9. Verify
Render at 320px, 768px, 1440px. Check the longest heading and the longest label. Zoom
to 200%. Check both themes (text contrast changes with the background).

---

## Output

```
Faces:    <display> (700) + <text> (400, 500)  — 2 files, 34KB total
Scale:    16px base, ratio 1.25, 9 steps, fluid above lg
Roles:    10 mapped (was 17 ad-hoc sizes)
Fixed:    3 six-line headline wraps, 4 over-long measures,
          tabular-nums on 6 tables, tracking at display sizes
Loading:  self-hosted, subset latin, metric-matched fallback (CLS 0.14 → 0.00)
Verified: 320/768/1440, 200% zoom, both themes
```

---

## Gate

- [ ] Adjacent hierarchy levels visibly differ (no 2px gaps)
- [ ] No headline wraps past 3–4 lines at any width
- [ ] Measure 60–75ch for prose
- [ ] `tabular-nums` on every in-place changing number
- [ ] <= 3 weights loaded, all used
- [ ] Metric-matched fallback; CLS from font swap is zero
- [ ] Contrast still passes in both themes
- [ ] Build passes

## See also
`reference/typography.md`, `scripts/scale.mjs`, `commands/colorize.md`
