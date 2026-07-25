#!/usr/bin/env node
/**
 * overhaul-ui — report
 *
 * Runs every check and writes one prioritised markdown report.
 *
 *   node scripts/report.mjs <dir> [--out=overhaul-ui-report.md] [--json]
 *
 * The report is a set of leads for commands/audit.md, not an audit by itself.
 * Static analysis cannot see hierarchy, taste, or whether an animation should
 * exist at all.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs, c, rel, detectStack } from './lib/util.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs();
const root = path.resolve(args._[0] || '.');
const asJson = !!args.json;
const outFile = args.out ? path.resolve(String(args.out)) : path.join(process.cwd(), 'overhaul-ui-report.md');

function run(script, extra = []) {
  try {
    const stdout = execFileSync(
      process.execPath,
      [path.join(HERE, script), root, '--json', ...extra],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }
    );
    return JSON.parse(stdout);
  } catch (err) {
    // non-zero exit is expected when findings exist; stdout still holds the JSON
    const stdout = err.stdout ? String(err.stdout) : '';
    try { return JSON.parse(stdout); } catch {
      return { error: err.message.split('\n')[0], counts: { error: 0, warn: 0, info: 0 }, findings: [] };
    }
  }
}

const stack = detectStack(root);
const slop = run('slop-scan.mjs');
const motion = run('motion-lint.mjs');
const a11y = run('a11y-lint.mjs');

const all = [
  ...(slop.findings || []).map((f) => ({ ...f, tool: 'slop-scan' })),
  ...(motion.findings || []).map((f) => ({ ...f, tool: 'motion-lint' })),
  ...(a11y.findings || []).map((f) => ({ ...f, tool: 'a11y-lint' })),
];

const RANK = { error: 0, warn: 1, info: 2 };
all.sort((a, b) => RANK[a.severity] - RANK[b.severity] || a.file.localeCompare(b.file) || a.line - b.line);

const totals = { error: 0, warn: 0, info: 0 };
for (const f of all) totals[f.severity]++;

/* group identical rules so the report is readable */
const groups = new Map();
for (const f of all) {
  const key = f.rule;
  if (!groups.has(key)) groups.set(key, { ...f, count: 0, locations: [] });
  const g = groups.get(key);
  g.count++;
  if (g.locations.length < 8) g.locations.push(`${f.file}:${f.line ?? 1}`);
}
const grouped = [...groups.values()].sort((a, b) => RANK[a.severity] - RANK[b.severity] || b.count - a.count);

/* suggested command order, driven by what was actually found */
const cat = (name) => all.filter((f) => f.category === name || f.tool === name).length;
const plan = [
  { cmd: 'harden', when: a11y.counts?.error || a11y.counts?.warn, why: 'accessibility defects block some users entirely' },
  { cmd: 'states', when: all.some((f) => /no-data|focus-visible|no-active-state|img-no-alt/.test(f.rule)), why: 'missing states are the largest perceived-quality gap' },
  { cmd: 'colorize', when: cat('colour'), why: 'untinted greys and default gradients are what read as AI-generated' },
  { cmd: 'typeset', when: true, why: 'type contrast is the highest-leverage visual change' },
  { cmd: 'motion-audit', when: motion.counts?.error || motion.counts?.warn, why: 'motion defects make the whole product feel slow' },
  { cmd: 'layout', when: cat('layout'), why: 'spacing rhythm and nesting depth' },
  { cmd: 'copy', when: cat('copy'), why: 'slop phrasing undoes good visual work' },
  { cmd: 'review', when: true, why: 'the pre-delivery gate' },
].filter((p) => p.when);

/* -------------------------------------------------------------------- write */

