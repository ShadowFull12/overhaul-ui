# Anti-slop — the catalogue

Concrete, checkable tells of default LLM output, and what to do instead. Most are
enforced by `scripts/slop-scan.mjs`. A rule marked **[E]** is an error-level
regression; **[W]** is a warning that needs a justification if kept.

The point is not that any single item is forbidden forever. It is that these choices
arrive by *default* rather than by decision, and defaults are what make output look
mass-produced. If you use one, be able to say why.

---

## 1. Colour tells

| Tell | Why it reads as slop | Instead |
|---|---|---|
| **[E]** Purple → blue gradient (`#6366F1`→`#8B5CF6`, `violet-500`→`indigo-600`) on hero, CTA or card | The single most recognisable AI signature. Applied without semantic meaning. | One flat brand colour. If you want depth, use a large soft radial in a *tinted neutral*, or a gradient of one hue across lightness only. |
| **[E]** Pure `#000` background or `#fff` text on dark | No real surface is pure. Reads as unconsidered. | Tint the extremes: `oklch(0.16 0.012 265)` dark, `oklch(0.985 0.004 90)` light. |
| **[E]** `#888` / `gray-500` for all secondary text | The default grey. Also usually fails contrast. | Build one neutral ramp tinted toward the brand hue; pick the step that hits 4.5:1. |
| **[W]** Neon cyan + magenta on near-black "cyberpunk dashboard" | The default "futuristic" costume. | Pick a direction on purpose (`reference/direction.md`) and derive colour from it. |
| **[W]** Six unrelated accent colours, one per feature card | Colour used as decoration, not meaning. | One accent. Differentiate cards with content, not hue. |
| **[W]** Gradient text on headings | Reduces contrast, breaks in dark mode, dates instantly. | Solid colour. If you need emphasis, use size and weight. |
| **[W]** Glow / `box-shadow` in the accent colour on every interactive surface | Emphasis everywhere = emphasis nowhere. | Glow at most on the single primary action, or nowhere. |

**Rule of thumb:** a gradient should signal something — depth, state, a boundary, a
brand mark. Decorative gradient on every surface signals nothing.

---

## 2. Typography tells

| Tell | Why | Instead |
|---|---|---|
| **[E]** Inter (or Roboto / Open Sans / Poppins / Montserrat) as the default for everything, chosen by reflex | Inter is a good typeface and a dead giveaway when it is the *unexamined* choice. | Choose a pairing from `reference/typography.md`. If you do use Inter, pair it with a distinct display face and say why. |
| **[E]** Headings and body within ~2px of each other | No hierarchy. The squint test fails. | Real jumps: 1.25–1.333 ratio minimum, more at display sizes. |
| **[E]** Headline wrapping to 5–6 lines because the container is narrow | Signature of a model that never looked at the render. | Constrain by characters, not by an arbitrary `max-w-md`. Display text: 20–40ch. Set `text-wrap: balance` on headings. |
| **[W]** Body text at `text-sm` (14px) as the site default | Under-reads on desktop; makes everything feel like a settings panel. | 16–18px body on web, 17px iOS / 16sp Android. |
| **[W]** Long-form paragraph running the full container width | Unreadable past ~90ch. | 60–75ch measure (`max-w-prose`, `text-wrap: pretty`). |
| **[W]** `letter-spacing` untouched at display sizes | Large type needs negative tracking to look intentional. | `-0.02em` to `-0.04em` at 40px+; slight positive tracking on all-caps labels. |
| **[W]** Proportional figures in tables and counters | Digits jitter as values change. | `font-variant-numeric: tabular-nums`. |
| **[W]** Five font weights loaded, three used | Bundle cost, muddy hierarchy. | Two weights, three at most. |

---

## 3. Layout and structure tells

