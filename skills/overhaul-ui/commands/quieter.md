# quieter — tone it down

**Route here when:** "too much", "too loud", "tone it down", "it's exhausting", "too
flashy", "make it feel more professional".

**Writes:** visual system changes, mostly reductions.

The opposite dial to `bolder`. Common on daily-driver tools that were designed like
marketing sites.

---

## Procedure

### 1. Diagnose the noise
- Multiple competing accent colours
- Saturated colour used across large areas
- Animation on frequent interactions
- Decoration on every surface (gradients, glows, shadows)
- Too many font sizes and weights
- Emphasis everywhere, so nothing is emphasised

### 2. Desaturate
Drop chroma across the palette. Keep the hue; reduce the intensity. A `0.22` chroma
accent becomes `0.13`. Large coloured areas become neutral with a coloured detail.

### 3. Reduce the accent to signal only
The accent appears on the primary action and the active state. Nothing else. Consider
the Monochrome + One Signal direction (`reference/direction.md` §10) — it is the most
reliable way to look intentional and calm.

### 4. Flatten
Remove gradients. Reduce shadows by one or two levels. Replace glow with a border or
nothing. Replace borders with space where the grouping still reads.

### 5. Reduce the type range
Fewer sizes, fewer weights. Two weights. Reduce the scale ratio (1.333 → 1.2). Keep
enough contrast for hierarchy — quiet does not mean uniform, and uniform is a different
failure.

### 6. Cut the motion
This is usually the biggest single win. Apply the frequency test in
`reference/motion.md` §1 and delete everything in the top two rows. Shorten what
survives. Remove all scroll-reveal, all infinite loops, all decorative movement.

### 7. Increase the density, carefully
Quiet tools are often denser. Tighten row heights and paddings one tier
(`reference/layout.md` §4) — but keep touch targets at 44px and keep the spacing
*relationships* intact.

### 8. Let space do the work
With decoration gone, alignment and spacing carry all the structure. This is where
sloppiness becomes visible. Expect to spend most of the effort here.

### 9. Verify hierarchy survived
Quiet interfaces fail by becoming flat. Run the squint test — there must still be an
obvious focal point and an obvious primary action. If not, restore contrast via size
and weight, not colour.

---

## Output

```
Diagnosis: 4 accents, saturated hero, animation on every interaction, 6 shadow levels

Changes
  Colour    accent chroma 0.22 → 0.13; 4 accents → 1; hero colour field → neutral
  Accent    now only on primary actions and active nav (was 23 usages → 4)
  Surfaces  8 gradients removed; shadow levels 6 → 3; 11 glows removed
  Type      7 sizes → 5; 4 weights → 2; ratio 1.333 → 1.2
  Motion    14 animations → 4; removed all scroll-reveal and 2 infinite loops;
            durations 400ms → 180ms
  Density   comfortable → default (rows 48 → 40px); touch targets held at 44px

Hierarchy verified: squint test passes; primary action still unmistakable
Contrast: unchanged, AA both themes
```

---

## Gate

- [ ] One accent, used only as signal
- [ ] No gradients or glows without a stated reason
- [ ] Motion reduced; nothing frequent animates
- [ ] Hierarchy still passes the squint test — no flattening
- [ ] Contrast unchanged or improved
- [ ] Touch targets still >= 44px after any densification
- [ ] Build passes

## See also
`reference/direction.md` §2 and §10, `commands/bolder.md`, `commands/distill.md`
