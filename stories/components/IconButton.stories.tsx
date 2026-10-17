import type { Meta, StoryObj } from '@storybook/react-vite';
import { Play, Square, RotateCw, Trash2, Terminal, Copy } from 'lucide-react';
import { IconButton, type IconButtonProps, Icon } from '../../src';

const meta: Meta<IconButtonProps> = {
  title: 'Components/actions/icon button',
  component: IconButton,
  args: {
    label: 'restart worker',
    variant: 'default',
    size: 'md',
    loading: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'inline-radio', options: ['primary', 'default', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A square, icon-only action with the same variants and sizes as button. Label is required: it becomes the accessible name and the native title.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<IconButtonProps>;

export const Playground: Story = {
  args: {
    children: <Icon icon={RotateCw} />,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <IconButton label="start release" variant="primary">
        <Icon icon={Play} />
      </IconButton>
      <IconButton label="restart worker" variant="default">
        <Icon icon={RotateCw} />
      </IconButton>
      <IconButton label="open shell" variant="ghost">
        <Icon icon={Terminal} />
      </IconButton>
      <IconButton label="delete volume" variant="danger">
        <Icon icon={Trash2} />
      </IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <IconButton label="copy link" size="sm">
        <Icon icon={Copy} size={12} />
      </IconButton>
      <IconButton label="copy link" size="md">
        <Icon icon={Copy} size={16} />
      </IconButton>
      <IconButton label="copy link" size="lg">
        <Icon icon={Copy} size={20} />
      </IconButton>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <IconButton label="restart worker" variant="primary">
        <Icon icon={RotateCw} />
      </IconButton>
      <IconButton label="restart worker" variant="primary" loading>
        <Icon icon={RotateCw} />
      </IconButton>
      <IconButton label="restart worker" variant="primary" disabled>
        <Icon icon={RotateCw} />
      </IconButton>
      <IconButton label="delete volume" variant="danger" disabled>
        <Icon icon={Trash2} />
      </IconButton>
    </div>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--s-2)',
        alignItems: 'center',
        padding: 'var(--s-3)',
        background: 'var(--surface)',
      }}
    >
      <IconButton label="start worker-2" variant="primary">
        <Icon icon={Play} />
      </IconButton>
      <IconButton label="stop worker-2" variant="ghost">
        <Icon icon={Square} />
      </IconButton>
      <IconButton label="restart worker-2" variant="ghost">
        <Icon icon={RotateCw} />
      </IconButton>
      <IconButton label="open shell on worker-2" variant="ghost">
        <Icon icon={Terminal} />
      </IconButton>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, variant: 'primary', label: 'restart worker', children: <Icon icon={RotateCw} /> },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'delete volume', variant: 'danger', children: <Icon icon={Trash2} /> },
};
