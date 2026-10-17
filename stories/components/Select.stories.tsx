import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select, type SelectProps, type SelectOption } from '../../src';

const regions: SelectOption[] = [
  { label: 'eu-central', value: 'eu-central' },
  { label: 'eu-west', value: 'eu-west' },
  { label: 'us-east', value: 'us-east' },
  { label: 'ap-south', value: 'ap-south' },
];

const meta: Meta<SelectProps> = {
  title: 'Components/inputs/select',
  component: Select,
  args: {
    selectSize: 'md',
    invalid: false,
    disabled: false,
    options: regions,
  },
  argTypes: {
    selectSize: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'height: sm 28px, md 34px, lg 42px.',
    },
    invalid: {
      control: 'boolean',
      description: 'paint the error border (--state-error) and set aria-invalid.',
    },
    disabled: { control: 'boolean' },
    options: {
      control: false,
      // the source comment says children take precedence; the code renders options when both are given.
      description:
        'declarative options: { label, value, disabled? }. when both options and children are passed, options win and the children are ignored.',
    },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'a square, native drop-down for choosing one value from a list, with a small cloud-blue chevron. pass options or <option> children.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SelectProps>;

const column = { display: 'grid', gap: 'var(--s-3)', width: 320 } as const;
const caption = { fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-dim)' } as const;

export const Playground: Story = {
  render: (args) => <Select aria-label="region" {...args} />,
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
      <Select selectSize="sm" aria-label="region, sm" options={regions} defaultValue="eu-central" />
      <Select selectSize="md" aria-label="region, md" options={regions} defaultValue="eu-west" />
      <Select selectSize="lg" aria-label="region, lg" options={regions} defaultValue="us-east" />
    </div>
  ),
};

export const WithChildren: Story = {
  name: 'with children',
  render: () => (
    <div style={{ width: 320 }}>
      <Select aria-label="keep backups for" defaultValue="30">
        <option value="7">7 days</option>
        <option value="30">30 days</option>
        <option value="90">90 days</option>
        <option value="365" disabled>
          1 year (needs more storage)
        </option>
      </Select>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={column}>
      <Select aria-label="region" options={regions} defaultValue="eu-central" />
      <Select aria-label="region, invalid" invalid options={regions} defaultValue="eu-west" />
      <Select aria-label="region, disabled" disabled options={regions} defaultValue="us-east" />
    </div>
  ),
};

const nodes: SelectOption[] = [
  { label: 'worker-1', value: 'worker-1' },
  { label: 'worker-2', value: 'worker-2' },
  { label: 'storage-01', value: 'storage-01' },
];

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [node, setNode] = useState('worker-2');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-2)', width: 320 }}>
        <Select aria-label="node" options={nodes} value={node} onChange={(e) => setNode(e.target.value)} />
        <span style={caption}>new jobs run on {node}</span>
      </div>
    );
  },
};
