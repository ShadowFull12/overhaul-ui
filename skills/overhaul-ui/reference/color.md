# Colour

Colour is where "AI-generated" is most visible and most cheaply fixed.

---

## 1. Work in OKLCH

`oklch(L C H)` — perceptual lightness 0–1, chroma 0–0.4ish, hue 0–360.

Why it matters practically: in OKLCH, equal lightness steps *look* equal, and you can
change hue without the lightness swinging. In HSL, `hsl(60 100% 50%)` (yellow) and
`hsl(240 100% 50%)` (blue) claim the same lightness and differ enormously. Every
HSL-generated ramp has a muddy middle and an unpredictable dark end.

```css
--accent-500: oklch(0.62 0.17 258);
/* fallback first for old browsers */
color: #3B6FD4;
color: oklch(0.62 0.17 258);
```

Baseline-safe as of 2026 in all evergreen browsers. Keep a hex fallback for email and
legacy embeds. Generate ramps with `node scripts/palette.mjs "#3B6FD4" --css`.

---

## 2. Tinted neutrals

The single most effective de-slopping move. Pure grey is a tell; tinted grey looks
designed.

```css
/* Cool / technical — hue 260 */
--n-0:  oklch(0.99  0.002 260);
--n-50: oklch(0.975 0.004 260);
--n-100:oklch(0.945 0.006 260);
--n-200:oklch(0.895 0.008 260);
--n-300:oklch(0.815 0.010 260);
--n-400:oklch(0.685 0.013 260);
--n-500:oklch(0.565 0.014 260);
--n-600:oklch(0.470 0.014 260);
--n-700:oklch(0.385 0.013 260);
--n-800:oklch(0.285 0.012 260);
--n-900:oklch(0.205 0.011 260);
--n-950:oklch(0.155 0.010 260);
--n-1000:oklch(0.115 0.009 260);
```

Swap the hue to change the temperature of the whole product:

| Hue | Feel | Fits |
|---|---|---|
| 250–270 | Cool, technical, calm | Dev tools, dashboards, fintech |
| 80–100 | Warm cream, paper | Wellness, editorial, education |
| 20–40 | Warm taupe, earthy | Food, hospitality, craft |
| 150–170 | Cool sage | Health, sustainability |
| 300–320 | Cool mauve | Fashion, culture |

Chroma stays low — `0.002` at the extremes, up to `0.014` in the middle. Above ~0.02
it stops being a neutral. The tint should be felt, not seen.

**Banned:** `#000`, `#fff`, `#888`, `gray-500` as body text, and Tailwind's default
`gray-*` untouched. `slate`/`stone`/`zinc` are acceptable if chosen deliberately.

---

## 3. Palette structure

One accent. That is the default. Everything else is neutrals plus semantic status
colours.

```
Neutrals    12–13 steps   surfaces, text, borders — 90% of the interface
Accent      9–11 steps    primary actions, active state, focus, links
Semantic    4 × 3 steps   success / warning / danger / info (bg, border, text)
```

A second accent is justified only when you have two genuinely distinct meanings
(e.g. "AI-generated" vs "human-authored"). Six accent colours across six feature
cards is decoration, not meaning.

### Semantic roles, not raw values
Never reference a ramp step in a component. Reference a role.

```css
:root {
  --bg:              var(--n-0);
  --bg-subtle:       var(--n-50);
  --bg-elevated:     var(--n-0);
  --bg-inset:        var(--n-100);
  --fg:              var(--n-950);
  --fg-muted:        var(--n-600);   /* verify 4.5:1 */
  --fg-subtle:       var(--n-500);   /* large text / icons only */
  --fg-on-accent:    var(--n-0);
  --border:          var(--n-200);
  --border-strong:   var(--n-300);
  --accent:          var(--a-600);
  --accent-hover:    var(--a-700);
  --accent-subtle:   var(--a-50);
  --ring:            var(--a-600);
  --success:         oklch(0.55 0.14 150);
  --warning:         oklch(0.72 0.15  75);
  --danger:          oklch(0.55 0.19  25);
}
```

Full architecture and naming rules in `reference/design-tokens.md`.

---

## 4. Dark mode

Dark mode is not inverted light mode. Six rules:

1. **Never pure black.** `oklch(0.15–0.18 0.01 <hue>)`. Pure black exaggerates halation around light text and makes shadows impossible.
2. **Elevation goes lighter, not darker.** Each surface level adds ~+0.025 to +0.04 L. Shadows barely read on dark; the lightness step is what conveys depth.
3. **Desaturate and lighten accents.** A colour that works on white is often too dark and too saturated on near-black. Drop chroma ~15–25%, raise L.
4. **Text is not `#fff`.** `oklch(0.95 0.005 <hue>)` for primary. Pure white on dark vibrates.
5. **Borders need more contrast on dark than you expect.** A border that reads at 8% opacity on light needs 12–16% on dark.
6. **Re-verify every pair.** Contrast is not preserved by inversion. Run `scripts/contrast.mjs` on both themes.

```css
:root { color-scheme: light; }
@media (prefers-color-scheme: dark) { :root:not([data-theme]) { color-scheme: dark; } }
[data-theme="dark"] {
  color-scheme: dark;
  --bg:            oklch(0.165 0.010 260);
  --bg-subtle:     oklch(0.195 0.011 260);
  --bg-elevated:   oklch(0.225 0.012 260);
  --fg:            oklch(0.955 0.004 260);
  --fg-muted:      oklch(0.740 0.010 260);
  --border:        oklch(0.300 0.012 260);
  --accent:        oklch(0.680 0.150 258);
}
```

