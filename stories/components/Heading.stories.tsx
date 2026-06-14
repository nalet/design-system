import type { Meta, StoryObj } from '@storybook/react';
import { Heading, type HeadingProps } from '../../src';

const meta: Meta<HeadingProps> = {
  title: 'Components/heading',
  component: Heading,
  args: {
    children: 'okd console',
    level: 1,
    chevron: false,
  },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2] },
    chevron: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'mono display heading at the h1/h2 roles, optionally led by a blue chevron for terminal tone.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<HeadingProps>;

export const Playground: Story = {};

export const Levels: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <Heading level={1}>deploy pipeline</Heading>
      <Heading level={2}>gitlab runners</Heading>
    </div>
  ),
};

export const WithChevron: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
      <Heading level={1} chevron>
        chino
      </Heading>
      <Heading level={2} chevron>
        stube platform
      </Heading>
    </div>
  ),
};

export const SectionHeader: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--s-2)' }}>
      <Heading level={1} chevron>
        postgres
      </Heading>
      <Heading level={2}>p95 latency</Heading>
    </div>
  ),
};
