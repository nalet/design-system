// live examples of the typography page that compose components (a field wires
// its control, a card takes elements as props): written in react, rendered
// as static html.
import { Button, Card, Field, Input, ObjectStatus, Stack, Text } from '@nalet/design-system';

/** both families in one panel: mono names, inter reads. */
export function BothFamilies() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Card
        header="storage-01"
        headerAside={<ObjectStatus state="success">healthy</ObjectStatus>}
        footer={
          <Stack direction="horizontal" gap={8} justify="end">
            <Button variant="ghost">cancel</Button>
            <Button variant="primary">save changes</Button>
          </Stack>
        }
      >
        <Stack gap={16}>
          <Text as="p" variant="body">
            backups run every night at 02:00 and are kept for 14 days.
          </Text>
          <Field label="backup host" hint="a full host name, such as storage-01.example.com">
            <Input defaultValue="storage-01.example.com" />
          </Field>
        </Stack>
      </Card>
    </div>
  );
}
