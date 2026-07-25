# learn — explain a design concept

**Route here when:** "explain X", "why is Y bad?", "what's the difference between…",
"teach me about spring animations", "what does `ease-out` actually do?".

**Read-only.** Teach; do not silently start editing.

---

## Procedure

### 1. Answer first
Lead with the answer in one or two sentences. Then explain. Do not build up to it.

### 2. Explain the mechanism
Why it is true, not just that it is. "`ease-in` feels sluggish" is a claim;
"`ease-in` starts slow, so movement is smallest at exactly the moment the user is
watching most closely — the first 60ms after their click" is a mechanism. Mechanisms
transfer to new situations; claims do not.

### 3. Show it
A minimal code example, or a before/after pair. Concrete numbers.

### 4. Give the boundary
When does the rule not apply? Every design rule has exceptions, and knowing them is
the difference between following rules and having judgment.

```
Rule:      popovers scale from their trigger, not their centre
Exception: modals — they are not anchored to anything, so centre is correct
```

### 5. Point at the depth
Name the reference file in this skill, and the external source if there is a good one.
Link, do not paraphrase at length.

### 6. Do not over-explain
Answer the question asked. If the user asks what `text-wrap: balance` does, they do not
need a typography lecture. Offer the adjacent thing in one line: "the related fix is
usually widening the container — say the word if that is the actual problem."

---

## Format

```md
**Short answer.** <One or two sentences.>

**Why.** <The mechanism. 2–5 sentences.>

**In code.**
```css
/* before */
.menu { transition: all 300ms ease-in; }
/* after */
.menu { transition: opacity 180ms var(--ease-out), transform 180ms var(--ease-out); }
```

**When it doesn't apply.** <The exception.>

**Deeper.** `reference/motion.md` §2 · [emilkowal.ski/ui](https://emilkowal.ski/ui)
```

---

## Common questions this handles

| Question | Reference |
|---|---|
| Why does my UI look AI-generated? | `reference/anti-slop.md` |
| What is OKLCH and why not HSL? | `reference/color.md` §1 |
| How do I pick fonts? | `reference/typography.md` §2 |
| What's a modular scale? | `reference/typography.md` §1 |
| Why is `ease-in` wrong? | `reference/motion.md` §2 |
| Springs vs duration-based animation? | `reference/motion.md` §4 |
| Why do my animations drop frames? | `reference/motion.md` §7 |
| What are the WCAG 2.2 additions? | `reference/accessibility.md` §1 |
| Container queries vs media queries? | `reference/responsive.md` §1 |
| How should design tokens be structured? | `reference/design-tokens.md` §1 |
| What is INP and how do I fix it? | `reference/performance.md` §3 |
| Which chart should I use? | `reference/data-viz.md` §1 |
| Why does my dark mode look flat? | `reference/color.md` §4 |
| Skeleton or spinner? | `reference/interaction-states.md` §2 |
| Why does my layout shift? | `reference/performance.md` §4 |
| What's the name of that animation effect? | Defer to `animation-vocabulary` if installed |

---

## Gate

- [ ] Answer stated in the first two sentences
- [ ] Mechanism explained, not just the rule
- [ ] Concrete example with real values
- [ ] Exception stated
- [ ] Pointer to the deeper reference
- [ ] Proportional to the question — no lecture where a sentence will do
- [ ] No files modified

## See also
All of `reference/`. `commands/critique.md` when the user actually wants a judgment
rather than an explanation.
