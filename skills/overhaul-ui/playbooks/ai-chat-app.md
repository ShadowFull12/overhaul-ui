# Playbook — AI chat / agent interface

A new surface type with its own failure modes. Streaming, uncertainty, long-running work
and trust are the hard parts — not the message bubbles.

---

## Layout

```
┌─ header: model/context selector · new chat · settings ──────────┐
│ [sidebar: conversation list, searchable, groupable]             │
│                                                                 │
│  message thread (scrollable, 680–760px measure)                 │
│                                                                 │
├─ composer: textarea (auto-grow) · attachments · send ───────────┤
└─────────────────────────────────────────────────────────────────┘
```

- Message measure 65–75ch. Chat output is long-form reading
- Composer pinned to the bottom, auto-growing to a max height (~40% of viewport) then scrolling internally
- Sidebar: search, grouped by date, renameable, deletable with undo
- Mobile: sidebar as a drawer; composer above the keyboard (`interactive-widget=resizes-content`, or `visualViewport` handling)

---

## The composer

The most-used control in the product. Every detail is felt many times per session.

- `Enter` sends, `Shift+Enter` newlines — and say so, subtly, on first use
- Auto-grow with `field-sizing: content` or a measured JS autosize. Never a fixed-height textarea
- **Never lose a draft.** Persist per conversation, survive a refresh and a navigation
- Send button disabled when empty; loading state while generating; a **Stop** button that actually stops
- Attachments: drag-drop, paste-from-clipboard, and a file picker. Show progress, allow removal, state the limits before the user hits them
- Character or token count only if there is a real limit, and only as it gets close
- Slash commands or an `@` mention menu if you have them — with a real keyboard model
- Focus returns to the composer after a response completes
- 16px minimum font size so iOS does not zoom

---

## Streaming output

- **Stream tokens.** A 20-second wait with a spinner is a materially worse product than the same wait streaming
- Autoscroll while the user is at the bottom; **stop autoscrolling the moment they scroll up**, and show a "jump to latest" affordance. Getting this wrong is the single most irritating chat bug
- No per-token animation. Fading in each token is expensive, and looks like a rendering fault
- Render markdown progressively without reflowing what is already displayed — buffer to a safe boundary rather than re-parsing the whole message each tick
- Code blocks: highlight after the block closes, not per token
- A visible caret or subtle indicator that generation is ongoing
- Announce completion to screen readers via a polite live region — **never** stream into an assertive one
- Stop must be instant and must keep the partial output

---

## Message design

- Distinguish user and assistant clearly — but you rarely need two bubble styles. Alignment, a subtle background on one side, or an avatar column is enough
- Assistant output is **prose**, not a bubble. Give it the full reading width and real typographic care: heading hierarchy, list spacing, code block styling, table handling
- Per-message actions (copy, regenerate, edit, feedback) visible on hover **and** reachable by keyboard. Never hover-only
- Copy confirmation on the button itself
- Timestamps on hover or in a muted corner, not on every message
- Long messages: collapse with a "show more" only if genuinely enormous
- Editing a user message and regenerating is a core interaction — make the branching state obvious

---

## Uncertainty and trust

The part most implementations skip, and the part that determines whether the product is
trusted.

- **Cite sources** where the answer depends on retrieved content. Link to the exact section, not the document
- Distinguish "the model generated this" from "this came from your data"
- Show what context was used — files, pages, tools — and let the user inspect it
- Never present a guess with the same confidence as a retrieved fact
- Make errors legible: a rate limit, a context overflow and a tool failure are three different problems and need three different messages
- Show token/cost information if the user pays per use

---

## Tool calls and agent steps

- Show each step as it happens: name it, show the status, allow expansion for detail
- Collapse completed steps to one line; keep failures expanded
- Long-running work needs a real progress signal and a cancel
- Never hide a destructive tool call behind a collapsed step — confirm before, not after
- Streaming reasoning or a plan is useful; a wall of internal monologue is not. Summarise by default, expand on request

---

## States

- **Empty (new chat):** suggested prompts that demonstrate real capability, not "Tell me a joke". This is the onboarding
- **Generating:** stop available, composer usable, partial output preserved
- **Error:** distinguishable causes, retry that does not lose the prompt
- **Rate limited / quota:** say what the limit is and when it resets
- **Context full:** explain it and offer a concrete action (start a new chat, remove a file)
- **Offline:** queue or fail clearly; never silently drop a message
- **Very long conversation:** virtualise, or paginate history

---

## Accessibility

Chat interfaces are frequently unusable with a screen reader. Details that fix that:

- Message list as a `log` or `feed` with each message a labelled item
- Streaming text into a **polite** live region, throttled — not every token
- Announce "response complete"
- Every per-message action keyboard reachable with an accessible name
- Keyboard shortcuts documented and discoverable, and not conflicting with screen-reader keys
- Code blocks keyboard-scrollable
- Respect reduced motion — remove typing indicators that pulse

---

## Performance

- Virtualise long threads
- Do not re-render the whole thread on each token — isolate the streaming message
- Highlight code after the block closes
- Lazy-load the markdown renderer and the syntax highlighter
- Throttle autoscroll to animation frames
- INP is the metric: typing must never lag while generation is running

---

## Gate

- [ ] `Enter`/`Shift+Enter` correct; drafts persist across refresh
- [ ] Stop button works instantly and keeps partial output
- [ ] Autoscroll stops when the user scrolls up; jump-to-latest available
- [ ] No per-token animation; typing stays responsive during generation
- [ ] Assistant output typeset as prose at 65–75ch
- [ ] Message actions keyboard reachable, not hover-only
- [ ] Sources cited where the answer is retrieval-based
- [ ] Tool calls visible; destructive ones confirmed before running
- [ ] All states handled, including rate limit and context overflow
- [ ] Streaming announced politely; completion announced
- [ ] Long threads virtualised
- [ ] `commands/review.md` passed
