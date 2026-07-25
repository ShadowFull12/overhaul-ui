#!/usr/bin/env node
/**
 * overhaul-ui — slop-scan
 *
 * Scans a codebase for AI-slop tells and craft defects defined in
 * data/slop-rules.json.
 *
 *   node scripts/slop-scan.mjs <dir> [options]
 *
 *   --json              machine-readable output
 *   --min=warn|error    only report at or above this severity
 *   --category=colour   filter by category (comma-separated)
 *   --fix-hints         print the suggested fix for every finding
 *   --max=<n>           cap findings per rule across the run (default 40)
 *   --quiet             summary only
 *
 * Exit code 1 when any error-level finding is present, else 0.
 *
 * A finding is a lead, not a verdict. Confirm it in the code before acting,
 * and never "fix" a false positive into worse code.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseArgs, walk, read, rel, lineOf, snippet, c,
  printFindings, sortFindings, stripNoise, CODE_EXT,
} from './lib/util.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RULES_FILE = path.join(HERE, '..', 'data', 'slop-rules.json');

const args = parseArgs();
const root = path.resolve(args._[0] || '.');
const asJson = !!args.json;
const quiet = !!args.quiet;
const showFix = !!args['fix-hints'] || !asJson;
const minSeverity = String(args.min || 'info');
const maxPerRule = Number(args.max || 40);
const categories = args.category
  ? String(args.category).split(',').map((s) => s.trim().toLowerCase())
  : null;

const RANK = { error: 0, warn: 1, info: 2 };

/* ------------------------------------------------------------------- rules */

function loadRules() {
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(RULES_FILE, 'utf8'));
  } catch (err) {
    console.error(`${c.red('error')} cannot read ${rel(RULES_FILE)}: ${err.message}`);
    process.exit(2);
  }
  const out = [];
  for (const r of raw.rules || []) {
    if (categories && !categories.includes(String(r.category).toLowerCase())) continue;
    if ((RANK[r.severity] ?? 3) > (RANK[minSeverity] ?? 2)) continue;
    try {
      const flags = new Set(String(r.flags || '').split(''));
      flags.add('g');
      out.push({
        ...r,
        re: new RegExp(r.pattern, [...flags].join('')),
        requiresRe: r.requires ? new RegExp(r.requires, 'm') : null,
        absenceRe: r.kind === 'absence' ? new RegExp(r.pattern, 'i') : null,
        exts: new Set(r.ext || ['*']),
      });
    } catch (err) {
      console.error(`${c.yellow('warn')} rule ${r.id} has an invalid pattern: ${err.message}`);
    }
  }
  return out;
}

/* -------------------------------------------------------------------- scan */

function scan() {
  const rules = loadRules();
  const files = walk(root, { exts: CODE_EXT });
  const findings = [];
  const ruleCount = new Map();
  const byCategory = new Map();

  for (const file of files) {
    const src = read(file);
    if (!src) continue;
    const ext = path.extname(file).toLowerCase();
    const relPath = rel(file, root);
    const clean = stripNoise(src);
    const perFile = new Map();

    for (const rule of rules) {
      if (!rule.exts.has('*') && !rule.exts.has(ext)) continue;
      if ((ruleCount.get(rule.id) || 0) >= maxPerRule) continue;

      /* absence rules: the pattern must be MISSING while `requires` is present */
      if (rule.kind === 'absence') {
        if (!rule.requiresRe || !rule.requiresRe.test(src)) continue;
        if (rule.absenceRe.test(src)) continue;
        push(rule, relPath, 1, null);
        continue;
      }

      if (rule.suppressIfFilePattern && new RegExp(rule.suppressIfFilePattern, 'i').test(src)) {
        continue;
      }

      const capPerFile = rule.maxPerFile ?? Infinity;
      rule.re.lastIndex = 0;
      let m;
      let guard = 0;
      while ((m = rule.re.exec(clean)) !== null && guard++ < 500) {
        if (m[0] === '') { rule.re.lastIndex++; continue; }
        const seen = perFile.get(rule.id) || 0;
        if (seen >= capPerFile) break;
        if ((ruleCount.get(rule.id) || 0) >= maxPerRule) break;
        perFile.set(rule.id, seen + 1);
        push(rule, relPath, lineOf(src, m.index), snippet(src, m.index));
      }
    }
  }

  function push(rule, file, line, code) {
    ruleCount.set(rule.id, (ruleCount.get(rule.id) || 0) + 1);
    byCategory.set(rule.category, (byCategory.get(rule.category) || 0) + 1);
    findings.push({
      rule: rule.id,
      category: rule.category,
      severity: rule.severity,
      file,
      line,
      code,
      message: rule.message,
      fix: showFix ? rule.fix : undefined,
    });
  }

  return { findings: sortFindings(findings), files: files.length, byCategory, ruleCount };
}

/* ------------------------------------------------------------------ output */

const result = scan();
const counts = { error: 0, warn: 0, info: 0 };
for (const f of result.findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

if (asJson) {
  console.log(JSON.stringify({
    tool: 'overhaul-ui/slop-scan',
    version: 1,
    root: rel(root, process.cwd()) || '.',
    filesScanned: result.files,
    counts,
    byCategory: Object.fromEntries(result.byCategory),
    findings: result.findings,
  }, null, 2));
} else {
  console.log(`${c.bold('overhaul-ui slop-scan')}  ${c.gray(`${result.files} files · ${rel(root, process.cwd()) || '.'}`)}`);

  if (!quiet) printFindings(result.findings, { title: 'slop-scan', root });
  else {
    const line = [
      counts.error ? c.red(`${counts.error} error`) : null,
      counts.warn ? c.yellow(`${counts.warn} warn`) : null,
      counts.info ? c.blue(`${counts.info} info`) : null,
    ].filter(Boolean).join(' · ');
    console.log(line || c.green('clean'));
  }

  if (result.byCategory.size) {
    const cats = [...result.byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}`)
      .join(c.gray(' · '));
    console.log(c.gray(`\nby category: ${cats}`));
  }

  if (counts.error) {
    console.log(
      `\n${c.red('Fix the error-level findings before delivering.')} ` +
        c.dim('See reference/anti-slop.md and commands/slop.md for the de-slopping order.')
    );
  } else if (counts.warn || counts.info) {
    console.log(c.dim('\nNo blocking findings. Warnings need a justification if kept.'));
  }
}

process.exit(counts.error > 0 ? 1 : 0);
