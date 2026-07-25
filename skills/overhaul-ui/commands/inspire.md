# inspire — find direction and references before building

**Route here when:** "what direction should this take?", "find references", "I don't
know what I want", "show me options".

**Read-only.** Produces direction options and named references, not code.

---

## Procedure

### 1. Extract the brief
Product type · audience · frequency of use · emotional target · credibility requirement ·
competitive context · brand constraints. Infer what is unstated and say so.

### 2. Propose three directions, not one
Three genuinely different options from `reference/direction.md`. Not three shades of the
same idea. For each:

```
Name:        <direction>
One line:    what it feels like
Why it fits: the specific brief attribute it serves
Mechanics:   type / colour / density / geometry / motion in one line each
Reference:   two or three named products or sites that do this well
Risk:        how this direction fails
```

Then recommend one, with the reason. Do not present three options and refuse to choose.

### 3. Name real references
Named references produce specific output; "modern and clean" produces averages. Reach for
products the user can actually look at:

| Register | Look at |
|---|---|
| Quiet product | Linear, Height, Raycast, Vercel dashboard |
| Technical dark | Railway, Neon, Grafana, Warp, Sentry |
| Editorial | Stripe Press, Readymag sites, Bloomberg Businessweek |
| Warm minimal | Notion marketing, Oura, Headspace |
| Data dense | Bloomberg Terminal, TradingView, Datadog |
| Brutalist | Balenciaga-era fashion sites, Bloomberg's older work, indie zines |
| Playful | Duolingo, Arc browser, Figma marketing |
| Luxury | Aesop, Hermès, Aman |
| Motion-led | rauno.me, emilkowal.ski, animations.dev, Family app |

Also useful: the [Web Interface Guidelines](https://interfaces.rauno.me) (Rauno
Freiberg), [Refactoring UI](https://refactoringui.com), [Laws of UX](https://lawsofux.com).

If web search is available, look for current work rather than relying on memory — design
references date fast. Cite what you find.

### 4. Be concrete about mechanics
"Editorial" is not actionable. "Instrument Serif at 96px with −0.03em tracking, 65ch
measure, cream ground at `oklch(0.98 0.008 88)`, no shadows, near-zero motion" is.

### 5. Optionally generate comps
If `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code` or `brandkit`
(Leon Lin) are installed, hand off to them to produce reference images before code. A
comp the user can react to beats three paragraphs of description.

### 6. Hand off
Once a direction is chosen, run `commands/init.md` to write it into
`design-system/DESIGN.md`, then `commands/shape.md` to build.

---

## Output

```
Brief (inferred where unstated)
  Product: developer-facing observability tool
  Audience: engineers, multiple times daily
  Emotional target: precise, calm, trustworthy
  Credibility: high — this tool is consulted during incidents
  Inferred: density matters more than delight; motion should be near-zero

Option A — Technical Dark  ★ recommended
  Feels like: a well-made instrument
  Fits: daily use, dense data, incident context
  Mechanics: near-black oklch(0.17 0.014 258) ground · JetBrains Mono for identifiers ·
             Inter 13px UI · one green accent · 1px grid lines, no cards · no motion
  Reference: Grafana, Railway, Sentry
  Risk: becomes the neon-cyberpunk cliché if saturation creeps up

Option B — Quiet Product
  […]

Option C — Data Dense
  […]

Recommendation: A. The incident context is the deciding factor — engineers reading
this at 3am need low glare and unambiguous status colour, which the dark ground and
single accent give you. B would work but wastes the opportunity to make status the
brightest thing on screen.

Next: commands/init.md to record it, then commands/shape.md to build.
```

---

## Gate

- [ ] Three genuinely different directions
- [ ] One recommendation with a stated reason
- [ ] Named, lookup-able references — not adjectives
- [ ] Concrete mechanics per option
- [ ] Each option's failure mode stated
- [ ] No code written

## See also
`reference/direction.md`, `commands/init.md`, `commands/shape.md`
