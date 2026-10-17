import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Input, type InputProps, Icon } from '../../src';

const meta: Meta<InputProps> = {
  title: 'Components/inputs/input',
  component: Input,
  args: {
    placeholder: 'worker-2',
    inputSize: 'md',
    invalid: false,
    disabled: false,
  },
  argTypes: {
    inputSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    leading: { control: false },
    trailing: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'a square, single-line text field in mono type, with optional leading and trailing affixes. put it in a field for its label, hint and error.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<InputProps>;

const column = { display: 'grid', gap: 'var(--s-3)', width: 320 } as const;
const stateRow = {
  display: 'grid',
  gridTemplateColumns: '80px 1fr',
  alignItems: 'center',
  gap: 'var(--s-3)',
} as const;
const caption = { fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-dim)' } as const;

export const Playground: Story = {
  render: (args) => <Input aria-label="node name" {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const Sizes: Story = {
  render: () => (
    <div style={column}>
      <Input inputSize="sm" aria-label="sm" placeholder="sm" />
      <Input inputSize="md" aria-label="md" placeholder="md" />
      <Input inputSize="lg" aria-label="lg" placeholder="lg" />
    </div>
  ),
};

export const WithAffixes: Story = {
  name: 'with affixes',
  render: () => (
    <div style={column}>
      <Input aria-label="search releases" leading={<Icon icon={Search} />} placeholder="search releases" />
      <Input aria-label="command" leading={<Icon icon={ChevronRight} />} defaultValue="deploy release" />
      <Input aria-label="timeout (ms)" defaultValue="250" trailing="ms" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: 360 }}>
      <div style={stateRow}>
        <span style={caption}>default</span>
        <Input aria-label="default" placeholder="worker-2" />
      </div>
      <div style={stateRow}>
        <span style={caption}>invalid</span>
        <Input aria-label="invalid" invalid defaultValue="worker 2" />
      </div>
      <div style={stateRow}>
        <span style={caption}>disabled</span>
        <Input aria-label="disabled" disabled defaultValue="worker-2" />
      </div>
      <div style={stateRow}>
        <span style={caption}>read-only</span>
        <Input aria-label="read-only" readOnly defaultValue="worker-2" />
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [value, setValue] = useState('worker-2');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-2)', width: 320 }}>
        <Input
          aria-label="node name"
          leading={<Icon icon={ChevronRight} />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="worker-2"
        />
        <span style={caption}>connects to {value || '…'}.example.com</span>
      </div>
    );
  },
};
