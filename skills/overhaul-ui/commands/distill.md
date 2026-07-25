# distill — remove until it is clear

**Route here when:** "too cluttered", "simplify this", "too much going on", "reduce the
noise", "this screen is overwhelming".

**Writes:** mostly deletions.

The hardest command to execute honestly, because the instinct is always to add.

---

## Procedure

### 1. State the one job
Write the single purpose of this view in one sentence. If you cannot, the information
architecture is the problem and no amount of styling will fix it — say so.

### 2. Rank everything
List every element on screen. Rank by how much it serves the one job. Be brutal about
the bottom half.

### 3. For each low-ranked element, choose
| Verdict | When |
|---|---|
| **Delete** | Nobody needs it here. Default verdict — try this first |
| **Demote** | Needed but not now: grey it, shrink it, move it below the fold |
| **Defer** | Needed sometimes: behind a disclosure, a menu, a secondary route |
| **Merge** | Two elements saying the same thing become one |
| **Keep** | It serves the job |

If you cannot say what an element does for the user, it goes.

### 4. Cut the decoration
Gradients, glows, dividers, icons that repeat the label, badges nobody reads,
decorative blobs, borders that space could replace, background patterns, redundant
counts. Every one is competing with content for attention.

### 5. Cut the chrome
- Repeated section labels ("SECTION 01", "OUR FEATURES")
- Headings that restate the page title
- Subtitles that paraphrase the heading
- Breadcrumbs on a two-level site
- A sidebar with three items
- Tooltips explaining self-evident controls
- Confirmation dialogs on reversible actions

### 6. Cut the copy
Every adverb. Every "simply", "just", "easily". Every sentence that would be true of any
product. Rule of three lists where all three items say one thing. See
`reference/copywriting.md` §1.

### 7. Cut the choices
Fewer, better options. Five CTAs means no CTA. A settings panel with 20 toggles needs
better defaults, not better grouping. Every option is a decision you pushed onto the
user.

### 8. Reduce the visual variables
Count distinct: font sizes, weights, colours, radii, shadow levels, border styles,
icon styles. Cut each count. Consistency reads as more designed than variety.

### 9. Then restore
Put back only what you actively miss. Usually one or two things. This step is what
separates distillation from vandalism.

### 10. Verify nothing broke
Deleting UI can delete functionality. Confirm every removed control was genuinely
redundant, not merely unattractive. Run the tests.

---

## Output

```
One job: "Let the user pay an outstanding invoice in under 30 seconds."

Deleted (14)
  3 decorative gradients · 6 redundant dividers · "OUR PROCESS" label ·
  4 icons duplicating their own labels · a 3-item sidebar

Demoted (5)
  Metadata row → muted, 13px · Secondary CTA → text link ·
  Related items → below the fold

Deferred (3)
  Advanced filters → disclosure · Export options → menu · Audit log → own route

Merged (2)
  Two "how it works" sections → one

Copy: 340 words → 180
Visual variables: 9 sizes → 5 · 4 weights → 2 · 6 greys → 3 · 5 radii → 3
Restored: the metadata row (needed for support lookups)

Elements on screen: 47 → 23
Nothing functional removed. Tests pass.
```

---

## Gate

- [ ] The one job is stated in a sentence
- [ ] Element count meaningfully reduced
- [ ] Nothing functional lost — verified, not assumed
- [ ] Hierarchy is clearer, not merely emptier
- [ ] Squint test passes with an obvious focal point
- [ ] Tests and build pass

## See also
`reference/philosophy.md` §4, `commands/quieter.md`, `commands/polish.md`
