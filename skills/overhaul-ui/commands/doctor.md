# doctor — check the environment and the setup

**Route here when:** "is this set up right?", "what's installed?", the scripts fail, or
before a first `init` in an unfamiliar environment.

**Read-only.**

---

## Procedure

### 1. Runtime
```bash
node --version      # >= 18 required for the scripts
```
If Node is missing or older than 18, the scripts will not run. Everything else in the
skill still works — the reference material and commands are just markdown. Say which
capabilities are unavailable rather than failing silently.

### 2. Skill installation
```bash
npx overhaul-ui doctor
```
Reports which agent directories the skill is installed into, whether the `SKILL.md`
frontmatter is valid, and which files are missing.

Manually: confirm `commands/`, `reference/`, `playbooks/`, `templates/`, `scripts/` and
`data/` all resolve relative to `SKILL.md`. If reference files are missing, the install
was partial — reinstall rather than working around it.

### 3. Project stack
Read and report:
- Framework and version
- Styling approach, and Tailwind version if present (v3 config vs v4 `@theme`)
- Component library
- Icon set
- Existing token file or theme provider
- Build, typecheck, test and lint commands
- Whether a design system is recorded (`design-system/DESIGN.md`)

### 4. Companion skills
List which of these are available, since the routing in `SKILL.md` §5 depends on it:
`impeccable` · `design-taste-frontend` · `ui-ux-pro-max` · `emil-design-eng` ·
`apple-design` · `review-animations` · `improve-animations` ·
`find-animation-opportunities` · `animation-vocabulary` · `pick-ui-library` ·
`high-end-visual-design` · `minimalist-ui` · `industrial-brutalist-ui` ·
`redesign-existing-projects` · `imagegen-frontend-web` · `imagegen-frontend-mobile` ·
`image-to-code` · `brandkit` · `full-output-enforcement`

### 5. Tooling availability
Check what verification you will actually be able to do:
- `npx lighthouse` / `unlighthouse` — performance measurement
- `@axe-core/cli` or axe DevTools — accessibility
- A dev server that can be started, or only a build
- Screenshot or browser access — visual verification
- Playwright / Storybook — visual regression

This determines what you can honestly claim in `commands/review.md`. If you cannot start
a browser, you cannot claim a keyboard pass.

### 6. Self-test the scripts
```bash
node scripts/contrast.mjs "#000000" "#FFFFFF"     # expect 21:1
node scripts/scale.mjs --base=16 --ratio=1.25 --steps=5
node scripts/palette.mjs "#2C6E49" --steps=5
node scripts/slop-scan.mjs . --json | head
```

---

## Output

```
overhaul-ui 1.0.0

Runtime
  node    v22.14.0  ok
  scripts 7/7 executable

Installed
  ~/.agents/skills/overhaul-ui         ok  (Codex, Cursor, Zed, Copilot, OpenCode, Roo, Amp)
  ~/.claude/skills/overhaul-ui         ok
  ~/.kiro/skills/overhaul-ui           ok
  frontmatter                          valid (name matches folder, description 1,180 chars)
  files                                67/67 present

Project
  framework   Next.js 15.2 (App Router)
  styling     Tailwind v4 (CSS-first @theme)
  components  shadcn/ui over Radix
  icons       lucide-react
  tokens      src/app/globals.css (@theme, 41 entries)
  design sys  design-system/DESIGN.md  present
  commands    build: next build · test: vitest run · lint: eslint .

Companion skills available
  emil-design-eng, apple-design, pick-ui-library, review-animations
  not installed: impeccable, ui-ux-pro-max, design-taste-frontend

Verification available
  build yes · typecheck yes · tests yes · lighthouse yes (npx)
  axe no (not installed — `npm i -D @axe-core/cli`)
  browser/screenshots no — cannot claim visual or keyboard verification

Notes
  1. Tailwind v4 — use @theme, not tailwind.config.js
  2. Without browser access, review gate items 4–6 are self-reported from code only
```

---

## Gate

- [ ] Runtime version reported
- [ ] Install locations and file completeness reported
- [ ] Stack detected, including the Tailwind version if applicable
- [ ] Companion skills listed
- [ ] **Verification capabilities honestly reported** — this is the point of the command
- [ ] Scripts self-tested

## See also
`commands/init.md`, `commands/review.md`
