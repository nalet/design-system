import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs, type TabsProps, type TabItem } from '../../src';

const items: TabItem[] = [
  { value: 'overview', label: 'overview' },
  { value: 'logs', label: 'logs' },
  { value: 'metrics', label: 'metrics' },
  { value: 'events', label: 'events' },
];

const meta: Meta<TabsProps> = {
  title: 'Components/navigation/tabs',
  component: Tabs,
  args: {
    items,
    defaultValue: 'overview',
  },
  argTypes: {
    items: { control: 'object' },
    // a controlled value without an onChange that updates it freezes the row.
    value: { control: false },
    defaultValue: { control: 'text' },
    onChange: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A row of mono tab triggers with a cloud-blue underline on the selected one. Renders the tablist only; you render the panel. Controlled via value/onChange or uncontrolled via defaultValue.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TabsProps>;

export const Playground: Story = {};

export const Uncontrolled: Story = {
  name: 'uncontrolled',
  render: () => <Tabs defaultValue="logs" items={items.slice(0, 3)} />,
};

export const WithDisabled: Story = {
  name: 'with disabled',
  render: () => (
    <Tabs
      defaultValue="overview"
      items={[
        { value: 'overview', label: 'overview' },
        { value: 'logs', label: 'logs' },
        { value: 'traces', label: 'traces', disabled: true },
        { value: 'events', label: 'events' },
      ]}
    />
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: function ControlledTabs() {
    const [tab, setTab] = useState('metrics');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)', width: 360 }}>
        <Tabs value={tab} onChange={setTab} items={items.slice(0, 3)} />
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--fg-muted)' }}>
          value: {tab}
        </div>
      </div>
    );
  },
};

const panels: Record<string, string> = {
  overview: 'api-7f9c / rollout healthy / p95 142 ms',
  logs: 'level=info msg="rollout complete" pod=api-7f9c node=worker-2',
  metrics: 'cpu 0.34 / mem 612 mi / 1.2k requests per second',
};

// the recommended wiring: Tabs renders no panel, so the panel names itself
// after the selected tab and takes a tab stop when it holds nothing focusable.
export const WithPanel: Story = {
  name: 'with panel',
  render: function TabsWithPanel() {
    const [tab, setTab] = useState('logs');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)', width: 440 }}>
        <Tabs value={tab} onChange={setTab} items={items.slice(0, 3)} />
        <pre
          role="tabpanel"
          aria-label={tab}
          tabIndex={0}
          style={{
            margin: 0,
            fontFamily: 'var(--ff-mono)',
            fontSize: 13,
            color: 'var(--fg)',
            background: 'var(--bg-2)',
            padding: 'var(--s-3)',
            border: '1px solid var(--border)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {panels[tab]}
        </pre>
      </div>
    );
  },
};
