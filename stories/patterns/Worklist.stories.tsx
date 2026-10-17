import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster, Worklist, type WorklistProps } from '../../src';
import { BacklogWorklist } from './BacklogWorklist';

const meta: Meta<WorklistProps> = {
  title: 'Patterns/worklist',
  component: Worklist,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'the floorplan for the things that need doing: header, key-figure filter tabs, one message strip, a filter bar, a toolbar with one emphasized action, and the table or its empty state.',
      },
    },
  },
  argTypes: {
    title: { control: false },
    subtitle: { control: false },
    tabs: { control: false },
    messages: { control: false },
    filterBar: { control: false },
    toolbar: { control: false },
    children: { control: false },
    headerInfo: { control: false },
    headerActions: { control: false },
  },
  decorators: [
    // one toaster per page: the docs page mounts its own, so canvases don't add more.
    (Story, context) => (
      <div style={{ padding: 'var(--s-5)', background: 'var(--bg)', boxSizing: 'border-box', minHeight: context.viewMode === 'docs' ? undefined : '100vh' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Story />
        </div>
        {context.viewMode === 'docs' ? null : <Toaster />}
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<WorklistProps>;

/** 2,644 made-up items across 120 invented series and 140 movies. */
export const FullExample: Story = {
  name: 'full example',
  render: () => <BacklogWorklist />,
};

export const NothingMissing: Story = {
  name: 'nothing missing',
  render: () => <BacklogWorklist variant="empty" />,
};

export const HoldingsUnknown: Story = {
  name: 'holdings unknown for everything',
  render: () => <BacklogWorklist variant="unknown" />,
};
