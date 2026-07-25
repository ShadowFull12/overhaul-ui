# Accessibility — WCAG 2.2 AA

Target: WCAG 2.2 Level AA. It is the standard referenced by the ADA Title II rule
(state/local government compliance from April 2026), Section 508, and the European
Accessibility Act. Spec: <https://www.w3.org/TR/WCAG22/>.

Honest framing: automated checks catch roughly 30–40% of issues. Never claim
compliance. State what you tested.

---

## 1. What WCAG 2.2 added over 2.1

The nine new criteria, and what they mean in code:

| SC | Level | Requirement | In practice |
|---|---|---|---|
| 2.4.11 Focus Not Obscured (Min) | AA | The focused element is not entirely hidden by author content | Sticky headers/footers must not cover the focused item — use `scroll-margin`, or `scroll-padding` on the scroll container |
| 2.4.12 Focus Not Obscured (Enh) | AAA | Not even partially hidden | — |
| 2.4.13 Focus Appearance | AAA | Indicator >= a 2px perimeter, >= 3:1 between focused and unfocused states | 2px ring + 2px offset satisfies this; do it anyway |
| 2.5.7 Dragging Movements | AA | Any drag action has a single-pointer alternative | Reorder via drag **and** a move-up/move-down menu; slider via drag **and** arrow keys / number input |
| 2.5.8 Target Size (Min) | AA | Targets >= 24×24 CSS px, or spaced so a 24px circle does not overlap a neighbour | 24 is the legal floor; **44×44 is the real bar**. Inline links in text are exempt |
| 3.2.6 Consistent Help | A | Help mechanisms appear in the same relative order across pages | Support link in the same place everywhere |
| 3.3.7 Redundant Entry | A | Do not ask for the same information twice in one process | Autofill step 3 from step 1, or show it read-only |
| 3.3.8 Accessible Authentication (Min) | AA | No cognitive function test without an alternative | Allow paste into OTP and password fields, support password managers, `autocomplete="one-time-code"` |
| 3.3.9 Accessible Authentication (Enh) | AAA | No cognitive test at all | Passkeys, magic links |

Also removed in 2.2: 4.1.1 Parsing (obsolete).

---

## 2. Semantics first

The best ARIA is no ARIA. Native elements bring behaviour, focus and semantics for
free.

| Need | Use | Not |
|---|---|---|
| Click action | `<button>` | `<div onClick>` |
| Navigation | `<a href>` | `<div onClick={router.push}>` |
| Toggle | `<input type="checkbox">` or `<button aria-pressed>` | styled div |
| Dropdown of options | `<select>` (or a proper listbox pattern) | div soup |
| Modal | `<dialog>` | absolutely-positioned div |
| Disclosure | `<details>/<summary>` | manual state |
| Tooltip / anchored menu | `popover` + anchor positioning | portal + z-index war |
| Progress | `<progress>` | animated div (unless styling demands it, then `role="progressbar"`) |
| Data table | `<table>` with `<th scope>` | grid of divs |

**Landmarks:** one `<h1>` per page; `<header>`, `<nav>`, `<main>`, `<aside>`,
`<footer>`; a "Skip to content" link as the first focusable element. Heading levels
step by one — never jump h2 → h4 for size reasons; use CSS for size.

**Accessible names**, in priority order: visible text > `aria-labelledby` >
`aria-label` > `title`. Icon-only buttons need a name. A name that differs from
visible text breaks voice control (SC 2.5.3 requires the visible label to be part of
the accessible name).

```html
<button aria-label="Close dialog"><XIcon aria-hidden="true" /></button>
<a href="/pricing">Pricing<span class="sr-only"> — plans and costs</span></a>
```

```css
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip-path: inset(50%);
  white-space: nowrap; border: 0;
}
```
Never use `display: none` or `visibility: hidden` for screen-reader-only text — both
remove it from the accessibility tree.

---

## 3. Keyboard

Every interactive element must be reachable and operable by keyboard, in an order that
matches the visual order.

| Component | Keys |
|---|---|
| Button | `Enter`, `Space` |
| Link | `Enter` |
| Checkbox / switch | `Space` |
| Radio group | `Arrow` keys move **and** select; the group is one tab stop |
| Select / listbox | `Arrow`, `Home`, `End`, type-ahead, `Enter` to commit, `Esc` to cancel |
| Combobox | `Arrow` to navigate, `Enter` select, `Esc` close, text stays editable |
| Tabs | `Arrow` to move; `Tab` moves to the panel. Manual activation for expensive panels |
| Menu / menubar | `Arrow`, `Home`, `End`, type-ahead, `Esc`, `Tab` closes |
| Modal | Focus moves in, is trapped, `Esc` closes, focus returns to the trigger |
| Non-modal popover | `Esc` closes, focus is *not* trapped |
| Tree | `Arrow` up/down to move, right/left to expand/collapse |
| Slider | `Arrow` ±step, `Page` ±large, `Home`/`End` to bounds |
| Table grid | `Arrow` cell navigation when it behaves as a grid |
| Drag-and-drop | A keyboard alternative is **required** (SC 2.5.7) |

