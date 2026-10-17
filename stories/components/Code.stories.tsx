import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code, type CodeProps, Stack, Text } from '../../src';

const meta: Meta<CodeProps> = {
  title: 'Components/data display/code',
  component: Code,
  args: {
    block: false,
    children: 'ctl get volumes',
  },
  argTypes: {
    block: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'mono code text: inline by default, in --cloud-cyan inside a hairline frame; block renders a square pre on the deeper canvas that scrolls sideways.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<CodeProps>;

export const Playground: Story = {};

export const Inline: Story = {
  render: () => (
    <Text as="p" variant="body" style={{ maxWidth: 520 }}>
      set <Code>--replicas=0</Code> to stop the service, then check that <Code>ctl get volumes</Code>{' '}
      lists the volume as detached.
    </Text>
  ),
};

export const Block: Story = {
  render: () => (
    <Code block style={{ maxWidth: 520 }}>
      {`$ ctl rollout status api-7f9c
waiting for rollout to finish: 1 of 3 updated
waiting for rollout to finish: 2 of 3 updated
rollout finished: 3 of 3 updated`}
    </Code>
  ),
};

export const Overflow: Story = {
  name: 'overflow',
  render: () => (
    <Code block style={{ maxWidth: 360 }}>
      {`ctl backup create --volume storage-01 --target https://backup.example.com/v1/archive --keep 14d --verify`}
    </Code>
  ),
};

export const Stacked: Story = {
  name: 'stacked',
  render: () => (
    <Stack gap={12} style={{ maxWidth: 520 }}>
      <Code block>
        {`ctl login https://ops.example.com
ctl get volumes`}
      </Code>
      <Code block>{`ctl release create 2.4.1`}</Code>
    </Stack>
  ),
};
