import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ActionMenu, Icon, Status, type ActionMenuProps } from '../../src';

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
    choices: { control: false },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    align: { control: 'inline-radio', options: ['start', 'end'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onOpenChange: { control: false },
    icon: { control: false },
    buttonLabel: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Actions behind one trigger: a menu button and a menu of verbs. With choices it is a menu of one choice: options with a check on the picked one.',
      },
    },
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
          <Status state="neutral">missing</Status>
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

export const Alignment: Story = {
  name: 'align start and end',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 360 }}>
      <ActionMenu
        label="actions for db-0"
        align="start"
        items={[
          { id: 'logs', label: 'open logs', onSelect: () => undefined },
          { id: 'restart', label: 'restart', onSelect: () => undefined },
        ]}
      />
      <ActionMenu
        label="actions for worker-2"
        items={[
          { id: 'logs', label: 'open logs', onSelect: () => undefined },
          { id: 'restart', label: 'restart', onSelect: () => undefined },
        ]}
      />
    </div>
  ),
};

const QUALITY = [
  { value: 'auto', label: 'auto', detail: '720p' },
  { value: '1080', label: '1080p' },
  { value: '720', label: '720p' },
  { value: '480', label: '480p' },
];

const SPEED = [
  { value: '0.5', label: '0.5×' },
  { value: '1', label: '1×' },
  { value: '1.5', label: '1.5×' },
  { value: '2', label: '2×' },
];

const note = { fontFamily: 'var(--ff-mono)', fontSize: '0.75rem', color: 'var(--fg-muted)' } as const;

function PlayerSettings({ size }: { size?: ActionMenuProps['size'] }) {
  const [quality, setQuality] = useState('auto');
  const [speed, setSpeed] = useState('1');
  const said = (list: typeof QUALITY, value: string) => list.find((o) => o.value === value)?.label;
  return (
    <div style={{ display: 'grid', gap: 'var(--s-3)', justifyItems: 'start' }}>
      <ActionMenu
        label="player settings"
        size={size}
        align="start"
        icon={<Icon icon={SlidersHorizontal} size={size === 'lg' ? 20 : 16} />}
        choices={[
          { id: 'quality', label: 'quality', options: QUALITY, value: quality, onChange: setQuality },
          { id: 'speed', label: 'speed', options: SPEED, value: speed, onChange: setSpeed },
        ]}
      />
      <span style={note}>
        quality: {said(QUALITY, quality)} · speed: {said(SPEED, speed)}
      </span>
    </div>
  );
}

export const OneChoice: Story = {
  name: 'a menu of one choice',
  render: () => <PlayerSettings />,
};

export const OneChoiceNamedByItsTrigger: Story = {
  name: 'one choice, named by its trigger',
  render: function OneChoiceNamedByItsTrigger() {
    const [speed, setSpeed] = useState('1');
    return (
      <ActionMenu
        label="speed"
        buttonLabel="speed"
        size="md"
        align="start"
        choices={[{ id: 'speed', options: SPEED, value: speed, onChange: setSpeed }]}
      />
    );
  },
};

export const Large: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-5)', alignItems: 'flex-start' }}>
      <ActionMenu
        label="actions for worker-2"
        size="lg"
        align="start"
        items={[
          { id: 'restart', label: 'restart', onSelect: () => undefined },
          { id: 'logs', label: 'open logs', onSelect: () => undefined },
          { id: 'delete', label: 'delete worker', onSelect: () => undefined, danger: true },
        ]}
      />
      <PlayerSettings size="lg" />
    </div>
  ),
};

export const OnATouchScreen: Story = {
  name: 'on a touch screen',
  render: () => (
    // the app says the kind of screen once, on an element around everything.
    <div data-nc-screen="touch" style={{ display: 'flex', gap: 'var(--s-5)', alignItems: 'flex-start' }}>
      <ActionMenu
        label="actions for worker-2"
        align="start"
        items={[
          { id: 'restart', label: 'restart', onSelect: () => undefined },
          { id: 'logs', label: 'open logs', onSelect: () => undefined },
          { id: 'delete', label: 'delete worker', onSelect: () => undefined, danger: true },
        ]}
      />
      <PlayerSettings />
    </div>
  ),
};
