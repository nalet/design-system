import type { Meta, StoryObj } from '@storybook/react';
import { Play, Square, RotateCw, Trash2, Terminal, Copy } from 'lucide-react';
import { IconButton, type IconButtonProps } from '../../src';

const meta: Meta<IconButtonProps> = {
  title: 'Components/iconbutton',
  component: IconButton,
  args: {
    label: 'restart pod',
    variant: 'default',
    size: 'md',
    loading: false,
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'inline-radio', options: ['primary', 'default', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: 'a square icon-only button with the same variants as button and a mandatory label for accessibility.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<IconButtonProps>;

export const Playground: Story = {
  args: {
    children: <RotateCw size={16} />,
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <IconButton label="deploy" variant="primary">
        <Play size={16} />
      </IconButton>
      <IconButton label="restart deploy" variant="default">
        <RotateCw size={16} />
      </IconButton>
      <IconButton label="open shell" variant="ghost">
        <Terminal size={16} />
      </IconButton>
      <IconButton label="drop database" variant="danger">
        <Trash2 size={16} />
      </IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-3)', alignItems: 'center' }}>
      <IconButton label="copy" size="sm">
        <Copy size={12} />
      </IconButton>
      <IconButton label="copy" size="md">
        <Copy size={16} />
      </IconButton>
      <IconButton label="copy" size="lg">
        <Copy size={20} />
      </IconButton>
    </div>
  ),
};

export const Toolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center', padding: 'var(--s-3)', background: 'var(--surface)' }}>
      <IconButton label="start chino" variant="primary">
        <Play size={16} />
      </IconButton>
      <IconButton label="stop chino" variant="ghost">
        <Square size={16} />
      </IconButton>
      <IconButton label="restart chino" variant="ghost">
        <RotateCw size={16} />
      </IconButton>
      <IconButton label="open shell" variant="ghost">
        <Terminal size={16} />
      </IconButton>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, variant: 'primary', label: 'rolling out gitlab' },
};

export const Disabled: Story = {
  args: { disabled: true, label: 'drop postgres', variant: 'danger', children: <Trash2 size={16} /> },
};
