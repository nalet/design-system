import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Button, ProgressBar, type ProgressBarProps, type ProgressState } from '../../src';

// one copy of 3 files, 2,200 MB in all. 1,364 MB of it is 62%, and 1.4 GB to one place.
const TOTAL = 2200;
const gb = (mb: number) => (mb / 1000).toFixed(1);
const amount = (mb: number) => `${gb(mb)} of ${gb(TOTAL)} GB`;

const meta: Meta<ProgressBarProps> = {
  title: 'Components/feedback & status/progress bar',
  component: ProgressBar,
  args: {
    label: 'Copying 3 files',
    value: 1364,
    max: TOTAL,
    amount: amount(1364),
    state: 'running',
  },
  argTypes: {
    state: { control: 'inline-radio', options: ['running', 'paused', 'failed', 'done'] },
    value: { control: { type: 'range', min: 0, max: TOTAL, step: 22 } },
    max: { control: 'number' },
    label: { control: 'text' },
    amount: { control: 'text' },
    valueText: { control: 'text' },
    message: { control: 'text' },
    onCancel: { control: false },
    onPause: { control: false },
    onResume: { control: false },
    onRetry: { control: false },
    invalid: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '24rem', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'How far work of a known size has come: what is under way, a bar that fills from the start, and the value in words under it. The bar is a native progress element; its colour follows the work, and the end is announced once.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ProgressBarProps>;

const column = { display: 'grid', gap: 'var(--s-5)' } as const;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={column}>
      <ProgressBar label="Copying 3 files" value={1364} max={TOTAL} amount={amount(1364)} />
      <ProgressBar label="Copying 3 files" value={1364} max={TOTAL} amount={amount(1364)} state="paused" />
      <ProgressBar
        label="Copying 3 files"
        value={1364}
        max={TOTAL}
        amount={amount(1364)}
        state="failed"
        message="Couldn't finish: the disk is full. Free 0.9 GB, then try again."
        onRetry={() => undefined}
      />
      <ProgressBar label="3 files" value={TOTAL} max={TOTAL} state="done" message={`copied · ${gb(TOTAL)} GB`} />
    </div>
  ),
};

export const Stopping: Story = {
  name: 'cancel and pause',
  render: () => (
    <div style={column}>
      <ProgressBar label="Checking 2,400 files" value={880} max={2400} amount="880 of 2,400 files" onCancel={() => undefined} />
      <ProgressBar
        label="Copying 3 files"
        value={1364}
        max={TOTAL}
        amount={amount(1364)}
        onPause={() => undefined}
        onCancel={() => undefined}
      />
    </div>
  ),
};

export const Waiting: Story = {
  name: 'waiting, with the reason',
  render: () => (
    <ProgressBar
      label="Copying 3 files"
      value={1364}
      max={TOTAL}
      state="paused"
      valueText="waiting for the other disk · 62%"
      onCancel={() => undefined}
    />
  ),
};

/** A copy that starts paused: resume runs it, pause holds it, and at the end the result takes the bar's place. */
export const Live: Story = {
  name: 'a copy, live',
  render: function Live() {
    const [done, setDone] = useState(1364);
    const [state, setState] = useState<ProgressState | 'cancelled'>('paused');

    useEffect(() => {
      if (state !== 'running') return;
      const timer = setInterval(() => setDone((mb) => Math.min(TOTAL, mb + 44)), 400);
      return () => clearInterval(timer);
    }, [state]);
    useEffect(() => {
      if (done >= TOTAL) setState('done');
    }, [done]);

    const again = () => {
      setDone(0);
      setState('running');
    };

    if (state === 'cancelled') return <Button onClick={again}>copy the 3 files</Button>;
    return (
      <div style={{ display: 'grid', gap: 'var(--s-3)', justifyItems: 'start' }}>
        <ProgressBar
          label={state === 'done' ? '3 files' : 'Copying 3 files'}
          value={done}
          max={TOTAL}
          amount={amount(done)}
          state={state}
          message={`copied · ${gb(TOTAL)} GB`}
          onPause={() => setState('paused')}
          onResume={() => setState('running')}
          onCancel={() => setState('cancelled')}
        />
        {state === 'done' ? (
          <Button size="sm" onClick={again}>
            copy them again
          </Button>
        ) : null}
      </div>
    );
  },
};

/** A copy that failed. "try again" runs it to its end. */
export const Failed: Story = {
  name: 'failed, and tried again',
  render: function Failed() {
    const [done, setDone] = useState(1364);
    const [state, setState] = useState<ProgressState>('failed');

    useEffect(() => {
      if (state !== 'running') return;
      const timer = setInterval(() => setDone((mb) => Math.min(TOTAL, mb + 44)), 400);
      return () => clearInterval(timer);
    }, [state]);
    useEffect(() => {
      if (done >= TOTAL) setState('done');
    }, [done]);

    return (
      <ProgressBar
        label={state === 'done' ? '3 files' : 'Copying 3 files'}
        value={done}
        max={TOTAL}
        amount={amount(done)}
        state={state}
        message={state === 'done' ? `copied · ${gb(TOTAL)} GB` : "Couldn't finish: the disk is full. Free 0.9 GB, then try again."}
        onRetry={() => setState('running')}
      />
    );
  },
};

export const OnTouch: Story = {
  name: 'on a touch screen',
  render: () => (
    <div data-nc-screen="touch">
      <ProgressBar
        label="Copying 3 files"
        value={1364}
        max={TOTAL}
        amount={amount(1364)}
        onPause={() => undefined}
        onCancel={() => undefined}
      />
    </div>
  ),
};

export const OnTv: Story = {
  name: 'on a tv',
  render: () => (
    <div data-nc-screen="tv">
      <ProgressBar
        label="Copying 3 files"
        value={1364}
        max={TOTAL}
        amount={amount(1364)}
        onPause={() => undefined}
        onCancel={() => undefined}
      />
    </div>
  ),
};
