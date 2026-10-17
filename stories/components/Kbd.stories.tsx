import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, type KbdProps, Stack, Text } from '../../src';

const meta: Meta<KbdProps> = {
  title: 'Components/data display/kbd',
  component: Kbd,
  args: {
    children: 'esc',
  },
  argTypes: {
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A single keycap: square, hairline frame with a 2px bottom edge, mono label. One key per kbd; place several, with a joiner, for a shortcut.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<KbdProps>;

export const Playground: Story = {};

export const Keys: Story = {
  render: () => (
    <Stack direction="horizontal" gap={12} align="center" wrap>
      <Kbd>esc</Kbd>
      <Kbd>tab</Kbd>
      <Kbd>enter</Kbd>
      <Kbd>shift</Kbd>
      <Kbd>ctrl</Kbd>
      <Kbd>alt</Kbd>
      <Kbd>cmd</Kbd>
      <Kbd>k</Kbd>
    </Stack>
  ),
};

export const Combo: Story = {
  render: () => (
    <Stack direction="horizontal" gap={24} align="center" wrap>
      <Text variant="muted">
        <Kbd>ctrl</Kbd> + <Kbd>k</Kbd>
      </Text>
      <Text variant="muted">
        <Kbd>ctrl</Kbd> + <Kbd>shift</Kbd> + <Kbd>p</Kbd>
      </Text>
      <Text variant="muted">
        <Kbd>g</Kbd> then <Kbd>i</Kbd>
      </Text>
    </Stack>
  ),
};

export const InShortcutList: Story = {
  name: 'in shortcut list',
  render: () => (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
        gap: 'var(--s-3) var(--s-5)',
        width: 300,
        margin: 0,
      }}
    >
      <Text as="dt" variant="ui">
        Search
      </Text>
      <Text as="dd" variant="muted">
        <Kbd>ctrl</Kbd> + <Kbd>k</Kbd>
      </Text>
      <Text as="dt" variant="ui">
        Open the selected row
      </Text>
      <Text as="dd" variant="muted">
        <Kbd>enter</Kbd>
      </Text>
      <Text as="dt" variant="ui">
        Close the dialog
      </Text>
      <Text as="dd" variant="muted">
        <Kbd>esc</Kbd>
      </Text>
    </dl>
  ),
};
