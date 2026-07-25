# critique — design judgment, not a defect list

**Route here when:** "critique this", "what do you think of this design?", "is this
good?", "roast my UI".

**Read-only.** Different from `audit`: `audit` produces a defect list with locations,
`critique` produces a *judgment* about whether the design is any good.

---

## Posture

You are a design director reviewing a portfolio piece. Be specific, be honest, and be
useful. Two failure modes to avoid:

- **Flattery.** "This looks great! A few small suggestions…" is worthless. If the design
  is generic, say it is generic and say why.
- **Nitpicking.** Twenty small findings while the fundamental problem goes unnamed. Lead
  with the fundamental problem.

Praise is allowed and should be specific. "The empty state is genuinely good — it names
what belongs there and offers two ways to start" is useful. "Nice work" is not.

---

## Procedure

### 1. First impression, unfiltered
What is the very first thing you notice? What does it feel like? What does it remind you
of? If it reminds you of "every AI landing page", that is the headline finding.

### 2. Answer the three questions the user will ask
- **What is this?** Is the product's purpose clear in under three seconds?
- **What matters most?** Is there one focal point, or does everything compete?
- **What do I do?** Is the primary action unmistakable?

If any answer is no, that is the critique. Everything else is secondary.

### 3. Name the direction, or its absence
Can you describe the design direction in one sentence? If the honest answer is "default
modern SaaS", say so — that is the most important thing you can tell them.

### 4. Assess craft
Hierarchy contrast · type quality and measure · colour discipline · spacing rhythm and
alignment · state coverage · motion judgment · copy specificity.

For each, one sentence. Not a checklist — a judgment.

### 5. Compare
Would this be interchangeable with two competitors' sites? Name specific reference points
it falls short of or matches ("the density is Linear-adjacent but the type contrast is
not").

### 6. Say what you would do
Three moves, ranked. Not thirty. The three that would most change the outcome.

### 7. Say what is working
Genuinely. Specific. If nothing is, say that too.

---

## Output

Prose, not a table. This is the one command where a checklist is the wrong format.

```
## First impression
Reads as a well-built default. Clean, competent, and interchangeable with a dozen
other developer-tool landing pages — the purple-to-blue hero gradient, Inter at
three sizes, and three centred feature cards are doing most of the talking.

## The three questions
What is this? — Not clear in three seconds. The h1 ("Ship faster with confidence")
would fit any of a hundred products.
What matters most? — Nothing. The hero, the logo wall and the feature grid have
roughly equal visual weight.
What do I do? — Ambiguous. Four CTAs, three of them "Get Started".

## Direction
There isn't one. That is the core finding, and it is upstream of every other issue
here — fixing the spacing on a design with no point of view produces a
better-spaced design with no point of view.

## Craft
Hierarchy — the type scale is ~1.15, so nothing dominates. This is the single
highest-leverage fix.
Type — Inter everywhere at 400/600. Competent, anonymous. Measure runs to ~100ch
in the feature copy.
Colour — nine unrelated greys and the default gradient. One tinted ramp and one
flat brand colour would change the whole read.
Space — uniform 24px between everything, so nothing groups.
States — the invoice table has no empty state and no error state. This is the
biggest gap between this and a shipped product.
Motion — every section fades up on scroll, including above the fold. Delete it.
Copy — "seamless", "powerful", "effortless". Nothing that could be false.

## Comparison
Density is close to Linear's, but Linear earns its quiet with much sharper type
contrast and a genuinely tinted neutral ramp. Here the quiet reads as unfinished
rather than restrained.

## Three moves
1. Choose a direction and commit — one sentence, then re-derive type and colour from it
2. Push the type scale to 1.333 and make the hero a real display moment
3. Build the missing table states — the fastest route from "demo" to "product"

## Working
The form validation is good: inline, on blur, with error text that says what to fix.
The keyboard focus rings are present and visible, which is rarer than it should be.
```

---

## Gate

- [ ] Leads with the fundamental issue, not a list of small ones
- [ ] Names the direction or its absence explicitly
- [ ] Exactly three ranked moves
- [ ] Specific praise where earned
- [ ] Honest — no softening a generic design into "a few tweaks"
- [ ] No source modified

## See also
`commands/audit.md` (defects with locations), `reference/philosophy.md`,
`reference/anti-slop.md`
