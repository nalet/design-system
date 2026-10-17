import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ActionMenu, ObjectStatus, type ActionMenuProps } from '../../src';

const meta: Meta<ActionMenuProps> = {
  title: 'Components/actions/action menu',
  component: ActionMenu,
  args: {
    label: 'actions for S04E07',
    items: [
      { id: 'pick', label: 'pick a release', onSelect: () => undefined },
      { id: 'grab', label: 'grab now', onSelect: () => undefined },
    ],
    size: 'sm',
    align: 'end',
  },
  argTypes: {
    items: { control: false },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    align: { control: 'inline-radio', options: ['start', 'end'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onOpenChange: { control: false },
    icon: { control: false },
    buttonLabel: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: 'actions behind one trigger: a menu button and a menu of verbs.' } },
  },
};
export default meta;

type Story = StoryObj<ActionMenuProps>;

export const Playground: Story = {};

export const InARow: Story = {
  name: 'in a row',
  render: function InARow() {
    const [last, setLast] = useState('nothing yet');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)', width: 420 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--s-3)',
            padding: 'var(--s-2) var(--s-3)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            fontFamily: 'var(--ff-mono)',
            fontSize: 13,
            color: 'var(--fg)',
          }}
        >
          <span style={{ flex: 1 }}>S04E07</span>
          <ObjectStatus state="neutral">missing</ObjectStatus>
          <ActionMenu
            label="actions for S04E07"
            items={[
              { id: 'pick', label: 'pick a release', onSelect: () => setLast('pick a release') },
              { id: 'grab', label: 'grab now', onSelect: () => setLast('grab now') },
            ]}
          />
        </div>
        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>chosen: {last}</span>
      </div>
    );
  },
};

export const TextTrigger: Story = {
  name: 'text trigger',
  args: { buttonLabel: 'export', label: 'export' },
  render: (args) => (
    <ActionMenu
      {...args}
      size="md"
      align="start"
      items={[
        { id: 'csv', label: 'as csv', onSelect: () => undefined },
        { id: 'json', label: 'as json', onSelect: () => undefined },
      ]}
    />
  ),
};

export const DisabledAndDanger: Story = {
  name: 'disabled and danger items',
  render: () => (
    <ActionMenu
      label="actions for worker-2"
      items={[
        { id: 'restart', label: 'restart', onSelect: () => undefined },
        { id: 'logs', label: 'open logs', onSelect: () => undefined, disabled: true },
        { id: 'delete', label: 'delete worker', onSelect: () => undefined, danger: true },
      ]}
    />
  ),
};

export const Busy: Story = {
  args: { loading: true },
};
