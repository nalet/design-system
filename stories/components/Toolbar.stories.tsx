import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { Icon, SelectionToolbar, Toolbar, type ToolbarProps } from '../../src';

const meta: Meta<ToolbarProps> = {
  title: 'Components/actions/toolbar',
  component: Toolbar,
  args: { label: 'missing episodes', heading: '2,500 missing' },
  argTypes: {
    actions: { control: false },
    heading: { control: 'text' },
    collapseBelow: { control: 'number' },
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Actions above the content they act on: one emphasized, the rest default or in overflow.' } },
  },
};
export default meta;

type Story = StoryObj<ToolbarProps>;

const noop = () => undefined;

export const Playground: Story = {
  render: (args) => (
    <Toolbar
      {...args}
      actions={[
        { id: 'grab', label: 'grab all missing', emphasized: true, icon: <Icon icon={Download} size={14} />, onSelect: noop },
        { id: 'refresh', label: 'refresh', icon: <Icon icon={RefreshCw} size={14} />, onSelect: noop },
        { id: 'export', label: 'export csv', overflow: true, onSelect: noop },
        { id: 'settings', label: 'sweep settings', overflow: true, onSelect: noop },
      ]}
    />
  ),
};

export const Narrow: Story = {
  render: (args) => (
    <div style={{ width: 360 }}>
      <Toolbar
        {...args}
        actions={[
          { id: 'grab', label: 'grab all', emphasized: true, onSelect: noop },
          { id: 'refresh', label: 'refresh', onSelect: noop },
          { id: 'export', label: 'export csv', onSelect: noop },
        ]}
      />
    </div>
  ),
};

export const Selection: Story = {
  name: 'selection toolbar',
  render: function Selection() {
    const [n, setN] = useState(0);
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
        <SelectionToolbar
          label="missing episodes"
          heading="2,500 missing"
          selectedCount={n}
          onClearSelection={() => setN(0)}
          selectAll={n === 100 ? { label: 'select all 2,500', onSelect: () => setN(2500) } : null}
          primaryAction={(count) =>
            count
              ? { label: `grab ${count.toLocaleString('en')} selected`, icon: <Icon icon={Download} size={14} />, onSelect: () => setN(0) }
              : null
          }
          actions={[{ id: 'refresh', label: 'refresh', onSelect: noop }]}
        />
        <div style={{ display: 'flex', gap: 'var(--s-2)', fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
          simulate:
          {[0, 1, 8, 100].map((v) => (
            <button key={v} type="button" onClick={() => setN(v)}>
              {v} selected
            </button>
          ))}
        </div>
      </div>
    );
  },
};
