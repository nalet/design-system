import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterBar, type FilterBarProps } from '../../src';

const meta: Meta<FilterBarProps> = {
  title: 'Components/inputs/filter bar',
  component: FilterBar,
  argTypes: {
    search: { control: false },
    filters: { control: false },
    onClearAll: { control: false },
    resultCount: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'what narrows a list: search, facets, clear all, and what is left.' } },
  },
  // room under the bar for an open multi select panel.
  decorators: [(Story) => <div style={{ minHeight: 240 }}>{Story()}</div>],
};
export default meta;

type Story = StoryObj<FilterBarProps>;

function useFilters() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('');
  const [aired, setAired] = useState('');
  const [state, setState] = useState<string[]>([]);
  const active = (q ? 1 : 0) + (kind ? 1 : 0) + (aired ? 1 : 0) + state.length;
  return {
    props: {
      search: { value: q, onChange: setQ, placeholder: 'search titles', label: 'search titles' },
      filters: [
        {
          type: 'select' as const,
          id: 'kind',
          label: 'kind',
          value: kind,
          onChange: setKind,
          options: [
            { value: '', label: 'all' },
            { value: 'series', label: 'series' },
            { value: 'movie', label: 'movies' },
          ],
        },
        {
          type: 'select' as const,
          id: 'aired',
          label: 'aired',
          value: aired,
          onChange: setAired,
          options: [
            { value: '', label: 'any time' },
            { value: 'week', label: 'this week' },
            { value: 'month', label: 'this month' },
            { value: 'older', label: 'older' },
          ],
        },
        {
          type: 'multiselect' as const,
          id: 'state',
          label: 'state',
          value: state,
          onChange: setState,
          options: [
            { value: 'missing', label: 'missing', count: 2318 },
            { value: 'way', label: 'on its way', count: 182 },
            { value: 'attention', label: 'needs attention', count: 3 },
          ],
        },
      ],
      resultCount: active ? `${Math.max(1, 2500 - active * 611).toLocaleString('en')} of 2,500` : '2,500',
      onClearAll: () => {
        setQ('');
        setKind('');
        setAired('');
        setState([]);
      },
    } satisfies FilterBarProps,
  };
}

export const Playground: Story = {
  render: function Playground() {
    return <FilterBar {...useFilters().props} />;
  },
};

export const Narrow: Story = {
  render: function Narrow() {
    return (
      <div style={{ width: 360 }}>
        <FilterBar {...useFilters().props} label="filter titles" />
      </div>
    );
  },
};

export const SearchOnly: Story = {
  name: 'search only',
  render: function SearchOnly() {
    const [q, setQ] = useState('');
    return (
      <FilterBar
        label="filter hosts"
        search={{ value: q, onChange: setQ, placeholder: 'search hosts', label: 'search hosts' }}
        resultCount="48"
      />
    );
  },
};
