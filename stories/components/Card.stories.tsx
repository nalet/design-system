import type { Meta, StoryObj } from '@storybook/react';
import { Card, type CardProps, Badge, Button } from '../../src';

const meta: Meta<CardProps> = {
  title: 'Components/card',
  component: Card,
  args: {
    header: 'okd console',
    children: 'rollout completed across 3 worker nodes.',
    flush: false,
    sunken: false,
  },
  argTypes: {
    flush: { control: 'boolean' },
    sunken: { control: 'boolean' },
    header: { table: { disable: true } },
    headerAside: { table: { disable: true } },
    footer: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'a square surface panel with a hairline border and optional mono header and footer rows.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<CardProps>;

export const Playground: Story = {};

export const Plain: Story = {
  render: () => (
    <Card>postgres primary is healthy. last checkpoint 12s ago.</Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card
      header="chino"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--fg-3)' }}>p95 142ms</span>
          <Button variant="ghost" size="sm">
            logs
          </Button>
        </div>
      }
    >
      transcoder queue drained. 4 packages published to nas001.
    </Card>
  ),
};

export const HeaderAside: Story = {
  render: () => (
    <Card header="gitlab pipeline" headerAside={<Badge tone="green" dot>passed</Badge>}>
      build → image push → okd rollout finished in 6m12s.
    </Card>
  ),
};

export const Sunken: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', maxWidth: 360 }}>
      <Card header="surface" headerAside={<Badge tone="blue">default</Badge>}>
        the default container for grouped content.
      </Card>
      <Card sunken header="sunken" headerAside={<Badge tone="amber">bg-2</Badge>}>
        deeper background for nested or inset panels.
      </Card>
    </div>
  ),
};

export const Flush: Story = {
  render: () => (
    <Card header="worker nodes" flush>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--ff-mono)', fontSize: 13 }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: 'var(--s-3) var(--s-4)' }}>worker6</td>
            <td style={{ padding: 'var(--s-3) var(--s-4)', textAlign: 'right', color: 'var(--cloud-blue)' }}>ready</td>
          </tr>
          <tr>
            <td style={{ padding: 'var(--s-3) var(--s-4)' }}>worker7</td>
            <td style={{ padding: 'var(--s-3) var(--s-4)', textAlign: 'right', color: 'var(--fg-3)' }}>draining</td>
          </tr>
        </tbody>
      </table>
    </Card>
  ),
};
