import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading, type HeadingProps, Stack, Text } from '../../src';

const meta: Meta<HeadingProps> = {
  title: 'Components/layout & structure/heading',
  component: Heading,
  args: {
    children: 'volumes',
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
        component:
          'Mono display heading for the page title (h1) and its sections (h2), optionally led by the blue chevron.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<HeadingProps>;

export const Playground: Story = {};

export const Levels: Story = {
  render: () => (
    <Stack gap={12}>
      <Heading level={1}>volumes</Heading>
      <Heading level={2}>recent runs</Heading>
    </Stack>
  ),
};

export const WithChevron: Story = {
  name: 'with chevron',
  render: () => (
    <Heading level={1} chevron>
      volumes
    </Heading>
  ),
};

/** A page title with its first section. */
export const SectionHeader: Story = {
  name: 'section header',
  render: () => (
    <Stack gap={24} style={{ maxWidth: 520 }}>
      <Stack gap={8}>
        <Heading level={1} chevron>
          storage-01
        </Heading>
        <Text variant="muted">412 GB used of 1 TB, 3 snapshots</Text>
      </Stack>
      <Stack gap={8}>
        <Heading level={2}>backups</Heading>
        <Text as="p" variant="body">
          Backups run every night at 02:00 and are kept for 14 days.
        </Text>
      </Stack>
    </Stack>
  ),
};
