# Direction — choosing and committing to a look

Direction is the input that prevents average output. Pick one before writing markup.
Name it in the deliverable. Do not blend two.

---

## How to choose

Answer four questions, then match:

1. **Emotional target** — should the user feel calm, impressed, efficient, playful, safe, provoked?
2. **Density** — art gallery (airy) or cockpit (dense)? Marketing skews airy; tools skew dense.
3. **Frequency of use** — daily driver (quiet, fast, no motion) or one-time visit (can be expressive).
4. **Credibility requirement** — fintech, health and security need visible sobriety. Consumer entertainment does not.

Then sanity-check: would a competitor's site be interchangeable with this one? If yes,
push the direction harder or change it.

---

## The catalogue

Each entry: what it is, when it fits, the mechanics that make it work, and how it
fails.

### 1. Editorial / Publication
Type-led, asymmetric, generous margins, real photography, minimal chrome.
**Fits:** portfolios, agencies, blogs, brand sites, docs with personality.
**Mechanics:** one serif display face at 56–120px with tight negative tracking; 65ch measure; baseline-ish rhythm; images full-bleed or hard-cropped to the grid; almost no borders; near-zero motion.
**Fails as:** unstructured and hard to scan if the grid is not enforced.

### 2. Quiet Product (Linear/Notion register)
Restrained, dense-but-breathable, hairline separators, one accent, tinted greys.
**Fits:** SaaS product UI, dashboards, developer tools, internal apps.
**Mechanics:** 13–14px UI text, 16px body; 4/8px spacing; `1px` borders at 6–10% contrast; radius 6–10px; shadows barely visible or absent; motion 100–180ms or none.
**Fails as:** forgettable if hierarchy contrast is too low. Needs at least one confident moment.

### 3. Warm Minimal
Off-white and cream grounds, soft neutrals, one muted accent, rounded geometry.
**Fits:** wellness, education, healthcare, consumer finance, family products.
**Mechanics:** background `oklch(0.97 0.008 85)`; humanist sans; radius 12–20px; shadows large and very soft; illustration over photography.
**Fails as:** bland and low-contrast. Enforce the 4.5:1 floor deliberately.

### 4. Technical Dark
Near-black tinted ground, monospace accents, precise 1px lines, data-forward.
**Fits:** developer tools, observability, crypto, security, infra.
**Mechanics:** `oklch(0.17 0.014 260)` base, elevated surfaces +0.03 L; one saturated accent used sparingly; mono for identifiers, numbers, keys; tabular numerals everywhere; grid lines instead of card borders.
**Fails as:** the neon-cyberpunk cliché. Keep saturation low except on the accent.

### 5. Brutalist / Swiss Print
Rigid modular grid, extreme type-scale contrast, visible structure, near-zero decoration.
**Fits:** portfolios, editorial, culture, statements, anti-corporate positioning.
**Mechanics:** Helvetica-lineage or grotesque; 2px+ hard borders; pure structural colour (black, one signal red); no radius; no shadow; type as image at 15–25vw.
**Fails as:** unusable for dense product work; hostile if applied to transactional flows.

### 6. Industrial / Tactical Telemetry
Manual-and-terminal aesthetic: monospace labels, coordinate readouts, dense data, analog texture.
**Fits:** data-heavy dashboards, aerospace/defence-adjacent, hardware, dev tools with attitude.
**Mechanics:** all-caps mono micro-labels with positive tracking; hairline grid overlays; amber/green/off-white on graphite; halftone or scanline texture at very low opacity; no radius.
**Fails as:** illegible costume if the data underneath is not genuinely dense.

### 7. Soft Depth (post-neumorphic)
Layered surfaces, real light logic, subtle inner and outer shadow, physical feel.
**Fits:** consumer apps, music, finance, anything gesture-driven.
**Mechanics:** consistent single light source; 2–3 elevation levels with matched shadow pairs (tight+dark, wide+soft); tinted shadows, never pure black; radius 14–24px.
**Fails as:** classic neumorphism — low contrast and unreadable affordances. Keep contrast on the foreground.

### 8. Glass / Translucent Material
Backdrop blur, layered translucency, vibrancy over content.
**Fits:** overlays, media apps, OS-adjacent UI, mobile sheets.
**Mechanics:** blur 20–40px with a saturation boost; translucency only where there is real content behind; always a solid fallback; borders with a light top edge to fake a specular highlight.
**Fails as:** the AI default. Use on 1–2 surfaces (nav, sheet), never on every card. Costly to paint — never animate blur on a large area.

