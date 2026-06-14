// @nalet/design-system — token build
//
// Reads tokens/tokens.json (DTCG) and emits three generated artifacts:
//   - src/styles/tokens.css   :root CSS variables + base + type-role utilities
//   - src/tokens.ts           typed token objects (colors / type / space)
//   - tailwind-preset.cjs     Tailwind preset for consumer apps
//
// Single source of truth is tokens/tokens.json. Do not hand-edit the outputs;
// run `node tokens/build.mjs` (or `npm run build-tokens`) instead.
//
// stdlib only — no dependencies.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const TOKENS_JSON = resolve(__dirname, 'tokens.json');
const OUT_CSS = resolve(ROOT, 'src/styles/tokens.css');
const OUT_TS = resolve(ROOT, 'src/tokens.ts');
const OUT_PRESET = resolve(ROOT, 'tailwind-preset.cjs');

const raw = readFileSync(TOKENS_JSON, 'utf8');
const dtcg = JSON.parse(raw);

// ---------------------------------------------------------------------------
// DTCG helpers
// ---------------------------------------------------------------------------

// Resolve a {dotted.path} alias against the source tree, returning the $value.
function resolveRef(ref) {
  const path = ref.slice(1, -1).split('.');
  let node = dtcg;
  for (const seg of path) {
    if (node == null) break;
    node = node[seg];
  }
  if (node == null || node.$value === undefined) {
    throw new Error(`unresolved token reference: ${ref}`);
  }
  return node.$value;
}

// Resolve a value that may be a {ref} alias (recursively) or a literal.
function resolveValue(value) {
  if (typeof value === 'string' && /^\{[^}]+\}$/.test(value)) {
    return resolveValue(resolveRef(value));
  }
  return value;
}

// ---------------------------------------------------------------------------
// Flatten source token groups into ordered, usable shapes
// ---------------------------------------------------------------------------

// The signal.* group is prefixed (signal-green / signal-amber) so its token
// keys match the canonical CSS-var names across every artifact. All other
// groups expose their bare name (bg, cloud-blue, ...).
function tokenKey(group, name) {
  return group === 'signal' ? `signal-${name}` : name;
}

// color: keep group structure but produce flat { key: hex } honoring source order.
const colorGroups = dtcg.color;
const colors = {}; // flat key -> hex (e.g. bg, cloud-blue, signal-green)
const colorOrder = []; // entries in source order, for stable emission
for (const group of Object.keys(colorGroups)) {
  for (const name of Object.keys(colorGroups[group])) {
    const hex = resolveValue(colorGroups[group][name].$value);
    const key = tokenKey(group, name);
    colors[key] = hex;
    colorOrder.push({ group, name, key, hex });
  }
}

// type families and roles
const families = {
  ui: resolveValue(dtcg.type.family.ui.$value),
  mono: resolveValue(dtcg.type.family.mono.$value),
};

const roles = {};
for (const role of Object.keys(dtcg.type.role)) {
  const v = dtcg.type.role[role].$value;
  roles[role] = {
    fontFamily: resolveValue(v.fontFamily),
    fontWeight: v.fontWeight,
    fontSize: v.fontSize,
    lineHeight: v.lineHeight,
    letterSpacing: v.letterSpacing,
  };
}

// space scale (s-1 .. s-8)
const space = {};
const spaceOrder = [];
for (const key of Object.keys(dtcg.space)) {
  const val = resolveValue(dtcg.space[key].$value);
  space[key] = val;
  spaceOrder.push({ key, val });
}

// ---------------------------------------------------------------------------
// Emit src/styles/tokens.css
// ---------------------------------------------------------------------------

const groupLabel = {
  canvas: 'canvas',
  foreground: 'foreground',
  brand: 'brand & signal',
  signal: 'brand & signal',
};

// Build the :root color block grouped + aligned like the seed.
function emitColorBlock() {
  const lines = [];
  let lastLabel = null;
  // pre-compute padding width for alignment within the whole block
  const varNames = colorOrder.map((c) => `--${c.key}:`);
  const pad = Math.max(...varNames.map((v) => v.length)) + 1;
  for (const { group, key, hex } of colorOrder) {
    const label = groupLabel[group] || group;
    if (label !== lastLabel) {
      if (lastLabel !== null) lines.push('');
      lines.push(`  /* ${label} */`);
      lastLabel = label;
    }
    const decl = `--${key}:`;
    lines.push(`  ${decl.padEnd(pad)}${hex};`);
  }
  return lines.join('\n');
}

function emitSpaceBlock() {
  // emit on two rows of four, matching the seed layout
  const rows = [];
  for (let i = 0; i < spaceOrder.length; i += 4) {
    const chunk = spaceOrder.slice(i, i + 4);
    rows.push(
      '  ' +
        chunk
          .map(({ key, val }) => `--${key}: ${val};`)
          .join('  '),
    );
  }
  return rows.join('\n');
}

function emitTypeUtilities() {
  const order = ['display', 'h1', 'h2', 'body', 'ui', 'code'];
  return order
    .filter((r) => roles[r])
    .map((r) => {
      const t = roles[r];
      return [
        `.type-${r} {`,
        `  font-family: ${t.fontFamily};`,
        `  font-weight: ${t.fontWeight};`,
        `  font-size: ${t.fontSize};`,
        `  line-height: ${t.lineHeight};`,
        `  letter-spacing: ${t.letterSpacing};`,
        `}`,
      ].join('\n');
    })
    .join('\n\n');
}

