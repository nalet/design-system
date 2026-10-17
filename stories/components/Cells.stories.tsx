import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateCell, IdentifierCell, StatusCell, type DateCellProps } from '../../src';

const NOW = new Date('2026-10-17T12:00:00Z');

const meta: Meta<DateCellProps> = {
  title: 'Components/data display/table cells',
  component: DateCell,
  args: { value: '2026-10-12T20:00:00Z', now: NOW, relative: true },
  argTypes: {
    value: { control: 'text' },
    now: { control: false },
    format: { control: false },
    relative: { control: 'boolean' },
    locale: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: 'Semantic cells for tables: status with a reason, dates both ways, identifiers.' } },
  },
};
export default meta;

type Story = StoryObj<DateCellProps>;

export const Playground: Story = {};

export const Dates: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
      <DateCell value="2026-10-17T08:00:00Z" now={NOW} />
      <DateCell value="2026-10-16T08:00:00Z" now={NOW} />
      <DateCell value="2026-10-12T08:00:00Z" now={NOW} />
      <DateCell value="2026-08-30T08:00:00Z" now={NOW} />
      <DateCell value="2025-03-02T08:00:00Z" now={NOW} />
      <DateCell value="2026-10-21T08:00:00Z" now={NOW} />
      <DateCell value={null} />
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: 320 }}>
      <StatusCell state="neutral" text="missing" detail="nothing found · again in 6h" />
      <StatusCell state="information" text="on its way" detail="waiting for the catalog" />
      <StatusCell state="error" text="needs attention" detail="no release passed the quality profile: every one was below 720p" />
      <StatusCell state="success" text="held" />
    </div>
  ),
};

export const Identifiers: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <IdentifierCell title="S04E07" text="The Long Way Round" />
      <IdentifierCell title="S04E08" />
      <IdentifierCell title="worker-2" text="Rack 4 · zone B" />
    </div>
  ),
};