| Tell | Why | Instead |
|---|---|---|
| **[E]** Card inside a card inside a card | Nested containers with their own borders, radii and shadows. Pure default composition. | Flatten. One container level. Separate with space, or a background shift, not a third border. |
| **[E]** Everything centred, every section the same rhythm: centred title → centred subtitle → 3 cards | The template. Repeated 6 times down the page. | Vary composition per section: full-bleed, asymmetric split, offset grid, editorial left-align, overlap. See `playbooks/landing-page.md`. |
| **[E]** Three-column feature grid with icon + bold title + two grey lines, ×3 | The most-generated block on the internet. | Two columns with real content, or a stacked editorial list, or one large example instead of three abstractions. |
| **[W]** Uniform gap everywhere (`gap-4` between everything) | No grouping information. | Vary by relationship: 4–8px intra-component, 16–24px intra-group, 48–96px between sections. |
| **[W]** Bento grid with visibly empty leftover cells | Grid arithmetic not checked against the render. | Compute the span math. Every cell earns content or the grid changes shape. |
| **[W]** Border on every element to create separation | Border soup. | Background shift, spacing, or a single hairline `1px` at low contrast. |
| **[W]** `border-radius: 8px` on absolutely everything | Unexamined default. | One radius scale, applied by role: inputs and buttons share a value; cards a larger one; full-round only for pills and avatars. Nest radii correctly (outer = inner + padding). |
| **[W]** Section padding identical top and bottom, identical for every section | Flat rhythm. | Sections need different weight. Give the hero and the closing CTA more room. |
| **[W]** Sticky transparent navbar with backdrop-blur, by default | Fine choice, default application. | Decide: does this page need persistent nav? Many landing pages do not. |

---

## 4. Motion tells

| Tell | Why | Instead |
|---|---|---|
| **[E]** `transition: all` | Animates properties you did not intend, including layout ones. Performance and correctness bug. | Name them: `transition: transform 180ms var(--ease-out), opacity 180ms var(--ease-out)`. |
| **[E]** `ease-in` on an entering element | Starts slow at the exact moment the user is watching. Feels sluggish at any duration. | `ease-out`, ideally a strong custom curve. |
| **[E]** `transform: scale(0)` → `scale(1)` entrance | Nothing in the physical world appears from nothing. | `scale(0.95)` + `opacity: 0`. |
| **[E]** Bounce / elastic / `back-out` easing on standard UI | Reads as toy-like and adds perceived latency. | Reserve spring bounce (0.1–0.25) for drag and playful, rare moments. |
| **[E]** Animating `height`, `width`, `top`, `left`, `margin` | Triggers layout on every frame. | `transform` and `opacity`. Use `grid-template-rows: 0fr → 1fr`, `interpolate-size: allow-keywords`, or FLIP for size changes. |
| **[W]** 500ms+ on a dropdown, tooltip or menu | Everything feels heavy. | Tooltip 125–200ms, dropdown 150–250ms, modal 200–300ms. |
| **[W]** Identical duration for enter and exit | Exits should get out of the way. | Exit at ~60–75% of enter duration. |
| **[W]** `transform-origin: center` on a popover anchored to a trigger | Scales from the wrong place. | Origin at the trigger (`var(--transform-origin)` in Base UI / Radix). Modals are the exception — keep them centred. |
| **[W]** Animation on a keyboard-triggered action (command palette, shortcut toggle) | Seen hundreds of times a day. Animation is pure tax. | No animation at all. |
| **[W]** Scroll-reveal fade-up on every section | Content that hides itself until scrolled is a hostile default, and it is the AI landing-page reflex. | At most one or two reveals, or none. Never on above-the-fold content. |
| **[W]** No `prefers-reduced-motion` block | Accessibility failure. | Reduce and substitute (opacity instead of movement), do not blanket-disable. |
| **[W]** Infinite pulsing/floating decorative blobs | Constant motion in peripheral vision is fatiguing. | Static, or one slow parallax at most. |

---

## 5. Component and state tells

