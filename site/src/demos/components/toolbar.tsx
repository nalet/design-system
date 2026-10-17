// a toolbar for the do and don't of the toolbar page, with a "more actions"
// menu that opens. an action carries its handler, and a hydrated example
// takes only plain data, so this takes the actions' words and runs nothing
// when one is pressed. interactive: hydrate it (client:visible).
import { Toolbar } from '@nalet/design-system';

interface DemoAction {
  id: string;
  label: string;
  emphasized?: boolean;
  overflow?: boolean;
  danger?: boolean;
}

export function DemoToolbar({ label, heading, actions }: { label: string; heading?: string; actions: DemoAction[] }) {
  return (
    <Toolbar label={label} heading={heading} actions={actions.map((action) => ({ ...action, onSelect: () => undefined }))} />
  );
}
