import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Stack, type StackProps, Button } from '../../src';

const meta: Meta<StackProps> = {
  title: 'Components/stack',
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
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around'] },
    wrap: { control: 'boolean' },
    inline: { control: 'boolean' },
    children: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'flexbox row/column whose gap comes straight off the space tokens; the workhorse for laying out everything else.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<StackProps>;

const Box = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      background: 'var(--cloud-blue)',
      color: 'var(--fg)',
      padding: 'var(--s-3)',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      minWidth: 64,
    }}
  >
    {children}
  </div>
);

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box>okd console</Box>
      <Box>gitlab ci</Box>
      <Box>postgres</Box>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack direction="vertical" gap={8}>
      <Box>deploy chino</Box>
      <Box>run migrations</Box>
      <Box>warm packaged-ids</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12}>
      <Box>build</Box>
      <Box>push</Box>
      <Box>rollout</Box>
    </Stack>
  ),
};

export const GapScale: Story = {
  render: () => (
    <Stack direction="vertical" gap={24}>
      {([4, 16, 32] as const).map((g) => (
        <Stack key={g} direction="horizontal" gap={g}>
          <Box>p50</Box>
          <Box>p95</Box>
          <Box>p99</Box>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Justified: Story = {
  render: () => (
    <Stack direction="horizontal" justify="between" align="center" style={{ width: 360 }}>
      <Box>worker6</Box>
      <Button variant="ghost">drain</Button>
    </Stack>
  ),
};
