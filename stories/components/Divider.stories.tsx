import type { Meta, StoryObj } from '@storybook/react';
import { Divider, type DividerProps } from '../../src';

const meta: Meta<DividerProps> = {
  title: 'Components/divider',
  component: Divider,
  args: {
    orientation: 'horizontal',
    heavy: false,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    heavy: { control: 'boolean' },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'a hairline rule in the border token; the heavy variant uses border-2 and a horizontal rule can carry a small mono label split across the line.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<DividerProps>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Divider {...args} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: 320 }}>
      <span style={{ color: 'var(--fg-dim)' }}>okd console</span>
      <Divider />
      <span style={{ color: 'var(--fg-dim)' }}>gitlab pipeline</span>
    </div>
  ),
};

export const Heavy: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: 320 }}>
      <Divider />
      <Divider heavy />
    </div>
  ),
};

export const Labeled: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-4)', width: 320 }}>
      <Divider label="postgres" />
      <Divider label="p95 latency" heavy />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--s-3)',
        height: 'var(--s-5)',
        color: 'var(--fg-dim)',
      }}
    >
      <span>deploy</span>
      <Divider orientation="vertical" />
      <span>chino</span>
      <Divider orientation="vertical" heavy />
      <span>gitlab</span>
    </div>
  ),
};
