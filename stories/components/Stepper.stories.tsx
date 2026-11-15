import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Field, Stepper, type StepperProps } from '../../src';

const seconds = (n: number) => (n === 1 ? '1 second' : `${n} seconds`);
const copies = (n: number) => (n === 1 ? '1 copy' : `${n} copies`);

/** a countdown in seconds, from 1 to 15: the stepper's own example. */
const countdown = {
  unit: 's',
  min: 1,
  max: 15,
  formatValue: seconds,
  minusLabel: 'fewer seconds',
  plusLabel: 'more seconds',
} satisfies StepperProps;

const meta: Meta<StepperProps> = {
  title: 'Components/inputs/stepper',
  component: Stepper,
  args: {
    ...countdown,
    defaultValue: 5,
    step: 1,
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    defaultValue: { control: 'number' },
    unit: { control: 'text' },
    minusLabel: { control: 'text' },
    plusLabel: { control: 'text' },
    disabled: { control: 'boolean' },
    value: { control: false },
    formatValue: { control: false },
    invalid: { control: false },
    onChange: { control: false, description: 'The native change handler. Read event.target.value.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A whole number, a few small steps from end to end: a native number field between a minus and a plus, in one frame. Put it in a field for its label and the hint that says its range.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<StepperProps>;

const column = { display: 'grid', gap: 'var(--s-5)' } as const;

export const Playground: Story = {
  render: (args) => (
    <Field label="Countdown" hint="From 1 to 15 seconds">
      <Stepper {...args} />
    </Field>
  ),
};

export const AtTheEnds: Story = {
  name: 'at its lowest and its highest',
  render: () => (
    <div style={column}>
      <Field label="Countdown" hint="From 1 to 15 seconds">
        <Stepper {...countdown} defaultValue={1} />
      </Field>
      <Field label="Countdown" hint="From 1 to 15 seconds">
        <Stepper {...countdown} defaultValue={15} />
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', justifyItems: 'start' }}>
      <Stepper size="sm" aria-label="Countdown, small" {...countdown} defaultValue={5} />
      <Stepper size="md" aria-label="Countdown, medium" {...countdown} defaultValue={5} />
      <Stepper size="lg" aria-label="Countdown, large" {...countdown} defaultValue={5} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={column}>
      <Field label="Countdown" hint="From 1 to 15 seconds">
        <Stepper {...countdown} defaultValue={5} />
      </Field>
      <Field label="Countdown" error="Use a whole number from 1 to 15">
        <Stepper {...countdown} defaultValue={40} />
      </Field>
      <Field label="Countdown" hint="Set by the device">
        <Stepper {...countdown} defaultValue={5} disabled />
      </Field>
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: function Controlled() {
    const [kept, setKept] = useState('3');
    const n = Number(kept);
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
        <Field label="Copies to keep" hint="From 1 to 9">
          <Stepper
            min={1}
            max={9}
            value={kept}
            onChange={(e) => setKept(e.target.value)}
            formatValue={copies}
            minusLabel="fewer copies"
            plusLabel="more copies"
          />
        </Field>
        <span style={{ fontFamily: 'var(--ff-ui)', fontSize: '0.8125rem', lineHeight: 1.4, color: 'var(--fg-muted)' }}>
          {n >= 1 && n <= 9 ? `The ${n === 1 ? 'newest copy stays' : `${n} newest copies stay`}; older ones go.` : 'Nothing changes until the number is from 1 to 9.'}
        </span>
      </div>
    );
  },
};

export const OnTouch: Story = {
  name: 'on a touch screen',
  render: () => (
    <div data-nc-screen="touch">
      <Field label="Countdown" hint="From 1 to 15 seconds">
        <Stepper {...countdown} defaultValue={5} />
      </Field>
    </div>
  ),
};

/** Each stepper is one row: left and right change the value, up and down move to the next row. */
export const OnTv: Story = {
  name: 'on a tv',
  render: () => (
    <div data-nc-screen="tv" style={{ display: 'grid', gap: 'var(--s-1)', width: '24rem', maxWidth: '100%' }}>
      <Field label="Countdown">
        <Stepper {...countdown} defaultValue={5} />
      </Field>
      <Field label="Copies to keep">
        <Stepper min={1} max={9} defaultValue={3} formatValue={copies} minusLabel="fewer copies" plusLabel="more copies" />
      </Field>
    </div>
  ),
};
