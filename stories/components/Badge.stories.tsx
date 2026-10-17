import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeProps, Stack, Text } from '../../src';

const meta: Meta<BadgeProps> = {
  title: 'Components/data display/badge',
  component: Badge,
  args: {
    children: 'gpu',
    tone: 'neutral',
    dot: false,
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'green', 'amber', 'blue'],
      description:
        'Colour tone: neutral (default), blue, green or amber. Only a colour; the state of an object is object status.',
    },
    dot: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A small square label for tags, counts and short attributes: mono, lowercase, hairline frame, optional dot. The state of an object is object status, not a badge.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<BadgeProps>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12} wrap>
      <Badge tone="neutral">v2.4.1</Badge>
      <Badge tone="blue">new</Badge>
      <Badge tone="green">verified</Badge>
      <Badge tone="amber">read-only</Badge>
    </Stack>
  ),
};

/** The dot repeats the tone: a colour key, e.g. for a legend. */
export const WithDot: Story = {
  name: 'with dot',
  render: () => (
    <Stack direction="horizontal" gap={12} wrap>
      <Badge tone="blue" dot>
        reads
      </Badge>
      <Badge tone="amber" dot>
        writes
      </Badge>
      <Badge dot>other</Badge>
    </Stack>
  ),
};

export const InContext: Story = {
  name: 'in context',
  render: () => (
    <Stack gap={12}>
      <Stack direction="horizontal" gap={12} align="center">
        <Text variant="ui">The Lantern (2024)</Text>
        <Badge>4k</Badge>
        <Badge>hdr</Badge>
      </Stack>
      <Stack direction="horizontal" gap={12} align="center">
        <Text variant="ui">The Example Show</Text>
        <Badge>12 episodes</Badge>
        <Badge tone="blue">new</Badge>
      </Stack>
    </Stack>
  ),
};

export const Labels: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12} wrap>
      <Badge>v2.4.1</Badge>
      <Badge>default</Badge>
      <Badge>12 files</Badge>
      <Badge>3 new</Badge>
    </Stack>
  ),
};
