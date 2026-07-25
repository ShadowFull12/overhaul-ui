# shape — build a new interface from a brief

**Route here when:** there is no existing code for the surface. "Build a landing page",
"create a settings screen", "I need a pricing page".

**Writes:** new files.

---

## Procedure

### 1. Infer the brief
Extract or infer, in one short block:
- **Surface type** — landing page, dashboard, form flow, list+detail, settings, marketing section
- **Audience and frequency** — first-time visitor or daily driver? This drives density and motion more than anything else
- **Primary action** — the one thing this screen exists to make happen
- **Tone** — from the product, the copy, and any existing brand
- **Constraints** — stack, existing system, brand assets, i18n, performance budget

State the inferences in one line each. Ask only if a wrong guess would waste real work.

### 2. Load the design system
If `design-system/DESIGN.md` exists, read it and follow it. Check
`design-system/pages/<page>.md` for overrides. If no system exists, run
`commands/init.md` first — do not invent a one-off system for one page.

### 3. Pick the playbook
`playbooks/landing-page.md` · `saas-dashboard.md` · `portfolio.md` · `ecommerce.md` ·
`docs-site.md` · `mobile-app.md` · `auth-and-forms.md` · `ai-chat-app.md`

The playbook gives you section order, content hierarchy and the known failure modes for
that surface type. Read it before structuring.

### 4. Structure before styling
Write the content and the hierarchy first — headings, real copy, real data shapes, in
document order. No styling. Then check:
- Does it read correctly as plain HTML with CSS off? That is your semantic and screen-reader baseline.
- Is there exactly one primary action?
- Does the heading outline make sense on its own?

### 5. Compose
Now lay it out. Rules that matter most here:
- Vary the section archetype (`reference/layout.md` §3). At least four distinct shapes.
- One focal point per view.
- Space by relationship, not uniformly.
- Uneven section rhythm.

### 6. Style
Tokens only. No arbitrary values. Type from the system, colour from the system,
radius/shadow/motion from the system. If you need a value the system does not have,
add it to the system rather than inlining it.

### 7. States before polish
Every async surface: loading, empty, error, success. Every control: hover,
focus-visible, active, disabled. Do this *before* animation — a beautifully animated
interface with no empty state is not finished.

### 8. Motion last, and sparingly
`reference/motion.md`. Ask the frequency question for every animation. Most new
screens need two or three animations total, or none.

### 9. Verify
Build. Render. Keyboard pass. 320/768/1440. Both themes. Reduced motion.
`commands/review.md`.

---

## Content rules

Never ship lorem ipsum, "John Doe", or `[Feature Name]`. Write real copy from
`reference/copywriting.md`. If you genuinely cannot know the content (a customer name,
a real metric), use a clearly-marked realistic placeholder and list it in the output as
something the user must supply.

Real content changes the design. A card sized around "Lorem ipsum dolor" will break
when the real title is 74 characters.

---

## Output

```
Surface:    <type>
Direction:  <name> (from DESIGN.md | chosen: <one sentence>)
Structure:  <section list, in order>
Primary action: <the one CTA>

Built: <files>
States: loading, empty, error implemented on <surfaces>
Motion: <n> animations, longest <n>ms, reduced-motion handled
Verified: build, keyboard, 320/768/1440, both themes
Needs from you: <real assets, copy, or data the user must supply>
```

---

## Gate

- [ ] Reads correctly with CSS disabled (semantic baseline)
- [ ] One primary action, one focal point
- [ ] Four or more distinct section archetypes (multi-section pages)
- [ ] All four async states present
- [ ] All five control states present
- [ ] Tokens only, no arbitrary values
- [ ] Real copy, no placeholders left unflagged
- [ ] `commands/review.md` passed

## See also
`playbooks/`, `commands/init.md`, `commands/states.md`, `commands/inspire.md`
