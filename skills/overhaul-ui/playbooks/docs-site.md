# Playbook — documentation site

Documentation is a tool, not a brochure. Optimise for finding the answer, not for
looking impressive.

---

## Layout

```
┌─ top bar: logo · version · search · theme · GitHub ────────────────┐
│ sidebar 260px │ content 680–760px          │ page TOC 200px        │
│ nav tree      │ prose + code               │ on this page          │
└───────────────┴────────────────────────────┴───────────────────────┘
```

- Content measure 65–75ch. This is the most important number on a docs site
- Three-column on wide screens; the right TOC collapses first, then the left nav becomes a drawer
- Sidebar: collapsible groups, current page clearly marked, scroll position preserved across navigations
- Sticky top bar only — a sticky sidebar that scrolls independently is correct, a sticky *everything* is not

---

## Search is the primary navigation

Most users search rather than browse. Treat it as the main feature, not an add-on.

- `⌘K` / `Ctrl+K`, and a visible search field. Both
- Full-text, not title-only. Show the matched section, not just the page
- Group results by section, highlight the matched terms
- Keyboard: arrows, `Enter`, `Esc`. Recent searches when the query is empty
- **No open/close animation** — this is a many-times-per-session interaction
- Instant, or under 100ms. Local index (Pagefind, Orama, Fuse) beats a network round trip

---

## Typography and reading

- Body 16–17px, leading 1.6–1.7. Docs are read, not scanned
- Clear heading hierarchy with a visible size and weight jump. Anchor links on hover/focus, with `scroll-margin-block-start` clearing the header
- Code font 14–15px, leading 1.6, no ligatures unless deliberate
- Inline code visually distinct but not shouting — a subtle background tint plus the mono face
- Lists with real spacing between items; nested lists indented clearly
- Tables scrollable on mobile with a visible affordance
- `text-wrap: pretty` on prose

---

## Code blocks

The most-used element on the page. Get them right.

- Syntax highlighting at build time (Shiki, Prism) — zero runtime cost
- **Copy button**, top-right, with confirmation **on the button itself** (icon morph, ~1.5s), not a toast
- Filename or language label in a header bar
- Line numbers only when the prose references line numbers
- Line highlighting for the lines being discussed, and diff highlighting for changes
- Horizontal scroll rather than wrapping, with `tab-size: 2`
- Package-manager tabs (npm/pnpm/yarn/bun) with the choice remembered across pages
- Never a code block that requires horizontal scrolling to see the important part — restructure the example
- Selectable and copyable without the line numbers coming along

---

## Content structure

- **Getting started in under 5 minutes.** If installation takes more explaining than that, the docs have found a product problem
- Every page answers one question, and the title states it
- Lead with the working example, then explain. Reference-first pages are for reference sections
- **Copy-pasteable examples that actually run.** Untested docs examples are the most damaging kind of error
- Callouts: note / tip / warning / danger — visually distinct, semantic, not colour-only, and used sparingly
- API reference: consistent shape per entry — signature, params table, returns, example, notes
- Version selector if you support multiple versions, with a clear indication when the user is reading old docs
- "Last updated" and an "Edit this page" link
- Prev/next links at the bottom, following the reading order

---

## Performance

Docs are read on bad connections, in a hurry, from a search result.

- Static-generate everything. Astro, Starlight, Nextra, VitePress, Docusaurus all do this well
- Prefetch on link hover
- Local search index, lazily loaded on first search
- No framework runtime for pages that are pure prose
- Budget: under 100KB JS. A docs page that takes 3s to render is a failure of the docs

---

## Accessibility

Developer docs are read with screen readers, at high zoom, and keyboard-only more than
most surfaces.

- Skip link to content, and a second one to the search field
- Heading levels sequential — never skipped for visual size
- Code blocks reachable and scrollable by keyboard (`tabindex="0"` on the scroll container, with an accessible name)
- Copy buttons labelled and their result announced
- Link text describes the destination — a screen-reader user listing 40 "here" links has nothing
- 320px and 400% zoom: the three-column layout must degrade gracefully
- Both themes, and code themes for both

---

## Gate

- [ ] Search works, is keyboard-driven, has no animation, and returns in under 100ms
- [ ] Content measure 65–75ch; body 16–17px
- [ ] Copy button on every code block, confirming on the button
- [ ] Every example is runnable and has been checked
- [ ] Anchor links work and clear the sticky header
- [ ] Getting-started path completable in 5 minutes
- [ ] Prev/next and "last updated" present
- [ ] Under 100KB JS; static-generated
- [ ] Skip links; sequential headings; keyboard-scrollable code blocks
- [ ] 320px and 400% zoom degrade cleanly; both themes
- [ ] `commands/review.md` passed
