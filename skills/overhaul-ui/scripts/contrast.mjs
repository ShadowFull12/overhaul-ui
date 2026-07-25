#!/usr/bin/env node
/**
 * overhaul-ui — contrast
 *
 * WCAG 2.x contrast between two colours, or a full matrix for a token set.
 *
 *   node scripts/contrast.mjs "#4B5563" "#FFFFFF"
 *   node scripts/contrast.mjs "oklch(0.55 0.17 258)" "#fff" --json
 *   node scripts/contrast.mjs --matrix tokens.json
 *   node scripts/contrast.mjs --matrix design-system/tokens.css
 *   node scripts/contrast.mjs --fix "#9CA3AF" "#FFFFFF" --target=4.5
 *
 * Accepts hex, rgb(), oklch() and a few named colours. Translucent
 * foregrounds are composited over the background first, because
 * `opacity: 0.6` text must be judged on what the user actually sees.
 *
 * Exit code 1 when any measured pair fails its threshold.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, c, rel } from './lib/util.mjs';
import { parseColor, contrastRatio, wcag, toHex, fixContrast, rgbToOklch, fmtOklch } from './lib/color.mjs';

const args = parseArgs();
const asJson = !!args.json;
const target = Number(args.target || 4.5);

if (args.matrix) matrix(String(args.matrix));
else if (args.fix) fix();
else if (args._.length >= 2) pair(args._[0], args._[1]);
else usage();

/* ------------------------------------------------------------------- modes */

function pair(fgRaw, bgRaw) {
  let fg, bg;
  try {
    fg = parseColor(fgRaw);
    bg = parseColor(bgRaw);
  } catch (err) {
    console.error(`${c.red('error')} ${err.message}`);
    process.exit(2);
  }

  const ratio = contrastRatio(fg, bg);
  const w = wcag(ratio);
  const fgHex = toHex(fg), bgHex = toHex(bg);
  const fgOk = rgbToOklch(fg.r, fg.g, fg.b);

  if (asJson) {
    console.log(JSON.stringify({
      tool: 'overhaul-ui/contrast', foreground: fgHex, background: bgHex, ...w,
    }, null, 2));
  } else {
    const ok = (b) => (b ? c.green('pass') : c.red('fail'));
    console.log(`\n  ${c.swatch(fgHex)} ${c.bold(fgHex)} ${c.gray('on')} ${c.swatch(bgHex)} ${c.bold(bgHex)}`);
    console.log(`  ${c.gray(fmtOklch(fgOk.L, fgOk.C, fgOk.H))}\n`);
    console.log(`  ${c.bold(`${w.ratio}:1`)}   ${c.gray(`grade ${w.grade}`)}\n`);
    console.log(`  body text        AA  4.5:1   ${ok(w.normalAA)}`);
    console.log(`  body text        AAA 7:1     ${ok(w.normalAAA)}`);
    console.log(`  large text       AA  3:1     ${ok(w.largeAA)}   ${c.gray('>=24px, or >=19px bold')}`);
    console.log(`  UI / focus ring  AA  3:1     ${ok(w.uiAA)}   ${c.gray('SC 1.4.11, 2.4.13')}`);

    if (!w.normalAA) {
      const suggestion = fixContrast(fg, bg, 4.5);
      if (suggestion) {
        console.log(
          `\n  ${c.cyan('→')} nearest passing foreground: ${c.swatch(suggestion.hex)} ${c.bold(suggestion.hex)} ` +
          c.gray(`(${suggestion.ratio.toFixed(2)}:1, ${fmtOklch(suggestion.L, suggestion.C, suggestion.H)})`)
        );
      }
    }
    console.log();
  }
  process.exit(w.normalAA ? 0 : 1);
}

function fix() {
  const fgRaw = String(args.fix);
  const bgRaw = args._[0] || '#ffffff';
  const fg = parseColor(fgRaw), bg = parseColor(bgRaw);
  const res = fixContrast(fg, bg, target);
  if (!res) {
    console.error(`${c.red('error')} cannot reach ${target}:1 against ${toHex(bg)} by adjusting lightness alone`);
    process.exit(1);
  }
  if (asJson) console.log(JSON.stringify({ from: toHex(fg), to: res.hex, ratio: res.ratio, oklch: fmtOklch(res.L, res.C, res.H) }, null, 2));
  else console.log(`${c.swatch(toHex(fg))} ${toHex(fg)} ${c.gray('→')} ${c.swatch(res.hex)} ${c.bold(res.hex)}  ${c.gray(`${res.ratio.toFixed(2)}:1  ${fmtOklch(res.L, res.C, res.H)}`)}`);
  process.exit(0);
}

/* ------------------------------------------------------------------ matrix */

