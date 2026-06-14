import type { Meta, StoryObj } from '@storybook/react';
import { Field, type FieldProps, Input, Select, Textarea, Checkbox } from '../../src';

const meta: Meta<FieldProps> = {
  title: 'Components/field',
  component: Field,
  args: {
    label: 'namespace',
    hint: 'lowercase, dns-safe',
    required: false,
    children: <Input placeholder="cloud-nalet-alm" />,
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    children: { table: { disable: true } },
    htmlFor: { table: { disable: true } },
  },
  parameters: {
    docs: {
      description: {
        component: 'label, control and hint/error wired into one accessible vertical stack.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<FieldProps>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-4)', maxWidth: 320 }}>
      <Field label="registry" hint="gitlab.example.com">
        <Input placeholder="registry host" defaultValue="gitlab.example.com" />
      </Field>
      <Field label="replicas" required hint="must be at least 1">
        <Input type="number" defaultValue="3" />
      </Field>
      <Field label="image tag" error="tag 'latest' is not allowed in prod">
        <Input defaultValue="latest" />
      </Field>
    </div>
  ),
};

export const Controls: Story = {
  name: 'control types',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-4)', maxWidth: 320 }}>
      <Field label="database" hint="pick a backing store">
        <Select
          options={[
            { label: 'postgres', value: 'postgres' },
            { label: 'redis', value: 'redis' },
            { label: 'sqlite', value: 'sqlite' },
          ]}
        />
      </Field>
      <Field label="rollout notes" hint="shown in the okd console">
        <Textarea placeholder="bumped chino api to p95" rows={3} />
      </Field>
      <Field hint="streams build logs to the pipeline view">
        <Checkbox label="verbose ci output" />
      </Field>
    </div>
  ),
};

export const Required: Story = {
  name: 'required',
  render: () => (
    <Field label="cluster" required hint="the blue marker signals a required field">
      <Select
        options={[
          { label: 'okd-prod', value: 'okd-prod' },
          { label: 'okd-staging', value: 'okd-staging' },
        ]}
      />
    </Field>
  ),
};

export const Error: Story = {
  name: 'error',
  render: () => (
    <Field label="hostname" error="hostname must resolve before deploy">
      <Input defaultValue="chino.nalet" />
    </Field>
  ),
};
