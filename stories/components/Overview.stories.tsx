import type { Meta, StoryObj } from '@storybook/react';
import { createElement, isValidElement } from 'react';
import * as DS from '../../src';

/**
 * components overview. reflective gallery of every react component exported
 * from the library entry (src/index.ts -> '@nalet/design-system'). this stays
 * in sync with whatever the components agent ships without hand-maintaining a
 * list. per-component stories with controls live alongside each component
 * (src/components/<name>/<name>.stories.tsx) and under stories/components.
 */

// react components come in three shapes: plain functions, forwardRef objects,
// and memo objects. accept all three; reject hooks, plain values, and helpers.
function isComponent(name: string, v: unknown): v is React.ComponentType<Record<string, unknown>> {
  if (!/^[A-Z]/.test(name)) return false;
  if (typeof v === 'function') return true;
  if (typeof v === 'object' && v !== null) {
    const tag = (v as { $$typeof?: symbol }).$$typeof;
    return typeof tag === 'symbol';
  }
  return false;
}

const SAFE_PROPS: Record<string, unknown> = { children: 'sample', label: 'sample' };

const meta: Meta = {
  title: 'Components/overview',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

export const All: Story = {
  render: () => {
    const entries = Object.entries(DS as Record<string, unknown>).filter(([name, v]) =>
      isComponent(name, v),
    );

    return (
      <div style={{ padding: 'var(--s-6)', background: 'var(--bg)', minHeight: '100vh' }}>
        <h2
          style={{
            fontFamily: 'var(--ff-mono)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--fg)',
            marginBottom: 'var(--s-2)',
          }}
        >
          components
        </h2>
        <p style={{ fontFamily: 'var(--ff-ui)', color: 'var(--fg-muted)', marginBottom: 'var(--s-5)' }}>
          {entries.length} exported from @nalet/design-system. open a component in the sidebar for
          its controls.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 'var(--s-4)',
          }}
        >
          {entries.map(([name, Comp]) => (
            <div
              key={name}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                padding: 'var(--s-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--s-3)',
              }}
            >
              <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--cloud-blue)' }}>
                {name}
              </div>
              <div style={{ minHeight: 40, display: 'flex', alignItems: 'center' }}>
                <ErrorBoundaryless name={name} Comp={Comp as React.ComponentType} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// best-effort render: some components require specific props. if a component
// throws on the safe props, show its name instead of breaking the gallery.
function ErrorBoundaryless({
  name,
  Comp,
}: {
  name: string;
  Comp: React.ComponentType;
}) {
  try {
    const el = createElement(Comp as React.ComponentType<Record<string, unknown>>, SAFE_PROPS);
    if (!isValidElement(el)) {
      return <span style={{ color: 'var(--fg-dim)', fontFamily: 'var(--ff-mono)' }}>{name}</span>;
    }
    return el;
  } catch {
    return <span style={{ color: 'var(--fg-dim)', fontFamily: 'var(--ff-mono)' }}>{name}</span>;
  }
}
