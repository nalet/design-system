import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, type KbdProps } from '../../src';

const meta: Meta<KbdProps> = {
  title: 'Components/kbd',
  component: Kbd,
  args: {
    children: 'esc',
  },
  argTypes: {
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'a single square keycap with a hairline border and mono label, e.g. esc or ctrl.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<KbdProps>;

export const Playground: Story = {};

export const Keys: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd>esc</Kbd>
      <Kbd>tab</Kbd>
      <Kbd>enter</Kbd>
      <Kbd>shift</Kbd>
      <Kbd>ctrl</Kbd>
      <Kbd>alt</Kbd>
      <Kbd>k</Kbd>
    </div>
  ),
};

export const Combo: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
        <Kbd>ctrl</Kbd>
        <Kbd>k</Kbd>
      </div>
      <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
        <Kbd>ctrl</Kbd>
        <Kbd>shift</Kbd>
        <Kbd>p</Kbd>
      </div>
    </div>
  ),
};

export const InShortcutList: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: 'var(--s-3)',
        width: 280,
        color: 'var(--fg)',
        fontFamily: 'var(--ff-mono)',
        fontSize: 13,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>open command palette</span>
        <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
          <Kbd>ctrl</Kbd>
          <Kbd>k</Kbd>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>focus terminal</span>
        <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
          <Kbd>ctrl</Kbd>
          <Kbd>`</Kbd>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>dismiss</span>
        <Kbd>esc</Kbd>
      </div>
    </div>
  ),
};
