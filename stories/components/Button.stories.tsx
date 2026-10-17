import type { Meta, StoryObj } from '@storybook/react-vite';
import { Terminal, Rocket, Trash2, ArrowRight } from 'lucide-react';
import { Button, type ButtonProps, Icon } from '../../src';

const meta: Meta<ButtonProps> = {
  title: 'Components/actions/button',
  component: Button,
  args: {
    children: 'run',
    variant: 'default',
    size: 'md',
    loading: false,
    block: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'default', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    block: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    leading: { control: false },
    trailing: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A square, mono-labelled action. Primary is the one emphasized action on a screen; loading swaps the leading slot for a spinner.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ButtonProps>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Button variant="primary">deploy</Button>
      <Button variant="default">run</Button>
      <Button variant="ghost">cancel</Button>
      <Button variant="danger">delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'with icons',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Button variant="primary" leading={<Icon icon={Rocket} />}>
        deploy release
      </Button>
      <Button variant="default" leading={<Icon icon={Terminal} />}>
        open shell
      </Button>
      <Button variant="ghost" trailing={<Icon icon={ArrowRight} />}>
        next
      </Button>
      <Button variant="danger" leading={<Icon icon={Trash2} />}>
        delete volume
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
      <Button variant="primary">roll out</Button>
      <Button variant="primary" loading>
        rolling out
      </Button>
      <Button variant="primary" disabled>
        roll out
      </Button>
      <Button variant="default" disabled>
        run
      </Button>
    </div>
  ),
};

export const Block: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: 280 }}>
      <Button variant="primary" block leading={<Icon icon={Rocket} />}>
        deploy release
      </Button>
      <Button variant="default" block>
        view pipeline
      </Button>
    </div>
  ),
};
