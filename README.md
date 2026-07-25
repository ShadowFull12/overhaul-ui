<div align="center">

# overhaul-ui

**A frontend design skill for AI coding agents.**

Your agent can already write correct UI code. This gives it taste, judgment, and the
checks to prove the work holds up.

[![npm version](https://img.shields.io/npm/v/overhaul-ui?style=flat-square&color=2C6E49&label=npm)](https://www.npmjs.com/package/overhaul-ui)
[![license](https://img.shields.io/badge/license-MIT-2C6E49?style=flat-square)](./LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A518-2C6E49?style=flat-square)](https://nodejs.org)
[![agent skills](https://img.shields.io/badge/format-Agent%20Skills-1f2937?style=flat-square)](https://agentskills.io/specification)
[![dependencies](https://img.shields.io/badge/dependencies-0-1f2937?style=flat-square)](./package.json)

[![Claude Code](https://img.shields.io/badge/Claude%20Code-supported-1f2937?style=flat-square)](#compatibility)
[![Cursor](https://img.shields.io/badge/Cursor-supported-1f2937?style=flat-square)](#compatibility)
[![Kiro](https://img.shields.io/badge/Kiro-supported-1f2937?style=flat-square)](#compatibility)
[![Codex](https://img.shields.io/badge/Codex-supported-1f2937?style=flat-square)](#compatibility)
[![Copilot](https://img.shields.io/badge/Copilot-supported-1f2937?style=flat-square)](#compatibility)
[![+8 more](https://img.shields.io/badge/%2B8%20more-1f2937?style=flat-square)](#compatibility)

```bash
npx overhaul-ui install
```

[Why](#why) · [Install](#install) · [Use](#use) · [Commands](#the-28-commands) · [CLI](#cli-tools) · [Compatibility](#compatibility) · [Credits](#credits)

</div>

---

## Why

A model predicts the most probable next token. Applied to design, "most probable" means
the average of everything it has seen: Inter at three sizes, a purple-to-blue gradient,
three centred feature cards, `transition: all 300ms ease-in-out`, and no empty state.

That is not a prompting failure. It is what an underspecified brief produces by default,
and it is why so much AI-built UI is simultaneously correct and forgettable.

**overhaul-ui supplies the missing layer:** a design direction to commit to, the craft
rules that separate shipped products from demos, and scripts that measure the things
you should never eyeball.

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

Seven zero-dependency Node scripts. The agent runs them; so can you. All support `--json`.

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

---

## Compatibility

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

overhaul-ui is a compilation *and* a router. It carries its own knowledge so it works
alone, and **defers to specialists when they're installed** rather than duplicating them:

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
node bin/overhaul-ui.mjs verify      # integrity check
node bin/overhaul-ui.mjs scan .      # dogfood it
```

---

<div align="center">

**MIT** © [shadowfull12](https://github.com/ShadowFull12)

<sub>Frontend only. If it's backend, infra or data, this skill says so and gets out of the way.</sub>

</div>
