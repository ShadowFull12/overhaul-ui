# tokens — extract, generate or refactor design tokens

**Route here when:** "extract the design tokens", "set up CSS variables", "the theme
config is a mess", "make this themeable".

**Writes:** a token file plus every reference to it.

---

## Procedure

### 1. Extract what exists
Grep every colour, size, radius, shadow, duration and easing literal in the codebase.
Build a frequency table. The values used 20+ times are your real system; the one-offs
are drift.

Record the counts — "9 greys, 14 radii, 6 durations" is the finding that justifies the
work.

### 2. Decide the target set
Keep it small enough to hold in your head:

```
13 neutrals · 9–11 accent · 12 semantic roles · 4 status × 3
9 type sizes · 3 leadings · 2 trackings
13 spacing steps · 5 radii · 4 shadows
6 durations · 4 easings · 8 z-index · 3 containers
```

Generate rather than hand-pick:
```bash
node scripts/tokens.mjs --brand="#2C6E49" --format=css      # or tailwind | json
node scripts/palette.mjs "#2C6E49" --neutrals --css
node scripts/scale.mjs --base=16 --ratio=1.25 --fluid --css
```

### 3. Build the three tiers
`reference/design-tokens.md` §1.
1. **Primitive** — raw values, referenced only by tier 2
2. **Semantic** — roles (`--fg-muted`, `--bg-elevated`, `--accent-hover`)
3. **Component** — only where a component needs something semantics cannot express

**Components reference tier 2 or 3. Never tier 1.** This is the rule that makes theming
work at all.

### 4. Name by role
`--fg-muted`, not `--gray-600`. `--danger`, not `--red`. Never encode the theme in the
name (`--bg`, not `--bg-light`). Consistent scale direction within a category.

### 5. Migrate references
Replace literals with tokens, file by file. Then grep for stragglers — a codebase with
both `#111827` and `var(--fg)` has two systems, and the hardcoded one will win somewhere
you did not look.

### 6. Wire the stack
- **Tailwind v4:** `@theme { --color-…, --font-…, --text-…, --ease-… }` — generates variables *and* utilities
- **Tailwind v3:** point the config at `var(--…)` so runtime theming survives
- **CSS Modules / vanilla:** one `tokens.css` imported at the root
- **React Native:** a typed TS object + `useTheme()`; no CSS variables exist
- **Cross-platform:** DTCG JSON + Style Dictionary, but only if you genuinely ship multiple platforms

### 7. Themes
Override the semantic layer only. Light, dark, system. Set the attribute before first
paint. Verify contrast in both themes.

### 8. Verify
Build. Render. Confirm a theme switch changes everything it should and nothing it
should not. Delete unused tokens.

---

## Output

```
Extracted: 47 colours, 14 radii, 23 spacing values, 9 durations (before)
Tokens:    13 neutrals + 11 accent + 12 semantic + 12 status
           9 type · 13 space · 5 radius · 4 shadow · 6 duration · 4 ease · 8 z
Tiers:     primitive → semantic → component; 0 components touch primitives
Format:    design-system/tokens.css + @theme (Tailwind v4)
Migrated:  312 literal references across 58 files
Remaining: 0 hardcoded colours (verified by grep)
Themes:    light / dark / system, contrast verified both
Deleted:   19 unused tokens
Build: pass
```

---

## Gate

- [ ] Three tiers, and no component references a primitive
- [ ] Role-based names; no theme encoded in a name
- [ ] Zero hardcoded literals left (verify by grep, not by assumption)
- [ ] One source of truth — not a CSS file and a JS object that can diverge
- [ ] Themes override semantics only
- [ ] Contrast verified in both themes
- [ ] Unused tokens deleted
- [ ] Build passes

## See also
`reference/design-tokens.md`, `templates/tokens.css`, `commands/colorize.md`,
`commands/init.md`
