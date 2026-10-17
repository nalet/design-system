import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Toaster, toast, type ToasterProps } from '../../src';

const meta: Meta<ToasterProps> = {
  title: 'Components/feedback & status/toast',
  component: Toaster,
  parameters: {
    docs: { description: { component: 'transient feedback after an action. never takes focus; leaves on its own.' } },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 220 }}>
        <Story />
        <Toaster />
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
      {(['neutral', 'information', 'success', 'warning'] as const).map((s) => (
        <Button key={s} onClick={() => toast(`${s}: a short confirmation`, { state: s })}>
          {s}
        </Button>
      ))}
    </div>
  ),
};
