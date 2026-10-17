import type { CSSProperties, ReactNode } from 'react';
import { typography, fontFamily } from '@nalet/design-system';

/**
 * the type roles, rendered from the typed tokens (src/tokens.ts, generated from
 * tokens/tokens.json -> type.role), so the specimen cannot drift from the
 * source. 'JetBrains Mono' for display / headings / system / code / brand,
 * 'Inter' for body / prose / ui labels.
 */

type Role = keyof typeof typography;

const SAMPLE: Record<Role, string> = {
  display: 'nalet',
  h1: 'storage settings',
  h2: 'recent runs',
  body: 'Backups run every night at 02:00 and are kept for 14 days. A run that fails is tried again an hour later.',
  ui: 'storage-01 · 412 GB used',
  code: 'npm i @nalet/design-system',
};

const USE: Record<Role, string> = {
  display: 'a splash or a sign-in screen. no component uses it',
  h1: 'the page title: heading level 1',
  h2: 'a section of the page: heading level 2',
  body: 'sentences and paragraphs: text body',
  ui: 'interface text and field labels: text ui',
  code: 'values read in mono: text code',
};

const familyName = (stack: string) => (stack.includes('JetBrains Mono') ? 'jetbrains mono' : 'inter');

const label: CSSProperties = { fontFamily: 'var(--ff-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--fg-muted)' };

const Row = ({ meta, children }: { meta: ReactNode; children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--s-2) var(--s-5)',
      alignItems: 'baseline',
      padding: 'var(--s-4) 0',
      borderBottom: '1px solid var(--border)',
    }}
  >
    <div style={{ ...label, flex: '0 0 11rem' }}>{meta}</div>
    <div style={{ flex: '1 1 16rem', minWidth: 0, overflowWrap: 'anywhere' }}>{children}</div>
  </div>
);

/** every role with its exact metrics, read from the typed tokens. */
export function TypeScale() {
  return (
    <div style={{ maxWidth: 960, width: '100%' }}>
      {(Object.keys(typography) as Role[]).map((role) => {
        const t = typography[role];
        return (
          <Row
            key={role}
            meta={
              <>
                <div style={{ color: 'var(--fg)', fontWeight: 600 }}>{role}</div>
                <div>
                  {familyName(t.fontFamily)} {t.fontWeight}
                </div>
                <div>
                  {t.fontSize} / {t.lineHeight}
                </div>
                <div>letter-spacing {t.letterSpacing}</div>
                <div style={{ color: 'var(--fg-dim)' }}>{USE[role]}</div>
              </>
            }
          >
            <div
              style={{
                fontFamily: t.fontFamily,
                fontWeight: t.fontWeight,
                fontSize: t.fontSize,
                lineHeight: t.lineHeight,
                letterSpacing: t.letterSpacing,
                color: role === 'body' ? 'var(--fg-2)' : 'var(--fg)',
              }}
            >
              {SAMPLE[role]}
            </div>
          </Row>
        );
      })}
    </div>
  );
}

const WEIGHTS: { family: 'mono' | 'ui'; weight: number; use: string }[] = [
  { family: 'mono', weight: 400, use: 'values: inputs, code, badges, status, tooltips, plain table cells' },
  { family: 'mono', weight: 500, use: 'tabs, filter tab labels, text code' },
  { family: 'mono', weight: 600, use: 'buttons, card, modal and tile titles, table headers, h2' },
  { family: 'mono', weight: 700, use: 'h1, page titles, key figures, the lockup' },
  { family: 'mono', weight: 800, use: 'the display role only' },
  { family: 'ui', weight: 400, use: 'body, hints and errors, messages and toasts, muted and dim text' },
  { family: 'ui', weight: 500, use: 'field labels, text ui' },
];

/** the weights the components draw, per family: the ones to load. */
export function TypeWeights() {
  return (
    <div style={{ maxWidth: 960, width: '100%' }}>
      {WEIGHTS.map((w) => (
        <Row
          key={`${w.family}-${w.weight}`}
          meta={
            <>
              <div style={{ color: 'var(--fg)', fontWeight: 600 }}>
                {w.family === 'mono' ? 'jetbrains mono' : 'inter'} {w.weight}
              </div>
              <div style={{ color: 'var(--fg-dim)' }}>{w.use}</div>
            </>
          }
        >
          <div
            style={{
              fontFamily: w.family === 'mono' ? fontFamily.mono : fontFamily.ui,
              fontWeight: w.weight,
              fontSize: 16,
              lineHeight: 1.4,
              color: 'var(--fg)',
            }}
          >
            {w.family === 'mono' ? 'api-7f9c · 2,500 missing · 0O 1lI' : 'Every night at 02:00, kept 14 days'}
          </div>
        </Row>
      ))}
    </div>
  );
}
