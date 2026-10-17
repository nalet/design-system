import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useId, useState } from 'react';
import { Modal, type ModalProps, Button, Field, Input } from '../../src';

const meta: Meta<ModalProps> = {
  title: 'Components/overlays/modal',
  component: Modal,
  args: {
    open: false,
    title: 'delete volume',
    width: 480,
    closeOnBackdrop: true,
    closeOnEsc: true,
  },
  argTypes: {
    // the stories own `open` and `onClose`; a control for them would do nothing.
    open: { control: false },
    onClose: { control: false },
    title: { control: 'text' },
    width: { control: 'number' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    footer: { control: false },
    children: { control: false },
    className: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'a square dialog over a dim backdrop for one task that needs an answer. traps tab, closes on esc and backdrop click, locks page scroll and returns focus to the opener.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ModalProps>;

// every story keeps onClose stable with useCallback: the modal re-runs its
// open steps (and moves focus) whenever onClose changes identity.

export const Playground: Story = {
  render: function PlaygroundModal(args) {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    return (
      <>
        <Button onClick={() => setOpen(true)}>open modal</Button>
        <Modal {...args} open={open} onClose={close}>
          set the title, width and dismiss options in the controls, then open the dialog again.
        </Modal>
      </>
    );
  },
};

export const Confirm: Story = {
  render: function ConfirmModal() {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          delete volume
        </Button>
        <Modal
          open={open}
          onClose={close}
          title="delete volume"
          footer={
            <>
              <Button variant="ghost" onClick={close}>
                cancel
              </Button>
              <Button variant="danger" onClick={close}>
                delete volume
              </Button>
            </>
          }
        >
          this permanently deletes storage-01 and its 3 snapshots. it can't be undone.
        </Modal>
      </>
    );
  },
};

export const Form: Story = {
  render: function FormModal() {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    const formId = useId();
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          add server
        </Button>
        <Modal
          open={open}
          onClose={close}
          title="add server"
          width={420}
          footer={
            <>
              <Button variant="ghost" onClick={close}>
                cancel
              </Button>
              {/* the footer sits outside the body: `form` ties the button to the form. */}
              <Button variant="primary" type="submit" form={formId}>
                add server
              </Button>
            </>
          }
        >
          <form
            id={formId}
            onSubmit={(e) => {
              e.preventDefault();
              close();
            }}
            style={{ display: 'grid', gap: 'var(--s-3)' }}
          >
            <Field label="base url" hint="the address the server answers on.">
              <Input defaultValue="https://api.example.com" />
            </Field>
            <Field label="name">
              <Input defaultValue="worker-2" />
            </Field>
          </form>
        </Modal>
      </>
    );
  },
};

export const NoTitle: Story = {
  name: 'no title',
  render: function NoTitleModal() {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    return (
      <>
        <Button onClick={() => setOpen(true)}>view latency</Button>
        <Modal
          open={open}
          onClose={close}
          ariaLabel="latency of api-7f9c"
          width={360}
          footer={
            <Button variant="ghost" onClick={close}>
              close
            </Button>
          }
        >
          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--fg)' }}>
            p95 latency of api-7f9c held at 142 ms across the last release.
          </span>
        </Modal>
      </>
    );
  },
};

export const Persistent: Story = {
  render: function PersistentModal() {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          run migration
        </Button>
        <Modal
          open={open}
          onClose={close}
          title="run migration"
          closeOnBackdrop={false}
          closeOnEsc={false}
          footer={
            <Button variant="primary" onClick={close}>
              done
            </Button>
          }
        >
          the schema migration on db-0 is running. esc and the backdrop don't close this dialog, so
          a stray key can't hide the run. the close button and done still do.
        </Modal>
      </>
    );
  },
};

const notes = [
  'deploy release now waits until every worker reports ready.',
  'view pipeline opens the run that built the current image.',
  'delete volume names the volume it is about to delete.',
  'storage-01 reports free space per volume.',
  'db-0 backups run at 02:00 and are kept for 14 days.',
  'api-7f9c restarts in under 10 seconds.',
  'logs keep 7 days of history per worker.',
  'metrics refresh every 30 seconds.',
];

export const LongContent: Story = {
  name: 'long content',
  render: function LongContentModal() {
    const [open, setOpen] = useState(false);
    const close = useCallback(() => setOpen(false), []);
    return (
      <>
        <Button onClick={() => setOpen(true)}>view release notes</Button>
        <Modal
          open={open}
          onClose={close}
          title="release notes"
          footer={
            <Button variant="ghost" onClick={close}>
              close
            </Button>
          }
        >
          {[3, 2, 1].map((minor) => (
            <section key={minor} style={{ marginBottom: 'var(--s-4)' }}>
              <h3
                style={{
                  margin: '0 0 var(--s-2)',
                  fontFamily: 'var(--ff-mono)',
                  fontSize: 13,
                  color: 'var(--fg)',
                }}
              >
                2.{minor}.0
              </h3>
              <ul style={{ margin: 0, paddingLeft: 'var(--s-4)' }}>
                {notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </section>
          ))}
        </Modal>
      </>
    );
  },
};
