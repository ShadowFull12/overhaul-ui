# copy — rewrite the interface text

**Route here when:** "the copy sounds like AI", "fix the wording", "the error messages
are useless", "write the microcopy".

**Writes:** all user-facing strings.

---

## Procedure

### 1. Grep the banned list
`reference/copywriting.md` §1. Every hit gets rewritten, not softened.
"Unlock", "elevate", "seamless", "effortless", "cutting-edge", "supercharge",
"revolutionize", "In today's fast-paced world", "Whether you're a X or a Y",
"It's not just X — it's Y", ✨/🚀 in headings.

### 2. Falsify every headline
Could this sentence be false? If it could not possibly be wrong, it says nothing.
Rewrite until it makes a specific, checkable claim.

```
"Unlock seamless collaboration"     → could not be false → rewrite
"Review a design in one thread"     → could be false → keep
```

### 3. Fix the CTAs
Verb + object. Unique on the page. "Get Started" four times means the page has no
structure. `Create project`, `Send invite`, `See the 2-minute demo`.

### 4. Fix the errors
What happened → why → what to do next. No codes as the primary message. Never blame the
user. Never lose their input.

| Before | After |
|---|---|
| "Invalid input" | "Enter a date in the future" |
| "Error 422" | "That email is already registered. [Sign in]" |
| "Something went wrong" | "Couldn't save — you're offline. We'll retry automatically." |

### 5. Fix the empty states
Say what belongs here, then offer the action. Never "No data available".

### 6. Fix the labels and hints
Labels: short nouns, sentence case. Hints: one line, explaining why or the format.
Placeholders: format examples only, never labels.

### 7. Set the voice and hold it
Formality × energy, chosen once. Most software is best at neutral + matter-of-fact. No
jokes in error states — the user is already annoyed.

Consistency: one word per concept (a "project" is never sometimes a "workspace"), one
case convention, one person ("you").

### 8. Mechanics
Sentence case · digits for data · localised numbers, dates and currency via `Intl` ·
curly quotes and en dashes · no trailing periods on labels and buttons · `Intl` plurals
via ICU rather than string concatenation.

### 9. Accessibility
Link text describes the destination · the visible label is part of the accessible name
(SC 2.5.3) · no "the button below" · abbreviations expanded on first use · plain
language, short sentences, active voice.

### 10. i18n headroom
Check the layout at 1.4× string length. German runs ~30% longer; some languages 50%. Do
not concatenate sentence fragments. Nothing important inside an image.

### 11. Read it aloud
Anything you would not say to a colleague gets cut. This catches more slop than any
checklist.

---

## Output

A table of the rewrites, then a summary.

| Location | Before | After |
|---|---|---|
| Hero h1 | "Unlock the power of seamless team collaboration" | "Review a design in one thread, not eleven Slack messages" |
| Hero CTA | "Get Started" | "Start a free project" |
| Feature 2 | "Powerful Analytics" | "See which step lost the signup" |
| Save error | "Something went wrong" | "Couldn't save — you're offline. We'll retry automatically." |
| Invoices empty | "No data available" | "No invoices yet — create one and it'll appear here." |

```
Rewritten: 34 strings across 12 files
Banned phrases removed: 19
Headlines: 7 rewritten to be falsifiable
CTAs: 6 made unique and specific
Errors: 8 now say what to do next
Voice: neutral + matter-of-fact, applied consistently
i18n: layout holds at 1.4× length
```

---

## Gate

- [ ] Zero hits from the banned list
- [ ] Every headline could be false
- [ ] Every CTA is verb + object, unique on the page
- [ ] Every error says what to do next
- [ ] Every empty state offers an action
- [ ] One word per concept; one voice; one case convention
- [ ] Layout survives 1.4× string length
- [ ] Accessible names match visible labels

## See also
`reference/copywriting.md`, `commands/states.md`, `commands/distill.md`
