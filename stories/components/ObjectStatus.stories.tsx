import type { Meta, StoryObj } from '@storybook/react-vite';
import { ObjectStatus, defineStates, type ObjectStatusProps } from '../../src';

const meta: Meta<ObjectStatusProps> = {
  title: 'Components/feedback & status/object status',
  component: ObjectStatus,
  args: { state: 'information', text: 'on its way', appearance: 'chip', icon: true },
  argTypes: {
    state: { control: 'inline-radio', options: ['neutral', 'information', 'success', 'warning', 'error'] },
    appearance: { control: 'inline-radio', options: ['chip', 'text'] },
    icon: { control: 'boolean' },
    text: { control: 'text' },
    stateLabel: { control: 'text' },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: 'the state of one object, said once and truthfully: a semantic state and short human text.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ObjectStatusProps>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <ObjectStatus state="neutral">missing</ObjectStatus>
      <ObjectStatus state="information">on its way</ObjectStatus>
      <ObjectStatus state="success">held</ObjectStatus>
      <ObjectStatus state="warning">connection firewalled</ObjectStatus>
      <ObjectStatus state="error">needs attention</ObjectStatus>
    </div>
  ),
};

export const TextAppearance: Story = {
  name: 'text appearance',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-2)', fontFamily: 'var(--ff-ui)', fontSize: 13, color: 'var(--fg-2)' }}>
      <span>
        storage-01 is <ObjectStatus state="success" appearance="text">healthy</ObjectStatus>
      </span>
      <span>
        worker-2 is <ObjectStatus state="warning" appearance="text">degraded</ObjectStatus>
      </span>
      <span>
        api-7f9c is <ObjectStatus state="error" appearance="text">unreachable</ObjectStatus>
      </span>
    </div>
  ),
};

export const WithoutGlyph: Story = {
  name: 'without glyph',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <ObjectStatus state="information" icon={false}>
        syncing
      </ObjectStatus>
      <ObjectStatus state="success" icon={false}>
        saved
      </ObjectStatus>
    </div>
  ),
};

// the vocabulary of one object, written once.
const LINK = defineStates({
  open: { state: 'success', text: 'open' },
  firewalled: { state: 'warning', text: 'connection firewalled' },
  checking: { state: 'information', text: 'checking' },
  down: { state: 'error', text: 'unreachable' },
  unknown: { state: 'neutral', text: 'not checked yet' },
});

export const Vocabulary: Story = {
  render: () => (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-2)' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 'var(--s-2)', color: 'var(--fg-muted)' }}>value</th>
          <th style={{ textAlign: 'left', padding: 'var(--s-2)', color: 'var(--fg-muted)' }}>renders</th>
        </tr>
      </thead>
      <tbody>
        {(Object.keys(LINK) as (keyof typeof LINK)[]).map((k) => (
          <tr key={k}>
            <td style={{ padding: 'var(--s-2)', borderTop: '1px solid var(--border)' }}>{k}</td>
            <td style={{ padding: 'var(--s-2)', borderTop: '1px solid var(--border)' }}>
              <ObjectStatus {...LINK[k]} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