### 9. Bold Colour Block
Large flat colour fields, hard edges, oversized type, high energy.
**Fits:** consumer launches, events, campaigns, sports, youth brands.
**Mechanics:** 2–3 saturated colours in large areas, not accents; text sized to fill its field; no gradients; motion punchy and short.
**Fails as:** exhausting and inaccessible if contrast pairs are not checked.

### 10. Monochrome + One Signal
Entire interface greyscale except a single colour reserved for the primary action or live state.
**Fits:** tools, dashboards, anything where "what do I do next" must be unmissable.
**Mechanics:** full neutral ramp does all the work; the signal colour appears at most twice per view.
**Fails as:** nothing — this is the safest way to look intentional. Best default when unsure.

### 11. Retro Digital
Early-web / terminal / pixel references, deliberate low fidelity.
**Fits:** indie tools, games, communities, nostalgia products.
**Mechanics:** pixel or bitmap face for accents only; limited palette; 1px hard shadows; dithering; `image-rendering: pixelated`.
**Fails as:** unreadable body text. Never set long copy in a pixel font.

### 12. Luxury / Fashion
Vast whitespace, tiny tracked-out labels, huge imagery, near-invisible UI.
**Fits:** premium goods, hospitality, jewellery, real estate, high-end services.
**Mechanics:** 10–11px all-caps labels with `0.15em` tracking; a display serif or a high-contrast didone; black/ivory/one metallic; slow 600–900ms image transitions; nothing rounded.
**Fails as:** slow and unusable if applied to a transactional flow. Keep checkout conventional.

### 13. Playful Geometric
Rounded shapes, illustrated accents, bright but controlled, generous motion.
**Fits:** kids, education, social, onboarding, community.
**Mechanics:** radius 16–28px; 3–4 bright hues from one family; custom illustration; spring motion with bounce 0.2–0.3; sticker-like layering.
**Fails as:** unprofessional for B2B, and slow if motion is everywhere.

### 14. Data Dense
Maximum information per screen, tables first, chrome minimised.
**Fits:** trading, analytics, admin, ops consoles, CRMs.
**Mechanics:** 12–13px text, 28–32px row height; zebra or hairline rows, never both; sticky headers; tabular numerals; colour only for status; virtualised lists.
**Fails as:** unreadable if spacing and alignment are not perfect. This direction has the least tolerance for sloppiness.

### 15. Immersive / Cinematic
Full-viewport imagery or video, scroll as narrative, text over media.
**Fits:** launches, films, games, travel, showcases.
**Mechanics:** scrim gradients behind text for contrast; scroll-driven animation via CSS `animation-timeline`; poster frames; hard performance budget.
**Fails as:** heavy, slow, inaccessible, and unusable on metered connections. Needs a reduced-motion and a low-bandwidth path.

### 16. Neo-Skeuomorphic Tactile
Real material references — paper, tape, ink, physical controls — used sparingly.
**Fits:** notes, journals, creative tools, music hardware UIs.
**Mechanics:** subtle noise/grain texture at 2–4% opacity; realistic edge highlights; physical control metaphors (dials, faders) with real drag behaviour.
**Fails as:** kitsch when overdone. One or two material moments, not a whole theme.

### 17. Utilitarian Web (deliberately plain)
System fonts, native controls, no decoration, ruthless speed.
**Fits:** internal tools, government, documentation, low-bandwidth contexts.
**Mechanics:** `system-ui` stack; native `<select>`, `<details>`, `<dialog>`; almost no CSS; sub-50KB pages.
**Fails as:** reads as unfinished to consumer audiences. State that plainness is the point.

### 18. Motion-Led
Layout is conventional; the differentiation is entirely in how things move.
**Fits:** design-engineering portfolios, component libraries, tools whose value is feel.
**Mechanics:** springs with velocity inheritance, shared-element transitions, gesture-first interaction, interruptible everything. Requires `reference/motion.md` in full.
**Fails as:** an animation showreel with nothing underneath. The static design must already be good.

---

## Committing

Once chosen, write the direction into the project so it survives future sessions.
`templates/DESIGN.md` is the file to fill in. Record:

- Direction name + one-sentence intent
- Type: display face, text face, mono face, scale ratio, weights
- Colour: neutral ramp, one accent, semantic roles, both themes
- Geometry: radius scale, border weights, shadow set
- Motion: easing tokens, duration tiers, what never animates
- Density: spacing scale, default row height, container widths
- Three things this direction explicitly rejects

The rejections matter as much as the choices. They are what stop drift back to the
average in the next session.

## Blending — the one legal case

You may combine a **base** direction for structure with a **single accent** direction
for one surface. Example: Quiet Product base + one Immersive hero. That is one
deliberate contrast. Anything beyond that is drift.
