import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, IllustratedMessage, type IllustratedMessageProps } from '../../src';

const meta: Meta<IllustratedMessageProps> = {
  title: 'Components/feedback & status/illustrated message',
  component: IllustratedMessage,
  args: {
    illustration: 'done',
    title: 'nothing missing',
    description: 'Every aired, monitored episode and movie is in the library.',
    size: 'md',
  },
  argTypes: {
    illustration: { control: 'inline-radio', options: ['empty', 'done', 'search', 'error', 'unknown'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    title: { control: 'text' },
    description: { control: 'text' },
    actions: { control: false },
  },
  parameters: {
    docs: { description: { component: 'An empty, done, no-match, error or unknown state, with what to do about it.' } },
  },
};
export default meta;

type Story = StoryObj<IllustratedMessageProps>;

export const Playground: Story = {};

export const Kinds: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--s-4)', width: 'min(100%, 980px)' }}>
      <IllustratedMessage illustration="empty" title="nothing tracked yet" description="Import a list to start tracking." size="sm" />
      <IllustratedMessage illustration="done" title="nothing missing" description="Everything aired is in the library." size="sm" />
      <IllustratedMessage illustration="search" title="no matches" description="Nothing fits these filters." size="sm" actions={<Button size="sm">clear filters</Button>} />
      <IllustratedMessage illustration="error" title="couldn't load" description="The list could not be read. Try again." size="sm" actions={<Button size="sm">try again</Button>} />
      <IllustratedMessage illustration="unknown" title="nothing can be checked yet" description="The library's holdings are unknown for every title." size="sm" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--s-5)', flexWrap: 'wrap' }}>
      <IllustratedMessage illustration="search" title="sm" size="sm" />
      <IllustratedMessage illustration="search" title="md" size="md" />
      <IllustratedMessage illustration="search" title="lg" size="lg" />
    </div>
  ),
};

export const WithAction: Story = {
  name: 'with action',
  render: () => (
    <IllustratedMessage
      illustration="unknown"
      title="nothing can be checked yet"
      description="The library's holdings are unknown for all 105 titles, so nothing is known to be missing."
      actions={<Button variant="primary">ask the catalog again</Button>}
    />
  ),
};
