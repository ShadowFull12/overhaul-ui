# Credits

overhaul-ui is a **compilation and synthesis**. It carries no copied source text from
any third-party skill. Where its guidance is informed by, derived from, or converges
with prior work, that work is credited here with its canonical source and licence.

Names and trademarks are used for identification and attribution only. No endorsement
is implied. If you own something here and want the attribution changed or removed,
open an issue.

**If a skill listed below is installed alongside overhaul-ui, defer to it** — see
`SKILL.md` section 5. This skill routes to specialists rather than competing with them.

---

## Agent skills this compilation draws on

| Skill / work | Author | Source | Licence |
|---|---|---|---|
| **impeccable** — end-to-end design direction, command architecture, live browser iteration | Paul Bakaus ([@pbakaus](https://github.com/pbakaus)) | [github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 |
| **frontend-design** — the skill impeccable builds on | Anthropic | [anthropics/claude-code](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) | Apache-2.0 |
| **design-taste-frontend** (taste-skill) — anti-slop landing pages and portfolios | Leon Lin ([@Leonxlnx](https://github.com/Leonxlnx)) | [github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) · [tasteskill.dev](https://tasteskill.dev) | MIT |
| **high-end-visual-design**, **minimalist-ui**, **industrial-brutalist-ui**, **redesign-existing-projects**, **gpt-taste**, **stitch-design-taste**, **imagegen-frontend-web**, **imagegen-frontend-mobile**, **image-to-code**, **brandkit**, **full-output-enforcement** | Leon Lin | [github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT |
| **emil-design-eng** — UI polish, component craft, the animation decision framework | Emil Kowalski ([@emilkowalski](https://github.com/emilkowalski)) | [github.com/emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT |
| **apple-design** — fluid interfaces, springs, velocity, materials | Emil Kowalski, from Apple's WWDC design talks | [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT |
| **review-animations**, **improve-animations**, **find-animation-opportunities**, **animation-vocabulary**, **pick-ui-library** | Emil Kowalski | [github.com/emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT |
| **ui-ux-pro-max** — searchable style / palette / font-pairing databases | [@nextlevelbuilder](https://github.com/nextlevelbuilder) | [github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · [uupm.cc](https://uupm.cc) | MIT |
| **Agent Skills specification** — the `SKILL.md` format this skill ships in | Originally Anthropic, now a community standard | [agentskills.io/specification](https://agentskills.io/specification) | Apache-2.0 (code), CC-BY-4.0 (docs) |

### Specific debts worth naming

The motion chapter (`reference/motion.md`) is the most directly derived material in this
skill. Its framework — ask how often the user will see it, never `ease-in` on an enter,
never `scale(0)`, exits faster than enters, origin at the trigger, transitions over
keyframes for interruptible UI, and the Before/After/Why review table — comes from
**Emil Kowalski's** published work: [emilkowal.ski](https://emilkowal.ski),
the [animations.dev](https://animations.dev) course, and the source of
[Sonner](https://github.com/emilkowalski/sonner) and
[Vaul](https://github.com/emilkowalski/vaul). If you want the depth rather than the
summary, go there.

The velocity-and-interruptibility model in the spring section traces to Apple's
**WWDC 2018 session 803, "Designing Fluid Interfaces"**
([developer.apple.com](https://developer.apple.com/videos/play/wwdc2018/803/)).

The command-suite shape — one router plus per-workflow reference files, with an
audit-then-plan posture — follows the pattern established by **impeccable**
(Paul Bakaus) and Anthropic's `frontend-design`.

The anti-slop catalogue converges with **design-taste-frontend** (Leon Lin) and the
wider 2026 discussion of "AI design slop" and distributional convergence in
LLM-generated UI.

---

## Design references

| Work | Author | Source |
|---|---|---|
| Refactoring UI | Adam Wathan & Steve Schoger | [refactoringui.com](https://refactoringui.com) |
| Practical UI | Adham Dannaway | [practical-ui.com](https://practical-ui.com) |
| Web Interface Guidelines | Rauno Freiberg | [interfaces.rauno.me](https://interfaces.rauno.me) |
| 10 Usability Heuristics | Jakob Nielsen, NN/g | [nngroup.com](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| Laws of UX | Jon Yablonski | [lawsofux.com](https://lawsofux.com) |
| CSS and animation writing | Josh W. Comeau | [joshwcomeau.com/animation](https://www.joshwcomeau.com/animation/) |
| Human Interface Guidelines | Apple | [developer.apple.com/design](https://developer.apple.com/design/human-interface-guidelines) |
| Material Design 3 motion | Google | [m3.material.io](https://m3.material.io/styles/motion/overview) |
| WCAG 2.2 | W3C WAI | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |
| ARIA Authoring Practices Guide | W3C WAI | [w3.org/WAI/ARIA/apg](https://www.w3.org/WAI/ARIA/apg/) |
| Core Web Vitals / INP | Google Chrome | [web.dev/articles/inp](https://web.dev/articles/inp) |
| OKLab / OKLCH colour space | Björn Ottosson | [bottosson.github.io/posts/oklab](https://bottosson.github.io/posts/oklab/) |
| APCA contrast | Andrew Somers, Myndex | [git.apcacontrast.com](https://git.apcacontrast.com/) — restricted licence; read it before implementing |
| Design Tokens format | DTCG | [tr.designtokens.org](https://tr.designtokens.org/) |
| Geist design system and font | Vercel | [vercel.com/geist](https://vercel.com/geist/introduction) |
| Radix Primitives | WorkOS (orig. Modulz) | [radix-ui.com](https://www.radix-ui.com) — MIT |
| Base UI | MUI | [base-ui.com](https://base-ui.com) — MIT |

Typeface recommendations in `reference/typography.md` name faces from Google Fonts
(SIL Open Font License) and, where noted, commercial foundries. Check each licence
before shipping.

---

## Colour maths

`scripts/lib/color.mjs` implements sRGB ↔ linear ↔ OKLab ↔ OKLCH using the matrices
published by **Björn Ottosson** (public domain / CC0 as stated on his post), and WCAG
2.x relative-luminance and contrast-ratio formulas from the W3C specification.

---

## This skill

**overhaul-ui** — by [shadowfull12](https://github.com/ShadowFull12), MIT.
[github.com/ShadowFull12/overhaul-ui](https://github.com/ShadowFull12/overhaul-ui)