const COLOR_RE = /(#[0-9a-fA-F]{3,8}\b|oklch\([^)]+\)|rgba?\([^)]+\))/;

function collect(file) {
  const text = fs.readFileSync(file, 'utf8');
  const tokens = new Map();

  if (file.endsWith('.json')) {
    const walkJson = (obj, prefix = '') => {
      for (const [k, v] of Object.entries(obj || {})) {
        const name = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'string' && COLOR_RE.test(v)) tokens.set(name, v.match(COLOR_RE)[0]);
        else if (v && typeof v === 'object') walkJson(v, name);
      }
    };
    walkJson(JSON.parse(text));
  } else {
    // CSS custom properties, resolving one level of var() indirection
    const decl = /--([\w-]+)\s*:\s*([^;]+);/g;
    const raw = new Map();
    let m;
    while ((m = decl.exec(text)) !== null) raw.set(m[1], m[2].trim());
    for (const [name, value] of raw) {
      let v = value;
      const ref = v.match(/var\(\s*--([\w-]+)/);
      if (ref && raw.has(ref[1])) v = raw.get(ref[1]);
      const hit = v.match(COLOR_RE);
      if (hit) tokens.set(name, hit[0]);
    }
  }
  return tokens;
}

function matrix(file) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) {
    console.error(`${c.red('error')} not found: ${file}`);
    process.exit(2);
  }

  const tokens = collect(abs);
  if (!tokens.size) {
    console.error(`${c.red('error')} no colour tokens found in ${rel(abs)}`);
    process.exit(2);
  }

  const isBg = (n) => /(^|[-.])(bg|background|surface|canvas|card|paper|elevated|inset|subtle)/i.test(n);
  const isFg = (n) => /(^|[-.])(fg|foreground|text|content|label|muted|heading|body|ink|copy)/i.test(n);
  const isLine = (n) => /(^|[-.])(border|divider|outline|ring|stroke|separator)/i.test(n);

  const bgs = [...tokens].filter(([n]) => isBg(n));
  const fgs = [...tokens].filter(([n]) => isFg(n));
  const lines = [...tokens].filter(([n]) => isLine(n));

  if (!bgs.length || (!fgs.length && !lines.length)) {
    console.error(
      `${c.yellow('warn')} could not classify tokens by role in ${rel(abs)}.\n` +
      `        Name them semantically (--bg, --bg-subtle, --fg, --fg-muted, --border) ` +
      `and re-run. See reference/design-tokens.md.`
    );
    process.exit(2);
  }

  const rows = [];
  for (const [bgName, bgVal] of bgs) {
    let bg;
    try { bg = parseColor(bgVal); } catch { continue; }
    for (const [fgName, fgVal] of [...fgs, ...lines]) {
      let fg;
      try { fg = parseColor(fgVal); } catch { continue; }
      const needed = isLine(fgName) || /subtle|placeholder/i.test(fgName) ? 3 : 4.5;
      const ratio = contrastRatio(fg, bg);
      rows.push({
        fg: fgName, bg: bgName, fgHex: toHex(fg), bgHex: toHex(bg),
        ratio: Math.round(ratio * 100) / 100, needed,
        pass: ratio >= needed,
      });
    }
  }

  const failures = rows.filter((r) => !r.pass);

  if (asJson) {
    console.log(JSON.stringify({
      tool: 'overhaul-ui/contrast', source: rel(abs), pairs: rows.length,
      failures: failures.length, rows,
    }, null, 2));
  } else {
    console.log(`\n${c.bold('contrast matrix')}  ${c.gray(`${rel(abs)} · ${tokens.size} tokens · ${rows.length} pairs`)}\n`);
    const width = Math.max(...rows.map((r) => r.fg.length + r.bg.length)) + 6;
    for (const r of rows.sort((a, b) => a.ratio - b.ratio)) {
      const label = `${r.fg} on ${r.bg}`.padEnd(width);
      const tag = r.pass ? c.green('pass') : c.red('FAIL');
      const need = c.gray(`needs ${r.needed}`);
      console.log(`  ${c.swatch(r.fgHex)}${c.swatch(r.bgHex)} ${label} ${String(r.ratio).padStart(6)}:1  ${tag}  ${need}`);
    }
    console.log(
      failures.length
        ? `\n${c.red(`${failures.length} failing pair${failures.length > 1 ? 's' : ''}`)}. ` +
          c.dim('Run with --fix "<colour>" "<background>" for the nearest passing value.')
        : `\n${c.green('All pairs pass.')} ${c.dim('Re-run against the dark theme file too — contrast is not preserved by inversion.')}`
    );
    console.log();
  }
  process.exit(failures.length ? 1 : 0);
}

/* ------------------------------------------------------------------- usage */

function usage() {
  console.log(`
${c.bold('overhaul-ui contrast')} — WCAG 2.x contrast

  node scripts/contrast.mjs <foreground> <background>
  node scripts/contrast.mjs --matrix <tokens.css|tokens.json>
  node scripts/contrast.mjs --fix <colour> [background] [--target=4.5]

Options
  --json              machine-readable output
  --target=<n>        target ratio for --fix (default 4.5)

Accepts  #rgb  #rrggbb  #rrggbbaa  rgb()  rgba()  oklch()  black  white

Thresholds
  4.5:1  body text (SC 1.4.3)
  3:1    text >=24px or >=19px bold, icons, focus rings (SC 1.4.11 / 2.4.13)
  7:1    body text AAA (SC 1.4.6)
`);
  process.exit(2);
}
