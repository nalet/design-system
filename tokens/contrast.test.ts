import { describe, expect, it } from 'vitest';
import tokens from './tokens.json';
import {
  BACKGROUNDS,
  MIN_NON_TEXT,
  MIN_TEXT,
  TEXT,
  contrastRatio,
  contrastReport,
  flattenColors,
} from './contrast.mjs';

const colors = flattenColors(tokens);

describe('token contrast (wcag 2.2 aa)', () => {
  const report = contrastReport(colors);

  it('checks every text token against every background', () => {
    const textPairs = report.filter((r) => r.rule === 'text');
    expect(textPairs).toHaveLength(TEXT.length * BACKGROUNDS.length);
  });

  it.each(report.map((r) => [`--${r.fg} on --${r.bg}`, r] as const))('%s', (_name, r) => {
    expect(
      r.ratio,
      `--${r.fg} (${colors[r.fg]}) on --${r.bg} (${colors[r.bg]}) is ${r.ratio.toFixed(2)}:1; ${r.rule} needs ${r.min}:1`,
    ).toBeGreaterThanOrEqual(r.min);
  });

  it('would have caught the old --fg-dim (#6E7787)', () => {
    const old = contrastReport({ ...colors, 'fg-dim': '#6E7787' }).filter((r) => !r.pass);
    expect(old.map((r) => `${r.fg} on ${r.bg}`)).toContain('fg-dim on surface');
  });

  it('keeps --fg-dim visibly dimmer than --fg-muted', () => {
    // the fix raises fg-dim to pass, not to merge it into the label colour.
    expect(contrastRatio(colors['fg-dim'], colors['fg-muted'])).toBeGreaterThan(1.6);
  });

  it('uses the wcag minimums', () => {
    expect(MIN_TEXT).toBe(4.5);
    expect(MIN_NON_TEXT).toBe(3);
  });
});
