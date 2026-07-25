#!/usr/bin/env node
import { main } from '../src/cli.mjs';

try {
  main();
} catch (err) {
  console.error(`\noverhaul-ui: ${err && err.message ? err.message : err}\n`);
  process.exit(1);
}
