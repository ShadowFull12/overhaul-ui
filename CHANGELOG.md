# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-07-26

Initial release.

### Skill
- `SKILL.md` router with a 28-entry command table, a 12-rule hard floor, and a
  40-point pre-delivery gate
- 28 command workflows: assess (`audit`, `critique`, `slop`, `motion-audit`, `review`,
  `doctor`, `learn`), build (`init`, `shape`, `components`, `states`, `animate`,
  `visualize`, `tokens`), change (`overhaul`, `polish`, `typeset`, `colorize`, `layout`,
  `responsive`, `distill`, `bolder`, `quieter`, `copy`, `harden`, `optimize`, `inspire`,
  `handoff`)
- 17 reference chapters covering philosophy, anti-slop, direction, typography, colour,
  layout, responsive, motion, interaction states, components, accessibility (WCAG 2.2 AA),
  performance (LCP/INP/CLS), design tokens, copywriting, data visualization, stacks and
  libraries
- 8 surface playbooks: landing page, SaaS dashboard, portfolio, e-commerce, docs site,
  mobile app, auth and forms, AI chat app
- 5 templates: `tokens.css`, `motion.css`, `DESIGN.md`, `AUDIT.md`, `HANDOFF.md`
- Delegation map to 19 companion skills, with full attribution in `CREDITS.md`

### Tooling
- `slop-scan` — 35 rules for AI-slop tells and craft defects across colour, motion,
  layout, accessibility, content, copy and performance
- `motion-lint` — motion anti-patterns, with an explicit list of what static analysis
  cannot see
- `a11y-lint` — static accessibility checks mapped to WCAG 2.2 success criteria
- `contrast` — WCAG 2.x ratios, full token-file matrices, and nearest-passing-colour
  suggestions; composites translucent foregrounds before measuring
- `palette` — perceptually even OKLCH ramps plus tinted neutral ramps
- `scale` — modular type scales and 4px spacing, with zoom-safe fluid `clamp()` output
- `tokens` — a complete three-tier token file from one brand colour, in CSS, Tailwind v4
  `@theme`, JSON or React Native TS
- `report` — runs everything into one prioritised markdown report with a suggested
  command order

### CLI
- `install` / `uninstall` / `list` across 12 agent skill directories, with a
  three-directory default that covers roughly 13 agents
- `--project` scope additionally writes Cursor `.mdc`, Copilot `.instructions.md`,
  Windsurf rules and an `AGENTS.md` section
- `doctor` — runtime, payload integrity, frontmatter validity, install locations,
  companion skills, stack detection, and an honest report of what can actually be
  verified in the current environment
- `verify` — payload integrity, link resolution, rule compilation, script syntax
- `commands`, `skill`, `credits` inspection commands

### Notes
- Zero runtime dependencies. Node >= 18.
- Frontend only by design.
