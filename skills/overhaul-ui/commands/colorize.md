# colorize — the colour, theme and dark-mode pass

**Route here when:** "fix the colors", "new palette", "add dark mode", "the contrast is
bad", or as step 3–4 of a de-slopping pass.

**Writes:** colour tokens and every colour reference.

---

## Procedure

### 1. Inventory
Grep every colour literal. Count the distinct greys. A codebase with 9 unrelated greys
has no system — that count is the finding.

```bash
node scripts/slop-scan.mjs . --json     # flags #000/#fff/#888, purple→blue, untinted greys
```

### 2. Pick the neutral hue
The temperature of the whole product. `reference/color.md` §2.
Cool 250–270 (technical) · warm 80–100 (paper) · earthy 20–40 · sage 150–170 · mauve 300–320.

### 3. Generate the ramps
```bash
node scripts/palette.mjs "<brand hex>" --steps=11 --neutrals --css
```
13 neutral steps, 9–11 accent steps, generated in OKLCH so lightness steps are
perceptually even. Never hand-pick a ramp; never generate one in HSL.

### 4. Cut to one accent
One accent is the default. A second only when there are two genuinely distinct
meanings. Semantic status colours (success/warning/danger/info) are separate and are
not "accents".

### 5. Map semantic roles
Components must never reference a ramp step. They reference roles.
```
--bg --bg-subtle --bg-elevated --bg-inset
--fg --fg-muted --fg-subtle --fg-on-accent
--border --border-strong --ring
--accent --accent-hover --accent-active --accent-subtle
--success --warning --danger --info (+ -bg, -border, -fg each)
```
Full architecture in `reference/design-tokens.md`.

### 6. Build the dark theme
Not an inversion. `reference/color.md` §4:
- Base `oklch(0.15–0.18 0.01 <hue>)`, never `#000`
- Elevation goes **lighter** (+0.025 to +0.04 L per level), not darker
- Accents lose 15–25% chroma and gain lightness
- Text `oklch(0.95 …)`, not pure white
- Borders need more contrast than on light
- `color-scheme: dark` so native controls, scrollbars and backdrops follow

### 7. Verify contrast — measure, do not estimate
```bash
node scripts/contrast.mjs "#4B5563" "#FFFFFF"
node scripts/contrast.mjs --matrix design-system/tokens.json
```
Body 4.5:1 · large text and UI glyphs 3:1 · focus ring 3:1 against neighbours ·
placeholders too. **Both themes.** Check text over gradients at the worst point, and
semi-transparent text against the composited result.

### 8. Kill colour-only encoding
Every status, validation state and chart series needs a second channel: icon, label,
shape, position or weight (SC 1.4.1).

### 9. Handle the theme switch properly
Three states: system / light / dark. Store the explicit choice, default to system. Set
the attribute **before first paint** (inline script in `<head>`, or server-render from a
cookie) or you ship a flash of the wrong theme. Do not transition every colour on
switch.

### 10. Sweep
Grep for leftover literals. Also check: images and logos that need a dark variant,
`<meta name="theme-color">`, favicon, OG images, email templates, and any hardcoded
colour in a chart config.

---

## Output

```
Neutrals:  13-step ramp, oklch hue 262 (was 9 unrelated greys)
Accent:    1 (was 4) — oklch(0.55 0.17 258), 11 steps
Roles:     19 semantic tokens; 0 components reference a ramp step directly
Themes:    light, dark, system — set pre-paint, no flash
Contrast:  all pairs pass AA in both themes (worst: --fg-muted on --bg-subtle, 4.71:1)
Removed:   6 gradients (incl. 2 purple→blue), 11 accent glows, all #000/#fff/#888
Fixed:     4 colour-only status indicators now have icons + labels
Verified:  contrast matrix, both themes, forced-colors mode
```

---

## Gate

- [ ] One tinted neutral ramp; no `#000`/`#fff`/`#888`/untouched `gray-*`
- [ ] One accent (or a stated reason for two)
- [ ] Components reference semantic roles only
- [ ] Dark mode built, not inverted; elevation via lightness
- [ ] Every pair contrast-verified in both themes with the script
- [ ] No colour-only encoding anywhere
- [ ] No theme flash on load
- [ ] `forced-colors: active` does not break the UI
- [ ] Build passes

## See also
`reference/color.md`, `reference/design-tokens.md`, `scripts/palette.mjs`,
`scripts/contrast.mjs`
