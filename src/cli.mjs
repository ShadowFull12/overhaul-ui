import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { c, tick, cross, arrow, version, parseArgs, SKILL_SRC, PKG_ROOT } from './util.mjs';
import { install, uninstall, list } from './install.mjs';
import { doctor } from './doctor.mjs';

const SCRIPT_ALIASES = {
  scan: 'slop-scan.mjs',
  'slop-scan': 'slop-scan.mjs',
  motion: 'motion-lint.mjs',
  'motion-lint': 'motion-lint.mjs',
  a11y: 'a11y-lint.mjs',
  'a11y-lint': 'a11y-lint.mjs',
  contrast: 'contrast.mjs',
  palette: 'palette.mjs',
  scale: 'scale.mjs',
  tokens: 'tokens.mjs',
  report: 'report.mjs',
};

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const cmd = (args._[0] || (args.version || args.v ? 'version' : 'help')).toLowerCase();
  const rest = argv.filter((a) => a !== args._[0]);

  switch (cmd) {
    case 'install':
    case 'i':
      return install(args);

    case 'uninstall':
    case 'remove':
      return uninstall(args);

    case 'list':
    case 'targets':
      return list();

    case 'doctor':
      return process.exit(doctor());

    case 'verify':
      return process.exit(verify());

    case 'credits':
      return show('CREDITS.md');

    case 'skill':
    case 'print':
      return show('SKILL.md');

    case 'commands':
      return listCommands();

    case 'version':
      console.log(version());
      return;

    case 'help':
    case '--help':
    case '-h':
      return help();

    default: {
      const script = SCRIPT_ALIASES[cmd];
      if (script) return runScript(script, rest);
      console.error(`${cross} unknown command: ${cmd}\n`);
      help();
      process.exit(2);
    }
  }
}

function runScript(script, argv) {
  const file = path.join(SKILL_SRC, 'scripts', script);
  if (!fs.existsSync(file)) {
    console.error(`${cross} script missing: ${script}`);
    process.exit(1);
  }
  const r = spawnSync(process.execPath, [file, ...argv], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}

function show(file) {
  const p = path.join(SKILL_SRC, file);
  if (!fs.existsSync(p)) {
    console.error(`${cross} ${file} not found`);
    process.exit(1);
  }
  process.stdout.write(fs.readFileSync(p, 'utf8'));
}

function listCommands() {
  const dir = path.join(SKILL_SRC, 'commands');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  console.log(`\n${c.bold('overhaul-ui skill commands')} ${c.gray(`(${files.length})`)}\n`);
  for (const f of files) {
    const first = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').find((l) => l.startsWith('# '));
    const [name, ...desc] = (first || '').replace(/^#\s*/, '').split(/\s+[-—]\s+/);
    console.log(`  ${c.bold(name.padEnd(14))} ${c.gray(desc.join(' — '))}`);
  }
  console.log(`\n${c.gray('Ask your agent:')} ${c.cyan('"use overhaul-ui to <command> this"')}`);
  console.log(`${c.gray('Or in Claude Code / Cursor:')} ${c.cyan('/overhaul-ui')}\n`);
}

function verify() {
  console.log(`\n${c.bold('overhaul-ui verify')}\n`);
  let bad = 0;

  const dirs = ['commands', 'reference', 'playbooks', 'templates', 'scripts', 'data'];
  for (const d of dirs) {
    const p = path.join(SKILL_SRC, d);
    const n = fs.existsSync(p) ? fs.readdirSync(p).length : 0;
    if (!n) { console.log(`  ${cross} ${d} ${c.red('empty or missing')}`); bad++; }
    else console.log(`  ${tick} ${d.padEnd(11)} ${n} entries`);
  }

  // every command/reference referenced by SKILL.md must exist
  const skill = fs.readFileSync(path.join(SKILL_SRC, 'SKILL.md'), 'utf8');
  const refs = [...skill.matchAll(/`((?:commands|reference|playbooks|templates|scripts|data)\/[\w.-]+)`/g)]
    .map((m) => m[1]);
  const missing = [...new Set(refs)].filter((r) => !fs.existsSync(path.join(SKILL_SRC, r)));
  if (missing.length) {
    for (const m of missing) console.log(`  ${cross} SKILL.md references missing ${c.red(m)}`);
    bad += missing.length;
  } else {
    console.log(`  ${tick} ${'links'.padEnd(11)} ${new Set(refs).size} SKILL.md references all resolve`);
  }

  // rules file parses and every regex compiles
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(SKILL_SRC, 'data', 'slop-rules.json'), 'utf8'));
    let n = 0;
    for (const r of raw.rules) { new RegExp(r.pattern, r.flags || ''); n++; }
    console.log(`  ${tick} ${'rules'.padEnd(11)} ${n} slop rules compile`);
  } catch (err) {
    console.log(`  ${cross} slop-rules.json ${c.red(err.message)}`);
    bad++;
  }

  // scripts parse
  const scripts = fs.readdirSync(path.join(SKILL_SRC, 'scripts')).filter((f) => f.endsWith('.mjs'));
  for (const s of scripts) {
    const r = spawnSync(process.execPath, ['--check', path.join(SKILL_SRC, 'scripts', s)], { encoding: 'utf8' });
    if (r.status !== 0) {
      console.log(`  ${cross} scripts/${s} ${c.red((r.stderr || '').split('\n')[0])}`);
      bad++;
    }
  }
  if (scripts.length) console.log(`  ${tick} ${'syntax'.padEnd(11)} ${scripts.length} scripts parse`);

  console.log(bad ? `\n${cross} ${bad} problem${bad > 1 ? 's' : ''}\n` : `\n${tick} ${c.bold('ok')}\n`);
  return bad ? 1 : 0;
}

