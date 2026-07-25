/**
 * overhaul-ui — shared helpers for the analysis scripts. Zero dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';

/* ------------------------------------------------------------------- args */

/** `--key=value`, `--flag`, `-n 5`, and positionals. */
export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const body = a.slice(2);
      const eq = body.indexOf('=');
      if (eq !== -1) out[body.slice(0, eq)] = body.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith('-')) out[body] = argv[++i];
      else out[body] = true;
    } else if (a.startsWith('-') && a.length > 1) {
      const k = a.slice(1);
      if (argv[i + 1] && !argv[i + 1].startsWith('-')) out[k] = argv[++i];
      else out[k] = true;
    } else {
      out._.push(a);
    }
  }
  return out;
}

/* ----------------------------------------------------------------- colours */

const NO_COLOR =
  process.env.NO_COLOR !== undefined ||
  process.env.TERM === 'dumb' ||
  !process.stdout.isTTY;

const wrap = (open, close) => (s) => (NO_COLOR ? String(s) : `\x1b[${open}m${s}\x1b[${close}m`);

export const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39),
  gray: wrap(90, 39),
  /** ANSI truecolour swatch from a hex value. */
  swatch(hex) {
    if (NO_COLOR) return '  ';
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `\x1b[48;2;${r};${g};${b}m  \x1b[0m`;
  },
};

/* -------------------------------------------------------------- filesystem */

export const DEFAULT_IGNORE = new Set([
  'node_modules', '.git', '.next', '.nuxt', '.svelte-kit', '.astro', '.output',
  'dist', 'build', 'out', 'coverage', '.turbo', '.cache', '.parcel-cache',
  'vendor', '.venv', '__pycache__', 'ios', 'android', '.expo', 'Pods',
  '.vercel', '.netlify', '.wrangler', 'storybook-static', '.overhaul-ui',
]);

export const CODE_EXT = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.css', '.scss', '.sass', '.less', '.pcss', '.postcss',
  '.vue', '.svelte', '.astro', '.html', '.htm',
  '.mdx', '.styl',
]);

/**
 * Recursively collect files under `root`.
 * @param {string} root
 * @param {{exts?:Set<string>, ignore?:Set<string>, maxFiles?:number, maxBytes?:number}} opts
 */
export function walk(root, opts = {}) {
  const exts = opts.exts ?? CODE_EXT;
  const ignore = opts.ignore ?? DEFAULT_IGNORE;
  const maxFiles = opts.maxFiles ?? 8000;
  const maxBytes = opts.maxBytes ?? 1_500_000;
  const files = [];

  const stack = [path.resolve(root)];
  while (stack.length && files.length < maxFiles) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.name.startsWith('.') && e.name !== '.storybook') {
        if (ignore.has(e.name)) continue;
      }
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!ignore.has(e.name)) stack.push(full);
      } else if (e.isFile()) {
        if (exts.size && !exts.has(path.extname(e.name).toLowerCase())) continue;
        let size = 0;
        try { size = fs.statSync(full).size; } catch { continue; }
        if (size > maxBytes) continue;
        files.push(full);
      }
    }
  }
  return files.sort();
}

export function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch { return null; }
}

export const rel = (file, root = process.cwd()) =>
  path.relative(root, file).split(path.sep).join('/') || path.basename(file);

/** 1-based line number for a character offset. */
export function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === '\n') line++;
  return line;
}

