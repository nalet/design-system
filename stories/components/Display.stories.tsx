import type { Meta, StoryObj } from '@storybook/react';
import { Heading, Text, Code, Kbd, Divider, Spinner, IconButton, Box, Stack } from '../../src';
import { Terminal } from 'lucide-react';
import { Icon } from '../../src';

const meta: Meta = {
  title: 'Components/Display',
};
export default meta;

type Story = StoryObj;

export const Headings: Story = {
  render: () => (
    <Stack gap={4}>
      <Heading level={1} chevron>
        design system
      </Heading>
      <Heading level={2}>foundations</Heading>
    </Stack>
  ),
};

export const TextRoles: Story = {
  render: () => (
    <Stack gap={3}>
      <Text variant="body">body — dark canvas, monospace voice, blue chevron.</Text>
      <Text variant="ui">ui — label / meta</Text>
      <Text variant="muted">muted — secondary</Text>
      <Text variant="dim">dim — hint / off</Text>
      <Text variant="code">code — npm i @nalet/design-system</Text>
    </Stack>
  ),
};

export const CodeAndKbd: Story = {
  render: () => (
    <Stack gap={4} align="start">
      <Code>npm i @nalet/design-system</Code>
      <Code block>{`import '@nalet/design-system/tokens.css';\nimport { Button } from '@nalet/design-system';`}</Code>
      <Stack direction="horizontal" gap={2}>
        <Kbd>ctrl</Kbd>
        <Kbd>b</Kbd>
        <Kbd>esc</Kbd>
      </Stack>
    </Stack>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Stack direction="horizontal" gap={4}>
      <Box p={5} bg="surface" border>
        <Text variant="ui">surface + border</Text>
      </Box>
      <Box p={5} bg="bg-2" border>
        <Text variant="ui">bg-2 + border</Text>
      </Box>
    </Stack>
  ),
};

export const Misc: Story = {
  render: () => (
    <Stack gap={4} align="start">
      <Divider label="section" />
      <Stack direction="horizontal" gap={4} align="center">
        <Spinner />
        <IconButton label="open shell" variant="primary">
          <Icon icon={Terminal} />
        </IconButton>
      </Stack>
    </Stack>
  ),
};
