# Typography

The highest-leverage change in almost any weak interface. Fix type first.

---

## 1. The scale

Pick a ratio and generate. Never hand-pick unrelated sizes.

| Ratio | Name | Character | Use for |
|---|---|---|---|
| 1.125 | Major second | Very tight | Dense dashboards, data tables |
| 1.200 | Minor third | Tight | Product UI, admin |
| 1.250 | Major third | Balanced | **Best default.** Most product + marketing |
| 1.333 | Perfect fourth | Expressive | Marketing, editorial |
| 1.414 | Augmented fourth | Dramatic | Landing pages with big display type |
| 1.618 | Golden | Very dramatic | Editorial, luxury, few levels only |

Generate with `node scripts/scale.mjs --base=16 --ratio=1.25 --steps=9 --fluid --css`.

A practical 16px / 1.25 scale, rounded to sane values:

```
12  13  14  16  20  25  31  39  49  61  76
xs  sm  base(16) → lg 20 → xl 25 → 2xl 31 → 3xl 39 → 4xl 49 → 5xl 61 → 6xl 76
```

**Rules**
- Body copy: 16–18px web, 17px iOS, 16sp Android. 14px is a UI size, not a body size.
- Adjacent hierarchy levels need a visible jump. If a heading is within 2–3px of body text, the hierarchy does not exist.
- Cap the number of levels actually used at 5–6. More levels means less hierarchy, not more.
- Display sizes should be *much* larger than you first reach for. 39px is a heading; 76px is a statement.

### Fluid type
Use `clamp()` for display sizes only. Keep body text fixed — fluid body text produces
odd measures and breaks user zoom expectations.

```css
/* min 39px at 360px viewport → max 76px at 1440px */
--text-display: clamp(2.4375rem, 1.2rem + 5.6vw, 4.75rem);
```

Always include a `rem` term in the middle so the value still responds to user font-size
settings. `clamp(2rem, 5vw, 4rem)` (no rem term) breaks zoom accessibility.

---

## 2. Pairings

One display/heading face plus one text face. A mono face if the product shows code,
identifiers or dense numbers. Three total is the ceiling.

### Web-safe / zero-network
```css
--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-serif: ui-serif, Georgia, Cambria, "Times New Roman", serif;
--font-mono: ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, monospace;
```

### Curated pairings (all Google Fonts unless noted)

| # | Display / Heading | Body / UI | Register | Fits |
|---|---|---|---|---|
| 1 | Instrument Serif | Geist Sans (or Inter) | Modern editorial | Startups, portfolios, brand sites |
| 2 | Fraunces (opsz variable) | Nunito Sans | Warm, characterful | Wellness, food, education |
| 3 | Playfair Display | Source Sans 3 | Classic elegant | Luxury, hospitality, weddings |
| 4 | Space Grotesk | IBM Plex Sans | Technical modern | Dev tools, infra, crypto |
| 5 | Bricolage Grotesque | Inter | Contemporary quirky | Creative agencies, culture |
| 6 | Libre Baskerville | Karla | Literary | Blogs, long-form, journals |
| 7 | Archivo Expanded | Archivo | Sporty confident | Fitness, events, consumer launches |
| 8 | Sora | Manrope | Clean geometric | SaaS, fintech |
| 9 | DM Serif Display | DM Sans | Friendly refined | Consumer finance, healthcare |
| 10 | Syne | Work Sans | Art-directed | Design studios, portfolios |
| 11 | Newsreader | Public Sans | Editorial trustworthy | News, government, docs |
| 12 | Chivo | Chivo | Single-family Swiss | Brutalist, utilitarian |
| 13 | Unbounded | Plus Jakarta Sans | Bold consumer | Apps, gaming, youth |
| 14 | Cormorant Garamond | Jost | High-contrast luxe | Fashion, jewellery |
| 15 | Gabarito | Figtree | Rounded approachable | Consumer tools, kids |
| 16 | JetBrains Mono | Inter | Terminal-forward | Dev tools, technical dark |
| 17 | Instrument Sans | Instrument Sans | One-family quiet | Product UI, dashboards |
| 18 | Redaction (Titles) | Söhne / Inter | Distressed editorial | Culture, music, indie |

