/**
 * Install targets for every agent/IDE that reads Agent Skills or instruction files.
 *
 * Paths verified against vendor documentation (2026). `~/.agents/skills/` is the
 * cross-vendor convention read by Codex, Cursor, Zed, Copilot, OpenCode, Roo,
 * Gemini CLI and Amp, so it covers the majority in one write.
 */

import os from 'node:os';
import path from 'node:path';

const home = os.homedir();
const H = (...p) => path.join(home, ...p);

/** Skill-folder targets: a full multi-file SKILL.md directory. */
export const SKILL_TARGETS = [
  {
    id: 'agents',
    label: 'Agent Skills (shared convention)',
    reads: 'Codex · Cursor · Zed · Copilot · OpenCode · Roo · Gemini CLI · Amp · Devin',
    global: H('.agents', 'skills'),
    project: path.join('.agents', 'skills'),
    recommended: true,
  },
  {
    id: 'claude',
    label: 'Claude Code',
    reads: 'Claude Code · also read by Cursor, OpenCode, Copilot, Amp, Cline',
    global: H('.claude', 'skills'),
    project: path.join('.claude', 'skills'),
    recommended: true,
  },
  {
    id: 'kiro',
    label: 'Kiro',
    reads: 'Kiro (AWS)',
    global: H('.kiro', 'skills'),
    project: path.join('.kiro', 'skills'),
    recommended: true,
  },
  {
    id: 'cursor',
    label: 'Cursor (native)',
    reads: 'Cursor',
    global: H('.cursor', 'skills'),
    project: path.join('.cursor', 'skills'),
  },
  {
    id: 'gemini',
    label: 'Gemini CLI',
    reads: 'Gemini CLI',
    global: H('.gemini', 'skills'),
    project: path.join('.gemini', 'skills'),
  },
  {
    id: 'antigravity',
    label: 'Antigravity',
    reads: 'Google Antigravity',
    global: H('.gemini', 'config', 'skills'),
    project: path.join('.agents', 'skills'),
  },
  {
    id: 'windsurf',
    label: 'Windsurf / Devin Desktop',
    reads: 'Windsurf, Devin Desktop',
    global: H('.codeium', 'windsurf', 'skills'),
    project: path.join('.windsurf', 'skills'),
  },
  {
    id: 'cline',
    label: 'Cline',
    reads: 'Cline',
    global: H('.cline', 'skills'),
    project: path.join('.cline', 'skills'),
  },
  {
    id: 'roo',
    label: 'Roo Code',
    reads: 'Roo Code',
    global: H('.roo', 'skills'),
    project: path.join('.roo', 'skills'),
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    reads: 'OpenCode',
    global: H('.config', 'opencode', 'skills'),
    project: path.join('.opencode', 'skills'),
  },
  {
    id: 'amp',
    label: 'Amp (Sourcegraph)',
    reads: 'Amp — highest-precedence user tier',
    global: H('.config', 'agents', 'skills'),
    project: path.join('.agents', 'skills'),
  },
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    reads: 'Copilot in VS Code',
    global: H('.copilot', 'skills'),
    project: path.join('.github', 'skills'),
  },
];

/** The default set: three writes, near-total coverage. */
export const DEFAULT_TARGET_IDS = ['agents', 'claude', 'kiro'];

/**
 * Pointer files for tools that read a single instruction file rather than a
 * skill folder. Project-scope only — these are per-repo conventions.
 */
export const POINTER_TARGETS = [
  {
    id: 'cursor-rules',
    label: 'Cursor rules (.mdc)',
    file: path.join('.cursor', 'rules', 'overhaul-ui.mdc'),
    render: ({ skillPath }) => `---
description: Frontend design and UI craft — anti-slop direction, typography, colour, layout, motion, states, accessibility. Use for any UI work.
globs: **/*.{tsx,jsx,ts,js,vue,svelte,astro,css,scss,html}
alwaysApply: false
---

# overhaul-ui

Frontend design skill. Read \`${skillPath}/SKILL.md\` and route the request to the
right command before doing UI work.

Non-negotiable floor: visible \`:focus-visible\` on every control · 4.5:1 body text
contrast in both themes · 44px touch targets · named transition properties (never
\`transition: all\`) · no \`ease-in\` on enters · nothing over 300ms for UI ·
\`prefers-reduced-motion\` handled · loading/empty/error states designed, not just the
happy path · tinted neutrals, never #000/#fff/#888 · no purple-to-blue gradient.
`,
  },
  {
    id: 'copilot-instructions',
    label: 'Copilot instructions',
    file: path.join('.github', 'instructions', 'overhaul-ui.instructions.md'),
    render: ({ skillPath }) => `---
applyTo: "**/*.{tsx,jsx,ts,js,vue,svelte,astro,css,scss,html}"
description: Frontend design and UI craft standards (overhaul-ui)
---

# overhaul-ui

Read \`${skillPath}/SKILL.md\` before UI work and follow its routing table.

Floor: visible focus states · 4.5:1 body contrast both themes · 44px targets ·
named transition properties · no ease-in enters · UI motion under 300ms ·
reduced-motion handled · loading/empty/error states designed · tinted neutrals ·
no purple-to-blue gradient · no emoji as icons.
`,
  },
  {
    id: 'windsurf-rules',
    label: 'Windsurf rules',
    file: path.join('.windsurf', 'rules', 'overhaul-ui.md'),
    render: ({ skillPath }) => `---
trigger: model_decision
description: Frontend design and UI craft — read for any UI, styling, layout, motion or accessibility work.
---

# overhaul-ui

Read \`${skillPath}/SKILL.md\` and follow its command routing.

Floor: visible focus states · 4.5:1 body contrast both themes · 44px targets ·
named transition properties · no ease-in enters · UI motion under 300ms ·
reduced-motion handled · all four async states · tinted neutrals.
`,
  },
  {
    id: 'agents-md',
    label: 'AGENTS.md section',
    file: 'AGENTS.md',
    append: true,
    render: ({ skillPath }) => `
## UI and frontend design — overhaul-ui

For any interface work (building, redesigning, auditing, polishing, animating),
read \`${skillPath}/SKILL.md\` first and route the request via its command table.

Hard floor, every time: visible \`:focus-visible\` on every control · body text at
4.5:1 in both themes · touch targets >= 44px · named transition properties (never
\`transition: all\`) · no \`ease-in\` on enters · UI motion under 300ms · exits faster
than enters · \`prefers-reduced-motion\` handled · loading, empty, error and success
states designed for every async surface · tinted neutrals, never #000/#fff/#888 ·
one accent colour · no purple-to-blue gradient · no emoji as structural icons.
`,
  },
];
