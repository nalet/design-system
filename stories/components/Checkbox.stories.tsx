import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, type CheckboxProps } from '../../src';

const meta: Meta<CheckboxProps> = {
  title: 'Components/inputs/checkbox',
  component: Checkbox,
  args: {
    label: 'Send a weekly summary',
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A square box that turns one option on or off in a form that is saved later, with a mixed (indeterminate) state and an optional label.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<CheckboxProps>;

const stack = { display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' } as const;
const legend = {
  padding: 0,
  marginBottom: 'var(--s-2)',
  fontFamily: 'var(--ff-ui)',
  fontWeight: 500,
  fontSize: 13,
  color: 'var(--fg-2)',
} as const;

/** A parent box whose children are partly on: a click turns them all on, the next all off. */
function MixedParent(props: CheckboxProps) {
  const [on, setOn] = useState<boolean | 'mixed'>('mixed');
  return (
    <Checkbox
      {...props}
      checked={on === true}
      indeterminate={on === 'mixed'}
      onChange={() => setOn(on !== true)}
    />
  );
}

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={stack}>
      <Checkbox label="Include archived items" />
      <Checkbox label="Send a weekly summary" defaultChecked />
      <MixedParent label="All volumes" />
      <Checkbox label="Notify the owner" disabled />
      <Checkbox label="Keep snapshots" defaultChecked disabled />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
      <legend style={legend}>Notify me about</legend>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
        <Checkbox label="Failed releases" defaultChecked />
        <Checkbox label="Finished releases" defaultChecked />
        <Checkbox label="New comments" />
        <Checkbox label="Weekly summary" />
      </div>
    </fieldset>
  ),
};

export const Interactive: Story = {
  name: 'interactive',
  render: () => {
    const items = ['storage-01', 'storage-02', 'storage-03'];
    const [selected, setSelected] = useState<string[]>(['storage-01']);

    const allOn = selected.length === items.length;
    const someOn = selected.length > 0 && !allOn;

    const toggleAll = () => setSelected(allOn ? [] : [...items]);
    const toggle = (volume: string) =>
      setSelected((prev) => (prev.includes(volume) ? prev.filter((v) => v !== volume) : [...prev, volume]));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
        <Checkbox label="Back up all volumes" checked={allOn} indeterminate={someOn} onChange={toggleAll} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--s-2)',
            paddingLeft: 'var(--s-3)',
            borderLeft: '1px solid var(--border-2)',
          }}
        >
          {items.map((volume) => (
            <Checkbox
              key={volume}
              label={volume}
              checked={selected.includes(volume)}
              onChange={() => toggle(volume)}
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
    <div style={{ display: 'flex', gap: 'var(--s-4)', alignItems: 'center' }}>
      <Checkbox aria-label="select api-7f9c" />
      <Checkbox aria-label="select worker-2" defaultChecked />
      <MixedParent aria-label="select all rows" />
    </div>
  ),
};