Commercial faces worth naming when the budget exists: Söhne, GT Walsheim, Untitled
Sans, ABC Diatype, Neue Haas Grotesk, Suisse Int'l, Mondwest, PP Editorial New.
Free-and-excellent: [Geist](https://vercel.com/font), Satoshi, General Sans, Switzer.

**Single-family strategy.** One well-drawn variable family with a wide weight and
optical-size range (Fraunces, Archivo, Recursive, Instrument Sans, Inter with
`opsz`) is a legitimate and often stronger choice than a weak pairing.

---

## 3. Measure, leading, tracking

| Property | Rule |
|---|---|
| **Measure** | 60–75ch for body prose; 45–60ch for narrow columns; 20–40ch for display headlines. Never let prose run past 90ch. |
| **Leading (body)** | 1.5–1.65. Longer measure needs more leading. |
| **Leading (headings)** | 1.0–1.2. Tighter as size grows. A 76px headline at 1.5 looks broken. |
| **Leading (UI)** | 1.35–1.45 for labels and dense rows. |
| **Tracking (display)** | `-0.02em` at 40px, `-0.03em` at 60px, `-0.04em` at 80px+. |
| **Tracking (body)** | `0`. Leave it alone. |
| **Tracking (all-caps / small labels)** | `+0.06em` to `+0.16em`. Caps need air. |
| **Paragraph spacing** | `0.75em`–`1em` between paragraphs. Never indent *and* space. |

### Wrapping
```css
h1, h2, h3, .headline { text-wrap: balance; }   /* even line lengths, <= ~6 lines */
p, li, figcaption      { text-wrap: pretty; }   /* avoids orphans */
```
`text-wrap: balance` is the direct fix for the AI habit of 6-line headline wraps —
but the real fix is a wider container. Balance a headline in a narrow column and you
get a neat 6-line block, which is still wrong.

---

## 4. Optical detail

The details that separate typeset from typed.

- **Optical sizing.** With a variable font exposing `opsz`, set `font-optical-sizing: auto`. Display sizes get finer strokes, small sizes get sturdier ones.
- **Tabular numerals.** `font-variant-numeric: tabular-nums` on tables, timers, counters, prices, anything that changes in place. Non-negotiable in data UI.
- **Old-style figures** (`oldstyle-nums`) in serif long-form prose for a print feel.
- **Ligatures.** On for prose (`liga`, `clig`). Off for code (`font-variant-ligatures: none` unless intentional).
- **Fractions and superscripts.** `font-variant-numeric: diagonal-fractions`, and real `sups` rather than `<sup>` scaling.
- **Punctuation.** Curly quotes `“ ”` and apostrophes `’`, en dash for ranges `2020–2024`, ellipsis character `…`. Straight quotes in prose look unfinished.
- **Hanging punctuation.** `hanging-punctuation: first last` where supported, for pull quotes.
- **Optical alignment.** A left-aligned quotation mark or bullet should hang slightly into the margin so the *text* aligns, not the glyph box.
- **Hyphenation.** `hyphens: auto` with `lang` set, for justified or narrow columns only. Never on headings.
- **Uppercase.** Use `text-transform: uppercase` with added tracking, and never for more than a few words. Screen readers read the underlying text, so keep the source sentence-case.
- **Small caps.** `font-variant-caps: all-small-caps` beats fake caps for abbreviations in prose.
- **Baseline of mixed content.** Icons beside text must align to the cap height, not the box centre. `align-items: center` on a flex row plus a `translateY(-0.5px)` nudge is usually the fix.

---

## 5. Loading fonts without regret

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="font" type="font/woff2"
      href="/fonts/subset-latin.woff2" crossorigin>
```
```css
@font-face {
  font-family: "Display";
  src: url("/fonts/display-var.woff2") format("woff2-variations");
  font-weight: 400 700;          /* variable range, one file */
  font-display: swap;            /* or optional for body if CLS matters more */
  unicode-range: U+0000-00FF, U+0131, U+2000-206F;  /* subset */
  size-adjust: 96%;              /* match fallback metrics, kills the reflow jump */
  ascent-override: 90%;
  descent-override: 22%;
}
```

- **Self-host** where possible. One less connection, no third-party dependency.
- **Variable fonts** when using 3+ weights; static when using 2.
- **Subset** to the scripts you ship. A full Latin-Ext + Cyrillic + Greek file is mostly waste.
- **Metric-matched fallbacks** (`size-adjust`, `ascent-override`) prevent the layout shift that font swaps cause. Next.js `next/font` does this automatically; do it by hand elsewhere.
- Two font families is a performance budget. Five weights across three families is not.
- Set `font-synthesis: none` if you want to catch missing weights rather than have the browser fake them badly.

---

## 6. Common failures and their fixes

| Symptom | Cause | Fix |
|---|---|---|
| Headline wraps to 6 lines | Container too narrow for the size | Widen container, cap at 20–40ch, `text-wrap: balance` |
| Page feels flat | Scale ratio too small | Move to 1.25+, and make the display level much bigger |
| Text hard to read | Measure too long, leading too tight | 65ch, leading 1.55 |
| Headings look cramped | Default leading of 1.5 at large size | Drop heading leading to 1.05–1.15 |
| Numbers jitter in a table | Proportional figures | `tabular-nums` |
| All-caps label looks jammed | No tracking | `+0.08em` and up |
| Layout jumps on load | Unmatched fallback metrics | `size-adjust` + overrides, or `font-display: optional` |
| Looks generic despite good structure | Single default sans, no display face | Add one distinct display face |
| Text over an image is unreadable | No scrim | Gradient scrim, or a text-protection blur layer, never just a text-shadow |
