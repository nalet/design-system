import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Button, Toaster, toast, useToastPlacement, type ToasterProps } from '../../src';

const meta: Meta<ToasterProps> = {
  title: 'Components/feedback & status/toast',
  component: Toaster,
  args: {
    placement: 'bottom',
    offset: 0,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom', 'top'] },
    offset: { control: 'number' },
    label: { control: 'text' },
    className: { control: false },
  },
  parameters: {
    docs: { description: { component: 'Transient feedback after an action. Never takes focus; leaves on its own.' } },
  },
  decorators: [
    // every mounted <Toaster /> renders every toast. a docs page shows several
    // stories at once, so there the page mounts one toaster and the stories none;
    // so does a page that embeds the story (parameters.embedded, the guidelines
    // site), which also needs no room kept for the toasts.
    (Story, context) => {
      const embedded = !!context.parameters.embedded;
      return (
        <div style={{ minHeight: embedded ? undefined : 220 }}>
          <Story />
          {context.viewMode === 'docs' || embedded ? null : <Toaster {...context.args} />}
        </div>
      );
    },
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
      <Button onClick={() => toast('Asking the catalog again — the list follows', { state: 'information' })}>
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
      <Button onClick={() => toast('Asking the catalog again — the list follows', { state: 'information' })}>
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

// a screen whose foot is taken moves the toasts while it is open. `offset` is
// the height of a bar that stays at the top of the page the story is shown on,
// so the toasts appear below it; a page without one leaves it at 0.
export const AtTheTop: Story = {
  name: 'at the top',
  render: function AtTheTop({ offset }) {
    const [open, setOpen] = useState(false);
    useToastPlacement(open ? 'top' : null, offset);
    const save = () => toast('Saved to watchlist', { state: 'success' });
    if (!open) {
      return (
        <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => setOpen(true)}>
            open player
          </Button>
          <Button onClick={save}>save to watchlist</Button>
        </div>
      );
    }
    return (
      <div
        role="group"
        aria-label="player"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          width: 'min(100%, 30rem)',
          minHeight: '13rem',
          border: '1px solid var(--border-2)',
          background: 'var(--bg-2)',
        }}
      >
        <p
          style={{
            margin: 'var(--s-3) var(--s-4)',
            textAlign: 'center',
            fontFamily: 'var(--ff-ui)',
            fontSize: '0.9375rem',
            lineHeight: 1.4,
            color: 'var(--fg)',
          }}
        >
          Where were you last night?
          <br />
          Out by the harbour.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--s-2)',
            flexWrap: 'wrap',
            padding: 'var(--s-2) var(--s-3)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <Button size="sm" onClick={save}>
            save to watchlist
          </Button>
          <Button size="sm" onClick={() => toast('Added to Film club', { state: 'success' })}>
            add to film club
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            close player
          </Button>
        </div>
      </div>
    );
  },
};

export const ReplaceById: Story = {
  name: 'replace by id',
  render: function ReplaceById() {
    const presses = useRef(0);
    return (
      <Button
        onClick={() => {
          presses.current += 1;
          toast(`Asking the catalog again (${presses.current})`, { id: 'ask-again', state: 'information' });
        }}
      >
        ask the catalog again
      </Button>
    );
  },
};
