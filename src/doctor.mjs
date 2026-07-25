import fs from 'node:fs';
import path from 'node:path';
import { SKILL_TARGETS } from './targets.mjs';
import { PKG_ROOT, SKILL_NAME, SKILL_SRC, c, tick, cross, version } from './util.mjs';
import { tildify, countFiles } from './install.mjs';
import { detectStack } from '../skills/overhaul-ui/scripts/lib/util.mjs';

const REQUIRED = [
  'SKILL.md', 'CREDITS.md',
  'commands/audit.md', 'commands/overhaul.md', 'commands/review.md',
  'reference/anti-slop.md', 'reference/motion.md', 'reference/accessibility.md',
  'playbooks/landing-page.md', 'templates/tokens.css', 'templates/motion.css',
  'data/slop-rules.json',
  'scripts/slop-scan.mjs', 'scripts/motion-lint.mjs', 'scripts/a11y-lint.mjs',
  'scripts/contrast.mjs', 'scripts/palette.mjs', 'scripts/scale.mjs',
  'scripts/tokens.mjs', 'scripts/report.mjs',
  'scripts/lib/color.mjs', 'scripts/lib/util.mjs',
];

const COMPANIONS = [
  'impeccable', 'design-taste-frontend', 'ui-ux-pro-max', 'emil-design-eng',
  'apple-design', 'review-animations', 'improve-animations',
  'find-animation-opportunities', 'animation-vocabulary', 'pick-ui-library',
  'high-end-visual-design', 'minimalist-ui', 'industrial-brutalist-ui',
  'redesign-existing-projects', 'imagegen-frontend-web', 'imagegen-frontend-mobile',
  'image-to-code', 'brandkit', 'full-output-enforcement',
];

export function doctor() {
  console.log(`\n${c.bold(`overhaul-ui ${version()}`)}\n`);

  /* runtime */
  const major = Number(process.versions.node.split('.')[0]);
  console.log(c.bold('Runtime'));
  console.log(`  ${major >= 18 ? tick : cross} node ${process.versions.node} ${major >= 18 ? '' : c.red('(>= 18 required for the scripts)')}`);
  console.log(`  ${c.gray(`${process.platform} ${process.arch}`)}`);

  /* payload */
  console.log(`\n${c.bold('Payload')}`);
  const missing = REQUIRED.filter((f) => !fs.existsSync(path.join(SKILL_SRC, f)));
  const total = fs.existsSync(SKILL_SRC) ? countFiles(SKILL_SRC) : 0;
  console.log(`  ${missing.length ? cross : tick} ${total} files · ${REQUIRED.length - missing.length}/${REQUIRED.length} key files present`);
  for (const m of missing) console.log(`    ${cross} missing ${c.red(m)}`);

  /* frontmatter */
  const fmPath = path.join(SKILL_SRC, 'SKILL.md');
  if (fs.existsSync(fmPath)) {
    const src = fs.readFileSync(fmPath, 'utf8');
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const name = fm && fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
    const desc = fm && fm[1].match(/^description:\s*([\s\S]*?)(?=\n\w+:|\n*$)/m)?.[1].trim();
    const nameOk = name === SKILL_NAME;
    const descOk = desc && desc.length > 20 && desc.length <= 1024;
    console.log(`  ${nameOk ? tick : cross} frontmatter name: ${name || c.red('absent')} ${nameOk ? '' : c.red('(must equal the folder name)')}`);
    console.log(`  ${descOk ? tick : cross} frontmatter description: ${desc ? `${desc.length} chars` : c.red('absent')} ${desc && desc.length > 1024 ? c.red('(over the 1024 limit)') : ''}`);
  }

  /* install locations */
  console.log(`\n${c.bold('Installed')}`);
  let found = 0;
  for (const t of SKILL_TARGETS) {
    const dest = path.join(t.global, SKILL_NAME);
    if (fs.existsSync(dest)) {
      found++;
      console.log(`  ${tick} ${t.id.padEnd(12)} ${c.gray(tildify(dest))}`);
    }
  }
  const projectDirs = ['.agents/skills', '.claude/skills', '.kiro/skills', '.cursor/skills']
    .map((d) => path.join(process.cwd(), d, SKILL_NAME))
    .filter((d) => fs.existsSync(d));
  for (const d of projectDirs) {
    found++;
    console.log(`  ${tick} ${'project'.padEnd(12)} ${c.gray(path.relative(process.cwd(), d).split(path.sep).join('/'))}`);
  }
  if (!found) console.log(`  ${cross} not installed anywhere. Run ${c.cyan('npx overhaul-ui install')}`);

  /* companion skills */
  console.log(`\n${c.bold('Companion skills')}`);
  const roots = [...new Set(SKILL_TARGETS.map((t) => t.global))].filter((d) => fs.existsSync(d));
  const present = new Set();
  for (const r of roots) {
    for (const name of COMPANIONS) {
      if (fs.existsSync(path.join(r, name, 'SKILL.md'))) present.add(name);
    }
  }
  if (present.size) {
    console.log(`  ${tick} available: ${c.gray([...present].join(', '))}`);
    console.log(`  ${c.gray(`overhaul-ui will defer to these where they specialise (SKILL.md section 5)`)}`);
  } else {
    console.log(`  ${c.gray('none detected — overhaul-ui works standalone')}`);
  }

  /* project */
  console.log(`\n${c.bold('Project')} ${c.gray(process.cwd())}`);
  const stack = detectStack(process.cwd());
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    console.log(`  ${c.gray('no package.json here — run this from a project root for stack detection')}`);
  } else {
    console.log(`  framework   ${stack.framework || c.gray('not detected')}`);
    console.log(`  styling     ${stack.styling || c.gray('not detected')}`);
    if (stack.tailwind) console.log(`  ${c.yellow('tailwind')}    ${stack.tailwind}`);
    console.log(`  components  ${stack.components.join(', ') || c.gray('none detected')}`);
    console.log(`  icons       ${stack.icons || c.gray('none detected')}`);
    console.log(`  motion      ${stack.motion.join(', ') || c.gray('CSS only')}`);
    console.log(`  pkg manager ${stack.packageManager || c.gray('unknown')}`);
    const ds = path.join(process.cwd(), 'design-system', 'DESIGN.md');
    console.log(`  design sys  ${fs.existsSync(ds) ? `${tick} design-system/DESIGN.md` : c.gray('none — run the init command')}`);
    const cmds = ['build', 'test', 'lint', 'typecheck'].filter((k) => stack.scripts[k]);
    if (cmds.length) console.log(`  scripts     ${cmds.map((k) => `${k}: ${stack.scripts[k]}`).join(' · ')}`);
  }

  /* verification capability — the honest bit */
  console.log(`\n${c.bold('Verification available here')}`);
  const canBuild = !!stack.scripts?.build;
  const canTest = !!stack.scripts?.test;
  console.log(`  ${canBuild ? tick : cross} build`);
  console.log(`  ${canTest ? tick : cross} tests`);
  console.log(`  ${c.gray('axe / lighthouse: available via npx if the network allows')}`);
  console.log(`  ${c.gray('browser, screenshots, screen readers: not available to the CLI —')}`);
  console.log(`  ${c.gray('do not report keyboard or visual verification you did not actually perform')}`);

  const ok = major >= 18 && !missing.length;
  console.log(`\n${ok ? `${tick} ${c.bold('healthy')}` : `${cross} ${c.bold('problems found')}`}\n`);
  return ok ? 0 : 1;
}