**Implementation notes**
- Set `color-scheme` so native scrollbars, form controls and `<dialog>` backdrops follow the theme.
- Support three states: system, light, dark. Store the user's explicit choice; default to system.
- Set the theme class before first paint (inline script in `<head>` or a cookie read on the server) or you ship a flash of the wrong theme.
- Images: `<picture>` with `prefers-color-scheme` media, or `filter: brightness(.9)` on photography to stop it glowing.
- Give dark-mode SVG logos a light variant. Do not `filter: invert()` a brand mark.

---

## 5. Contrast

| Content | Minimum |
|---|---|
| Body text | 4.5:1 (WCAG AA) |
| Text >= 24px, or >= 19px bold | 3:1 |
| Icons and essential graphics | 3:1 (SC 1.4.11) |
| Focus indicator vs adjacent colours | 3:1 (SC 1.4.11 / 2.4.13) |
| Component boundaries where needed to identify a control | 3:1 |
| Disabled elements | exempt, but keep them legible anyway |
| AAA body text | 7:1 |

Verify, do not estimate: `node scripts/contrast.mjs "#4B5563" "#FFFFFF"`.

**Gotchas**
- Text on an image always needs a scrim. A `text-shadow` is not a scrim.
- Text over a gradient must pass at the *worst* point of the gradient.
- Semi-transparent text (`opacity: 0.6`) must be measured against the *composited*
  result, not the source colour.
- Placeholder text almost always fails. Give it 4.5:1 or accept that it is decorative
  and never load-bearing.
- Never use colour as the only signal (SC 1.4.1). Pair with an icon, text label,
  weight, or shape. This applies to charts, status dots and validation states.

[APCA](https://git.apcacontrast.com/) models perceptual contrast better than WCAG 2's
ratio, especially on dark backgrounds. Use it as a design aid; ship against WCAG 2.2
because that is what regulations reference. Note APCA's own licence terms before
embedding its algorithm.

---

## 6. Palette starting points

| Direction | Ground | Accent | Neutral hue |
|---|---|---|---|
| Quiet Product | `oklch(0.99 0.002 265)` | `oklch(0.55 0.17 262)` | 265 |
| Technical Dark | `oklch(0.17 0.014 258)` | `oklch(0.72 0.16 155)` | 258 |
| Warm Minimal | `oklch(0.972 0.010 88)` | `oklch(0.52 0.11 40)` | 88 |
| Editorial | `oklch(0.985 0.004 90)` | `oklch(0.42 0.16 25)` | 90 |
| Luxury | `oklch(0.965 0.006 85)` | `oklch(0.62 0.09 75)` | 85 |
| Health / Calm | `oklch(0.98 0.008 160)` | `oklch(0.55 0.11 175)` | 160 |
| Fintech Trust | `oklch(0.99 0.003 250)` | `oklch(0.45 0.14 250)` | 250 |
| Bold Consumer | `oklch(0.99 0.002 300)` | `oklch(0.62 0.22 350)` | 300 |
| Brutalist | `oklch(0.97 0 0)` | `oklch(0.55 0.24 28)` | 0 (true neutral is on-brief here) |
| Data Dense | `oklch(0.18 0.008 240)` | `oklch(0.70 0.14 230)` | 240 |

These are seeds, not answers. Feed the accent to `scripts/palette.mjs` and read the
generated ramp.

---

## 7. Gradients, shadows, glow

**Gradients** — allowed when they carry meaning: depth on a large ground, a state
change, a brand mark, a chart encoding. Rules:
- Interpolate in `oklch` (`linear-gradient(in oklch, ...)`) to avoid grey midpoints.
- Vary lightness within one hue family, not hue across the wheel. Two-hue gradients
  are where purple-to-blue comes from.
- Large soft radials read as light. Small hard linears read as plastic.
- Add `background-blend-mode` or 1–2% noise to defeat banding on wide gradients.

**Shadows** — model one light source. Use paired shadows: a tight dark one for
contact, a wide soft one for ambience. Tint the shadow with the surface hue; pure
black shadows look dirty.

```css
--shadow-xs: 0 1px 2px oklch(0.2 0.02 260 / 0.06);
--shadow-sm: 0 1px 2px oklch(0.2 0.02 260 / 0.06), 0 2px 6px oklch(0.2 0.02 260 / 0.05);
--shadow-md: 0 2px 4px oklch(0.2 0.02 260 / 0.06), 0 8px 20px oklch(0.2 0.02 260 / 0.07);
--shadow-lg: 0 4px 8px oklch(0.2 0.02 260 / 0.07), 0 20px 44px oklch(0.2 0.02 260 / 0.10);
```

Max 3–4 elevation levels. On dark themes, replace most shadow work with a lightness
step plus a 1px top highlight border.

**Glow** — at most on the single primary action, or nowhere. Accent-coloured glow on
every card is the fastest way to look AI-generated.

---

## 8. Failure table

| Symptom | Cause | Fix |
|---|---|---|
| Looks AI-generated | Purple→blue gradient, untinted greys | One flat brand colour, tinted ramp |
| Muddy mid-tones | Ramp generated in HSL | Regenerate in OKLCH |
| Dark mode looks flat | Elevation via shadow only | Step lightness per surface level |
| Accent invisible on dark | Same accent both themes | Lighten + desaturate for dark |
| Secondary text unreadable | `#888` / `gray-500` | Pick the ramp step that measures 4.5:1 |
| Everything shouts | Accent used everywhere | One accent, twice per view |
| Status unclear to colour-blind users | Colour-only encoding | Add icon + text label |
| Gradient bands visibly | 8-bit interpolation over a long distance | `in oklch`, add subtle noise |
| Shadows look dirty | Pure black at high opacity | Tinted, lower opacity, layered |
