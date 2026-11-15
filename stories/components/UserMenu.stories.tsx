import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { CircleHelp, LogOut, Settings, User } from 'lucide-react';
import { Icon, UserMenu, type UserMenuItem, type UserMenuProps } from '../../src';
import { PERSON, PICTURE } from '../_data/person';

const items: UserMenuItem[] = [
  { id: 'account', label: 'account' },
  { id: 'settings', label: 'settings' },
  { id: 'help', label: 'help' },
];

const meta: Meta<UserMenuProps> = {
  title: 'Components/navigation/user menu',
  component: UserMenu,
  args: {
    ...PERSON,
    items,
    size: 'md',
    align: 'end',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    align: { control: 'inline-radio', options: ['start', 'end'] },
    items: { control: false },
    onSignOut: { control: false },
    onOpenChange: { control: false },
    signOutIcon: { control: false },
    picture: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Everything about the person behind one square avatar: who is signed in, the items the app gives, and sign out, last and set apart.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<UserMenuProps>;

// room under the avatar for the menu, which opens in place, and the avatar at the end, where the bar has it.
const room: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 'var(--s-3)',
  flex: '1 1 16rem',
  minWidth: 'min(16rem, 100%)',
  minHeight: '14rem',
  boxSizing: 'border-box',
};

function Room({ screen, height, children }: { screen?: 'touch' | 'tv'; height?: string; children: ReactNode }) {
  return (
    <div data-nc-screen={screen} style={{ ...room, minHeight: height ?? room.minHeight }}>
      {children}
    </div>
  );
}

export const Playground: Story = {
  render: function Playground(args) {
    const [last, setLast] = useState('nothing yet');
    return (
      <Room>
        <UserMenu
          {...args}
          items={items.map((item) => ({ ...item, onSelect: () => setLast(String(item.label)) }))}
          onSignOut={() => setLast('sign out')}
        />
        <span role="status" style={{ fontFamily: 'var(--ff-mono)', fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
          chosen: {last}
        </span>
      </Room>
    );
  },
};

export const Open: Story = {
  render: () => (
    <Room>
      <UserMenu {...PERSON} items={items} onSignOut={() => undefined} defaultOpen />
    </Room>
  ),
};

export const WithAPicture: Story = {
  name: 'with a picture',
  render: () => (
    <Room>
      <UserMenu {...PERSON} picture={PICTURE} items={items} onSignOut={() => undefined} />
    </Room>
  ),
};

export const WithIcons: Story = {
  name: 'items with icons',
  render: () => (
    <Room>
      <UserMenu
        {...PERSON}
        items={[
          { id: 'account', label: 'account', icon: <Icon icon={User} /> },
          { id: 'settings', label: 'settings', icon: <Icon icon={Settings} /> },
          { id: 'help', label: 'help', icon: <Icon icon={CircleHelp} /> },
        ]}
        signOutIcon={<Icon icon={LogOut} />}
        onSignOut={() => undefined}
        defaultOpen
      />
    </Room>
  ),
};

export const Links: Story = {
  name: 'items that are links',
  render: () => (
    <Room>
      <UserMenu
        {...PERSON}
        items={[
          { id: 'account', label: 'account', href: '#account' },
          { id: 'settings', label: 'settings', href: '#settings' },
          { id: 'help', label: 'help', href: '#help' },
        ]}
        onSignOut={() => undefined}
      />
    </Room>
  ),
};

export const OnATouchScreen: Story = {
  name: 'on a touch screen',
  render: () => (
    <Room screen="touch" height="20rem">
      <UserMenu {...PERSON} items={items} onSignOut={() => undefined} defaultOpen />
    </Room>
  ),
};

export const OnATv: Story = {
  name: 'on a tv',
  render: () => (
    <Room screen="tv" height="18rem">
      <UserMenu {...PERSON} items={items} onSignOut={() => undefined} defaultOpen />
    </Room>
  ),
};
