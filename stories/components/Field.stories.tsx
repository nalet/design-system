import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, type FieldProps, Input, Select, Textarea, Checkbox } from '../../src';

const meta: Meta<FieldProps> = {
  title: 'Components/inputs/field',
  component: Field,
  args: {
    label: 'Release name',
    hint: 'Lowercase letters, digits and hyphens',
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
          'The label, hint and error around one control, wired with `id`, `aria-describedby` and `aria-invalid`.',
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
      <Field label="Host" hint="The name the service answers on">
        <Input placeholder="api.example.com" />
      </Field>
      <Field label="Replicas" required hint="At least 1">
        <Input type="number" defaultValue="3" min={1} required />
      </Field>
      <Field label="Image tag" error="Pin a version, such as 1.4.2">
        <Input defaultValue="latest" />
      </Field>
    </div>
  ),
};

export const Controls: Story = {
  name: 'control types',
  render: () => (
    <div style={column}>
      <Field label="Region" hint="Where new releases run">
        <Select
          options={[
            { label: 'eu-central', value: 'eu-central' },
            { label: 'eu-west', value: 'eu-west' },
            { label: 'us-east', value: 'us-east' },
          ]}
        />
      </Field>
      <Field label="Release notes" hint="Shown on the release page">
        <Textarea placeholder="fixed the retry loop in the upload step" rows={3} />
      </Field>
      <Field hint="A summary of last week's releases, every Monday">
        <Checkbox label="Send a weekly summary" />
      </Field>
    </div>
  ),
};

export const Required: Story = {
  name: 'required',
  render: () => (
    <Field label="Region" required hint="Where new releases run">
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
    <Field label="Host" error="Use a full host name, such as api.example.com">
      <Input defaultValue="api" />
    </Field>
  ),
};
