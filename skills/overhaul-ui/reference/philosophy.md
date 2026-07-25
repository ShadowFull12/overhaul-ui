# Philosophy — how to decide

The part that cannot be linted. Read this when you need to know *what* to make, not
*how* to code it.

---

## 1. Why AI interfaces look the same

A model predicts the most probable next token. Applied to design, "most probable"
means the arithmetic mean of everything it has seen: the safest font, the safest
gradient, the safest three-column feature grid. This is sometimes called
distributional convergence — absent direction, output collapses toward the centre of
the training distribution. The centre is by definition unremarkable.

Two consequences worth internalising:

- **Underspecified prompts guarantee generic output.** The gaps get filled with
  averages. So the fix is not "try harder" — it is to specify direction before
  writing markup. Direction is the input that has no average.
- **Polish without judgment reads as slop.** Shadows, glass, glow and springs applied
  uniformly do not signal care; they signal defaults. A design where everything is
  emphasised has emphasised nothing.

The escape is not novelty for its own sake. It is *specificity*: this product, this
audience, this one idea, expressed consistently.

---

## 2. What makes an interface feel expensive

Cheap and expensive are not budget words here. They describe perceived care.

| Feels cheap | Feels expensive |
|---|---|
| Everything the same weight and size | Deliberate, large contrast in scale |
| Uniform 16px gaps everywhere | Spacing that groups and separates meaningfully |
| Decoration on every surface | One or two moments of decoration, earned |
| Borders around everything | Space and background shift doing the separating |
| Six shades of grey, unrelated | One neutral ramp, consistently applied |
| Motion on everything | Motion on the two things that need it |
| Copy that describes the company | Copy that describes the user's outcome |
| Happy path only | Empty, loading and error states as designed as the success state |

The single highest-leverage move in almost every weak interface: **increase the
contrast between hierarchy levels and reduce the number of competing elements.** Make
the primary thing much bigger or much heavier, and delete or de-emphasise two things
next to it.

---

## 3. Hierarchy is the whole job

Every view answers, in order: What is this? What matters most? What do I do? What
else exists?

Build hierarchy with the cheapest tool that works, in this order:

1. **Position** — top and left-leading in LTR reading order carries the most weight.
2. **Size** — the most reliable signal. Use real jumps, not 2px differences.
3. **Weight** — 400 body against 600/700 headings beats five intermediate weights.
4. **Colour value** — a lighter grey recedes. This is how you de-emphasise without deleting.
5. **Space** — proximity groups; distance separates. Whitespace is structure.
6. **Colour hue** — one accent, spent on the primary action. Not distributed.
7. **Decoration** — borders, shadows, backgrounds. Last resort, not first instinct.

Corollary: if you find yourself adding a border to make something stand out, you have
skipped steps 1 through 5.

### The squint test
Blur your view of the design (or literally squint). You should still see: one focal
point, clear grouping, an obvious primary action. If everything blurs into one grey
mass, hierarchy has failed regardless of how nice the individual pieces are.

---

## 4. Restraint

> Perfection is achieved not when there is nothing left to add, but when there is
> nothing left to take away. — commonly attributed to Antoine de Saint-Exupéry

Practical form:

- **Every element must justify its existence.** If you cannot say what a divider,
  icon, badge or gradient is doing for the user, delete it.
- **One idea per view.** Two competing focal points means neither wins.
- **Additive fixes are usually wrong.** When something feels off, the fix is more
  often removal or realignment than addition.
- **Consistency beats cleverness.** A slightly worse pattern applied consistently
  reads as more designed than five better patterns applied inconsistently.

The counterweight: restraint is not timidity. A design can be loud, dense, brutal or
maximal *on purpose* — that is a direction, and it needs the same discipline. What
restraint forbids is unconsidered accumulation.

---

## 5. Taste is trained

Taste is not preference; it is a trained instinct for what elevates. It comes from
looking closely at excellent work, asking why a specific detail feels good, and
reproducing it until you understand the mechanism.

