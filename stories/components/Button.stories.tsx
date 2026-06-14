import type { Meta, StoryObj } from '@storybook/react';
import { Terminal } from 'lucide-react';
import { Button, type ButtonProps } from '../../src';
import { Icon } from '../../src';

const meta: Meta<ButtonProps> = {
  title: 'Components/Button',
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
      <Button variant="danger">drop</Button>
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

export const WithIcon: Story = {
  render: () => (
    <Button variant="primary" leading={<Icon icon={Terminal} />}>
      open shell
    </Button>
  ),
};

export const Loading: Story = {
  args: { loading: true, variant: 'primary', children: 'deploying' },
};
