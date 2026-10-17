import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Lockup, type LockupProps } from '../../src';

const Caption = ({ children }: { children: ReactNode }) => (
  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{children}</span>
);

const meta: Meta<LockupProps> = {
  title: 'Components/brand & icons/lockup',
  component: Lockup,
  args: { height: 48, showCursor: true, filled: false },
  argTypes: {
    height: { control: { type: 'number', min: 16, max: 160, step: 4 } },
    showCursor: { control: 'boolean' },
    filled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'the chevron, the wordmark and the cursor, in a 300 × 160 box. role="img", named by its wordmark.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<LockupProps>;

export const Playground: Story = {};

export const Variants: Story = {
  name: 'variants',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-6)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
        <Lockup height={48} />
        <Caption>height 48, cursor</Caption>
      </div>
      <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
        <Lockup height={48} showCursor={false} />
        <Caption>showCursor=false</Caption>
      </div>
      <div style={{ display: 'grid', gap: 'var(--s-2)', padding: 'var(--s-3)', background: 'var(--surface-2)' }}>
        <Lockup height={48} filled />
        <Caption>filled, on --surface-2</Caption>
      </div>
    </div>
  ),
};
