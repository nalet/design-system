import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch, type SwitchProps } from '../../src';

const meta: Meta<SwitchProps> = {
  title: 'Components/switch',
  component: Switch,
  args: {
    label: 'enable prewarm',
    size: 'md',
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: 'a square on/off toggle with a blue track when on and a sliding square thumb.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SwitchProps>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
      <Switch label="off" />
      <Switch label="on" defaultChecked />
      <Switch label="disabled off" disabled />
      <Switch label="disabled on" disabled defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <Switch size="sm" label="sm" defaultChecked />
      <Switch size="md" label="md" defaultChecked />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        <Switch
          label={on ? 'transcoder: nvenc' : 'transcoder: ffmpeg fallback'}
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
        />
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-dim)' }}>
          {on ? 'gpu route active' : 'cpu route active'}
        </span>
      </div>
    );
  },
};

export const SettingsPanel: Story = {
  name: 'settings panel',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--s-3)',
        padding: 'var(--s-4)',
        background: 'var(--bg-2)',
        border: '1px solid var(--border-2)',
        maxWidth: 280,
      }}
    >
      <Switch label="auto-update channel" defaultChecked />
      <Switch label="prewarm hls on seek" defaultChecked />
      <Switch label="anti-affinity scheduling" />
      <Switch label="verbose okd logs" />
    </div>
  ),
};
