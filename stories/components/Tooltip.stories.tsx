import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Tooltip, type TooltipProps } from '../../src';

// a non-interactive trigger: a value or a term with a dotted underline. the
// tooltip's wrapper supplies the tab stop that makes it reachable by keyboard.
function Term({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        borderBottom: '1px dotted var(--fg-dim)',
        cursor: 'help',
        fontFamily: 'var(--ff-mono)',
        fontSize: 13,
        color: 'var(--fg)',
      }}
    >
      {children}
    </span>
  );
}

const meta: Meta<TooltipProps> = {
  title: 'Components/overlays/tooltip',
  component: Tooltip,
  args: {
    content: 'p95 over the last 5 minutes',
    side: 'top',
    children: <Term>142 ms</Term>,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    content: { control: 'text' },
    children: { control: false },
  },
  // room around the trigger so the bubble is never clipped by the canvas edge.
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--s-7)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A small square label with a short, optional detail. Shows while its trigger is hovered or has keyboard focus; CSS only.',
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
        gap: 'var(--s-6) var(--s-8)',
        padding: 'var(--s-4) var(--s-8)',
      }}
    >
      <Tooltip side="top" content="shown above">
        <Term>top</Term>
      </Tooltip>
      <Tooltip side="bottom" content="shown below">
        <Term>bottom</Term>
      </Tooltip>
      <Tooltip side="left" content="shown to the left">
        <Term>left</Term>
      </Tooltip>
      <Tooltip side="right" content="shown to the right">
        <Term>right</Term>
      </Tooltip>
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <p style={{ margin: 0, fontFamily: 'var(--ff-ui)', color: 'var(--fg-2)', fontSize: 14, maxWidth: 400 }}>
      The rollout of{' '}
      <Tooltip content="built 2026-06-15 09:12">
        <Term>api-7f9c</Term>
      </Tooltip>{' '}
      finished on{' '}
      <Tooltip content="3 of 3 replicas ready">
        <Term>worker-2</Term>
      </Tooltip>{' '}
      in{' '}
      <Tooltip content="from first pull to all replicas ready" side="bottom">
        <Term>48 s</Term>
      </Tooltip>
      .
    </p>
  ),
};
