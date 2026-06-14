import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Textarea, type TextareaProps } from '../../src';

const meta: Meta<TextareaProps> = {
  title: 'Components/textarea',
  component: Textarea,
  args: {
    placeholder: 'paste your kubeconfig',
    rows: 4,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component: 'a square multiline field with mono text, hairline border and cyan focus.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TextareaProps>;

export const Playground: Story = {};

export const Default: Story = {
  args: {
    defaultValue: 'kubectl rollout restart deploy/chino-api -n stube',
    placeholder: 'enter a command',
  },
};

export const Invalid: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', maxWidth: 420 }}>
      <Textarea
        invalid
        rows={3}
        defaultValue={'image: registry.example.com/stube/chino-api:\nport: 8080'}
      />
      <span style={{ color: 'var(--signal-amber)', fontFamily: 'var(--ff-mono)', fontSize: 12 }}>
        line 1: image tag is empty
      </span>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'p95 latency budget locked while pipeline #1543 runs',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', maxWidth: 420 }}>
      <Textarea rows={2} placeholder='2 rows — commit message' />
      <Textarea rows={4} placeholder='4 rows — gitlab-ci job script' />
      <Textarea rows={8} placeholder='8 rows — postgres dump notes' />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const [value, setValue] = useState(
      'apiVersion: stube.io/v1alpha1\nkind: Stube\nmetadata:\n  name: appliance',
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', maxWidth: 420 }}>
        <Textarea
          rows={5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='edit the stube custom resource'
        />
        <span style={{ color: 'var(--fg-dim)', fontFamily: 'var(--ff-mono)', fontSize: 12 }}>
          {value.length} chars
        </span>
      </div>
    );
  },
};
