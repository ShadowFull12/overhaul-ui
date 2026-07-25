#!/usr/bin/env node
/**
 * overhaul-ui — a11y-lint
 *
 * Static accessibility checks that a regex can see reliably.
 *
 *   node scripts/a11y-lint.mjs <dir> [--json] [--quiet]
 *
 * This finds maybe 30-40% of real accessibility problems. It is not an audit
 * and it is not compliance. The manual pass in commands/harden.md — keyboard
 * only, a screen reader, 400% zoom — is where the rest live.
 *
 * Exit code 1 when any error-level finding is present.
 */

import path from 'node:path';
import {
  parseArgs, walk, read, rel, lineOf, snippet, c, printFindings, CODE_EXT,
} from './lib/util.mjs';

const args = parseArgs();
const root = path.resolve(args._[0] || '.');
const asJson = !!args.json;

const MARKUP = new Set(['.jsx', '.tsx', '.vue', '.svelte', '.astro', '.html', '.htm']);
const STYLES = new Set(['.css', '.scss', '.sass', '.less', '.pcss', '.postcss']);

const CHECKS = [
  /* --- focus ---------------------------------------------------------- */
  {
    id: 'outline-none',
    severity: 'error', sc: '2.4.7',
    exts: null,
    re: /outline\s*:\s*(?:none|0)\b|\boutline-none\b/g,
    skipIfFile: /focus-visible|focus:ring|focus-within/,
    message: 'Focus outline removed with no visible replacement (SC 2.4.7)',
    fix: ':focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }',
  },
  {
    id: 'positive-tabindex',
    severity: 'error', sc: '2.4.3',
    exts: null,
    re: /tabIndex\s*=\s*\{?\s*["']?[1-9]|tabindex\s*=\s*["']?[1-9]/g,
    message: 'Positive tabindex breaks the natural tab order (SC 2.4.3)',
    fix: 'Use 0 to make focusable, -1 for programmatic focus. Fix DOM order instead.',
  },

  /* --- semantics ------------------------------------------------------ */
  {
    id: 'clickable-div',
    severity: 'error', sc: '2.1.1',
    exts: MARKUP,
    re: /<(?:div|span|li)(?=[^>]*\bon(?:Click|click)=)(?![^>]*\brole=)(?![^>]*\btabIndex)[^>]*>/g,
    message: 'Clickable div/span with no role or tabindex — not keyboard operable (SC 2.1.1)',
    fix: '<button type="button">, or <a href> if it navigates.',
  },
  {
    id: 'anchor-no-href',
    severity: 'warn', sc: '2.1.1',
    exts: MARKUP,
    re: /<a(?![^>]*\bhref=)(?![^>]*\bto=)[^>]*\bon(?:Click|click)=/g,
    message: '<a> with a click handler but no href — not focusable, not announced as a link',
    fix: 'Add href, or use <button>.',
  },
  {
    id: 'img-no-alt',
    severity: 'error', sc: '1.1.1',
    exts: MARKUP,
    re: /<img(?![^>]*\balt=)[^>]*>/g,
    message: '<img> with no alt attribute (SC 1.1.1). Decorative images need alt="", not omission',
    fix: 'Describe the image, or alt="" if purely decorative.',
  },
  {
    id: 'svg-no-label',
    severity: 'info', sc: '1.1.1',
    exts: MARKUP,
    re: /<svg(?![^>]*(?:aria-hidden|aria-label|aria-labelledby|role=))[^>]*>/g,
    message: '<svg> with no aria-hidden and no accessible name',
    fix: 'aria-hidden="true" when decorative; role="img" + <title> when meaningful.',
    maxPerFile: 3,
  },
  {
    id: 'iframe-no-title',
    severity: 'warn', sc: '4.1.2',
    exts: MARKUP,
    re: /<iframe(?![^>]*\btitle=)[^>]*>/g,
    message: '<iframe> with no title — announced as "frame" with no context',
    fix: 'title="<what this frame contains>"',
  },

  /* --- forms ---------------------------------------------------------- */
  {
    id: 'input-no-label',
    severity: 'warn', sc: '3.3.2',
    exts: MARKUP,
    re: /<input(?![^>]*\b(?:aria-label|aria-labelledby|id)=)(?![^>]*type\s*=\s*["'](?:hidden|submit|button|reset)["'])[^>]*>/g,
    message: '<input> with no id and no aria-label — probably has no associated label (SC 3.3.2)',
    fix: 'A visible <label for>. Placeholder is not a label.',
  },
  {
    id: 'placeholder-as-label',
    severity: 'warn', sc: '3.3.2',
    exts: MARKUP,
    re: /<input(?=[^>]*\bplaceholder=)(?![^>]*\b(?:aria-label|aria-labelledby|id)=)[^>]*>/g,
    message: 'Placeholder used as the only label — disappears on input, fails screen readers',
    fix: 'Real <label>. Placeholder for format hints only.',
  },
  {
    id: 'no-autocomplete',
    severity: 'info', sc: '1.3.5',
    exts: MARKUP,
    re: /<input(?=[^>]*type\s*=\s*["'](?:email|password|tel|text)["'])(?![^>]*autocomplete)[^>]*>/g,
    message: 'Input with no autocomplete token (SC 1.3.5) — also just slower for everyone',
    fix: 'autocomplete="email" | "current-password" | "new-password" | "tel" | "name" | "one-time-code"',
    maxPerFile: 4,
  },
  {
    id: 'paste-blocked',
    severity: 'error', sc: '3.3.8',
    exts: null,
    re: /onPaste\s*=\s*\{?\s*(?:\([^)]*\)\s*=>\s*)?(?:e|event)?\s*(?:=>)?[^}]{0,40}preventDefault|onpaste\s*=\s*["']return false/g,
    message: 'Paste blocked — fails Accessible Authentication (SC 3.3.8) and breaks password managers',
    fix: 'Never block paste. Accept any format and normalise server-side.',
  },
  {
    id: 'number-input-misuse',
    severity: 'info', sc: null,
    exts: MARKUP,
    re: /<input[^>]*type\s*=\s*["']number["'][^>]*(?:name|id)\s*=\s*["'][^"']*(?:phone|tel|card|zip|postal|code|otp|pin)/gi,
    message: 'type="number" for a code, phone or card field — spinners, scroll-wheel changes, no leading zeros',
    fix: 'type="text" with inputmode="numeric" and the right autocomplete token.',
  },

  /* --- viewport / zoom ------------------------------------------------ */
  {
    id: 'zoom-disabled',
    severity: 'error', sc: '1.4.4',
    exts: null,
    re: /user-scalable\s*=\s*(?:no|0)|maximum-scale\s*=\s*1(?:\.0)?\b/g,
    message: 'Pinch-zoom disabled (SC 1.4.4)',
    fix: 'content="width=device-width, initial-scale=1, viewport-fit=cover"',
  },
  {
    id: 'fixed-height-text',
    severity: 'info', sc: '1.4.12',
    exts: STYLES,
    re: /\bheight\s*:\s*\d+px[^;]*;[^}]{0,120}(?:font-size|line-height)/g,
    message: 'Fixed height on a text container — clips when the user forces text spacing (SC 1.4.12)',
    fix: 'min-height instead of height.',
    maxPerFile: 4,
  },
  {
    id: 'px-root-font',
    severity: 'warn', sc: '1.4.4',
    exts: STYLES,
    re: /\bhtml\s*\{[^}]*font-size\s*:\s*\d+px/g,
    message: 'Root font-size locked in px — breaks the user\'s browser font setting (SC 1.4.4)',
    fix: 'Leave html font-size alone, or use a percentage.',
  },

  /* --- content -------------------------------------------------------- */
  {
    id: 'aria-hidden-on-focusable',
    severity: 'error', sc: '4.1.2',
    exts: MARKUP,
    re: /<(?:button|a|input|select|textarea)[^>]*aria-hidden\s*=\s*["'{]?true/g,
    message: 'aria-hidden on a focusable element — reachable by keyboard but invisible to screen readers',
    fix: 'Remove aria-hidden, or make the element non-focusable too.',
  },
  {
    id: 'autofocus',
    severity: 'info', sc: null,
    exts: MARKUP,
    re: /\bautoFocus\b|\bautofocus\b/g,
    message: 'autofocus — disorienting for screen-reader and mobile users; skips page context',
    fix: 'Only inside a dialog the user just opened. Never on page load.',
  },
  {
    id: 'title-as-label',
    severity: 'info', sc: '4.1.2',
    exts: MARKUP,
    re: /<(?:button|a)(?![^>]*aria-label)[^>]*\btitle\s*=/g,
    message: '`title` as the accessible name — unreliable, invisible on touch, invisible to keyboard',
    fix: 'Visible text, or aria-label.',
    maxPerFile: 3,
  },
  {
    id: 'marquee-blink',
    severity: 'error', sc: '2.2.2',
    exts: MARKUP,
    re: /<(?:marquee|blink)\b/g,
    message: 'Moving content with no pause control (SC 2.2.2)',
    fix: 'Remove. If a ticker is required, provide a pause control and respect reduced-motion.',
  },
];

const ABSENCE = [
  {
    id: 'no-lang-attribute',
    severity: 'error', sc: '3.1.1',
    exts: new Set(['.html', '.htm']),
    requires: /<html/i,
    missing: /<html[^>]*\blang\s*=/i,
    message: '<html> with no lang attribute (SC 3.1.1) — screen readers guess the pronunciation',
    fix: '<html lang="en">',
  },
  {
    id: 'no-skip-link',
    severity: 'info', sc: '2.4.1',
    exts: new Set(['.html', '.htm']),
    requires: /<nav|<header/i,
    missing: /skip[- ]?to|skip[- ]?link|#main-content|#content"/i,
    message: 'No skip link — keyboard users must tab through the whole nav on every page (SC 2.4.1)',
    fix: 'A visually-hidden first focusable link to #main.',
  },
  {
    id: 'no-focus-visible-styles',
    severity: 'warn', sc: '2.4.7',
    exts: STYLES,
    requires: /:hover|\.btn|\.button/,
    missing: /:focus-visible|:focus\b/,
    message: 'Stylesheet defines hover states but no focus states at all (SC 2.4.7)',
    fix: 'Every hover affordance needs a focus equivalent.',
  },
];

/* -------------------------------------------------------------------- run */

const files = walk(root, { exts: CODE_EXT });
const findings = [];
const scHits = new Set();

for (const file of files) {
  const src = read(file);
  if (!src) continue;
  const ext = path.extname(file).toLowerCase();
  const relPath = rel(file, root);

  for (const chk of CHECKS) {
    if (chk.exts && !chk.exts.has(ext)) continue;
    if (chk.skipIfFile && chk.skipIfFile.test(src)) continue;
    chk.re.lastIndex = 0;
    let m, guard = 0, perFile = 0;
    const cap = chk.maxPerFile ?? 10;
    while ((m = chk.re.exec(src)) !== null && guard++ < 300) {
      if (m[0] === '') { chk.re.lastIndex++; continue; }
      if (++perFile > cap) break;
      if (chk.sc) scHits.add(chk.sc);
      findings.push({
        rule: chk.id, sc: chk.sc, severity: chk.severity, file: relPath,
        line: lineOf(src, m.index), code: snippet(src, m.index),
        message: chk.message, fix: chk.fix,
      });
    }
  }

  for (const chk of ABSENCE) {
    if (chk.exts && !chk.exts.has(ext)) continue;
    if (!chk.requires.test(src)) continue;
    if (chk.missing.test(src)) continue;
    if (chk.sc) scHits.add(chk.sc);
    findings.push({
      rule: chk.id, sc: chk.sc, severity: chk.severity, file: relPath, line: 1,
      code: null, message: chk.message, fix: chk.fix,
    });
  }
}

const counts = { error: 0, warn: 0, info: 0 };
for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

const NOT_COVERED = [
  'keyboard operability in practice (unplug the mouse and try)',
  'focus order versus visual order',
  'focus trap and focus restore in dialogs',
  'screen reader output and announcement quality',
  'colour contrast (use scripts/contrast.mjs)',
  'reflow at 320px and 400% zoom',
  'ARIA pattern correctness for composite widgets',
  'cognitive load, plain language, and error recovery quality',
];

if (asJson) {
  console.log(JSON.stringify({
    tool: 'overhaul-ui/a11y-lint',
    root: rel(root, process.cwd()) || '.',
    filesScanned: files.length,
    counts,
    successCriteriaTouched: [...scHits].sort(),
    findings,
    notCovered: NOT_COVERED,
    disclaimer: 'Static checks catch roughly 30-40% of accessibility issues. This is not an audit and not a compliance claim.',
  }, null, 2));
} else {
  console.log(`${c.bold('overhaul-ui a11y-lint')}  ${c.gray(`${files.length} files · target WCAG 2.2 AA`)}`);
  printFindings(findings, { title: 'a11y-lint', root });
  if (scHits.size) console.log(c.gray(`\nsuccess criteria touched: ${[...scHits].sort().join(', ')}`));
  console.log(c.dim('\nNot covered by static analysis:'));
  for (const n of NOT_COVERED) console.log(c.dim(`  · ${n}`));
  console.log(c.dim('\nRun the manual pass in commands/harden.md. Do not report compliance from this output.'));
}

process.exit(counts.error > 0 ? 1 : 0);
