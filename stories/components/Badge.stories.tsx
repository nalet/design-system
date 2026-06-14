import type { Meta, StoryObj } from '@storybook/react';
import { Badge, type BadgeProps } from '../../src';

const meta: Meta<BadgeProps> = {
  title: 'Components/badge',
  component: Badge,
  args: {
    children: 'running',
    tone: 'neutral',
    dot: false,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'green', 'amber', 'blue'] },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: { component: 'a small square status chip with a hairline border and an optional status dot.' },
    },
  },
};
export default meta;

type Story = StoryObj<BadgeProps>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Badge tone="neutral">queued</Badge>
      <Badge tone="green">healthy</Badge>
      <Badge tone="amber">degraded</Badge>
      <Badge tone="blue">syncing</Badge>
    </div>
  ),
};

export const WithDot: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Badge tone="green" dot>ready</Badge>
      <Badge tone="amber" dot>pending</Badge>
      <Badge tone="blue" dot>rollout</Badge>
      <Badge tone="neutral" dot>idle</Badge>
    </div>
  ),
};

export const PodStatus: Story = {
  name: 'pod status',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
        <span style={{ color: 'var(--fg)', fontFamily: 'var(--ff-mono)', fontSize: 12 }}>
          chino-stream-7d9f
        </span>
        <Badge tone="green" dot>running</Badge>
      </div>
      <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
        <span style={{ color: 'var(--fg)', fontFamily: 'var(--ff-mono)', fontSize: 12 }}>
          postgres-0
        </span>
        <Badge tone="amber" dot>pending</Badge>
      </div>
      <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
        <span style={{ color: 'var(--fg)', fontFamily: 'var(--ff-mono)', fontSize: 12 }}>
          gitlab-runner-2
        </span>
        <Badge tone="blue" dot>terminating</Badge>
      </div>
    </div>
  ),
};

export const Labels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Badge>okd</Badge>
      <Badge tone="blue">p95 142ms</Badge>
      <Badge tone="green">deploy ok</Badge>
      <Badge tone="amber">retry x3</Badge>
    </div>
  ),
};
