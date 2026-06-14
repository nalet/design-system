import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, type SelectProps, type SelectOption } from '../../src';

const meta: Meta<SelectProps> = {
  title: 'Components/select',
  component: Select,
  args: {
    selectSize: 'md',
    invalid: false,
    disabled: false,
    options: [
      { label: 'okd console', value: 'okd' },
      { label: 'gitlab', value: 'gitlab' },
      { label: 'postgres', value: 'postgres' },
      { label: 'kafka', value: 'kafka' },
    ],
  },
  argTypes: {
    selectSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    options: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: 'a square native select with a hairline border, mono text and a small blue chevron.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SelectProps>;

export const Playground: Story = {};

const namespaces: SelectOption[] = [
  { label: 'chino', value: 'chino' },
  { label: 'musig', value: 'musig' },
  { label: 'katalog', value: 'katalog' },
  { label: 'platform-event-streaming', value: 'platform-event-streaming' },
];

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', maxWidth: 320 }}>
      <Select selectSize="sm" options={namespaces} defaultValue="chino" />
      <Select selectSize="md" options={namespaces} defaultValue="musig" />
      <Select selectSize="lg" options={namespaces} defaultValue="katalog" />
    </div>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <Select defaultValue="prod">
        <option value="prod">prod</option>
        <option value="beta">beta</option>
        <option value="dev">dev</option>
        <option value="local" disabled>
          local (offline)
        </option>
      </Select>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', maxWidth: 320 }}>
      <Select options={namespaces} defaultValue="chino" />
      <Select invalid options={namespaces} defaultValue="musig" />
      <Select disabled options={namespaces} defaultValue="katalog" />
    </div>
  ),
};

const regions: SelectOption[] = [
  { label: 'worker6 (gpu)', value: 'worker6' },
  { label: 'worker4', value: 'worker4' },
  { label: 'nas001', value: 'nas001' },
];

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [node, setNode] = useState('worker6');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', maxWidth: 320 }}>
        <Select
          options={regions}
          value={node}
          onChange={(e) => setNode(e.target.value)}
        />
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
          scheduling transcoder on {node}
        </span>
      </div>
    );
  },
};
