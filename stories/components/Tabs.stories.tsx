import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs, type TabsProps, type TabItem } from '../../src';

const items: TabItem[] = [
  { value: 'overview', label: 'overview' },
  { value: 'logs', label: 'logs' },
  { value: 'metrics', label: 'metrics' },
  { value: 'events', label: 'events' },
];

const meta: Meta<TabsProps> = {
  title: 'Components/tabs',
  component: Tabs,
  args: {
    items,
    defaultValue: 'overview',
  },
  argTypes: {
    items: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { control: 'text' },
    onChange: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'row of mono tab triggers with a cloud-blue active underline; controlled via value/onChange or uncontrolled via defaultValue with roving arrow-key focus.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TabsProps>;

export const Playground: Story = {};

export const Uncontrolled: Story = {
  name: 'uncontrolled',
  render: () => (
    <Tabs
      defaultValue="logs"
      items={[
        { value: 'overview', label: 'overview' },
        { value: 'logs', label: 'logs' },
        { value: 'metrics', label: 'metrics' },
      ]}
    />
  ),
};

export const WithDisabled: Story = {
  name: 'with disabled',
  render: () => (
    <Tabs
      defaultValue="catalog"
      items={[
        { value: 'catalog', label: 'catalog' },
        { value: 'stream', label: 'stream' },
        { value: 'transcoder', label: 'transcoder', disabled: true },
        { value: 'packager', label: 'packager' },
      ]}
    />
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [tab, setTab] = useState('chino');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)', width: 360 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'chino', label: 'chino' },
            { value: 'musig', label: 'musig' },
            { value: 'gitlab', label: 'gitlab' },
          ]}
        />
        <div
          style={{
            fontFamily: 'var(--ff-mono)',
            fontSize: 13,
            color: 'var(--fg-muted)',
            padding: 'var(--s-3)',
            border: '1px solid var(--border)',
          }}
        >
          active panel: {tab}
        </div>
      </div>
    );
  },
};

export const WithPanel: Story = {
  name: 'with panel',
  render: () => {
    const [tab, setTab] = useState('logs');
    const panels: Record<string, string> = {
      overview: 'okd console / rollout healthy / p95 142ms',
      logs: 'level=info msg="rollout complete" pod=chino-api-7f9c',
      metrics: 'cpu 0.34 / mem 612mi / req 1.2k rps',
    };
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)', width: 420 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'overview', label: 'overview' },
            { value: 'logs', label: 'logs' },
            { value: 'metrics', label: 'metrics' },
          ]}
        />
        <pre
          style={{
            margin: 0,
            fontFamily: 'var(--ff-mono)',
            fontSize: 13,
            color: 'var(--fg)',
            background: 'var(--bg-elev)',
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
