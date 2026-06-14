import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, type CheckboxProps } from '../../src';

const meta: Meta<CheckboxProps> = {
  title: 'Components/checkbox',
  component: Checkbox,
  args: {
    label: 'prune dangling images',
    checked: false,
    indeterminate: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'a square checkbox with a blue fill when on, an indeterminate dash state, and an optional label.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<CheckboxProps>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
      <Checkbox label="restart on push" checked readOnly />
      <Checkbox label="run migrations" />
      <Checkbox label="all workers" indeterminate readOnly />
      <Checkbox label="force rollout" disabled />
      <Checkbox label="skip cache" checked disabled readOnly />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
      <Checkbox label="okd console" checked readOnly />
      <Checkbox label="gitlab" checked readOnly />
      <Checkbox label="postgres" />
      <Checkbox label="chino" />
    </div>
  ),
};

export const Interactive: Story = {
  name: 'interactive',
  render: () => {
    const items = ['worker4', 'worker5', 'worker6'];
    const [drained, setDrained] = useState<string[]>(['worker4']);

    const allOn = drained.length === items.length;
    const someOn = drained.length > 0 && !allOn;

    const toggleAll = () => setDrained(allOn ? [] : [...items]);
    const toggle = (node: string) =>
      setDrained((prev) =>
        prev.includes(node) ? prev.filter((n) => n !== node) : [...prev, node],
      );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
        <Checkbox
          label="drain all nodes"
          checked={allOn}
          indeterminate={someOn}
          onChange={toggleAll}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-2)',
            paddingLeft: 'var(--s-3)',
            borderLeft: '1px solid var(--border-2)',
          }}
        >
          {items.map((node) => (
            <Checkbox
              key={node}
              label={node}
              checked={drained.includes(node)}
              onChange={() => toggle(node)}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const WithoutLabel: Story = {
  name: 'without label',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <Checkbox aria-label="select row" />
      <Checkbox aria-label="select all rows" checked readOnly />
      <Checkbox aria-label="partial selection" indeterminate readOnly />
    </div>
  ),
};
