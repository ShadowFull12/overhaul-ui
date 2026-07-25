# init — establish the design system for a project

**Route here when:** first time working on a repo's UI, or the project has no recorded
design direction. Run once. Everything after this reads the artifacts it produces.

**Writes:** `design-system/DESIGN.md`, optionally `design-system/tokens.css` and
`design-system/pages/`.

---

## Procedure

### 1. Detect the stack
Read `package.json`, the lock file, framework config, and the CSS entry point.
Record: framework, styling approach, Tailwind version (v3 config vs v4 `@theme`),
component library, icon set, existing token file, test/build commands.
Details: `reference/stacks.md`.

### 2. Inventory what already exists
```bash
node scripts/slop-scan.mjs . --json
```
Then find by hand: font declarations, colour values in use, radius values, shadow
values, spacing values, existing CSS variables, and how many distinct greys are in
play. Count them. The count tells you whether a system exists or not.

### 3. Read the brief
Product type, audience, frequency of use, device mix, credibility requirement,
brand constraints. If any is unstated, infer from the code and content, and record
the inference so it can be corrected.

### 4. Choose a direction
`reference/direction.md`. One direction. Name it in a sentence.
If an existing product already has a coherent look, **name what is there** and extend
it — do not replace a working direction during `init`.

### 5. Decide the system
- **Type:** display face, text face, mono face, scale ratio, weights to load (`reference/typography.md`)
- **Colour:** neutral ramp hue, one accent, semantic roles, both themes (`reference/color.md`)
- **Geometry:** radius scale, border width, shadow set
- **Space:** base unit, scale, density tier, container widths (`reference/layout.md`)
- **Motion:** easing tokens, duration tiers, what never animates (`reference/motion.md`)

Generate rather than hand-pick:
```bash
node scripts/palette.mjs "<brand hex>" --css --neutrals
node scripts/scale.mjs --base=16 --ratio=1.25 --steps=9 --fluid --css
node scripts/tokens.mjs --brand="<brand hex>" --format=css   # or tailwind
```

### 6. Write `design-system/DESIGN.md`
Copy `templates/DESIGN.md` and fill every field. Empty fields defeat the purpose —
the file exists so the next session does not re-decide.

Include a **Rejections** section: three to five things this direction explicitly does
not do. Rejections prevent drift more effectively than the positive rules.

### 7. Wire the tokens in
Add the token file to the CSS entry point, or merge into `@theme` (v4) / the config
(v3) / the theme object (RN). Do not create a parallel system next to an existing one
— extend what is there.

### 8. Verify
Run the build. Render one representative page. Confirm nothing regressed visually.

---

## Output

```
Direction:  <name> — <one sentence>
Stack:      <framework> / <styling> / <component lib>
Type:       <display> + <text> (+ <mono>), ratio <n>
Colour:     neutrals oklch hue <h>, accent <hex>, both themes
Space:      <base>px base, density <tier>
Motion:     <n> tiers, <n> easings, no motion on <list>
Written:    design-system/DESIGN.md, design-system/tokens.css
Existing system: extended | replaced | none found
```

Then one short paragraph on what you found and what you decided. Not a checklist.

---

## Page overrides

For a surface that must deviate (a marketing page inside a product app), create
`design-system/pages/<page>.md` recording only the deltas. When building that page,
read `DESIGN.md` first, then the page file, and let the page file win.

---

## Gate

- [ ] `DESIGN.md` exists with no placeholder text
- [ ] Direction is nameable in one sentence
- [ ] Tokens compile and are actually referenced by at least one component
- [ ] Both themes defined and contrast-verified (`scripts/contrast.mjs`)
- [ ] Build passes

## See also
`reference/direction.md`, `reference/design-tokens.md`, `templates/DESIGN.md`,
`commands/tokens.md`