function help() {
  console.log(`
${c.bold(`overhaul-ui ${version()}`)}  ${c.gray('frontend design skill for AI coding agents')}

${c.bold('INSTALL')}
  npx overhaul-ui install                 ${c.gray('~/.agents, ~/.claude, ~/.kiro (covers most agents)')}
  npx overhaul-ui install --all           ${c.gray('every known agent directory')}
  npx overhaul-ui install --target=claude,cursor,kiro
  npx overhaul-ui install --project       ${c.gray('into this repo + rule/pointer files')}
  npx overhaul-ui uninstall [--project]
  npx overhaul-ui list                    ${c.gray('show all targets and what is installed')}

${c.bold('USE')}
  npx overhaul-ui scan <dir>              ${c.gray('AI-slop and craft defects')}
  npx overhaul-ui motion <dir>            ${c.gray('motion anti-patterns')}
  npx overhaul-ui a11y <dir>              ${c.gray('static accessibility checks')}
  npx overhaul-ui report <dir>            ${c.gray('everything, into one markdown report')}
  npx overhaul-ui contrast "#4B5563" "#fff"
  npx overhaul-ui contrast --matrix tokens.css
  npx overhaul-ui palette "#2C6E49" --neutrals --css
  npx overhaul-ui scale --ratio=1.333 --fluid --css
  npx overhaul-ui tokens --brand="#2C6E49" --out=src/tokens.css

${c.bold('INSPECT')}
  npx overhaul-ui doctor                  ${c.gray('environment, install, stack, what you can verify')}
  npx overhaul-ui commands                ${c.gray('list the 26 skill commands')}
  npx overhaul-ui skill                   ${c.gray('print SKILL.md')}
  npx overhaul-ui credits                 ${c.gray('attribution for every source')}
  npx overhaul-ui verify                  ${c.gray('integrity check of the skill payload')}

${c.bold('THEN')}
  ${arrow} restart your agent
  ${arrow} say ${c.cyan('"use overhaul-ui to audit this page"')} or ${c.cyan('"overhaul this UI"')}

${c.gray('docs')}  https://github.com/ShadowFull12/overhaul-ui
`);
}
