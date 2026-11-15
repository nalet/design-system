import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch, type SwitchProps } from '../../src';

const meta: Meta<SwitchProps> = {
  title: 'Components/inputs/switch',
  component: Switch,
  args: {
    label: 'Email alerts',
    size: 'md',
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'The track: sm 30 × 16px, md 36 × 20px, lg 42 × 24px. A screen made for touch and a tv draw lg whatever this says.',
    },
    label: { control: 'text' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { control: false, description: 'The native change handler. Read event.target.checked.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A square on/off toggle for a setting that applies at once: a native checkbox with role="switch", a cloud-blue track when on and a square thumb.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SwitchProps>;

const stack = { display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' } as const;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={stack}>
      <Switch label="Email alerts" />
      <Switch label="Automatic updates" defaultChecked />
      <Switch label="Debug logging" disabled />
      <Switch label="Audit log" disabled defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-4)', alignItems: 'center' }}>
      <Switch size="sm" label="sm" defaultChecked />
      <Switch size="md" label="md" defaultChecked />
      <Switch size="lg" label="lg" defaultChecked />
    </div>
  ),
};

// a screen made for touch: the attribute on an element around the switches,
// usually the page's root. every switch is drawn large, in a row 48 high.
export const OnATouchScreen: Story = {
  name: 'on a touch screen',
  render: () => (
    <div data-nc-screen="touch" style={{ display: 'flex', flexDirection: 'column', width: 280 }}>
      <Switch label="Automatic updates" defaultChecked />
      <Switch label="Email alerts" defaultChecked />
      <Switch label="Weekly summary" />
    </div>
  ),
};

// a tv: each switch is a row of a settings list, with the tv focus on the row.
export const OnATv: Story = {
  name: 'on a tv',
  render: () => (
    <div data-nc-screen="tv" style={{ display: 'flex', flexDirection: 'column', width: 280 }}>
      <Switch label="Automatic updates" defaultChecked />
      <Switch label="Email alerts" defaultChecked />
      <Switch label="Weekly summary" />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [on, setOn] = useState(false);
    return (
      <div style={stack}>
        <Switch label="Maintenance mode" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <span role="status" style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-dim)' }}>
          {on ? 'visitors see the maintenance notice' : 'the site is open to visitors'}
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
        width: 280,
      }}
    >
      <Switch label="Automatic updates" defaultChecked />
      <Switch label="Email alerts" defaultChecked />
      <Switch label="Weekly summary" />
      <Switch label="Debug logging" />
    </div>
  ),
};
