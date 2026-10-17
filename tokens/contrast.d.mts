// types for tokens/contrast.mjs (the module itself is plain js so tokens/build.mjs
// can import it with no build step).

export interface ContrastRow {
  /** text or ui token, without the leading `--`. */
  fg: string;
  /** background token, without the leading `--`. */
  bg: string;
  ratio: number;
  /** the minimum this pair must meet: 4.5 for text, 3 for non-text ui. */
  min: number;
  /** which part of the policy asks for the pair. */
  rule: string;
  pass: boolean;
}

export interface Exemption {
  tokens: string[];
  why: string;
}

export const BACKGROUNDS: string[];
export const TEXT: string[];
export const STATES: string[];
export const TEXT_ON_TINT: string[];
export const BOUNDARIES: string[];
export const FILLS: { fg: string; bg: string; why: string }[];
export const EXEMPT: Exemption[];
export const MIN_TEXT: number;
export const MIN_NON_TEXT: number;

export function hexToRgb(hex: string): [number, number, number];
export function luminance(hex: string): number;
export function contrastRatio(a: string, b: string): number;
export function flattenColors(dtcg: unknown): Record<string, string>;
export function contrastReport(colors: Record<string, string>): ContrastRow[];
