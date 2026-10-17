import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { Button, Toaster, toast, type ToasterProps } from '../../src';

const meta: Meta<ToasterProps> = {
  title: 'Components/feedback & status/toast',
  component: Toaster,
  parameters: {
    docs: { description: { component: 'transient feedback after an action. never takes focus; leaves on its own.' } },
  },
  decorators: [
    // every mounted <Toaster /> renders every toast. a docs page shows several
    // stories at once, so there the page mounts one toaster and the stories none.
    (Story, context) => (
      <div style={{ minHeight: 220 }}>
        <Story />
        {context.viewMode === 'docs' ? null : <Toaster />}
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<ToasterProps>;

export const Playground: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Button variant="primary" onClick={() => toast('8 episodes queued', { state: 'success' })}>
        grab 8 selected
      </Button>
      <Button onClick={() => toast('asking the catalog again — the list follows', { state: 'information' })}>
        ask the catalog again
      </Button>
      <Button variant="ghost" onClick={() => toast('3 skipped: held already or under way')}>
        neutral
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Button onClick={() => toast('3 skipped: held already or under way')}>neutral</Button>
      <Button onClick={() => toast('asking the catalog again — the list follows', { state: 'information' })}>
        information
      </Button>
      <Button onClick={() => toast('8 episodes queued', { state: 'success' })}>success</Button>
      <Button onClick={() => toast('6 queued · 2 skipped: their source is over its daily limit', { state: 'warning' })}>
        warning
      </Button>
    </div>
  ),
};

export const AtMostThree: Story = {
  name: 'at most three',
  render: () => (
    <Button
      onClick={() => {
        for (const host of ['api-7f9c', 'worker-2', 'db-0', 'storage-01']) toast(`${host} restarted`, { state: 'success' });
      }}
    >
      restart 4 hosts
    </Button>
  ),
};

export const ReplaceById: Story = {
  name: 'replace by id',
  render: function ReplaceById() {
    const presses = useRef(0);
    return (
      <Button
        onClick={() => {
          presses.current += 1;
          toast(`asking the catalog again (${presses.current})`, { id: 'ask-again', state: 'information' });
        }}
      >
        ask the catalog again
      </Button>
    );
  },
};