| Tell | Why | Instead |
|---|---|---|
| **[E]** `outline: none` with no `:focus-visible` replacement | Breaks keyboard use. WCAG failure. | A real focus ring: 2px, offset 2px, >= 3:1 contrast. |
| **[E]** Only the happy path implemented | Real products are mostly non-happy paths. | Loading, empty, error, success for every async surface. See `reference/interaction-states.md`. |
| **[E]** Emoji as structural icons (🚀 ⚙️ 📊 in nav or feature cards) | Font-dependent, inconsistent per platform, untintable, unprofessional. | One vector icon set (Lucide, Phosphor, Radix Icons, SF Symbols). |
| **[E]** Placeholder text used as the label | Disappears on input; fails screen readers; kills recall. | Real `<label>`. Placeholder only for format hints. |
| **[W]** Spinner as the only loading state for content-shaped areas | Tells the user nothing about what is coming. | Skeleton matching the final layout; spinner only for indeterminate short waits inside controls. |
| **[W]** No `:active` state on buttons | The interface never confirms the press. | `transform: scale(0.97)` with a ~150ms ease-out. |
| **[W]** Disabled button with no explanation | Dead end. | Explain why, or keep it enabled and validate on submit. |
| **[W]** `alert()` / `console.log` as user feedback | Not a design. | Toast, inline message, or optimistic state. |
| **[W]** Toast for errors the user must act on | Disappears before it is read. | Inline, next to the cause. Toasts are for transient confirmations. |
| **[W]** Modal for everything | Interrupts, traps, breaks back-button expectation on mobile. | Inline expansion, drawer, or a route. |
| **[W]** Hover-only affordances | Invisible on touch, invisible to keyboard. | Always-visible or focus-reachable. Gate hover-*enhancements* behind `@media (hover: hover)`. |
| **[W]** Fake avatars / lorem ipsum / "John Doe" left in delivered UI | Signals unfinished. | Realistic content, or a designed empty state. |

---

## 6. Copy tells

The verbal half of slop. See `reference/copywriting.md` for the full treatment.

**Banned openers and connectives:** "In today's fast-paced world", "Unlock the power
of", "Take your X to the next level", "Seamlessly integrate", "Revolutionize your
workflow", "Elevate your", "The future of X is here", "Say goodbye to", "Effortlessly",
"Supercharge", "Game-changing", "Cutting-edge", "Robust and scalable",
"Delve into", "It's not just X, it's Y", "Whether you're a X or a Y".

**Banned structural tics:** em-dash-heavy triplets, "✨" and "🚀" in headings, every
feature titled with a two-word abstraction ("Smart Insights", "Seamless Sync",
"Powerful Analytics"), the rule-of-three bullet list where all three items say the
same thing.

**Instead:** say what it does, for whom, and what changes. Concrete nouns. Real
numbers. The user's words. A headline that would be false if the product were
different is a good headline.

| Slop | Better |
|---|---|
| "Unlock the power of seamless collaboration" | "Ship a design review in one thread" |
| "Elevate your workflow with cutting-edge AI" | "Drafts your release notes from the diff" |
| "Something went wrong. Please try again." | "Couldn't save — you're offline. We'll retry when you reconnect." |
| "No data available" | "No invoices yet. Create your first one." |
| "Get Started" (×4 on one page) | "Start a free project", "See the 2-minute demo" |

---

## 7. Meta tells (agent behaviour)

| Tell | Instead |
|---|---|
| Explaining what you will do at length, then doing something smaller | Do it, then summarise briefly |
| `// TODO: implement` in a delivered file | Finish, or explicitly scope it out |
| Comments restating the code (`// set the color`) | Comment only non-obvious *why* |
| Inventing brand assets or logo file paths | Use official assets or a text lockup |
| Claiming "fully accessible" / "production-ready" | State exactly what you tested |
| Six clarifying questions before starting | Infer, state the inference in one line, start |
| Same layout archetype for every section and every project | Vary deliberately |

---

## 8. The de-slopping pass

Fastest route from generic to designed. In order:

1. **Run** `node scripts/slop-scan.mjs .` and read the errors.
2. **Name a direction.** One sentence. Everything after this serves it.
3. **Replace the type.** New pairing, wider scale contrast, fix the measure. Biggest visual delta for the least risk.
4. **Rebuild the neutral ramp.** Tint it. Remove `#000`/`#fff`/`#888`. Re-derive every grey from the ramp.
5. **Cut the accent count to one.** Reassign the freed colours to neutrals.
6. **Kill decoration.** Remove gradients, glows, and every border that space could replace. Flatten nested cards.
7. **Re-space.** Apply one scale; make section rhythm uneven and intentional.
8. **Break the section template.** Give at least three sections a different composition.
9. **Fix motion.** Named properties, ease-out enters, faster exits, delete animation from anything frequent.
10. **Add the missing states.** Loading, empty, error. Usually the largest quality jump per line of code.
11. **Rewrite the copy.** Strip the jargon list in §6.
12. **Re-run** the gate in `SKILL.md` §6.

Do not do these in parallel and do not do them halfway. A half-replaced palette looks
worse than the original.
