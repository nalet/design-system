import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, type CardProps, Badge, Button, Stack, Text, Thead, Tbody, Tr, Th, Td } from '../../src';

const meta: Meta<CardProps> = {
  title: 'Components/layout & structure/card',
  component: Card,
  args: {
    header: 'storage-01',
    children: '412 GB used of 1 TB. Last checked 2 minutes ago.',
    flush: false,
    sunken: false,
  },
  argTypes: {
    flush: { control: 'boolean' },
    sunken: { control: 'boolean' },
    header: { control: 'text' },
    headerAside: { control: false },
    footer: { control: false },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A square surface panel with a hairline border, an optional mono header row with an aside for actions, and an optional footer row.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<CardProps>;

export const Playground: Story = {
  render: (args) => <Card {...args} style={{ width: 320 }} />,
};

export const Plain: Story = {
  render: () => <Card style={{ width: 320 }}>db-0 is healthy. Last checkpoint 12s ago.</Card>,
};

export const WithHeaderAndFooter: Story = {
  name: 'with header and footer',
  render: () => (
    <Card
      header="api-7f9c"
      style={{ width: 360 }}
      footer={
        <Stack direction="horizontal" justify="between" align="center">
          <Text variant="muted">p95 142ms</Text>
          <Button variant="ghost" size="sm">
            view logs
          </Button>
        </Stack>
      }
    >
      Queue drained. 4 packages published to storage-01.
    </Card>
  ),
};

export const HeaderAside: Story = {
  name: 'header aside',
  render: () => (
    <Card
      header="volumes"
      style={{ width: 360 }}
      headerAside={
        <>
          <Badge>12</Badge>
          <Button variant="ghost" size="sm">
            add volume
          </Button>
        </>
      }
    >
      1.2 TB used across 12 volumes.
    </Card>
  ),
};

/** A sunken card nested inside a default one. */
export const Sunken: Story = {
  render: () => (
    <Card header="storage-01" style={{ width: 360 }}>
      <Stack gap={12}>
        <Text variant="muted">412 GB used of 1 TB</Text>
        <Card sunken header="last backup">
          Tonight at 02:00, kept 14 days.
        </Card>
      </Stack>
    </Card>
  ),
};

/** Flush body with a table built from the table primitives, so the card's frame is the only frame. */
export const Flush: Story = {
  render: () => (
    <Card header="volumes" flush style={{ width: 360 }}>
      <table className="nc-table" aria-label="volumes">
        <Thead>
          <Tr>
            <Th scope="col">volume</Th>
            <Th scope="col" style={{ textAlign: 'right' }}>
              used (gb)
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>storage-01</Td>
            <Td style={{ textAlign: 'right' }}>412</Td>
          </Tr>
          <Tr>
            <Td>storage-02</Td>
            <Td style={{ textAlign: 'right' }}>96</Td>
          </Tr>
        </Tbody>
      </table>
    </Card>
  ),
};

/** A card people navigate to by heading: a real heading as the title, and a named region. */
export const AsSection: Story = {
  name: 'as a section',
  render: () => (
    <Card
      role="region"
      aria-labelledby="card-backups-title"
      header={
        <h2 id="card-backups-title" style={{ margin: 0, font: 'inherit' }}>
          backups
        </h2>
      }
      style={{ width: 360 }}
    >
      Backups run every night at 02:00 and are kept for 14 days.
    </Card>
  ),
};
