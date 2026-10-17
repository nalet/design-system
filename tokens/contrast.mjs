// @nalet/design-system — contrast policy
//
// One definition of which colour pairs must meet which WCAG 2.2 contrast ratio,
// shared by three readers so they can never disagree:
//   - tokens/contrast.test.ts   the gate: fails ci when a pair drops below its minimum
//   - tokens/build.mjs          warns while a token is being tuned
//   - the colour docs page      renders the table from the same report
//
// stdlib only — no dependencies.

/** every surface text can sit on. */
export const BACKGROUNDS = ['bg', 'bg-2', 'surface', 'surface-2', 'surface-selected'];

/** every token used as text (or as an icon that carries meaning). */
export const TEXT = [
  'fg',
  'fg-2',
  'fg-muted',
  'fg-dim',
  'cloud-blue',
  'cloud-cyan',
  'state-neutral',
  'state-information',
  'state-success',
  'state-warning',
  'state-error',
];

/** the five semantic states. each has a text token, a -bg tint and a -border. */
export const STATES = ['neutral', 'information', 'success', 'warning', 'error'];

/** text that sits on a state tint (a message strip's body, a chip's label). */
export const TEXT_ON_TINT = ['fg', 'fg-2', 'fg-muted'];

/**
 * non-text ui (wcag 1.4.11): the boundary that identifies a control, the focus
 * ring, and the fill of a checked control. 3:1 against every background.
 */
export const BOUNDARIES = ['border-control', 'focus-ring', 'cloud-blue'];

/** text on a filled control. */
export const FILLS = [
  { fg: 'bg', bg: 'cloud-blue', why: 'primary button label' },
  { fg: 'bg', bg: 'signal-amber', why: 'danger button label on hover' },
];

/** tokens deliberately outside the policy, and why. rendered in the docs. */
export const EXEMPT = [
  {
    tokens: ['border', 'border-2'],
    why: 'Decorative hairlines between regions. They never alone identify a control: inputs, selects and checkboxes use border-control.',
  },
  {
    tokens: ['state-*-border'],
    why: 'Chip outlines. A chip is identified by its text and its tint, both of which are checked.',
  },
  {
    tokens: ['signal-green', 'signal-amber', 'signal-red'],
    why: 'Checked through their aliases state-success, state-warning and state-error, which share their values.',
  },
];

export const MIN_TEXT = 4.5;
export const MIN_NON_TEXT = 3;

// ---------------------------------------------------------------------------
// colour math (wcag 2.2 relative luminance + contrast ratio)
// ---------------------------------------------------------------------------

export function hexToRgb(hex) {
  const h = String(hex).trim().replace(/^#/, '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

function channel(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// tokens.json -> flat { key: hex }, the css-var names without the leading --
// ---------------------------------------------------------------------------

const PREFIXED_GROUPS = new Set(['signal', 'state']);

export function flattenColors(dtcg) {
  const resolve = (value, seen = new Set()) => {
    if (typeof value === 'string' && /^\{[^}]+\}$/.test(value)) {
      if (seen.has(value)) throw new Error(`circular token reference: ${value}`);
      seen.add(value);
      let node = dtcg;
      for (const seg of value.slice(1, -1).split('.')) node = node?.[seg];
      if (node?.$value === undefined) throw new Error(`unresolved token reference: ${value}`);
      return resolve(node.$value, seen);
    }
    return value;
  };
  const out = {};
  for (const group of Object.keys(dtcg.color)) {
    for (const name of Object.keys(dtcg.color[group])) {
      const key = PREFIXED_GROUPS.has(group) ? `${group}-${name}` : name;
      out[key] = resolve(dtcg.color[group][name].$value);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// the report: every pair the policy checks, with its ratio and verdict
// ---------------------------------------------------------------------------

/**
 * @param {Record<string, string>} colors flat token map (key -> hex)
 * @returns {{ fg: string, bg: string, ratio: number, min: number, rule: string, pass: boolean }[]}
 */
export function contrastReport(colors) {
  const rows = [];
  const add = (fg, bg, min, rule) => {
    if (!(fg in colors)) throw new Error(`contrast policy names an unknown token: --${fg}`);
    if (!(bg in colors)) throw new Error(`contrast policy names an unknown token: --${bg}`);
    const ratio = contrastRatio(colors[fg], colors[bg]);
    rows.push({ fg, bg, ratio, min, rule, pass: ratio >= min });
  };
  for (const fg of TEXT) for (const bg of BACKGROUNDS) add(fg, bg, MIN_TEXT, 'text');
  for (const s of STATES) add(`state-${s}`, `state-${s}-bg`, MIN_TEXT, 'state text on its tint');
  for (const s of STATES) for (const fg of TEXT_ON_TINT) add(fg, `state-${s}-bg`, MIN_TEXT, 'text on a state tint');
  for (const fg of BOUNDARIES) for (const bg of BACKGROUNDS) add(fg, bg, MIN_NON_TEXT, 'non-text ui');
  for (const f of FILLS) add(f.fg, f.bg, MIN_TEXT, `text on a fill (${f.why})`);
  return rows;
}
