# Component craft

Per-component specs. Numbers are defaults for a "Default" density tier — adjust to the
project's scale, but keep the relationships.

---

## Button

| Size | Height | Padding-x | Text | Radius |
|---|---|---|---|---|
| sm | 32px | 12px | 13px/500 | 6px |
| md | 40px | 16px | 14px/500 | 8px |
| lg | 48px | 24px | 15–16px/500 | 10px |

- **Variants:** primary (filled accent), secondary (filled neutral or outline), ghost (transparent, hover fill), destructive, link. That is enough. Five variants × four sizes is already 20 combinations.
- One primary per view. Two primaries means neither is primary.
- Icon + label gap 6–8px. Icon optically aligned to cap height, not box centre.
- Icon-only buttons are square, `aria-label`ed, and >= 44px hit area even if visually 32px (`padding` or a pseudo-element).
- `:active { transform: scale(0.97) }`. Non-negotiable.
- Loading: fixed width (grid-stack the spinner over the label), `aria-busy`, `disabled`.
- Full-width only on mobile and in narrow cards.
- Text: verb + object ("Create project"), sentence case, no "Click here", no ALL CAPS unless the direction demands it.
- Never nest a button inside an anchor or another button.

---

## Input / textarea / select

- Height matches button md (40px) so they align in a row. Radius matches too.
- 12–14px horizontal padding. Text 14–16px — **16px minimum on iOS** or Safari zooms the page on focus.
- Label above, 6–8px gap. Hint below, 4–6px gap.
- Border 1px at rest; on focus, the ring — do **not** thicken the border (layout shift).
- Placeholder is a format hint (`name@example.com`), never a label, and it must still meet contrast or be treated as non-essential.
- Textarea: `field-sizing: content` for auto-growth where supported, else a JS autosize; `resize: vertical`; `min-height` of 3 rows.
- Leading/trailing adornments inside the field padding, `pointer-events: none` unless interactive.
- Number inputs: `inputmode="decimal"`, hide spinners, `tabular-nums`. Do not use `type="number"` for IDs, phone numbers or card numbers.
- Custom select only when the native one genuinely cannot do the job — you are taking on the full listbox keyboard contract. `<select>` also gets the mobile native picker for free.

---

## Checkbox, radio, switch

- Visual box 16–20px, hit area >= 44px via label wrapping and padding.
- Label is clickable (wrap the input, or `for`/`id`).
- Checkbox: check mark drawn with `stroke-dasharray` animation, ~150ms ease-out. Support `indeterminate`.
- Radio group: one tab stop, arrows to move and select, `<fieldset>` + `<legend>`.
- Switch = immediate effect, no save button. Checkbox = staged, applied on submit. Choosing the wrong one is a real UX bug.
- Switch thumb travel 150–200ms ease-out; track colour crossfades over the same duration.
- Never use a switch for something that needs confirmation.

---

## Modal / dialog

- Native `<dialog>` where possible: top layer, backdrop, `Esc`, focus handling.
- Widths: 400px (confirm), 520px (form), 720px (content), max `min(92vw, …)`.
- Scrim: 40–60% black, or a tinted dark at ~50%. Blur is optional and expensive.
- Enter: `opacity 0→1` + `scale(0.96→1)`, 200–260ms ease-out. **Origin stays centre** — modals are not anchored. Exit at ~160ms.
- `overscroll-behavior: contain` on the body of the dialog; lock the page scroll and use `scrollbar-gutter: stable` to prevent a layout shift.
- Focus: first focusable element, or the primary action if it is safe. **Never** auto-focus a destructive button.
- Return focus to the trigger on close.
- Long content scrolls **inside** the dialog with sticky header and footer.
- On mobile, prefer a bottom sheet. Sheet drag-to-dismiss with a velocity threshold (~0.11 px/ms) rather than a pure distance threshold, and damping past the boundary.
- Never stack modals. Never put a modal inside a modal.

---

## Dropdown / menu / popover

- Anchored: use CSS anchor positioning or Floating UI. Flip and shift on collision. Never let it clip off-screen.
- `transform-origin` at the trigger side. 150–200ms ease-out enter, ~120ms exit.
- Min-width matching the trigger for selects; content-width for menus.
- Item height 32–36px, 8–12px padding-x, 6px radius on the highlight inset by 4px from the menu edge.
- Section dividers 1px hairline with 4px margin. Group labels 11–12px, muted, tracked.
- Keyboard: arrows, `Home`/`End`, type-ahead, `Esc`, `Tab` closes.
- Do not put a form inside a menu. Use a popover or a dialog.
- Submenus open on hover with a ~100ms intent delay plus a safe triangle, and on keyboard `→`.

---

## Toast

