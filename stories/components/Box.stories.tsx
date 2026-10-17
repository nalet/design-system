import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, type BoxProps, Stack, Text } from '../../src';

const meta: Meta<BoxProps> = {
  title: 'Components/layout & structure/box',
  component: Box,
  args: {
    p: 16,
    bg: 'surface',
    border: true,
    children: 'storage-01',
  },
  argTypes: {
    p: { control: 'select', options: [0, 4, 8, 12, 16, 24, 32, 48, 64] },
    px: {
      control: 'select',
      options: [0, 4, 8, 12, 16, 24, 32, 48, 64],
      description: 'left and right padding from the space scale, applied after p.',
    },
    py: {
      control: 'select',
      options: [0, 4, 8, 12, 16, 24, 32, 48, 64],
      description: 'top and bottom padding from the space scale, applied after p.',
    },
    bg: { control: 'inline-radio', options: ['bg', 'bg-2', 'surface', 'surface-2'] },
    border: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'the base layout primitive: a square div with padding from the space scale, an optional canvas background and an optional hairline border. never rounded.',
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

/** a surface with a sunken region inside it. */
export const Panel: Story = {
  render: () => (
    <Box p={16} bg="surface" border style={{ width: 320 }}>
      <Stack gap={12}>
        <Text variant="ui">release 2.4.1</Text>
        <Box p={12} bg="bg-2" border>
          <Stack gap={8}>
            <Text variant="code">pipeline #1543 passed</Text>
            <Text variant="code">rollout ready, 3 of 3</Text>
            <Text variant="code">p95 142ms</Text>
          </Stack>
        </Box>
      </Stack>
    </Box>
  ),
};
