import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Banner, Button, type BannerProps } from '../../src';

const meta: Meta<BannerProps> = {
  title: 'Components/feedback & status/banner',
  component: Banner,
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
    docs: { description: { component: 'A page-level message about the content of the screen.' } },
  },
};
export default meta;

type Story = StoryObj<BannerProps>;

export const Playground: Story = {
  render: (args) => (
    <Banner
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
      <Banner state="neutral">The sweep only searches; grabbing on its own is off in settings.</Banner>
      <Banner state="information">Asking the catalog what the library holds. The list follows.</Banner>
      <Banner state="success">Every source answered in the last hour.</Banner>
      <Banner state="warning">2 sources are over their daily query limit until midnight.</Banner>
      <Banner state="error">Couldn&apos;t queue the grab: the download client didn&apos;t answer. Nothing was changed.</Banner>
    </div>
  ),
};

export const WithDetails: Story = {
  name: 'with details',
  render: () => (
    <Banner
      state="error"
      details={'GET /api/missing: http 502 bad gateway\nrequest id 7d1c0e4a'}
      actions={
        <Button size="sm" variant="ghost">
          try again
        </Button>
      }
    >
      Couldn&apos;t load the list.
    </Banner>
  ),
};

export const Dismissible: Story = {
  render: function Dismissible() {
    const [open, setOpen] = useState(true);
    return open ? (
      <Banner state="success" onDismiss={() => setOpen(false)}>
        Saved. Times on this page now show in UTC.
      </Banner>
    ) : (
      <Button onClick={() => setOpen(true)}>show the message again</Button>
    );
  },
};
