import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, type FieldProps, Input, Select, Textarea, Checkbox } from '../../src';

const meta: Meta<FieldProps> = {
  title: 'Components/inputs/field',
  component: Field,
  args: {
    label: 'release name',
    hint: 'lowercase letters, digits and hyphens',
    required: false,
    children: <Input placeholder="the-lantern-2024" />,
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    children: { control: false },
    htmlFor: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'the label, hint and error around one control, wired with id, aria-describedby and aria-invalid.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<FieldProps>;

const column = { display: 'grid', gap: 'var(--s-4)' } as const;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={column}>
      <Field label="host" hint="the name the service answers on">
        <Input placeholder="api.example.com" />
      </Field>
      <Field label="replicas" required hint="at least 1">
        <Input type="number" defaultValue="3" min={1} required />
      </Field>
      <Field label="image tag" error="pin a version, such as 1.4.2">
        <Input defaultValue="latest" />
      </Field>
    </div>
  ),
};

export const Controls: Story = {
  name: 'control types',
  render: () => (
    <div style={column}>
      <Field label="region" hint="where new releases run">
        <Select
          options={[
            { label: 'eu-central', value: 'eu-central' },
            { label: 'eu-west', value: 'eu-west' },
            { label: 'us-east', value: 'us-east' },
          ]}
        />
      </Field>
      <Field label="release notes" hint="shown on the release page">
        <Textarea placeholder="fixed the retry loop in the upload step" rows={3} />
      </Field>
      <Field hint="a summary of last week's releases, every monday">
        <Checkbox label="send a weekly summary" />
      </Field>
    </div>
  ),
};

export const Required: Story = {
  name: 'required',
  render: () => (
    <Field label="region" required hint="where new releases run">
      <Select
        required
        defaultValue=""
        options={[
          { label: 'choose a region', value: '' },
          { label: 'eu-central', value: 'eu-central' },
          { label: 'eu-west', value: 'eu-west' },
        ]}
      />
    </Field>
  ),
};

export const Error: Story = {
  name: 'error',
  render: () => (
    <Field label="host" error="use a full host name, such as api.example.com">
      <Input defaultValue="api" />
    </Field>
  ),
};