const md = [];
md.push('# overhaul-ui report');
md.push('');
md.push(`**Scanned:** \`${rel(root, process.cwd()) || '.'}\` · ${slop.filesScanned ?? 0} files · ${new Date().toISOString().slice(0, 10)}`);
md.push('');
md.push('## Stack');
md.push('');
md.push(`| | |`);
md.push(`|---|---|`);
md.push(`| Framework | ${stack.framework || 'not detected'} |`);
md.push(`| Styling | ${stack.styling || 'not detected'} |`);
md.push(`| Components | ${stack.components.length ? stack.components.join(', ') : 'none detected'} |`);
md.push(`| Icons | ${stack.icons || 'none detected'} |`);
md.push(`| Motion | ${stack.motion.length ? stack.motion.join(', ') : 'CSS only'} |`);
md.push(`| Package manager | ${stack.packageManager || 'unknown'} |`);
md.push('');
md.push('## Totals');
md.push('');
md.push('| Tool | error | warn | info |');
md.push('|---|---|---|---|');
for (const [name, r] of [['slop-scan', slop], ['motion-lint', motion], ['a11y-lint', a11y]]) {
  md.push(`| ${name} | ${r.counts?.error ?? 0} | ${r.counts?.warn ?? 0} | ${r.counts?.info ?? 0} |`);
}
md.push(`| **total** | **${totals.error}** | **${totals.warn}** | **${totals.info}** |`);
md.push('');

if (slop.byCategory && Object.keys(slop.byCategory).length) {
  md.push('By category: ' + Object.entries(slop.byCategory).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '));
  md.push('');
}

md.push('## Findings');
md.push('');
if (!grouped.length) {
  md.push('No static findings. That is a floor, not a verdict — hierarchy, direction, state');
  md.push('coverage and motion judgment are not visible to static analysis.');
} else {
  let currentSeverity = null;
  for (const g of grouped) {
    if (g.severity !== currentSeverity) {
      currentSeverity = g.severity;
      md.push(`### ${g.severity === 'error' ? 'Errors' : g.severity === 'warn' ? 'Warnings' : 'Info'}`);
      md.push('');
    }
    md.push(`**\`${g.rule}\`** — ${g.count} occurrence${g.count > 1 ? 's' : ''}${g.sc ? ` · WCAG ${g.sc}` : ''}`);
    md.push('');
    md.push(g.message);
    if (g.fix) md.push(`\n*Fix:* ${g.fix}`);
    md.push('');
    md.push('```');
    md.push(g.locations.join('\n') + (g.count > g.locations.length ? `\n… ${g.count - g.locations.length} more` : ''));
    md.push('```');
    md.push('');
  }
}

md.push('## Suggested order');
md.push('');
md.push('| # | Command | Why here |');
md.push('|---|---|---|');
plan.forEach((p, i) => md.push(`| ${i + 1} | \`${p.cmd}\` | ${p.why} |`));
md.push('');
md.push('## Not covered by this report');
md.push('');
md.push('- Design direction and whether the interface has a point of view');
md.push('- Hierarchy: whether the squint test passes');
md.push('- Whether each animation should exist at all (the frequency test)');
md.push('- Colour contrast — run `node scripts/contrast.mjs --matrix <tokens>`');
md.push('- Keyboard operability, focus order, focus traps');
md.push('- Screen reader output quality');
md.push('- Reflow at 320px and 400% zoom');
md.push('- Real performance (Lighthouse / field data)');
md.push('');
md.push('Read `commands/audit.md` and do the manual pass. This file is a set of leads.');
md.push('');

const text = md.join('\n');

if (asJson) {
  console.log(JSON.stringify({
    tool: 'overhaul-ui/report', root: rel(root, process.cwd()) || '.', stack, totals,
    tools: { slop: slop.counts, motion: motion.counts, a11y: a11y.counts },
    grouped, plan: plan.map((p) => p.cmd),
  }, null, 2));
} else {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, text, 'utf8');
  console.log(`${c.bold('overhaul-ui report')}  ${c.gray(`${slop.filesScanned ?? 0} files`)}`);
  console.log(
    `  ${totals.error ? c.red(`${totals.error} error`) : c.green('0 error')} · ` +
    `${c.yellow(`${totals.warn} warn`)} · ${c.blue(`${totals.info} info`)}`
  );
  console.log(`  ${c.green('✓')} wrote ${c.bold(path.relative(process.cwd(), outFile))}`);
  if (plan.length) console.log(c.dim(`  suggested order: ${plan.map((p) => p.cmd).join(' → ')}`));
}

process.exit(totals.error > 0 ? 1 : 0);
