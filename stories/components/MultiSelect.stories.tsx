import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useId, useState } from 'react';
import { Button, Field, Input, Modal, MultiSelect, type MultiSelectProps } from '../../src';

const OPTIONS: MultiSelectProps['options'] = [
  { value: 'missing', label: 'missing', count: 2318 },
  { value: 'way', label: 'on its way', count: 182 },
  { value: 'attention', label: 'needs attention', count: 3 },
];

const meta: Meta<MultiSelectProps> = {
  title: 'Components/inputs/multi select',
  component: MultiSelect,
  args: { label: 'state', options: OPTIONS, value: [], size: 'md' },
  argTypes: {
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
    action: { control: false },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    emptyText: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: 'A facet that keeps several values: a trigger and a panel of checkboxes.' } },
  },
  decorators: [(Story) => <div style={{ minHeight: 200 }}>{Story()}</div>],
};
export default meta;

type Story = StoryObj<MultiSelectProps>;

export const Playground: Story = {
  render: function Playground(args) {
    const [value, setValue] = useState<string[]>(args.value);
    return <MultiSelect {...args} value={value} onChange={setValue} />;
  },
};

export const Chosen: Story = {
  name: 'with values chosen',
  render: function Chosen() {
    const [value, setValue] = useState<string[]>(['way', 'attention']);
    return <MultiSelect label="state" options={OPTIONS} value={value} onChange={setValue} />;
  },
};

export const Small: Story = {
  render: function Small() {
    const [value, setValue] = useState<string[]>([]);
    return <MultiSelect label="state" size="sm" options={OPTIONS} value={value} onChange={setValue} />;
  },
};

const asOptions = (names: string[]): MultiSelectProps['options'] => names.map((name) => ({ value: name, label: name }));

/** people's own lists: the options they make themselves. */
const LISTS = ['Watchlist', 'Rainy Sundays', 'Film club'];
const MANY_LISTS = [
  ...LISTS,
  'Westerns',
  'To watch again',
  'Road trips',
  'Noir',
  'Documentaries',
  'Classics',
  'Summer',
  'Short films',
  'Silent films',
  'Musicals',
  'Animation',
];

/**
 * the lists that hold one title, with "create a list" under them. the action
 * opens a dialog for the new list's name; the list is among the options the
 * next time the panel opens.
 */
function ListPicker({ names, chosen, size }: { names: string[]; chosen: string[]; size?: MultiSelectProps['size'] }) {
  const [lists, setLists] = useState(names);
  const [value, setValue] = useState(chosen);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');
  const close = useCallback(() => setNaming(false), []);
  const formId = useId();
  const taken = lists.some((list) => list.toLowerCase() === name.trim().toLowerCase());
  return (
    <>
      <MultiSelect
        label="lists"
        emptyText="none"
        size={size}
        options={asOptions(lists)}
        value={value}
        onChange={setValue}
        action={{
          label: 'create a list',
          onSelect: () => {
            setName('');
            setNaming(true);
          },
        }}
      />
      <Modal
        open={naming}
        onClose={close}
        title="create a list"
        width={360}
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              cancel
            </Button>
            <Button variant="primary" type="submit" form={formId} disabled={!name.trim() || taken}>
              create list
            </Button>
          </>
        }
      >
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || taken) return;
            setLists((all) => [...all, name.trim()]);
            close();
          }}
        >
          <Field label="Name" error={taken ? 'A list with this name exists.' : undefined}>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </form>
      </Modal>
    </>
  );
}

export const WithAction: Story = {
  name: 'an action under the options',
  render: () => <ListPicker names={LISTS} chosen={['Watchlist', 'Rainy Sundays']} />,
};

export const LongList: Story = {
  name: 'a long list of options',
  render: () => <ListPicker names={MANY_LISTS} chosen={['Watchlist', 'Film club', 'To watch again']} />,
  // room for the options at their tallest, 320, and the foot.
  decorators: [(Story) => <div style={{ minHeight: 460 }}>{Story()}</div>],
};

export const Large: Story = {
  render: function Large() {
    const [value, setValue] = useState<string[]>(['way']);
    return <MultiSelect label="state" size="lg" options={OPTIONS} value={value} onChange={setValue} />;
  },
  decorators: [(Story) => <div style={{ minHeight: 280 }}>{Story()}</div>],
};

export const OnATouchScreen: Story = {
  name: 'on a touch screen',
  render: function OnATouchScreen() {
    const [value, setValue] = useState<string[]>([]);
    return (
      // the app says the kind of screen once, on an element around everything.
      <div data-nc-screen="touch">
        <MultiSelect label="state" options={OPTIONS} value={value} onChange={setValue} />
      </div>
    );
  },
  decorators: [(Story) => <div style={{ minHeight: 280 }}>{Story()}</div>],
};
