/**
 * space — maps the 4-base scale to the --s-* CSS vars from tokens.css.
 * Keys are the raw pixel steps so consumers think in the documented scale
 * (4/8/12/16/24/32/48/64) and we resolve to the token var.
 */
export type SpaceToken = 0 | 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64;

const STEP_TO_VAR: Record<number, string> = {
  0: '0',
  4: 'var(--s-1)',
  8: 'var(--s-2)',
  12: 'var(--s-3)',
  16: 'var(--s-4)',
  24: 'var(--s-5)',
  32: 'var(--s-6)',
  48: 'var(--s-7)',
  64: 'var(--s-8)',
};

/** Resolve a space token to its CSS var expression. */
export function space(token: SpaceToken): string {
  return STEP_TO_VAR[token] ?? '0';
}