For an agent, this translates into three concrete habits:

1. **Name what you are copying.** "Command palette like Raycast", "toast stack like
   Sonner", "quiet density like Linear". Named references produce specific output;
   "modern and clean" produces averages.
2. **Reverse-engineer mechanisms, not screenshots.** The reason a drawer feels right
   is a specific curve, a velocity threshold, and a transform origin — not the
   colour.
3. **Look again with fresh eyes.** Re-read your own output as if reviewing someone
   else's. Most defects are obvious on second read and invisible on first.

---

## 6. Unseen details compound

Most craft details are never consciously noticed. That is the point — when something
behaves exactly as assumed, the user proceeds without a second thought. The aggregate
of invisible correctness is what people describe as "it just feels good."

A partial list of details nobody praises and everybody feels:

- A button that scales to `0.97` on press, so the interface confirms it heard you
- A popover that scales from its trigger rather than from its own centre
- A second tooltip that opens instantly because the first one is already open
- A toast that pauses its timer when the tab is hidden
- Tabular numbers in a table, so digits stop jittering as values change
- A skeleton whose shape matches the content that replaces it, so nothing jumps
- `autocomplete="one-time-code"` on the OTP field
- The scrollbar gutter reserved, so opening a modal does not shift the page
- Focus returning to the button that opened the dialog after it closes

None of these are features. All of them are the product.

---

## 7. Beauty is leverage

People choose tools on total experience, not feature lists. Two products with equal
capability are not equally adopted. Good defaults, good motion and a clear visual
point of view are genuine competitive advantages, and they are still underused in
software — which is precisely why they differentiate.

This is the argument against treating design as decoration applied at the end. It is
also the argument against gold-plating: leverage comes from the *experience*, and a
beautiful interface that is slow, inaccessible or confusing has negative leverage.

---

## 8. Ten heuristics, compressed

Jakob Nielsen's usability heuristics, in the form that actually changes code
(<https://www.nngroup.com/articles/ten-usability-heuristics/>):

1. **Visibility of system status** — never leave an action unacknowledged. Something changes within 100ms.
2. **Match the real world** — use the user's words, not the database's column names.
3. **User control** — undo, cancel, escape, back. Especially for destructive actions.
4. **Consistency** — the same thing looks and behaves the same way everywhere.
5. **Error prevention** — constrain input, confirm destruction, disable the impossible.
6. **Recognition over recall** — show options; do not require memory between steps.
7. **Flexibility** — keyboard shortcuts for repeat users, obvious paths for new ones.
8. **Minimalist design** — every extra unit of information competes with the essential.
9. **Recover from errors** — say what happened, why, and what to do next, in plain language.
10. **Help** — documentation should be findable, task-oriented and short.

Useful companions: [Laws of UX](https://lawsofux.com) (Jon Yablonski) for the
psychology behind these, and [Refactoring UI](https://refactoringui.com) (Adam Wathan
& Steve Schoger) for the visual-tactics layer.

---

## 9. The decision procedure

When stuck, run this:

1. **What is the one job of this view?** Write it in a sentence. If you cannot, the
   information architecture is the problem, not the styling.
2. **Who uses it, how often?** Daily-driver tools need speed, density and no
   animation. First-run and marketing surfaces can afford delight.
3. **What is the direction?** Pick from `reference/direction.md`. Name it.
4. **What is the hierarchy?** Rank the elements. Top-ranked gets scale and colour;
   bottom-ranked gets grey or deletion.
5. **What is the system?** Type scale, spacing scale, one neutral ramp, one accent,
   radius, shadow, motion tokens. Decide once, apply everywhere.
6. **What can be removed?** Cut until it hurts, then put back only what you miss.
7. **What are the states?** Loading, empty, error, success, disabled, offline, long
   content, zero results, one result, ten thousand results.
8. **Verify.** Section 6 of `SKILL.md`.

Steps 3 and 6 are the ones models skip. Do not skip them.
