import type { Meta, StoryObj } from '@storybook/react';
import { Server, Info } from 'lucide-react';
import { Tooltip, type TooltipProps, Button, IconButton } from '../../src';

const meta: Meta<TooltipProps> = {
  title: 'Components/tooltip',
  component: Tooltip,
  args: {
    content: 'p95 latency over the last 5m',
    side: 'top',
    children: <Button variant="default">hover me</Button>,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    content: { control: 'text' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: 'small square mono label shown on pointer hover and keyboard focus of its trigger.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TooltipProps>;

export const Playground: Story = {};

export const Sides: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: 'var(--s-6)',
        padding: 'var(--s-6)',
      }}
    >
      <Tooltip side="top" content="restart deployment">
        <Button variant="default">top</Button>
      </Tooltip>
      <Tooltip side="bottom" content="scale to 0 replicas">
        <Button variant="default">bottom</Button>
      </Tooltip>
      <Tooltip side="left" content="open gitlab pipeline">
        <Button variant="default">left</Button>
      </Tooltip>
      <Tooltip side="right" content="tail pod logs">
        <Button variant="default">right</Button>
      </Tooltip>
    </div>
  ),
};

export const OnIconButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', padding: 'var(--s-6)' }}>
      <Tooltip content="restart chino-api" side="bottom">
        <IconButton icon={Server} aria-label="restart chino-api" />
      </Tooltip>
      <Tooltip content="cluster: okd-prod" side="bottom">
        <IconButton icon={Info} aria-label="cluster info" />
      </Tooltip>
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <p style={{ fontFamily: 'var(--ff-mono)', color: 'var(--fg)', fontSize: 13, maxWidth: 360 }}>
      rollout of{' '}
      <Tooltip content="image: chino:2026.06.15" side="top">
        <span style={{ color: 'var(--cloud-blue)', cursor: 'help' }}>chino</span>
      </Tooltip>{' '}
      finished on{' '}
      <Tooltip content="3 of 3 replicas ready" side="top">
        <span style={{ color: 'var(--cloud-blue)', cursor: 'help' }}>worker6</span>
      </Tooltip>
    </p>
  ),
};
