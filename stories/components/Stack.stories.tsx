import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Stack, type StackProps, Box, Badge, Button, Text } from '../../src';

const meta: Meta<StackProps> = {
  title: 'Components/layout & structure/stack',
  component: Stack,
  args: {
    direction: 'vertical',
    gap: 16,
    wrap: false,
    inline: false,
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    gap: { control: 'select', options: [0, 4, 8, 12, 16, 24, 32, 48, 64] },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'cross-axis alignment (align-items). not set: children stretch.',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
      description: 'main-axis distribution (justify-content). not set: children pack at the start.',
    },
    wrap: {
      control: 'boolean',
      description:
        'let children wrap onto a new line. meant for horizontal stacks; a vertical stack wraps only with a fixed height.',
    },
    // the source comment says "stretch to fill the cross axis"; the code renders inline-flex.
    inline: {
      control: 'boolean',
      description: 'render inline-flex: the stack sizes to its content and sits in the line of text.',
    },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'a flex row or column whose gap comes straight off the space scale; the workhorse for laying out everything else.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<StackProps>;

/** a sample child: a framed block, so the gap is visible. */
const Item = ({ children }: { children: ReactNode }) => (
  <Box p={12} bg="surface-2" border>
    <Text variant="code">{children}</Text>
  </Box>
);

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Item>storage-01</Item>
      <Item>storage-02</Item>
      <Item>storage-03</Item>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack direction="vertical" gap={8}>
      <Item>build</Item>
      <Item>test</Item>
      <Item>deploy release</Item>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12}>
      <Item>build</Item>
      <Item>push</Item>
      <Item>roll out</Item>
    </Stack>
  ),
};

export const GapScale: Story = {
  name: 'gap scale',
  render: () => (
    <Stack direction="vertical" gap={24}>
      {([4, 16, 32] as const).map((g) => (
        <Stack key={g} direction="horizontal" gap={g} align="center">
          <Item>p50</Item>
          <Item>p95</Item>
          <Item>p99</Item>
          <Text variant="dim">gap {g}</Text>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Justified: Story = {
  render: () => (
    <Stack direction="horizontal" justify="between" align="center" style={{ width: 360 }}>
      <Text variant="ui">worker-2</Text>
      <Button variant="ghost" size="sm">
        drain
      </Button>
    </Stack>
  ),
};

export const Wrap: Story = {
  render: () => (
    <Stack direction="horizontal" gap={8} wrap style={{ width: 240 }}>
      {['gpu', 'batch', 'http', 'stateful', 'read-only', 'nightly', 'v2.4.1'].map((l) => (
        <Badge key={l}>{l}</Badge>
      ))}
    </Stack>
  ),
};
