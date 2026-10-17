import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, type TextProps, Stack } from '../../src';

const meta: Meta<TextProps> = {
  title: 'Components/data display/text',
  component: Text,
  args: {
    children: 'rollout completed in 42s',
    variant: 'body',
    truncate: false,
  },
  argTypes: {
    // the source comment says muted/dim only shift colour; Text.css also sets them to 13px.
    variant: {
      control: 'inline-radio',
      options: ['body', 'ui', 'muted', 'dim', 'code'],
      description:
        'type role. body is 16px inter; ui, muted and dim are 13px inter (muted and dim lower the colour); code is 13px mono.',
    },
    truncate: { control: 'boolean' },
    children: { control: 'text' },
    as: { control: 'select', options: ['span', 'p', 'div'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'copy at one of five type roles: body for prose, ui for interface text, muted and dim for secondary 13px lines, code for mono values. renders a span unless you pick another element with as.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TextProps>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack gap={12} style={{ maxWidth: 520 }}>
      <Text variant="body">the backup finished and the volume is writable again.</Text>
      <Text variant="ui">storage-01</Text>
      <Text variant="muted">last synced 3 minutes ago</Text>
      <Text variant="dim">no recent activity</Text>
      <Text variant="code">sha256:9f4c1e7b2a8d</Text>
    </Stack>
  ),
};

export const InlineMono: Story = {
  name: 'inline mono',
  render: () => (
    <Text as="p" variant="body" style={{ maxWidth: 520 }}>
      the last backup took <Text variant="code">00:04:12</Text> and wrote{' '}
      <Text variant="code">412 gb</Text>.
    </Text>
  ),
};

export const Truncate: Story = {
  name: 'truncate',
  render: () => (
    <Stack gap={12} style={{ width: 220 }}>
      <Text variant="code" truncate>
        sha256:9f4c1e7b2a8d3f6c0b5e1a7d4f2c9b8e6a3d1f0c7b4e2a9d8f6c3b1e7a4d2f0c
      </Text>
      <Text variant="muted" truncate>
        /data/exports/2024/q3/storage-01/report-final.csv
      </Text>
    </Stack>
  ),
};

export const AsElement: Story = {
  name: 'as element',
  render: () => (
    <Stack gap={8} style={{ maxWidth: 520 }}>
      <Text as="h3" variant="ui">
        backups
      </Text>
      <Text as="p" variant="body">
        backups run every night at 02:00 and are kept for 14 days.
      </Text>
      <Text as="div" variant="muted">
        next run in 6 hours
      </Text>
    </Stack>
  ),
};
