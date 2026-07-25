# UX copy

Copy is interface. Bad copy cannot be fixed with good typography.

---

## 1. Banned phrases

These are the verbal equivalent of the purple-to-blue gradient. If any appear in
generated copy, rewrite the sentence.

**Openers**
"In today's fast-paced world", "In an era of", "In the digital age", "Gone are the days",
"Picture this", "Let's dive in", "Let's face it"

**Value claims**
"Unlock the power of", "Take your X to the next level", "Elevate your", "Supercharge",
"Revolutionize", "Transform the way you", "The future of X is here", "Redefine",
"Reimagine", "Empower your team to"

**Adjective filler**
"cutting-edge", "state-of-the-art", "game-changing", "next-generation", "world-class",
"best-in-class", "robust and scalable", "powerful yet simple", "seamless",
"effortless", "intuitive", "innovative", "revolutionary", "comprehensive"

**Connectives and tics**
"Whether you're a X or a Y", "It's not just X — it's Y", "Say goodbye to X",
"But here's the thing", "And that's not all", "The best part?", "Simply put",
"At the end of the day", em-dash triplets, ✨/🚀/💡 in headings

**Empty CTAs**
"Get Started" repeated four times on one page, "Learn More", "Click here",
"Discover more", "Explore now"

The pattern behind all of these: they would be true of any product. If the sentence
survives swapping your product for a competitor's, it is saying nothing.

---

## 2. What to write instead

**The test:** could this sentence be false? If a headline could not possibly be wrong,
it carries no information.

| Slop | Specific |
|---|---|
| "Unlock seamless team collaboration" | "Review a design in one thread, not eleven Slack messages" |
| "Powerful analytics at your fingertips" | "See which page lost the signup, in two clicks" |
| "Cutting-edge AI-powered insights" | "Drafts your release notes from the diff" |
| "Effortlessly manage your workflow" | "Assign, schedule and close a ticket without leaving the keyboard" |
| "The future of invoicing is here" | "Send an invoice in 30 seconds. Get paid in 3 days on average." |

**Method**
1. Name the user's actual job. Not the category — the task at 3pm on a Tuesday.
2. Name what changes. Time saved, steps removed, mistakes prevented, a number.
3. Use the user's vocabulary. Read their support tickets, not your marketing deck.
4. Prefer concrete nouns and strong verbs. Cut every adverb.
5. One idea per sentence. If there is an "and", consider two sentences.

**Headline lengths:** hero 4–10 words. Section heading 2–6. Feature title 1–4. If a
headline needs a comma and a subordinate clause, it is a paragraph.

---

## 3. Microcopy

### Buttons
Verb + object. "Create project", "Send invite", "Delete 3 items".
Sentence case. Not "Submit", not "OK" for anything consequential.
The button label should complete the sentence the heading started.

### Labels
Short, noun-based, sentence case: "Email address", "Card number", "Team name".
Not "Please enter your email address here".

### Placeholders
Format hints only: `name@example.com`, `+44 7700 900000`. Never a label. Never
instructions the user needs after they start typing.

### Hints
One line, below the field, explaining *why* or *what format*: "We'll only use this for
receipts." Not the same text as the label.

### Errors
What happened → why → what to do. Never blame the user, never expose a code as the
primary message.

| Bad | Good |
|---|---|
| "Invalid input" | "Enter a date in the future" |
| "Error 422" | "That email is already registered. [Sign in instead]" |
| "Something went wrong" | "Couldn't save — you're offline. We'll retry automatically." |
| "Password requirements not met" | "Add one number to your password" |

### Empty states
Say what belongs here, then offer the action.
"No invoices yet — create one and it'll appear here." + `[New invoice]`
Never "No data available."

### Confirmations
Name what will happen and make it reversible if possible.
"Delete `Q3 report`? This can't be undone." Buttons: `[Cancel]` `[Delete report]` —
label the action, not "Yes"/"OK".

### Loading
Say what is happening if it takes over a second: "Importing 1,240 rows…" Not "Loading…".

### Success
"Invoice sent to jane@acme.com" beats "Success!".

---

## 4. Voice

Pick a register and hold it. Two dimensions to decide:

- **Formality:** formal (finance, health, legal) → neutral (most B2B) → casual (consumer, dev tools).
- **Energy:** calm → matter-of-fact → enthusiastic.

Most software is best at **neutral + matter-of-fact**: clear, brief, no exclamation
marks, no jokes in error states. Personality belongs in onboarding, empty states and
marketing — never in a failure the user is annoyed about.

Consistency checklist: sentence case everywhere (or Title Case everywhere), the same
word for the same concept ("project" is not sometimes "workspace"), the same tense,
the same person ("you", not "the user").

---

## 5. Mechanics

- **Sentence case** for headings, buttons, labels, menu items. Title Case only if the brand demands it. ALL CAPS only as a styled micro-label with tracking, and never for a sentence.
- **Numbers:** digits for data (`3 items`, `£24.00`), words for prose under ten. Localise separators and currency with `Intl.NumberFormat`.
- **Dates:** never `MM/DD/YYYY` for an international audience. `12 Mar 2026` or a relative form ("2 days ago") with the absolute value in a `title`.
- **Truncation:** cut at a word boundary and add a real ellipsis `…`, with the full text reachable.
- **Punctuation:** curly quotes, en dash for ranges, no trailing period on labels and buttons; periods on full sentences in body and hints.
- **Sentence-final periods in bullets:** all or none.
- **i18n:** German runs ~30% longer than English; some languages ~50%. Never build a layout that assumes English length. Avoid concatenating sentence fragments — use ICU message format for plurals and interpolation. Nothing in an image.
- **Inclusive:** "they" as the singular, no idioms that do not translate, no metaphors requiring cultural knowledge, no ableist shorthand ("crazy", "insane", "blind to"). Avoid "simply", "just", "easy" — they are demeaning when the user is stuck.

---

## 6. Accessible copy

- Link text describes the destination: "Read the pricing guide", not "click here". A screen-reader user listing links must be able to tell them apart.
- The visible label must be part of the accessible name (SC 2.5.3) — don't label a button "Save" and `aria-label` it "Submit form".
- Don't rely on visual context: "the button below" is meaningless in a linear reading order.
- Expand an abbreviation on first use, or use `<abbr>`.
- Aim for a plain-language reading level. Short sentences, common words, active voice.
- Announce the important, not the incidental: a live region that says "Loading" three times is noise.

---

## 7. Review pass

1. Grep the banned list in §1. Every hit gets rewritten.
2. Every headline: could it be false? If not, rewrite.
3. Every CTA: verb + object, unique on the page.
4. Every error: does it say what to do next?
5. Every empty state: does it offer an action?
6. Consistency: one word per concept, one case convention, one voice.
7. Read it aloud. Anything you would not say to a colleague gets cut.
8. Length check at 1.4× for translation headroom.
