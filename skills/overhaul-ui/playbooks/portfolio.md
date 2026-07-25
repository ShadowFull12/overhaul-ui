# Playbook — portfolio / personal site

The one surface where being generic is disqualifying. A templated portfolio actively
argues against hiring you.

---

## Direction

Pick something with a point of view: Editorial, Brutalist, Motion-Led, Luxury, or
deliberately Utilitarian. `reference/direction.md`.

The safest-looking choice is the worst choice here. A plain, fast, well-typeset page with
one distinctive move beats a feature-rich page that looks like a theme.

---

## Structure

Shorter than you think. Most portfolios are too long.

1. **Who you are** — one or two sentences at the top. Name, what you do, what you are looking for. No "Hi, I'm X 👋"
2. **Selected work** — 3–6 pieces. Selected, not exhaustive
3. **About** — brief. Link to a CV rather than reproducing it
4. **Contact** — an email address as text, not a form

That is a complete portfolio. Add a writing section, a now page, or experiments only if
they are genuinely good.

**Skip:** a skills grid with progress bars (meaningless), a technology logo wall, a
timeline of every job, testimonials from classmates, a hero with "Full-Stack Developer |
Designer | Problem Solver".

---

## Case studies

The actual product of a portfolio. Each piece needs:

- **The problem** in one paragraph, in plain language
- **Your role** — specifically what you did, especially on team projects. Vagueness here reads as inflation
- **The approach** — 2–4 decisions and why you made them. This is what a reviewer is assessing
- **The outcome** — a number if one exists, honestly. "We did not measure it" is respectable
- **Visuals** — large, legible, real. One good image beats six thumbnails

Length: 400–800 words. Reviewers skim; make the structure scannable and lead each section
with its conclusion.

**Do not:** show only final polished mockups with no reasoning · use "we" to obscure what
you personally did · include a project you cannot discuss · pad with process photos of
sticky notes.

---

## Typography

This is the whole design on a text-led site. `reference/typography.md`.

- One distinctive display face. This is the single biggest differentiator available
- Real scale contrast — the name or headline can be very large
- 65ch measure on prose. Portfolio text is often the longest reading on the site
- Attend to the optical details: tracking at display sizes, curly quotes, en dashes, hanging punctuation on pull quotes

---

## Images

- Real work at real resolution. A blurry screenshot signals carelessness about your own work
- `aspect-ratio` on every slot so nothing jumps
- AVIF/WebP, `srcset`, LQIP or blurhash placeholders
- Consistent treatment across pieces: the same crop logic, the same background, the same corner treatment. Inconsistency reads louder than any individual image
- Never a stock 3D abstract render

---

## Motion

One of the few places where motion-as-craft is on-brief — a design engineer's portfolio
that moves well is demonstrating the skill it claims.

But: the static design must already be good. Motion on a weak layout is a showreel with
nothing underneath.

Justified: one page-entry sequence · shared-element transitions between index and case
study (View Transitions are perfect for this) · a genuinely interesting hover on work
items · one signature interaction that demonstrates skill.

Not justified: fade-up on every paragraph · a custom cursor that fights native behaviour ·
a preloader on a 200KB site · scroll-jacking · a horizontal-scroll page that breaks
keyboard navigation.

Always: `prefers-reduced-motion`, and a keyboard path through everything.

---

## Performance

A slow portfolio is a technical statement about you.

Targets: LCP under 1.5s · total page under 500KB · no framework runtime unless it earns
its place. Astro, Eleventy or plain HTML are all excellent choices here. Self-host fonts.
Static-host it.

---

## Practical details people forget

- Working `mailto:` or a plainly visible email address. A contact form that silently fails is the worst possible outcome
- OG image and meta description per page — your work will be shared in Slack and Twitter
- A real favicon, all sizes
- Working links. Check every one, including the dead side project
- A downloadable CV if you are job-hunting, with a stable URL
- Dates on work, so "recent" stays true
- Accessible: portfolios are reviewed by design teams who check. A portfolio with no focus rings has failed its own audition

---

## Gate

- [ ] The direction is distinctive and nameable
- [ ] Nothing that reads as a theme or a template
- [ ] 3–6 selected pieces, each with problem / role / approach / outcome
- [ ] Your specific contribution is unambiguous on every piece
- [ ] One distinctive display face; real scale contrast; 65ch prose measure
- [ ] Consistent image treatment; every image sharp
- [ ] Email reachable without a form; every link works
- [ ] OG images, meta descriptions, favicon
- [ ] Keyboard pass; visible focus rings; reduced motion honoured
- [ ] LCP < 1.5s; page under ~500KB
- [ ] `commands/review.md` passed
