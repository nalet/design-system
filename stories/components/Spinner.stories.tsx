import type { Meta, StoryObj } from '@storybook/react';
import { Spinner, type SpinnerProps } from '../../src';

const meta: Meta<SpinnerProps> = {
  title: 'Components/spinner',
  component: Spinner,
  args: {
    size: 16,
    label: 'loading',
  },
  argTypes: {
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
    color: { control: 'text' },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'square-cornered ring that rotates and inherits currentcolor; the one moving thing in an otherwise still terminal ui.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SpinnerProps>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <Spinner size={12} />
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={40} />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <Spinner color="var(--cloud-blue)" />
      <Spinner color="var(--fg)" />
      <Spinner color="var(--muted)" />
    </div>
  ),
};

export const InheritsColor: Story = {
  name: 'inherits color',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--s-3)',
        alignItems: 'center',
        color: 'var(--cloud-blue)',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
      }}
    >
      <Spinner size={14} />
      <span>rolling out chino to okd</span>
    </div>
  ),
};

export const InlineWithLabel: Story = {
  name: 'inline with label',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
      <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', color: 'var(--muted)' }}>
        <Spinner size={14} label="waiting for postgres" />
        <span>waiting for postgres</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', color: 'var(--muted)' }}>
        <Spinner size={14} label="streaming gitlab pipeline logs" />
        <span>streaming gitlab pipeline logs</span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', color: 'var(--muted)' }}>
        <Spinner size={14} label="computing p95 latency" />
        <span>computing p95 latency</span>
      </div>
    </div>
  ),
};
