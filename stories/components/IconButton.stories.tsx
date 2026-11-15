import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Bookmark, Captions, Heart, Play, Square, RotateCw, Trash2, Terminal, Copy } from 'lucide-react';
import { Button, IconButton, type IconButtonProps, Icon } from '../../src';

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
    pressed: { control: 'inline-radio', options: [undefined, false, true] },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A square, icon-only action with the same variants and sizes as button. Label is required: it becomes the accessible name and the native title. With pressed it holds a state, on or off.',
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

const caption = { fontFamily: 'var(--ff-ui)', fontSize: '0.75rem', color: 'var(--fg-muted)' } as const;

export const OnAndOff: Story = {
  name: 'on and off',
  render: function OnAndOff() {
    const [saved, setSaved] = useState(true);
    const [liked, setLiked] = useState(false);
    const [subtitles, setSubtitles] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
          <IconButton label="save to watchlist" pressed={saved} onClick={() => setSaved((on) => !on)}>
            <Icon icon={Bookmark} />
          </IconButton>
          <IconButton label="like" pressed={liked} onClick={() => setLiked((on) => !on)}>
            <Icon icon={Heart} />
          </IconButton>
          <IconButton label="show subtitles" variant="ghost" pressed={subtitles} onClick={() => setSubtitles((on) => !on)}>
            <Icon icon={Captions} />
          </IconButton>
        </div>
        <span style={caption}>
          {saved ? 'On the watchlist' : 'Not on the watchlist'}, {liked ? 'liked' : 'not liked'}, subtitles{' '}
          {subtitles ? 'shown' : 'hidden'}.
        </span>
      </div>
    );
  },
};

export const OnLook: Story = {
  name: 'the on look',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-5)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {(
        [
          { text: 'Standard, off', variant: 'default', pressed: false },
          { text: 'Standard, on', variant: 'default', pressed: true },
          { text: 'Quiet, off', variant: 'ghost', pressed: false },
          { text: 'Quiet, on', variant: 'ghost', pressed: true },
        ] as const
      ).map((kind) => (
        <div key={kind.text} style={{ display: 'grid', gap: 'var(--s-2)', justifyItems: 'center' }}>
          <IconButton label="save to watchlist" variant={kind.variant} pressed={kind.pressed}>
            <Icon icon={Bookmark} />
          </IconButton>
          <span style={caption}>{kind.text}</span>
        </div>
      ))}
    </div>
  ),
};

export const OnBesideTheNextStep: Story = {
  name: 'on, beside the next step',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
      <Button variant="primary" leading={<Icon icon={Play} />}>
        play
      </Button>
      <IconButton label="save to watchlist" pressed>
        <Icon icon={Bookmark} />
      </IconButton>
      <IconButton label="like" pressed>
        <Icon icon={Heart} />
      </IconButton>
    </div>
  ),
};
