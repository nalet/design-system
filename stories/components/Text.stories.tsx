import type { Meta, StoryObj } from '@storybook/react';
import { Text, type TextProps } from '../../src';

const meta: Meta<TextProps> = {
  title: 'Components/text',
  component: Text,
  args: {
    children: 'rollout completed in 42s',
    variant: 'body',
    truncate: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['body', 'ui', 'muted', 'dim', 'code'],
    },
    truncate: { control: 'boolean' },
    children: { control: 'text' },
    as: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'inline or block copy at one of the documented type roles; body and ui use inter, code uses mono, and muted and dim only shift the color.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TextProps>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <Text variant="body">deploying chino to the okd console</Text>
      <Text variant="ui">gitlab pipeline #1543</Text>
      <Text variant="muted">last synced 3 minutes ago</Text>
      <Text variant="dim">no recent activity</Text>
      <Text variant="code">oc rollout status deploy/chino-api</Text>
    </div>
  ),
};

export const InlineCode: Story = {
  name: 'inline code',
  render: () => (
    <Text variant="body">
      run <Text variant="code">oc get pods -n stube</Text> to list the running pods
    </Text>
  ),
};

export const Truncate: Story = {
  name: 'truncate',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: 220 }}>
      <Text variant="code" truncate>
        sha256:9f4c1e7b2a8d3f6c0b5e1a7d4f2c9b8e6a3d1f0c7b4e2a9d8f6c3b1e7a4d2f0c
      </Text>
      <Text variant="muted" truncate>
        /var/lib/registry/docker/registry/v2/blobs/sha256/9f/chino-api
      </Text>
    </div>
  ),
};

export const AsElement: Story = {
  name: 'as element',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <Text as="p" variant="body">
        the transcoder splits work across the gpu and packager pools.
      </Text>
      <Text as="label" variant="ui">
        namespace
      </Text>
      <Text as="div" variant="muted">
        p95 latency holding under 180ms
      </Text>
    </div>
  ),
};
