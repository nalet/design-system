import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal, type ModalProps, Button } from '../../src';

const meta: Meta<ModalProps> = {
  title: 'Components/modal',
  component: Modal,
  args: {
    open: false,
    title: 'drop postgres',
    width: 480,
    closeOnBackdrop: true,
    closeOnEsc: true,
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    width: { control: 'number' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    onClose: { table: { disable: true } },
    footer: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'square dialog over a dim backdrop that traps focus, closes on esc and backdrop click, locks body scroll, and restores focus to the opener.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ModalProps>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="default" onClick={() => setOpen(true)}>
          open modal
        </Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          drag the controls panel to change the title, width, and dismiss behaviour, then
          reopen this dialog.
        </Modal>
      </>
    );
  },
};

export const Confirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          drop postgres
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="drop postgres"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                drop
              </Button>
            </>
          }
        >
          this permanently deletes the chino database on the okd cluster. all watch-history
          rows are lost and the volume is reclaimed.
        </Modal>
      </>
    );
  },
};

export const Form: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          add server
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="add server"
          width={420}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                connect
              </Button>
            </>
          }
        >
          <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
            <label style={{ display: 'grid', gap: 'var(--s-1)' }}>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
                base url
              </span>
              <input
                defaultValue="https://chino.example.com"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 0,
                  color: 'var(--fg)',
                  fontFamily: 'var(--ff-mono)',
                  fontSize: 13,
                  padding: 'var(--s-2) var(--s-3)',
                }}
              />
            </label>
            <label style={{ display: 'grid', gap: 'var(--s-1)' }}>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
                client id
              </span>
              <input
                defaultValue="chino"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 0,
                  color: 'var(--fg)',
                  fontFamily: 'var(--ff-mono)',
                  fontSize: 13,
                  padding: 'var(--s-2) var(--s-3)',
                }}
              />
            </label>
          </div>
        </Modal>
      </>
    );
  },
};

export const NoTitle: Story = {
  name: 'no title',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="default" onClick={() => setOpen(true)}>
          view p95 latency
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} ariaLabel="latency report" width={360}>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--fg)' }}>
            gitlab pipeline #1497 p95 latency held at 142 ms across the last deploy.
          </div>
        </Modal>
      </>
    );
  },
};

export const Persistent: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          run migration
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="run migration"
          closeOnBackdrop={false}
          closeOnEsc={false}
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              acknowledge
            </Button>
          }
        >
          the katalog schema migration is in flight. backdrop and esc dismissal are disabled so
          the rollout is not interrupted; use the action below to close.
        </Modal>
      </>
    );
  },
};