/** Trimmed source line for a character offset, capped for display. */
export function snippet(text, index, max = 110) {
  const start = text.lastIndexOf('\n', index) + 1;
  let end = text.indexOf('\n', index);
  if (end === -1) end = text.length;
  const s = text.slice(start, end).trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/* ------------------------------------------------------------------ project */

/** Best-effort stack detection from package.json and config files. */
export function detectStack(root = process.cwd()) {
  const info = {
    framework: null, styling: null, tailwind: null, components: [],
    icons: null, motion: [], packageManager: null, scripts: {}, deps: {},
  };

  let pkg = null;
  try { pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')); } catch {}
  if (!pkg) return info;

  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  info.deps = deps;
  info.scripts = pkg.scripts || {};

  const has = (n) => Object.prototype.hasOwnProperty.call(deps, n);

  if (has('next')) info.framework = `Next.js ${deps.next}`;
  else if (has('nuxt')) info.framework = `Nuxt ${deps.nuxt}`;
  else if (has('@sveltejs/kit')) info.framework = `SvelteKit ${deps['@sveltejs/kit']}`;
  else if (has('astro')) info.framework = `Astro ${deps.astro}`;
  else if (has('remix') || has('@remix-run/react')) info.framework = 'Remix';
  else if (has('expo')) info.framework = `Expo ${deps.expo}`;
  else if (has('react-native')) info.framework = `React Native ${deps['react-native']}`;
  else if (has('vue')) info.framework = `Vue ${deps.vue}`;
  else if (has('svelte')) info.framework = `Svelte ${deps.svelte}`;
  else if (has('react')) info.framework = `React ${deps.react}`;

  if (has('tailwindcss')) {
    const v = String(deps.tailwindcss).replace(/[^\d.]/g, '');
    info.tailwind = v.startsWith('4') ? 'v4 (CSS-first @theme)' : `v${v.split('.')[0] || '3'} (config file)`;
    info.styling = `Tailwind ${info.tailwind}`;
  } else if (has('styled-components')) info.styling = 'styled-components';
  else if (has('@emotion/react')) info.styling = 'Emotion';
  else if (has('@vanilla-extract/css')) info.styling = 'Vanilla Extract';
  else if (has('@pandacss/dev')) info.styling = 'Panda CSS';
  else info.styling = 'CSS / CSS Modules';

  for (const [name, label] of [
    ['@radix-ui/react-dialog', 'Radix'], ['radix-ui', 'Radix'],
    ['@base-ui-components/react', 'Base UI'], ['@base_ui/react', 'Base UI'],
    ['@mui/material', 'MUI'], ['@mantine/core', 'Mantine'],
    ['@chakra-ui/react', 'Chakra'], ['@headlessui/react', 'Headless UI'],
    ['react-aria-components', 'React Aria'], ['@ark-ui/react', 'Ark UI'],
  ]) if (has(name) && !info.components.includes(label)) info.components.push(label);

  for (const [name, label] of [
    ['lucide-react', 'Lucide'], ['lucide', 'Lucide'],
    ['@phosphor-icons/react', 'Phosphor'], ['@radix-ui/react-icons', 'Radix Icons'],
    ['react-icons', 'react-icons'], ['@heroicons/react', 'Heroicons'],
    ['@expo/vector-icons', 'Expo vector-icons'],
  ]) if (has(name)) { info.icons = label; break; }

  for (const [name, label] of [
    ['framer-motion', 'Framer Motion'], ['motion', 'Motion'],
    ['gsap', 'GSAP'], ['react-native-reanimated', 'Reanimated'],
    ['@react-spring/web', 'react-spring'], ['lottie-web', 'Lottie'],
  ]) if (has(name)) info.motion.push(label);

  if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) info.packageManager = 'pnpm';
  else if (fs.existsSync(path.join(root, 'yarn.lock'))) info.packageManager = 'yarn';
  else if (fs.existsSync(path.join(root, 'bun.lockb')) || fs.existsSync(path.join(root, 'bun.lock'))) info.packageManager = 'bun';
  else if (fs.existsSync(path.join(root, 'package-lock.json'))) info.packageManager = 'npm';

  return info;
}

/* ------------------------------------------------------------------ output */

export const SEVERITY_ORDER = { error: 0, warn: 1, info: 2 };

export function sortFindings(list) {
  return [...list].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3) ||
      String(a.file).localeCompare(String(b.file)) ||
      (a.line ?? 0) - (b.line ?? 0)
  );
}

export function printFindings(findings, { title = 'findings', root = process.cwd() } = {}) {
  const sorted = sortFindings(findings);
  const counts = { error: 0, warn: 0, info: 0 };
  for (const f of sorted) counts[f.severity] = (counts[f.severity] || 0) + 1;

  if (!sorted.length) {
    console.log(`${c.green('✓')} ${title}: clean`);
    return counts;
  }

  let lastFile = null;
  for (const f of sorted) {
    if (f.file !== lastFile) {
      console.log(`\n${c.bold(f.file)}`);
      lastFile = f.file;
    }
    const tag =
      f.severity === 'error' ? c.red('error') :
      f.severity === 'warn'  ? c.yellow(' warn') : c.blue(' info');
    console.log(`  ${tag} ${c.gray(String(f.line ?? '-').padStart(4))}  ${f.message}`);
    if (f.code) console.log(`         ${c.gray(f.code)}`);
    if (f.fix)  console.log(`         ${c.cyan('→')} ${c.dim(f.fix)}`);
  }

  console.log(
    `\n${c.bold(title)}: ` +
      [
        counts.error ? c.red(`${counts.error} error`) : null,
        counts.warn ? c.yellow(`${counts.warn} warn`) : null,
        counts.info ? c.blue(`${counts.info} info`) : null,
      ].filter(Boolean).join(' · ') || c.green('clean')
  );
  return counts;
}

/** Strip comments and string literals so patterns don't match inside them. */
export function stripNoise(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => ' '.repeat(m.length))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m) => ' '.repeat(m.length));
}
