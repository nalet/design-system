import type { Meta, StoryObj } from '@storybook/react';
import { Box, type BoxProps } from '../../src';

const meta: Meta<BoxProps> = {
  title: 'Components/box',
  component: Box,
  args: {
    p: 16,
    bg: 'surface',
    border: true,
    children: 'okd console',
  },
  argTypes: {
    p: { control: 'select', options: [0, 4, 8, 12, 16, 24, 32, 48, 64] },
    px: { control: 'select', options: [0, 4, 8, 12, 16, 24, 32, 48, 64] },
    py: { control: 'select', options: [0, 4, 8, 12, 16, 24, 32, 48, 64] },
    bg: { control: 'inline-radio', options: ['bg', 'bg-2', 'surface', 'surface-2'] },
    border: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'square layout primitive with token padding, canvas background and an optional hairline border; never rounded.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<BoxProps>;

export const Playground: Story = {};

export const Padding: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Box p={8} bg="surface" border>
        p 8
      </Box>
      <Box p={16} bg="surface" border>
        p 16
      </Box>
      <Box p={24} bg="surface" border>
        p 24
      </Box>
      <Box p={32} bg="surface" border>
        p 32
      </Box>
    </div>
  ),
};

export const Backgrounds: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Box p={16} bg="bg" border>
        bg
      </Box>
      <Box p={16} bg="bg-2" border>
        bg-2
      </Box>
      <Box p={16} bg="surface" border>
        surface
      </Box>
      <Box p={16} bg="surface-2" border>
        surface-2
      </Box>
    </div>
  ),
};

export const AsymmetricPadding: Story = {
  name: 'asymmetric padding',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Box px={32} py={8} bg="surface" border>
        px 32 / py 8
      </Box>
      <Box px={8} py={24} bg="surface-2" border>
        px 8 / py 24
      </Box>
    </div>
  ),
};

export const Panel: Story = {
  render: () => (
    <Box p={16} bg="surface" border style={{ width: 320 }}>
      <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
        <div style={{ color: 'var(--fg)' }}>chino deploy</div>
        <Box p={12} bg="bg" border>
          <div style={{ display: 'grid', gap: 'var(--s-2)', color: 'var(--cloud-blue)' }}>
            <span>gitlab pipeline #1543</span>
            <span>okd rollout: ready</span>
            <span>p95: 142ms</span>
          </div>
        </Box>
      </div>
    </Box>
  ),
};
