import type { Meta, StoryObj } from '@storybook/react';
import { Code, type CodeProps } from '../../src';

const meta: Meta<CodeProps> = {
  title: 'Components/code',
  component: Code,
  args: {
    block: false,
    children: 'oc get pods -n chino',
  },
  argTypes: {
    block: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'mono code text; inline by default in cloud-cyan, or a square scrollable terminal block with the block prop.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<CodeProps>;

export const Playground: Story = {};

export const Inline: Story = {
  render: () => (
    <p style={{ color: 'var(--fg)', maxWidth: 520, lineHeight: 1.6 }}>
      scale the transcoder down with <Code>kubectl scale deploy/tdarr --replicas=0</Code> and
      confirm the worker freed the gpu before you rerun <Code>nvidia-smi</Code>.
    </p>
  ),
};

export const Block: Story = {
  render: () => (
    <Code block style={{ maxWidth: 520 }}>
      {`$ oc rollout status deploy/chino -n stube
Waiting for deployment "chino" rollout to finish: 1 of 3 updated...
Waiting for deployment "chino" rollout to finish: 2 of 3 updated...
deployment "chino" successfully rolled out`}
    </Code>
  ),
};

export const Overflow: Story = {
  name: 'overflow',
  render: () => (
    <Code block style={{ maxWidth: 360 }}>
      {`psql 'postgres://katalog:****@postgres.stube.svc:5432/katalog' -c 'select id, title, p95_ms from playback_sessions order by p95_ms desc limit 5'`}
    </Code>
  ),
};

export const Stacked: Story = {
  name: 'stacked',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', maxWidth: 520 }}>
      <Code block>
        {`$ git clone git@gitlab.example.com:stube/chino.git
$ cd chino && pnpm install`}
      </Code>
      <Code block>
        {`$ gitlab-ci trigger --ref main --pipeline deploy
pipeline #1543 queued`}
      </Code>
    </div>
  ),
};
