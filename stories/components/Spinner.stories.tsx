import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner, type SpinnerProps, Stack, Text } from '../../src';

const meta: Meta<SpinnerProps> = {
  title: 'Components/feedback & status/spinner',
  component: Spinner,
  args: {
    size: 16,
    label: 'loading',
  },
  argTypes: {
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
    // the source comment says it defaults to currentColor; Spinner.css sets --cloud-blue.
    color: {
      control: 'text',
      description:
        'Frame colour, any CSS colour. Default --cloud-blue; pass currentColor to follow the surrounding text.',
    },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A faint, still square frame with three quarters of it lit and the gap running round it, one lap in four seconds, in --cloud-blue unless you pass color. Renders role=status named by its label; under reduced motion it stands still and the label carries the state. For an action in progress, use a loading button instead.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SpinnerProps>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12} align="center">
      <Spinner size={12} />
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={40} />
    </Stack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12} align="center">
      <Spinner />
      <Spinner color="var(--fg)" />
      <Spinner color="var(--fg-muted)" />
    </Stack>
  ),
};

/** `color="currentColor"` makes the frame follow the text around it. */
export const InheritsColor: Story = {
  name: 'inherits color',
  render: () => (
    <Stack direction="horizontal" gap={8} align="center" style={{ color: 'var(--fg-muted)' }}>
      <Spinner size={14} color="currentColor" aria-hidden="true" />
      <Text variant="muted">Checking storage-01</Text>
    </Stack>
  ),
};

/** A spinner standing in for one value while it loads; the label names the value. */
export const InlineWithLabel: Story = {
  name: 'inline with label',
  render: () => (
    <Stack gap={8} style={{ width: 240 }}>
      <Stack direction="horizontal" justify="between" align="center">
        <Text variant="muted">Volumes</Text>
        <Text variant="ui">12</Text>
      </Stack>
      <Stack direction="horizontal" justify="between" align="center">
        <Text variant="muted">Used space</Text>
        <Spinner size={14} label="loading used space" />
      </Stack>
    </Stack>
  ),
};
