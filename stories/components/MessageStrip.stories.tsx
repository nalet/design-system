import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, MessageStrip, type MessageStripProps } from '../../src';

const meta: Meta<MessageStripProps> = {
  title: 'Components/feedback & status/message strip',
  component: MessageStrip,
  args: {
    state: 'warning',
    children: "105 titles can't be checked: the catalog holds them without an identity.",
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['neutral', 'information', 'success', 'warning', 'error'] },
    live: { control: 'inline-radio', options: ['polite', 'assertive', 'off'] },
    children: { control: 'text' },
    actions: { control: false },
    details: { control: false },
    onDismiss: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'a page-level message about the content of the screen.' } },
  },
};
export default meta;

type Story = StoryObj<MessageStripProps>;

export const Playground: Story = {
  render: (args) => (
    <MessageStrip
      {...args}
      actions={
        <>
          <Button size="sm" variant="ghost">
            show them
          </Button>
          <Button size="sm" variant="ghost">
            ask the catalog again
          </Button>
        </>
      }
      details={'the catalog holds a title of this name without an identity (item 3f2a9c1e-5b7d-4c11-9e02-6a1d0b8f4c21, "The Quiet Harbour"): what it holds of it cannot be known until that item carries one'}
    />
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <MessageStrip state="neutral">the sweep only searches; grabbing on its own is off in settings.</MessageStrip>
      <MessageStrip state="information">asking the catalog what the library holds. the list follows.</MessageStrip>
      <MessageStrip state="success">every source answered in the last hour.</MessageStrip>
      <MessageStrip state="warning">2 sources are over their daily query limit until midnight.</MessageStrip>
      <MessageStrip state="error">couldn&apos;t queue the grab: the download client didn&apos;t answer. nothing was changed.</MessageStrip>
    </div>
  ),
};

export const WithDetails: Story = {
  name: 'with details',
  render: () => (
    <MessageStrip
      state="error"
      details={'GET /api/missing: http 502 bad gateway\nrequest id 7d1c0e4a'}
      actions={
        <Button size="sm" variant="ghost">
          try again
        </Button>
      }
    >
      couldn&apos;t load the list.
    </MessageStrip>
  ),
};

export const Dismissible: Story = {
  render: function Dismissible() {
    const [open, setOpen] = useState(true);
    return open ? (
      <MessageStrip state="success" onDismiss={() => setOpen(false)}>
        saved. times on this page now show in utc.
      </MessageStrip>
    ) : (
      <Button onClick={() => setOpen(true)}>show the message again</Button>
    );
  },
};
