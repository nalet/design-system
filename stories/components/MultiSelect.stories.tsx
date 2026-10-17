import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MultiSelect, type MultiSelectProps } from '../../src';

const OPTIONS: MultiSelectProps['options'] = [
  { value: 'missing', label: 'missing', count: 2318 },
  { value: 'way', label: 'on its way', count: 182 },
  { value: 'attention', label: 'needs attention', count: 3 },
];

const meta: Meta<MultiSelectProps> = {
  title: 'Components/inputs/multi select',
  component: MultiSelect,
  args: { label: 'state', options: OPTIONS, value: [], size: 'md', emptyText: 'any' },
  argTypes: {
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: 'a facet that keeps several values: a trigger and a panel of checkboxes.' } },
  },
  decorators: [(Story) => <div style={{ minHeight: 200 }}>{Story()}</div>],
};
export default meta;

type Story = StoryObj<MultiSelectProps>;

export const Playground: Story = {
  render: function Playground(args) {
    const [value, setValue] = useState<string[]>(args.value);
    return <MultiSelect {...args} value={value} onChange={setValue} />;
  },
};

export const Chosen: Story = {
  name: 'with values chosen',
  render: function Chosen() {
    const [value, setValue] = useState<string[]>(['way', 'attention']);
    return <MultiSelect label="state" options={OPTIONS} value={value} onChange={setValue} />;
  },
};

export const Small: Story = {
  render: function Small() {
    const [value, setValue] = useState<string[]>([]);
    return <MultiSelect label="state" size="sm" options={OPTIONS} value={value} onChange={setValue} />;
  },
};
