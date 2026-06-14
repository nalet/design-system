import type { Meta, StoryObj } from '@storybook/react';
import { Input, Textarea, Select, Checkbox, Chevron } from '../../src';

const meta: Meta = {
  title: 'Components/Forms',
};
export default meta;

type Story = StoryObj;

export const Fields: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)', width: 320 }}>
      <Input placeholder="host" leading={<Chevron size={12} />} />
      <Input placeholder="port" inputSize="sm" />
      <Input placeholder="invalid value" invalid defaultValue="nope" />
      <Select
        options={[
          { label: 'main', value: 'main' },
          { label: 'beta', value: 'beta' },
          { label: 'edge', value: 'edge' },
        ]}
      />
      <Textarea placeholder="notes" />
      <Checkbox label="auto-update" defaultChecked />
      <Checkbox label="indeterminate" indeterminate />
      <Checkbox label="disabled" disabled />
    </div>
  ),
};
