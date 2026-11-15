import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button, Field, Icon, IconButton, Slider, type SliderProps } from '../../src';

const percent = (n: number) => `${n}%`;

// a film of 1:52:00, 6,720 seconds
const LENGTH = 6720;
const two = (n: number) => String(n).padStart(2, '0');
const clock = (s: number) => `${Math.floor(s / 3600)}:${two(Math.floor((s % 3600) / 60))}:${two(s % 60)}`;
const played = (s: number) => {
  const minutes = Math.floor(s / 60);
  return minutes < 60 ? `${minutes} minutes of 1 hour 52` : `1 hour ${minutes - 60} of 1 hour 52`;
};

const meta: Meta<SliderProps> = {
  title: 'Components/inputs/slider',
  component: Slider,
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 60,
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    defaultValue: { control: 'number' },
    disabled: { control: 'boolean' },
    sharesRow: { control: 'boolean' },
    value: { control: false },
    loaded: { control: false },
    before: { control: false },
    after: { control: false },
    formatValue: { control: false },
    invalid: { control: false },
    onChange: { control: false, description: 'The native change handler. Read event.target.value.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A value in a range that people judge by its effect: a native range input with a square thumb, the part up to the thumb in blue, and the value in words after the track. Put it in a field for its label.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<SliderProps>;

/** the room a story has: a column of settings, or a player's controls on a tv. */
const room = (width: string): Story['decorators'] => [
  (Story) => (
    <div style={{ width, maxWidth: '100%' }}>
      <Story />
    </div>
  ),
];
const column22 = room('22rem');

const column = { display: 'grid', gap: 'var(--s-5)' } as const;
const kind = { display: 'grid', gap: 'var(--s-2)' } as const;
const caption = { fontFamily: 'var(--ff-ui)', fontSize: '0.75rem', lineHeight: 1.4, color: 'var(--fg-dim)' } as const;
const row = { display: 'flex', alignItems: 'center', gap: 'var(--s-3)' } as const;

export const Playground: Story = {
  decorators: column22,
  render: (args) => (
    <Field label="Volume">
      <Slider {...args} formatValue={percent} />
    </Field>
  ),
};

function SeekBar(props: Partial<SliderProps>) {
  const [at, setAt] = useState(2530);
  return (
    <Slider
      aria-label="Seek"
      min={0}
      max={LENGTH}
      step={10}
      value={at}
      onChange={(e) => setAt(Number(e.target.value))}
      loaded={4032}
      formatValue={played}
      before={clock(at)}
      after={clock(LENGTH)}
      {...props}
    />
  );
}

export const Kinds: Story = {
  name: 'three kinds',
  decorators: column22,
  render: () => (
    <div style={column}>
      <div style={kind}>
        <span style={caption}>How loud, in a player</span>
        <Slider aria-label="Volume" before={<Icon icon={Volume2} />} defaultValue={70} formatValue={percent} />
      </div>
      <div style={kind}>
        <span style={caption}>Where you are, in a player</span>
        <SeekBar />
      </div>
      <div style={kind}>
        <span style={caption}>A value in a range, in settings</span>
        <Field label="Text size">
          <Slider min={80} max={160} step={10} defaultValue={120} formatValue={percent} />
        </Field>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  decorators: column22,
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <div style={row}>
        <Button size="sm">mute</Button>
        <Slider size="sm" aria-label="Volume, small" defaultValue={40} formatValue={percent} />
      </div>
      <div style={row}>
        <Button size="md">mute</Button>
        <Slider size="md" aria-label="Volume, medium" defaultValue={60} formatValue={percent} />
      </div>
      <div style={row}>
        <Button size="lg">mute</Button>
        <Slider size="lg" aria-label="Volume, large" defaultValue={80} formatValue={percent} />
      </div>
    </div>
  ),
};

export const States: Story = {
  decorators: column22,
  render: () => (
    <div style={column}>
      <Field label="Volume">
        <Slider defaultValue={60} formatValue={percent} />
      </Field>
      <Field label="Volume" hint="Set by the device">
        <Slider defaultValue={60} formatValue={percent} disabled />
      </Field>
      <Field label="Share of the disk for backups" error="Choose 10% or more: one backup needs that much">
        <Slider defaultValue={5} formatValue={percent} />
      </Field>
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  decorators: column22,
  render: function Controlled() {
    const [size, setSize] = useState(120);
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
        <Field label="Text size">
          <Slider min={80} max={160} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} formatValue={percent} />
        </Field>
        <p style={{ margin: 0, fontFamily: 'var(--ff-ui)', fontSize: `${size / 100}rem`, lineHeight: 1.4, color: 'var(--fg-2)' }}>
          Text on this page is this large.
        </p>
      </div>
    );
  },
};

export const OnTouch: Story = {
  name: 'on a touch screen',
  decorators: column22,
  render: () => (
    <div data-nc-screen="touch">
      <Field label="Volume">
        <Slider defaultValue={60} formatValue={percent} />
      </Field>
    </div>
  ),
};

/** The seek bar has a row of its own; the volume shares the buttons' row, so up and down change it. */
export const OnTv: Story = {
  name: 'on a tv',
  decorators: room('30rem'),
  render: () => (
    <div data-nc-screen="tv" style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <SeekBar />
      <div style={{ ...row, flexWrap: 'wrap', paddingInline: 'var(--s-3)' }}>
        <IconButton label="previous episode" size="lg" variant="ghost">
          <Icon icon={SkipBack} />
        </IconButton>
        <IconButton label="play" size="lg" variant="ghost">
          <Icon icon={Play} />
        </IconButton>
        <IconButton label="next episode" size="lg" variant="ghost">
          <Icon icon={SkipForward} />
        </IconButton>
        <Slider
          aria-label="Volume"
          sharesRow
          before={<Icon icon={Volume2} />}
          defaultValue={70}
          formatValue={percent}
          style={{ flex: '1 1 10rem', width: 'auto' }}
        />
      </div>
    </div>
  ),
};
