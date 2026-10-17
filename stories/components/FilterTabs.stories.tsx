import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterTabs, type FilterTabsProps } from '../../src';

const TABS: FilterTabsProps['tabs'] = [
  { id: 'missing', label: 'missing', count: 2500 },
  { id: 'way', label: 'on their way', count: 182, state: 'information' },
  { id: 'attention', label: 'needs attention', count: 3, state: 'error' },
  { id: 'unaired', label: 'not yet aired', count: 132 },
  { id: 'unknown', label: "can't be checked", count: 105, state: 'warning' },
];

const meta: Meta<FilterTabsProps> = {
  title: 'Components/navigation/filter tabs',
  component: FilterTabs,
  args: { tabs: TABS, value: 'missing', label: 'filter missing by state' },
  argTypes: { tabs: { control: false }, onChange: { control: false }, value: { control: false } },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Key figures that filter one list: a count over a label, one tab selected.' } },
  },
};
export default meta;

type Story = StoryObj<FilterTabsProps>;

export const Playground: Story = {
  render: function Playground(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
        <FilterTabs {...args} value={value} onChange={setValue} panelId="filter-tabs-demo-panel" idPrefix="filter-tabs-demo" />
        <div
          id="filter-tabs-demo-panel"
          role="tabpanel"
          aria-labelledby={`filter-tabs-demo-${value}`}
          style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}
        >
          the list below shows: {value}
        </div>
      </div>
    );
  },
};

export const WithoutState: Story = {
  name: 'plain counts',
  render: function Plain() {
    const [value, setValue] = useState('all');
    return (
      <FilterTabs
        label="filter downloads"
        value={value}
        onChange={setValue}
        tabs={[
          { id: 'all', label: 'all', count: 48 },
          { id: 'active', label: 'downloading', count: 6 },
          { id: 'done', label: 'done today', count: 42 },
        ]}
      />
    );
  },
};
