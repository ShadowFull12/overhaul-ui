/**
 * Install / uninstall the skill folder into agent directories.
 */

import fs from 'node:fs';
import path from 'node:path';
import { SKILL_TARGETS, DEFAULT_TARGET_IDS, POINTER_TARGETS } from './targets.mjs';
import { PKG_ROOT, SKILL_NAME, SKILL_SRC, c, tick, cross, arrow } from './util.mjs';

const SKIP = new Set(['node_modules', '.git', '.DS_Store']);

export function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) count += copyDir(from, to);
    else { fs.copyFileSync(from, to); count++; }
  }
  return count;
}

export function countFiles(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    n += e.isDirectory() ? countFiles(path.join(dir, e.name)) : 1;
  }
  return n;
}

export function resolveTargets(opts) {
  if (opts.all) return SKILL_TARGETS;
  if (opts.target) {
    const ids = String(opts.target).split(',').map((s) => s.trim().toLowerCase());
    const found = SKILL_TARGETS.filter((t) => ids.includes(t.id));
    const unknown = ids.filter((id) => !SKILL_TARGETS.some((t) => t.id === id));
    if (unknown.length) {
      console.error(`${cross} unknown target${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}`);
      console.error(`  available: ${SKILL_TARGETS.map((t) => t.id).join(', ')}`);
      process.exit(2);
    }
    return found;
  }
  return SKILL_TARGETS.filter((t) => DEFAULT_TARGET_IDS.includes(t.id));
}

export function install(opts = {}) {
  if (!fs.existsSync(SKILL_SRC)) {
    console.error(`${cross} skill payload missing at ${SKILL_SRC}`);
    process.exit(1);
  }

  const scope = opts.project ? 'project' : 'global';
  const cwd = process.cwd();
  const targets = resolveTargets(opts);
  const fileCount = countFiles(SKILL_SRC);

  console.log(`\n${c.bold('overhaul-ui')} ${c.gray(`installing ${fileCount} files · ${scope} scope`)}\n`);

  const done = [];
  const seen = new Set();

  for (const t of targets) {
    const baseDir = scope === 'global' ? t.global : path.resolve(cwd, t.project);
    const dest = path.join(baseDir, SKILL_NAME);

    if (seen.has(dest)) continue;
    seen.add(dest);

    if (scope === 'global' && !opts.all && !opts.target && !opts.force) {
      // only write to a global dir whose parent already exists, unless it is a
      // recommended default (those we create, so the skill works out of the box)
      if (!t.recommended && !fs.existsSync(path.dirname(baseDir))) continue;
    }

    try {
      if (fs.existsSync(dest) && !opts.force) fs.rmSync(dest, { recursive: true, force: true });
      const n = copyDir(SKILL_SRC, dest);
      done.push({ ...t, dest, n });
      console.log(`  ${tick} ${c.bold(t.label.padEnd(34))} ${c.gray(tildify(dest))}`);
      console.log(`    ${c.gray(t.reads)}`);
    } catch (err) {
      console.log(`  ${cross} ${t.label.padEnd(34)} ${c.red(err.code || err.message)}`);
    }
  }

  if (scope === 'project' && !opts['no-pointers']) {
    console.log(`\n  ${c.bold('pointer files')} ${c.gray('for tools that read a single instruction file')}`);
    const skillPath = path.join('.agents', 'skills', SKILL_NAME).split(path.sep).join('/');
    for (const p of POINTER_TARGETS) {
      const file = path.resolve(cwd, p.file);
      try {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        const body = p.render({ skillPath });
        if (p.append && fs.existsSync(file)) {
          const existing = fs.readFileSync(file, 'utf8');
          if (existing.includes('overhaul-ui')) {
            console.log(`  ${c.gray('·')} ${p.label.padEnd(34)} ${c.gray('already referenced, skipped')}`);
            continue;
          }
          fs.appendFileSync(file, body, 'utf8');
        } else {
          fs.writeFileSync(file, body.trimStart(), 'utf8');
        }
        console.log(`  ${tick} ${p.label.padEnd(34)} ${c.gray(p.file.split(path.sep).join('/'))}`);
      } catch (err) {
        console.log(`  ${cross} ${p.label.padEnd(34)} ${c.red(err.code || err.message)}`);
      }
    }
  }

  if (!done.length) {
    console.log(`\n${cross} nothing installed. Try ${c.bold('--all')} or ${c.bold('--target=claude,kiro')}\n`);
    process.exit(1);
  }

  console.log(`\n${tick} ${c.bold(`installed to ${done.length} location${done.length > 1 ? 's' : ''}`)}`);
  console.log(`\n${c.bold('Next')}`);
  console.log(`  ${arrow} restart your agent so it picks up the new skill`);
  console.log(`  ${arrow} then say: ${c.cyan('"use overhaul-ui to audit this UI"')}`);
  console.log(`  ${arrow} or run: ${c.cyan('npx overhaul-ui scan .')}`);
  console.log(`  ${arrow} verify install: ${c.cyan('npx overhaul-ui doctor')}\n`);
}