const css = `/* nalet.cloud design system — tokens
 *
 * GENERATED FILE — do not edit by hand.
 * Source of truth: tokens/tokens.json. Regenerate with \`node tokens/build.mjs\`.
 *
 * Fonts (Inter, JetBrains Mono) are NOT bundled. Load them in the consuming app
 * — self-host, or uncomment the @import below to pull from Google Fonts:
 *
 * @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700;800&display=swap');
 */

:root {
${emitColorBlock()}

  /* type */
  --ff-ui:   ${families.ui};
  --ff-mono: ${families.mono};

  /* space (4-base) */
${emitSpaceBlock()}
}

/* base — dark canvas, ui family. square frames everywhere (no border-radius). */
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--ff-ui);
}

/* type roles — apply as utility classes (mono for display/system, ui for prose) */
${emitTypeUtilities()}
`;

// ---------------------------------------------------------------------------
// Emit src/tokens.ts
// ---------------------------------------------------------------------------

function tsObject(obj, indent = '  ') {
  const entries = Object.entries(obj).map(
    ([k, v]) => `${indent}${JSON.stringify(k)}: ${JSON.stringify(v)},`,
  );
  return entries.join('\n');
}

function tsRoles() {
  const order = ['display', 'h1', 'h2', 'body', 'ui', 'code'];
  return order
    .filter((r) => roles[r])
    .map((r) => {
      const t = roles[r];
      const body = [
        `    fontFamily: ${JSON.stringify(t.fontFamily)},`,
        `    fontWeight: ${JSON.stringify(t.fontWeight)},`,
        `    fontSize: ${JSON.stringify(t.fontSize)},`,
        `    lineHeight: ${JSON.stringify(t.lineHeight)},`,
        `    letterSpacing: ${JSON.stringify(t.letterSpacing)},`,
      ].join('\n');
      return `  ${JSON.stringify(r)}: {\n${body}\n  },`;
    })
    .join('\n');
}

const ts = `// @nalet/design-system — typed tokens
//
// GENERATED FILE — do not edit by hand.
// Source of truth: tokens/tokens.json. Regenerate with \`node tokens/build.mjs\`.

export const colors = {
${tsObject(colors)}
} as const;

export const fontFamily = {
  ui: ${JSON.stringify(families.ui)},
  mono: ${JSON.stringify(families.mono)},
} as const;

export const typography = {
${tsRoles()}
} as const;

export const space = {
${tsObject(space)}
} as const;

export type ColorToken = keyof typeof colors;
export type TypographyRole = keyof typeof typography;
export type SpaceToken = keyof typeof space;

export const tokens = { colors, fontFamily, typography, space } as const;
export default tokens;
`;

// ---------------------------------------------------------------------------
// Emit tailwind-preset.cjs
// ---------------------------------------------------------------------------

// Map flat colors into a Tailwind colors object (kebab keys preserved).
function presetColors() {
  return colorOrder
    .map(({ key }) => `      ${JSON.stringify(key)}: ${JSON.stringify(colors[key])},`)
    .join('\n');
}

// spacing keys 1..8 (from s-1..s-8) plus the raw s-N aliases.
function presetSpacing() {
  const lines = [];
  for (const { key, val } of spaceOrder) {
    const num = key.replace('s-', '');
    lines.push(`      ${JSON.stringify(num)}: ${JSON.stringify(val)},`);
  }
  for (const { key, val } of spaceOrder) {
    lines.push(`      ${JSON.stringify(key)}: ${JSON.stringify(val)},`);
  }
  return lines.join('\n');
}

const preset = `// @nalet/design-system — Tailwind preset
//
// GENERATED FILE — do not edit by hand.
// Source of truth: tokens/tokens.json. Regenerate with \`node tokens/build.mjs\`.
//
// For CONSUMER apps that want the nalet tokens inside their own Tailwind config:
//   // tailwind.config.cjs
//   module.exports = { presets: [require('@nalet/design-system/tailwind')], ... }
//
// borderRadius DEFAULT is 0 to enforce square frames — the brand non-negotiable.
// Icons are the only rounded shape, and that radius is baked into the icon PNGs.

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
${presetColors()}
      },
      fontFamily: {
        mono: ${JSON.stringify(families.mono.split(',').map((s) => s.trim()))},
        sans: ${JSON.stringify(families.ui.split(',').map((s) => s.trim()))},
      },
      spacing: {
${presetSpacing()}
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
      },
    },
  },
};
`;

// ---------------------------------------------------------------------------
// Write + verify
// ---------------------------------------------------------------------------

mkdirSync(dirname(OUT_CSS), { recursive: true });
mkdirSync(dirname(OUT_TS), { recursive: true });

writeFileSync(OUT_CSS, css, 'utf8');
writeFileSync(OUT_TS, ts, 'utf8');
writeFileSync(OUT_PRESET, preset, 'utf8');

// Verify generated CSS contains every canonical hex from the source, so the
// build can never silently drift from the seed values.
const seedHexes = colorOrder.map((c) => c.hex.toUpperCase());
const missing = seedHexes.filter((hex) => !css.toUpperCase().includes(hex));
if (missing.length) {
  console.error('FAIL: generated tokens.css missing hexes:', missing.join(', '));
  process.exit(1);
}

console.log('tokens build ok');
console.log(`  colors: ${colorOrder.length}  type-roles: ${Object.keys(roles).length}  space: ${spaceOrder.length}`);
console.log(`  wrote ${OUT_CSS.replace(ROOT + '/', '')}`);
console.log(`  wrote ${OUT_TS.replace(ROOT + '/', '')}`);
console.log(`  wrote ${OUT_PRESET.replace(ROOT + '/', '')}`);
