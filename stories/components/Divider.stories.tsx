import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, type DividerProps, Stack, Text } from '../../src';

const meta: Meta<DividerProps> = {
  title: 'Components/layout & structure/divider',
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
        component:
          'A 1px rule in the border token; heavy uses border-2, and a horizontal rule can carry a short mono label split across the line.',
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
    <Stack gap={12} style={{ width: 320 }}>
      <Stack gap={4}>
        <Text variant="ui">storage-01</Text>
        <Text variant="muted">412 GB used of 1 TB</Text>
      </Stack>
      <Divider />
      <Stack gap={4}>
        <Text variant="ui">Backups</Text>
        <Text variant="muted">Every night at 02:00, kept 14 days</Text>
      </Stack>
    </Stack>
  ),
};

export const Heavy: Story = {
  render: () => (
    <Stack gap={12} style={{ width: 320 }}>
      <Text variant="dim">Default</Text>
      <Divider />
      <Text variant="dim">Heavy</Text>
      <Divider heavy />
    </Stack>
  ),
};

export const Labeled: Story = {
  render: () => (
    <Stack gap={12} style={{ width: 320 }}>
      <Text variant="ui">Run #1543</Text>
      <Divider label="older" />
      <Text variant="ui">Run #1502</Text>
      <Divider label="archived" heavy />
      <Text variant="ui">Run #1388</Text>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12} align="center" style={{ height: 'var(--s-5)' }}>
      <Text variant="muted">12 volumes</Text>
      <Divider orientation="vertical" />
      <Text variant="muted">1.2 TB used</Text>
      <Divider orientation="vertical" heavy />
      <Text variant="muted">Updated 3 min ago</Text>
    </Stack>
  ),
};