- Bottom-right on desktop, top or bottom centre on mobile. One position per app.
- Enter from the same edge it will exit toward — spatial consistency makes swipe-to-dismiss feel obvious.
- Enter 300–400ms with `ease` (slightly slower and more elegant than the standard `ease-out` snap); exit ~200ms.
- Stack max 3 visible, collapse the rest, offset each by 8–16px with a slight scale down.
- Duration 4s info, 6–8s with an action, indefinite for errors that need action — or better, don't use a toast for those.
- Pause the timer on hover, on focus, and when the tab is hidden.
- Use CSS transitions rather than keyframes: toasts are added rapidly and keyframes restart from zero.
- `role="status"` / `aria-live="polite"`. Focusable action buttons.
- Never use for anything the user must read or act on.

---

## Tooltip

- Delay 400–700ms before the first one; **0ms and no animation for subsequent tooltips** while one is already open. This makes a whole toolbar feel faster.
- 125–200ms ease-out, origin at the trigger.
- Max-width ~280px. One short line ideally.
- Never contain interactive content — that is a popover.
- Never the only source of essential information (invisible on touch).
- Dismissible with `Esc`; visible on keyboard focus, not just hover (SC 1.4.13).

---

## Table / data grid

- Row height 32px compact / 40px default / 48px comfortable.
- Header: 12–13px, medium weight, muted, sticky, with a bottom hairline.
- `tabular-nums` everywhere. Numbers right-aligned; text left-aligned; the header alignment matches its column.
- **Either** zebra striping **or** row hairlines. Not both.
- Row hover as a background shift; row selection with a leading accent bar plus a subtle tint.
- Sticky first column for wide tables (`position: sticky; left: 0` + a shadow to signal the overlap).
- Sortable headers are `<button>`s inside `<th>`, with `aria-sort`.
- Truncate with ellipsis + `title`; never wrap unpredictably in a dense table.
- Virtualise past ~100 rows. Reserve the scroll height so the scrollbar does not jump.
- Column widths: fixed or fractional, not `auto` — `auto` reflows the whole table when data changes.
- Empty, loading (skeleton rows matching the real row height) and error states.
- Bulk actions appear in a bar that does not shift the table.

---

## Navigation

- Top nav: 56–64px tall. Sticky only if there is a reason.
- Sidebar: 240–280px expanded, 56–64px collapsed. Persist the collapsed state.
- Active item: accent text + a 2–3px leading bar, or a filled background. Pick one and use it everywhere.
- `aria-current="page"` on the active link.
- Mobile: bottom tab bar max 5 items, or a sheet menu. Respect `env(safe-area-inset-bottom)`.
- Breadcrumbs for depth > 2, in a `<nav aria-label="Breadcrumb">` with an `<ol>`.
- Do not animate nav transitions in a daily-use tool.
- Never hide primary navigation behind a hamburger on desktop.

---

## Card

- Padding 16–24px. Radius 8–16px. **One** of: border, shadow, or background shift.
- No cards inside cards.
- If the whole card is clickable: wrap in one link, or use the pseudo-element overlay trick so nested links still work:
```css
.card { position: relative; }
.card-title-link::after { content: ""; position: absolute; inset: 0; }
.card .secondary-action { position: relative; z-index: 1; }
```
- Hover: `translateY(-2px)` + shadow step, 150ms — and only if the card is a link. Non-interactive cards must not respond to hover.
- Fixed aspect-ratio media (`aspect-ratio: 16/9`) so grids do not jump as images load.
- Consistent internal structure across a set: same title lines, same metadata position. Use `grid-template-rows: subgrid` to align across cards.

---

## Avatar

- Sizes 24 / 32 / 40 / 48 / 64. Circular for people, rounded-square for organisations.
- Fallback: initials on a colour derived deterministically from the name (hash → hue), never random per render.
- Groups: overlap by 25–30% with a background-coloured ring on each, and a "+N" chip at the end.
- `alt` = the person's name, or `alt=""` when the name is already adjacent.

---

## Command palette

- No open/close animation. It is used dozens of times a day.
- Fuzzy match with visible highlighting of matched characters.
- Groups with sticky headers, keyboard hints on the right, recent items first when the query is empty.
- Arrow keys move; `Enter` runs; `Esc` closes; the input never loses focus.
- Scroll the highlighted item into view with `block: "nearest"`.

---

## Charts

See `reference/data-viz.md`.

---

## Component API design

- **Good defaults over options.** Most consumers never customise. Ship it beautiful with zero props.
- **Minimal setup.** One provider at the root, one call anywhere. Every required hook, context or wrapper is friction that costs adoption.
- **Composition over configuration.** `<Select><Select.Trigger/><Select.Content/></Select>` scales better than 30 props.
- **Forward the ref, spread the rest.** `...props` onto the root so consumers can attach anything.
- **`asChild` / polymorphism** instead of a `component` prop.
- **Controlled and uncontrolled** both supported (`value` + `defaultValue`).
- **Style hooks:** `data-state`, `data-side`, `data-disabled` attributes so consumers can style states in CSS without prop drilling.
- **Handle edge cases invisibly:** pause timers on tab blur, capture pointer during drag, ignore extra touch points, preserve scroll position, restore focus. Nobody notices, everybody feels it.
- **Cohesion:** the motion, the density, the naming and the docs should feel like one thing. A crisp component with a slow bouncy animation reads as two decisions by two people.
