import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SKILL_NAME = 'overhaul-ui';
export const SKILL_SRC = path.join(PKG_ROOT, 'skills', SKILL_NAME);

export function version() {
  try {
    return JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8')).version;
  } catch {
    return '0.0.0';
  }
}

const NO_COLOR = process.env.NO_COLOR !== undefined || !process.stdout.isTTY;
const w = (o, cl) => (s) => (NO_COLOR ? String(s) : `\x1b[${o}m${s}\x1b[${cl}m`);

export const c = {
  bold: w(1, 22), dim: w(2, 22), red: w(31, 39), green: w(32, 39),
  yellow: w(33, 39), blue: w(34, 39), magenta: w(35, 39), cyan: w(36, 39), gray: w(90, 39),
};

export const tick = c.green('+');
export const cross = c.red('x');
export const arrow = c.cyan('>');

export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const body = a.slice(2);
      const eq = body.indexOf('=');
      if (eq !== -1) out[body.slice(0, eq)] = body.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith('-')) out[body] = argv[++i];
      else out[body] = true;
    } else out._.push(a);
  }
  return out;
}
