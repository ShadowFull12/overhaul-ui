<div align="center">

<img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/S3_2.png" alt="overhaul-ui" width="640">

**The design department your AI agent never had.**

Not one more design opinion to install — the skill that knows the good ones already
out there, routes to the right specialist at the right moment, and covers everything
none of them ship with the same rigor: WCAG 2.2, Core Web Vitals, OKLCH colour math,
and 35 measured AI-slop detection rules. 28 commands. 17 disciplines. 13 agents. One
install.

[![npm version](https://img.shields.io/npm/v/overhaul-ui?style=flat-square&color=2C6E49&label=npm)](https://www.npmjs.com/package/overhaul-ui)
[![downloads](https://img.shields.io/npm/dm/overhaul-ui?style=flat-square&color=2C6E49)](https://www.npmjs.com/package/overhaul-ui)
[![license](https://img.shields.io/badge/license-MIT-2C6E49?style=flat-square)](./LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A518-2C6E49?style=flat-square)](https://nodejs.org)
[![ci](https://img.shields.io/github/actions/workflow/status/ShadowFull12/overhaul-ui/ci.yml?style=flat-square&label=ci)](https://github.com/ShadowFull12/overhaul-ui/actions/workflows/ci.yml)
[![agent skills](https://img.shields.io/badge/format-Agent%20Skills-1f2937?style=flat-square)](https://agentskills.io/specification)
[![dependencies](https://img.shields.io/badge/dependencies-0-1f2937?style=flat-square)](./package.json)
[![install size](https://img.shields.io/badge/unpacked-546%20kB-1f2937?style=flat-square)](https://www.npmjs.com/package/overhaul-ui?activeTab=code)

[![Claude Code](https://img.shields.io/badge/Claude%20Code-supported-1f2937?style=flat-square)](#compatibility)
[![Cursor](https://img.shields.io/badge/Cursor-supported-1f2937?style=flat-square)](#compatibility)
[![Kiro](https://img.shields.io/badge/Kiro-supported-1f2937?style=flat-square)](#compatibility)
[![Codex](https://img.shields.io/badge/Codex-supported-1f2937?style=flat-square)](#compatibility)
[![Copilot](https://img.shields.io/badge/Copilot-supported-1f2937?style=flat-square)](#compatibility)
[![+8 more](https://img.shields.io/badge/%2B8%20more-1f2937?style=flat-square)](#compatibility)

```bash
npx overhaul-ui install
```

<sub>28 commands · 17 reference chapters · 8 playbooks · 7 analysis scripts · 13 agents · zero dependencies</sub>

[See it work](#see-it-work) · [Why](#why-one-skill-instead-of-five) · [Install](#install) · [Use](#use) · [Commands](#the-28-commands) · [CLI](#cli-tools) · [Compatibility](#compatibility) · [Credits](#credits)

</div>

---

## See it work

Two real rebuilds. Same content, same stack, same developer — the difference is the
skill running the design decisions.

<div align="center">

<img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/derived/cardix-before-after-loop.webp" alt="Cardix — before and after, side by side" width="900">

<sub><b>Cardix</b> — left: before. right: after, rebuilt with overhaul-ui.
<a href="https://github.com/ShadowFull12/overhaul-ui/blob/main/assets/derived/cardix-before-after.mp4">Full 53-second walkthrough →</a></sub>

</div>

<table>
<tr>
<th align="center" width="50%">Before</th>
<th align="center" width="50%">After</th>
</tr>
<tr>
<td><img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/derived/cardix-before-photo.png" alt="Cardix before"></td>
<td><img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/derived/cardix-after-photo.png" alt="Cardix after"></td>
</tr>
<tr>
<td colspan="2" align="center"><sub><b>Cardix</b> — untinted greys and default spacing → one tinted OKLCH ramp, real type hierarchy, designed empty states</sub></td>
</tr>
<tr>
<td><img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/derived/portfolio-before-image.png" alt="Portfolio before"></td>
<td><img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/derived/portfolio-after-image.png" alt="Portfolio after"></td>
</tr>
<tr>
<td colspan="2" align="center"><sub><b>Portfolio</b> — the template look → a named direction, committed to end-to-end</sub></td>
</tr>
</table>

> Every rebuild above passes the same gate: `:focus-visible` on every control, body text
> at 4.5:1 in both themes, named transition properties, no `ease-in` enters,
> `prefers-reduced-motion` handled, and all four async states designed. Not eyeballed —
> measured by the [scripts](#cli-tools) that ship with the skill.

---

## Why one skill instead of five

The Agent Skills ecosystem already has excellent frontend-design specialists: deep
animation philosophy, sharp anti-slop taste, searchable colour and font databases,
ambitious end-to-end design direction. Installing several of them is the right
instinct — and it creates a new problem. They don't know about each other. Two of
them will happily give your agent contradictory advice in the same session, and none
of them ship the offline tooling to verify any of it.

**overhaul-ui is the layer above that.** It detects what's already installed on your
machine and routes to the specialist that's actually best at the task in front of it —
see [Plays well with other skills](#plays-well-with-other-skills). It only steps in
directly for the parts of frontend work that need rigor rather than taste: WCAG 2.2
line items, Core Web Vitals budgets, OKLCH colour math, 35 codified slop-detection
rules, motion anti-pattern linting. One install. One consistent hard floor across
every agent you use. Nothing to reconcile.

<div align="center">
<img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/S3_5.png" alt="One skill routing to seventeen design disciplines" width="820">
<br><sub>One entry point. Seventeen disciplines. Routed per request, never all loaded at once.</sub>
</div>

### The problem it starts from

A model predicts the most probable next token. Applied to design, "most probable"
means the average of everything it has seen: Inter at three sizes, a purple-to-blue
gradient, three centred feature cards, `transition: all 300ms ease-in-out`, and no
empty state.

That is not a prompting failure. It is what an underspecified brief produces by
default, and it is why so much AI-built UI is simultaneously correct and
forgettable.

<table>
<tr><th align="left">Without</th><th align="left">With</th></tr>
<tr valign="top"><td>

- Inter everywhere, ratio 1.15
- Nine unrelated greys, `#888` body text
- Purple→blue hero gradient
- `transition: all 300ms ease-in-out`
- Command palette animates open
- Happy path only
- `outline: none`
- "Unlock the power of seamless…"

</td><td>

- Named direction, real scale contrast
- One tinted OKLCH ramp, one accent
- Gradients only where they mean something
- `transform 180ms var(--ease-out)`
- Frequent interactions don't animate at all
- Loading, empty, error, success designed
- Visible `:focus-visible`, verified 3:1
- Copy that would be false for a competitor

</td></tr>
</table>

---

## Install

```bash
# recommended — three directories, covers ~13 agents
npx overhaul-ui install

# every known agent directory
npx overhaul-ui install --all

# a specific set
npx overhaul-ui install --target=claude,cursor,kiro

# into this repo only, plus rule/pointer files for tools that use them
npx overhaul-ui install --project
```

Then **restart your agent** and check it landed:

```bash
npx overhaul-ui doctor
```

<details>
<summary><b>Other install methods</b></summary>

**Global CLI**
```bash
npm i -g overhaul-ui && overhaul-ui install
```

**pnpm / yarn / bun**
```bash
pnpm dlx overhaul-ui install
yarn dlx overhaul-ui install
bunx overhaul-ui install
```

**Manual** — clone and copy the payload:
```bash
git clone https://github.com/ShadowFull12/overhaul-ui
cp -r overhaul-ui/skills/overhaul-ui ~/.agents/skills/
```

**Pin a version** — the skill payload is content, so pinning keeps behaviour stable:
```bash
npx overhaul-ui@1.0.0 install
```

**Claude Code plugin marketplace**
```
/plugin marketplace add ShadowFull12/overhaul-ui
/plugin install overhaul-ui
```

**Uninstall**
```bash
npx overhaul-ui uninstall          # or --project
```
</details>

---

## Use

Talk to your agent normally. The skill activates on UI work and routes itself.

```
"this landing page looks AI-generated, fix it"      → slop
"redesign the dashboard"                            → overhaul
"audit this page"                                   → audit
"the animations feel janky"                          → motion-audit
"add dark mode"                                      → colorize
"make it accessible"                                 → harden
"build a pricing page"                               → shape
"is this design any good?"                           → critique
```

Or name a command explicitly: `/overhaul-ui:audit`, `oh audit`, `use overhaul-ui to polish this`.

### What it does before it touches anything

1. **Reads the stack** — framework, styling, Tailwind v3 vs v4, existing tokens, component library
2. **Routes** the request to one of 28 workflows
3. **Loads only** the reference chapters that workflow needs
4. **Runs the scripts** instead of guessing at contrast, slop and motion defects
5. **Gates** the result against a 40-point pre-delivery checklist
6. **Reports honestly** — what was verified, and what was not

---

## The hard floor

<img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/S3_6B.png" alt="Focus ring with consistent offset" width="150" align="right">

Twelve rules that apply to every deliverable. Violating one is a defect, not a style
preference.

| | |
|---|---|
| Visible `:focus-visible` at ≥3:1 on every control | Body text ≥4.5:1 in **both** themes |
| Touch targets ≥44×44px | Keyboard reach and order match visual order |
| `prefers-reduced-motion` handled, not deleted | Transitions name their properties — never `all` |
| No `ease-in` enters, nothing over 300ms for UI | All four async states, not just the happy path |
| No layout shift from hover, focus or load | Tinted neutrals — no `#000`/`#fff`/`#888` |
| Images have dimensions and alt text | No emoji as structural icons |

---

## The 28 commands

<table>
<tr valign="top"><td width="33%">

**Assess**
`audit` · full defect list
`critique` · design judgment
`slop` · de-slop the aesthetic
`motion-audit` · review motion
`review` · pre-delivery gate
`doctor` · environment check
`learn` · explain a concept

</td><td width="33%">

**Build**
`init` · set up the system
`shape` · new interface
`components` · one component
`states` · loading/empty/error
`animate` · add motion
`visualize` · charts, dashboards
`tokens` · token architecture

</td><td width="33%">

**Change**
`overhaul` · redesign in place
`polish` · micro-detail pass
`typeset` · typography
`colorize` · colour, dark mode
`layout` · spacing, composition
`responsive` · sizes and inputs
`distill` · remove clutter
`bolder` / `quieter` · dial it
`copy` · rewrite the text
`harden` · WCAG 2.2 AA
`optimize` · Core Web Vitals
`inspire` · find a direction
`handoff` · write it up

</td></tr>
</table>

```bash
npx overhaul-ui commands     # list them with descriptions
```

### 17 reference chapters

`philosophy` · `anti-slop` · `direction` (18 named looks) · `typography` (18 pairings) ·
`color` (OKLCH, dark mode) · `layout` · `responsive` · `motion` · `interaction-states` ·
`components` · `accessibility` (WCAG 2.2) · `performance` (LCP/INP/CLS) · `design-tokens` ·
`copywriting` · `data-viz` (25 chart types) · `stacks` · `libraries`

### 8 playbooks

`landing-page` · `saas-dashboard` · `portfolio` · `ecommerce` · `docs-site` ·
`mobile-app` · `auth-and-forms` · `ai-chat-app`

### 5 templates

`tokens.css` · `motion.css` · `DESIGN.md` · `AUDIT.md` · `HANDOFF.md`

---

## CLI tools

Most design skills are prose and opinion. These seven zero-dependency Node scripts
*compute* things instead — real OKLCH colour math, real WCAG contrast ratios, real
pattern matching against 35 codified slop rules. The agent runs them before it tells
you something is fine; so can you. All support `--json`.

```bash
# AI-slop and craft defects — 35 rules across colour, motion, layout, a11y, copy
npx overhaul-ui scan src/

# motion anti-patterns: transition:all, ease-in enters, scale(0), layout animation
npx overhaul-ui motion src/

# static accessibility defects, mapped to WCAG 2.2 success criteria
npx overhaul-ui a11y src/

# everything, into one prioritised markdown report
npx overhaul-ui report . --out=report.md

# WCAG contrast — a pair, or a whole token file
npx overhaul-ui contrast "#4B5563" "#FFFFFF"
npx overhaul-ui contrast --matrix src/styles/tokens.css

# generate a perceptually even OKLCH ramp + tinted neutrals
npx overhaul-ui palette "#2C6E49" --neutrals --css
#   → 13 tinted neutral steps + 11 accent steps, contrast-checked against both themes

# modular type scale + spacing, with fluid clamp() output
npx overhaul-ui scale --base=16 --ratio=1.333 --fluid --css

# a complete token file from one brand colour
npx overhaul-ui tokens --brand="#2C6E49" --out=src/styles/tokens.css
```

<details>
<summary><b>Sample output</b></summary>

```
overhaul-ui slop-scan  128 files · src

src/components/Hero.tsx
  error   14  Purple-to-blue gradient - the most recognisable AI-design signature
              className="bg-gradient-to-r from-violet-500 to-blue-600 …"
              → One flat brand colour. If depth is needed, vary lightness within one hue.
  error   31  transition: all animates properties you never intended
   warn   47  UI transition >= 500ms - the whole interface feels heavy

src/styles/global.css
  error    8  Focus outline removed with no visible replacement (SC 2.4.7)
              → :focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }

slop-scan: 4 error · 11 warn · 6 info
by category: colour 7 · motion 6 · accessibility 4 · copy 3 · layout 1
```
</details>

<div align="center">
<img src="https://raw.githubusercontent.com/ShadowFull12/overhaul-ui/main/assets/S3_6A.png" alt="Perceptually even OKLCH lightness ramp" width="760">
<br><sub>Ramps are generated in OKLCH, so equal lightness steps actually <i>look</i> equal.
Every HSL-generated palette has a muddy middle — this is the fix, and it's real math, not a preset.</sub>
</div>

---

## Compatibility

Configure your design system once. Every agent you use inherits it.

Installs as a spec-compliant [Agent Skill](https://agentskills.io/specification), so it
works anywhere the format is read. The default install writes three directories that
between them cover nearly everything.

| Agent | Global path | Default install |
|---|---|:-:|
| **Codex, Cursor, Zed, Copilot, OpenCode, Roo, Gemini CLI, Amp, Devin** | `~/.agents/skills/` | ✅ |
| **Claude Code** | `~/.claude/skills/` | ✅ |
| **Kiro** | `~/.kiro/skills/` | ✅ |
| Cursor (native) | `~/.cursor/skills/` | `--all` |
| Gemini CLI (native) | `~/.gemini/skills/` | `--all` |
| Antigravity | `~/.gemini/config/skills/` | `--all` |
| Windsurf / Devin Desktop | `~/.codeium/windsurf/skills/` | `--all` |
| Cline | `~/.cline/skills/` | `--all` |
| Roo Code | `~/.roo/skills/` | `--all` |
| OpenCode | `~/.config/opencode/skills/` | `--all` |
| Amp | `~/.config/agents/skills/` | `--all` |
| GitHub Copilot | `~/.copilot/skills/` | `--all` |

`--project` additionally writes `.cursor/rules/overhaul-ui.mdc`,
`.github/instructions/overhaul-ui.instructions.md`, `.windsurf/rules/overhaul-ui.md`
and an `AGENTS.md` section, for tools that read a single instruction file.

```bash
npx overhaul-ui list     # see all targets and what is already installed
```

### Works with these stacks

React · Next.js · Vue · Nuxt · Svelte · SvelteKit · Astro · Remix · React Native ·
Expo · Tailwind v3 and v4 · CSS Modules · vanilla CSS · Vanilla Extract · Panda ·
styled-components · Radix · Base UI · shadcn/ui · React Aria · MUI · Mantine · Chakra

---

## Plays well with other skills

This is the part most design skills don't do, and it's deliberate: only a tool
confident in its own lane routes work *away* from itself instead of fighting for it.

overhaul-ui is a compilation *and* a router. It carries its own knowledge for all 17
disciplines so it works completely standalone, and **detects and defers to specialists
when they're installed** rather than duplicating or contradicting them:

| Installed | It defers for |
|---|---|
| [`impeccable`](https://github.com/pbakaus/impeccable) | Ambitious end-to-end direction, live browser iteration |
| [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill) | Landing pages and portfolios that must not read as templated |
| [`ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Searchable palette / font / style databases |
| [`emil-design-eng`](https://github.com/emilkowalski/skills), `apple-design` | Deep component and animation craft |
| `review-animations`, `improve-animations`, `find-animation-opportunities` | Dedicated motion review and planning |
| `pick-ui-library`, `animation-vocabulary` | Library choice, naming a motion effect |
| `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui` | Committing hard to one named look |
| `imagegen-frontend-*`, `image-to-code`, `brandkit` | Reference comps before code |

```bash
npx overhaul-ui doctor     # shows which companions are available
```

---

## Credits

This skill is an original synthesis. It ships **no copied source text** from any
third-party skill. Where its guidance is informed by or converges with prior work, that
work is credited with its source and licence in **[CREDITS.md](./CREDITS.md)**.

The largest debts, named plainly:

- **[Emil Kowalski](https://emilkowal.ski)** — the motion chapter's whole framework: the frequency test, no `ease-in` on enters, never `scale(0)`, exits faster than enters, origin at the trigger, transitions over keyframes. Author of [Sonner](https://github.com/emilkowalski/sonner), [Vaul](https://github.com/emilkowalski/vaul) and [animations.dev](https://animations.dev). Go there for the depth.
- **[Paul Bakaus](https://github.com/pbakaus/impeccable)** (`impeccable`) and **Anthropic** (`frontend-design`) — the router-plus-commands architecture and audit-first posture.
- **[Leon Lin](https://github.com/Leonxlnx/taste-skill)** (`taste-skill`) — the anti-slop catalogue converges with this work.
- **Apple** — WWDC 2018 session 803, *Designing Fluid Interfaces*, for the velocity and interruptibility model.
- **[Björn Ottosson](https://bottosson.github.io/posts/oklab/)** — the OKLab/OKLCH maths in `scripts/lib/color.mjs`.
- **W3C WAI**, **Google Chrome**, **NN/g**, **Refactoring UI**, **Rauno Freiberg**, **Josh Comeau** — the standards and writing the reference chapters lean on.

```bash
npx overhaul-ui credits
```

---

## Contributing

Issues and PRs welcome. Useful contributions:

- New rules for `skills/overhaul-ui/data/slop-rules.json` (with a real-world example)
- New playbooks for surface types not covered
- Stack notes for frameworks not yet in `reference/stacks.md`
- False positives from the scanners — these are the most valuable reports

```bash
git clone https://github.com/ShadowFull12/overhaul-ui
cd overhaul-ui
node bin/overhaul-ui.mjs verify      # payload integrity, link resolution, rule compilation
node bin/overhaul-ui.mjs scan .      # dogfood it
node bin/overhaul-ui.mjs doctor      # environment and install state
```

CI runs `verify`, asserts the contrast maths still returns exactly 21:1 for black on
white, and exercises every generator and installer on Node 18/20/22 across Linux,
Windows and macOS.

### Releasing

Publishing goes through [npm trusted publishing](https://docs.npmjs.com/trusted-publishers)
(GitHub OIDC) — no `NPM_TOKEN` is stored anywhere.

```bash
npm version patch|minor|major
git push --follow-tags
```

The `v*` tag triggers `.github/workflows/release.yml`, which checks the tag matches
`package.json`, runs `verify`, then publishes.

---

<div align="center">

**MIT** © [shadowfull12](https://github.com/ShadowFull12)

<sub>Frontend only. If it's backend, infra or data, this skill says so and gets out of the way.</sub>

</div>
