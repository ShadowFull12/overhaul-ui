#!/usr/bin/env node
/**
 * overhaul-ui — motion-lint
 *
 * Finds motion anti-patterns that a regex can see reliably.
 *
 *   node scripts/motion-lint.mjs <dir> [--json] [--quiet]
 *
 * What it cannot see, and you must check by hand:
 *   - whether an animation should exist at all (the frequency test)
 *   - whether the transform origin matches the trigger
 *   - whether an animation is interruptible in practice
 *   - anything driven by a JS library's runtime config
 * Those live in commands/motion-audit.md.
 *
 * Exit code 1 when any error-level finding is present.
 */

import path from 'node:path';
import {
  parseArgs, walk, read, rel, lineOf, snippet, c, printFindings, stripNoise, CODE_EXT,
} from './lib/util.mjs';

const args = parseArgs();
const root = path.resolve(args._[0] || '.');
const asJson = !!args.json;

const CHECKS = [
  {
    id: 'transition-all',
    severity: 'error',
    re: /transition\s*:\s*all\b|\btransition-all\b/g,
    message: '`transition: all` — animates properties you never intended, including layout ones',
    fix: 'transition: transform 180ms var(--ease-out), opacity 180ms var(--ease-out)',
  },
  {
    id: 'ease-in-on-enter',
    severity: 'error',
    re: /(?:transition|animation)[^;\n{]{0,90}\bease-in\b(?!-out)/g,
    message: '`ease-in` — starts slow at the exact moment the user is watching',
    fix: 'var(--ease-out) = cubic-bezier(0.23, 1, 0.32, 1). ease-in is only defensible on an exit.',
  },
  {
    id: 'scale-zero',
    severity: 'error',
    re: /\bscale\(\s*0\s*\)|\bscale3d\(\s*0\s*,|\bscale-0\b/g,
    message: 'Entrance from scale(0) — nothing in the real world appears from nothing',
    fix: 'transform: scale(0.96); opacity: 0',
  },
  {
    id: 'bounce-easing',
    severity: 'error',
    re: /cubic-bezier\(\s*[-\d.]+\s*,\s*-[\d.]+|cubic-bezier\([^)]*,\s*1\.[1-9]\d*\s*\)|\bease-\[cubic-bezier\([^\]]*-[\d.]/g,
    message: 'Overshoot/bounce easing on UI — reads as toy-like and adds perceived latency',
    fix: 'Reserve bounce (0.1–0.25) for drag-release and rare playful moments.',
  },
  {
    id: 'layout-property-animation',
    severity: 'error',
    re: /transition\s*:\s*(?:[^;\n]*\s)?(?:height|width|top|left|right|bottom|margin(?:-\w+)?|padding(?:-\w+)?)\b[^;\n]*\d/g,
    message: 'Animating a layout property — forces layout on every frame',
    fix: 'transform/opacity. For size: grid-template-rows 0fr→1fr, interpolate-size, or FLIP.',
  },
  {
    id: 'keyframes-layout-property',
    severity: 'warn',
    re: /@keyframes[^{]*\{(?:[^{}]|\{[^{}]*\})*?\b(?:height|width|top|left|margin-\w+)\s*:\s*[-\d]/g,
    message: 'Keyframes animating a layout property',
    fix: 'Rewrite in transform/opacity, or use a FLIP technique.',
  },
  {
    id: 'duration-too-long',
    severity: 'warn',
    re: /transition(?:-duration)?\s*:\s*(?:[^;\n]*\s)?(?:[5-9]\d{2}|[1-9]\d{3,})ms|duration-\[?(?:[5-9]\d{2}|[1-9]\d{3,})ms/g,
    message: 'UI transition >= 500ms — the whole interface feels heavy',
    fix: 'Tooltip 125–200 · dropdown 150–250 · modal 200–300. Drawers and marketing may exceed.',
  },
  {
    id: 'duration-seconds',
    severity: 'warn',
    re: /transition(?:-duration)?\s*:\s*(?:[^;\n]*\s)?[1-9](?:\.\d+)?s\b/g,
    message: 'Transition measured in whole seconds — almost certainly too slow for UI',
    fix: 'Under 300ms for UI. Marketing motion is the only exception.',
  },
  {
    id: 'blur-animation',
    severity: 'warn',
    re: /transition\s*:\s*[^;\n]*\b(?:backdrop-)?filter\b|transition\s*:\s*[^;\n]*backdrop-filter/g,
    message: 'Animating filter/backdrop-filter — paint-expensive, worst in Safari',
    fix: 'Animate opacity on a pre-blurred layer instead. Keep any blur under 20px.',
  },
  {
    id: 'permanent-will-change',
    severity: 'warn',
    re: /will-change\s*:\s*(?!auto\b)[\w-]/g,
    message: 'Static `will-change` — wastes GPU memory and can reduce performance',
    fix: 'Set it just before the animation, remove it after.',
  },
  {
    id: 'motion-shorthand-props',
    severity: 'warn',
    re: /animate\s*=\s*\{\{[^}]{0,80}?\b(?:x|y|scale|rotate)\s*:/g,
    message: 'Motion `x`/`y`/`scale` shorthand is not GPU-accelerated — it runs on the main thread',
    fix: 'animate={{ transform: "translateX(100px)" }}, or use CSS for predetermined motion.',
  },
  {
    id: 'infinite-decorative-loop',
    severity: 'warn',
    re: /animation\s*:\s*[^;\n]*\binfinite\b|\banimate-(?:pulse|bounce|ping)\b/g,
    message: 'Infinite decorative animation — constant peripheral motion is fatiguing',
    fix: 'Static, or a single slow parallax. Keep pulse for genuine loading indicators only.',
  },
  {
    id: 'scroll-listener',
    severity: 'info',
    re: /addEventListener\(\s*['"]scroll['"]/g,
    message: 'Scroll listener — CSS scroll-driven animations run off the main thread',
    fix: 'animation-timeline: scroll() / view(). Or throttle to rAF and never read layout inside.',
  },
  {
    id: 'transform-origin-center-on-popover',
    severity: 'info',
    re: /(?:popover|dropdown|menu|tooltip|select)[^{]{0,60}\{[^}]{0,200}transform-origin\s*:\s*center/gi,
    message: 'Anchored overlay with centre transform origin — it should scale from its trigger',
    fix: 'transform-origin: var(--transform-origin). Modals are the exception — keep them centred.',
  },
  {
    id: 'smooth-scroll-ungated',
    severity: 'info',
    re: /scroll-behavior\s*:\s*smooth/g,
    message: '`scroll-behavior: smooth` — needs a reduced-motion override',
    fix: '@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }',
  },
];

const ABSENCE = [
  {
    id: 'no-reduced-motion',
    severity: 'error',
    requires: /@keyframes|animation\s*:|transition\s*:\s*[\w-]+\s+\d/,
    missing: /prefers-reduced-motion/,
    exts: new Set(['.css', '.scss', '.sass', '.less', '.pcss', '.postcss']),
    message: 'Stylesheet animates but never handles `prefers-reduced-motion`',
    fix: 'Add a reduce block that substitutes opacity for movement. See templates/motion.css.',
  },
  {
    id: 'no-active-state',
    severity: 'warn',
    requires: /(?:\.btn|\.button|button)\s*(?:,[^{]*)?\{[^}]*(?::hover|transition)/,
    missing: /:active|active:|data-pressed/,
    exts: new Set(['.css', '.scss', '.sass', '.less', '.pcss', '.postcss']),
    message: 'Button styles with hover but no `:active` — the interface never confirms the press',
    fix: '.button:active { transform: scale(0.97); } with a ~150ms ease-out transition.',
  },
];

/* -------------------------------------------------------------------- run */

const files = walk(root, { exts: CODE_EXT });
const findings = [];

for (const file of files) {
  const src = read(file);
  if (!src) continue;
  const relPath = rel(file, root);
  const ext = path.extname(file).toLowerCase();
  const clean = stripNoise(src);

  for (const chk of CHECKS) {
    chk.re.lastIndex = 0;
    let m, guard = 0, perFile = 0;
    while ((m = chk.re.exec(clean)) !== null && guard++ < 300) {
      if (m[0] === '') { chk.re.lastIndex++; continue; }
      if (++perFile > 12) break;
      findings.push({
        rule: chk.id, severity: chk.severity, file: relPath,
        line: lineOf(src, m.index), code: snippet(src, m.index),
        message: chk.message, fix: chk.fix,
      });
    }
  }

  for (const chk of ABSENCE) {
    if (!chk.exts.has(ext)) continue;
    if (!chk.requires.test(src)) continue;
    if (chk.missing.test(src)) continue;
    findings.push({
      rule: chk.id, severity: chk.severity, file: relPath, line: 1,
      code: null, message: chk.message, fix: chk.fix,
    });
  }
}

const counts = { error: 0, warn: 0, info: 0 };
for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

if (asJson) {
  console.log(JSON.stringify({
    tool: 'overhaul-ui/motion-lint', root: rel(root, process.cwd()) || '.',
    filesScanned: files.length, counts, findings,
    notCovered: [
      'whether the animation should exist at all (frequency test)',
      'transform origin correctness relative to the trigger',
      'interruptibility in practice',
      'runtime config of JS animation libraries',
    ],
  }, null, 2));
} else {
  console.log(`${c.bold('overhaul-ui motion-lint')}  ${c.gray(`${files.length} files`)}`);
  printFindings(findings, { title: 'motion-lint', root });
  console.log(
    c.dim(
      '\nNot checked here: whether each animation should exist at all, transform-origin\n' +
      'correctness, interruptibility, and JS library runtime config. See commands/motion-audit.md.'
    )
  );
}

process.exit(counts.error > 0 ? 1 : 0);
