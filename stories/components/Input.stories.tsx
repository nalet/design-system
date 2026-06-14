import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Search, Server, ChevronRight } from 'lucide-react';
import { Input, type InputProps } from '../../src';
import { Icon } from '../../src';

const meta: Meta<InputProps> = {
  title: 'Components/input',
  component: Input,
  args: {
    placeholder: 'okd console',
    inputSize: 'md',
    invalid: false,
    disabled: false,
  },
  argTypes: {
    inputSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    leading: { table: { disable: true } },
    trailing: { table: { disable: true } },
  },
  parameters: {
    docs: { description: { component: 'a square mono text field with cyan focus ring and optional in-field prefix/suffix slots.' } },
  },
};
export default meta;

type Story = StoryObj<InputProps>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', maxWidth: 320 }}>
      <Input inputSize="sm" placeholder="sm — gitlab" />
      <Input inputSize="md" placeholder="md — postgres" />
      <Input inputSize="lg" placeholder="lg — chino" />
    </div>
  ),
};

export const WithAffixes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', maxWidth: 320 }}>
      <Input leading={<Icon icon={Search} />} placeholder="search images" />
      <Input leading={<Icon icon={Server} />} placeholder="okd-prod" defaultValue="worker6" />
      <Input leading={<Icon icon={ChevronRight} />} placeholder="deploy" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', maxWidth: 320 }}>
      <Input placeholder="default" />
      <Input invalid placeholder="invalid — p95 breach" defaultValue="240ms" />
      <Input disabled placeholder="disabled — locked" defaultValue="readonly" />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [value, setValue] = useState('chino-stream');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-2)', maxWidth: 320 }}>
        <Input
          leading={<Icon icon={ChevronRight} />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="namespace"
        />
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-dim)' }}>
          oc project {value || '…'}
        </span>
      </div>
    );
  },
};