export function uninstall(opts = {}) {
  const scope = opts.project ? 'project' : 'global';
  const cwd = process.cwd();
  const targets = opts.target || opts.all ? resolveTargets(opts) : SKILL_TARGETS;

  console.log(`\n${c.bold('overhaul-ui')} ${c.gray(`removing · ${scope} scope`)}\n`);
  let removed = 0;
  const seen = new Set();

  for (const t of targets) {
    const baseDir = scope === 'global' ? t.global : path.resolve(cwd, t.project);
    const dest = path.join(baseDir, SKILL_NAME);
    if (seen.has(dest)) continue;
    seen.add(dest);
    if (!fs.existsSync(dest)) continue;
    try {
      fs.rmSync(dest, { recursive: true, force: true });
      console.log(`  ${tick} ${t.label.padEnd(34)} ${c.gray(tildify(dest))}`);
      removed++;
    } catch (err) {
      console.log(`  ${cross} ${t.label.padEnd(34)} ${c.red(err.code || err.message)}`);
    }
  }

  if (scope === 'project') {
    for (const p of POINTER_TARGETS.filter((x) => !x.append)) {
      const file = path.resolve(cwd, p.file);
      if (fs.existsSync(file)) {
        fs.rmSync(file);
        console.log(`  ${tick} ${p.label.padEnd(34)} ${c.gray(p.file)}`);
        removed++;
      }
    }
    console.log(c.gray('\n  AGENTS.md was left alone — remove the overhaul-ui section by hand if you want it gone.'));
  }

  console.log(removed ? `\n${tick} removed ${removed} location${removed > 1 ? 's' : ''}\n` : `\n${c.gray('nothing to remove')}\n`);
}

export function list() {
  console.log(`\n${c.bold('overhaul-ui install targets')}\n`);
  const w = Math.max(...SKILL_TARGETS.map((t) => t.id.length)) + 2;
  for (const t of SKILL_TARGETS) {
    const installed = fs.existsSync(path.join(t.global, SKILL_NAME));
    const mark = installed ? tick : c.gray('·');
    const dflt = DEFAULT_TARGET_IDS.includes(t.id) ? c.cyan(' [default]') : '';
    console.log(`  ${mark} ${c.bold(t.id.padEnd(w))} ${t.label}${dflt}`);
    console.log(`    ${c.gray(t.reads)}`);
    console.log(`    ${c.gray(tildify(path.join(t.global, SKILL_NAME)))}`);
  }
  console.log(`\n${c.gray('install a specific set:')} ${c.cyan('npx overhaul-ui install --target=claude,cursor,kiro')}`);
  console.log(`${c.gray('install everywhere:   ')} ${c.cyan('npx overhaul-ui install --all')}\n`);
}

export function tildify(p) {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const s = home && p.startsWith(home) ? `~${p.slice(home.length)}` : p;
  return s.split(path.sep).join('/');
}
