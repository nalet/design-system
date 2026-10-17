// action menus for the do and don't of the action menu page. an item carries
// its handler, and a hydrated example takes only plain data, so these take
// the items' words and run nothing when one is chosen. interactive: hydrate
// them (client:visible), so the menus open.
import { ActionMenu } from '@nalet/design-system';

interface DemoItem {
  id: string;
  label: string;
  danger?: boolean;
  disabled?: boolean;
}

export function DemoMenu({ label, buttonLabel, items }: { label: string; buttonLabel?: string; items: DemoItem[] }) {
  return (
    <ActionMenu label={label} buttonLabel={buttonLabel} items={items.map((item) => ({ ...item, onSelect: () => undefined }))} />
  );
}
