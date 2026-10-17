import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { Textarea, type TextareaProps, Field } from '../../src';

const meta: Meta<TextareaProps> = {
  title: 'Components/inputs/textarea',
  component: Textarea,
  args: {
    placeholder: 'fixed the retry loop in the upload step',
    rows: 4,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    invalid: {
      control: 'boolean',
      // the source comment still says amber; the css uses --state-error.
      description: 'paint the error border (--state-error) and set aria-invalid.',
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'a square, multi-line text field in mono type that people can drag taller. put it in a field for its label, hint and error.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<TextareaProps>;

const caption = { fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--fg-dim)' } as const;

export const Playground: Story = {
  render: (args) => <Textarea aria-label="release notes" {...args} />,
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export const Default: Story = {
  args: {
    'aria-label': 'release notes',
    defaultValue: 'scaled worker-2 to three replicas.\nrestarted api-7f9c after the update.',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export const Invalid: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Field label="manifest" error="line 1: name is empty">
        <Textarea rows={3} defaultValue={'name:\nreplicas: 3\nimage: registry.example.com/api:1.4.2'} />
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    'aria-label': 'release notes',
    disabled: true,
    defaultValue: 'locked while the release runs',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)', width: 420 }}>
      <Textarea aria-label="2 rows" rows={2} placeholder="2 rows — a short note" />
      <Textarea aria-label="4 rows" rows={4} placeholder="4 rows, the default — a description" />
      <Textarea aria-label="8 rows" rows={8} placeholder="8 rows — a pasted config" />
    </div>
  ),
};

export const Controlled: Story = {
  name: 'controlled',
  render: () => {
    const limit = 120;
    const countId = useId();
    const [value, setValue] = useState('name: api\nreplicas: 3\nimage: registry.example.com/api:1.4.2');
    return (
      <div style={{ display: 'grid', gap: 'var(--s-2)', width: 420 }}>
        <Textarea
          aria-label="manifest"
          aria-describedby={countId}
          rows={5}
          maxLength={limit}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span id={countId} style={caption}>
          {value.length} / {limit} characters
        </span>
      </div>
    );
  },
};