**Focus management rules**
- `tabindex="0"` to add to tab order; `tabindex="-1"` for programmatic focus only. Never a positive `tabindex`.
- On route change in an SPA, move focus to the new `<h1>` or main region and announce the page title.
- After deleting a row, move focus to the next row — not to `<body>`.
- After closing an overlay, return focus to the element that opened it.
- Never move focus without user intent (auto-focusing a search field on every page load is hostile to screen-reader users on mobile).
- Roving tabindex for composite widgets: one tab stop for the group, arrows within.

Follow the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) patterns
rather than inventing behaviour. Better: use Radix or Base UI, which implement them.

---

## 4. Forms

```html
<div class="field">
  <label for="email">Email address</label>
  <input id="email" name="email" type="email"
         autocomplete="email" inputmode="email"
         spellcheck="false" required
         aria-describedby="email-hint email-err"
         aria-invalid="true">
  <p id="email-hint" class="hint">We'll only use this for receipts.</p>
  <p id="email-err" class="error" role="alert">
    <AlertIcon aria-hidden="true" /> Enter an email address like name@example.com
  </p>
</div>
```

Checklist:
- Visible `<label>` for every input. Placeholder is never a label.
- Correct `type` and `inputmode` — the mobile keyboard should match the data.
- `autocomplete` tokens (`email`, `name`, `tel`, `street-address`, `cc-number`, `one-time-code`, `new-password`, `current-password`). Required by SC 1.3.5 and it is also just faster.
- Group related fields with `<fieldset>` + `<legend>`. Radio groups always.
- Mark required fields in text, not only with an asterisk. Or mark the optional ones instead.
- Error text is programmatically associated, not just visually adjacent.
- Never disable paste. Never block password managers.
- Allow generous input formats (spaces in card numbers, any phone format) and normalise server-side.
- Do not submit or navigate on change of a `<select>`.
- Give the user a way to review before an irreversible submit (SC 3.3.4).
- `<button type="submit">`, not a click handler on a div, so `Enter` works in the form.

---

## 5. Images, media, motion

- Meaningful image → descriptive `alt`. Decorative → `alt=""`. Never omit the attribute.
- Complex images (charts, diagrams) → short `alt` + a longer description nearby or in a `<figcaption>`/table.
- Text in images: avoid. If unavoidable, the same text must exist in the DOM.
- SVG: `role="img"` + `<title>`, or `aria-hidden="true"` when decorative and adjacent text carries the meaning.
- Video: captions (SC 1.2.2), audio description where visual info is essential, real controls, never autoplay with sound.
- No autoplaying motion longer than 5s without a pause control (SC 2.2.2).
- No flashing above 3Hz (SC 2.3.1).
- `prefers-reduced-motion` honoured — see `reference/motion.md`.

---

## 6. Reflow, zoom, spacing

- **1.4.10 Reflow:** usable at 320 CSS px wide with no two-dimensional scrolling. Test at 320px, and at 1280px with 400% zoom.
- **1.4.4 Resize text:** text scalable to 200% without loss. Use `rem`; never lock `font-size` in `px` on `html`; never `user-scalable=no` or `maximum-scale=1`.
- **1.4.12 Text spacing:** no clipping when the user forces line-height 1.5, paragraph spacing 2em, letter-spacing 0.12em, word-spacing 0.16em. Fixed-height containers with text inside are the usual failure — use `min-height`.
- Respect Dynamic Type on iOS and font scale on Android; never hardcode text sizes in RN without scaling.

---

## 7. Live regions

```html
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status"></div>
<div role="alert" id="urgent"></div>   <!-- implicit aria-live="assertive" -->
```

- The container must exist in the DOM **before** you write into it, or nothing is announced.
- `polite` for status, results counts, "Saved". `assertive`/`role="alert"` only for errors that block progress.
- Do not stack multiple assertive regions — they interrupt each other.
- Toasts need `role="status"` and enough time to be read (WCAG 2.2.1 — provide a way to extend or dismiss).
- A visual spinner announces nothing. Pair `aria-busy` with a live-region message.

---

## 8. Testing

**Do (fast, real signal)**
1. Unplug the mouse. Complete the primary flow with the keyboard only. This finds more than any tool.
2. Tab through and watch for: invisible focus, illogical order, focus lost after an interaction, traps.
3. Run axe DevTools or Lighthouse. Fix everything it finds — those are the free wins.
4. Zoom to 200% and 400%. Resize to 320px.
5. Turn on the OS reduced-motion setting.
6. Read the page with a screen reader: VoiceOver (`Cmd+F5`) on macOS, NVDA on Windows, TalkBack on Android. Even 60 seconds finds real bugs.
7. Force dark mode and Windows High Contrast (`forced-colors: active`).
8. `node scripts/a11y-lint.mjs .` for the static checks.

**Don't**
- Trust an automated score as compliance.
- Add ARIA to fix something native semantics would solve.
- Use `role="button"` on a div and stop there — you still owe keyboard handling and focus.
- Claim "WCAG AA compliant". Say "meets AA for the criteria we tested: …".

---

## 9. Quick reference — the ten most common failures

1. `outline: none` with no replacement
2. Placeholder used as label
3. Icon-only button with no accessible name
4. Insufficient contrast on secondary text and placeholders
5. Heading levels skipped for visual sizing
6. `<div onClick>` instead of `<button>`
7. Modal without focus trap or focus restore
8. Colour as the only status indicator
9. No `alt` attribute at all (vs an empty one)
10. Custom select/combobox with no keyboard support
