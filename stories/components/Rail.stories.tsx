import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeepCase, Rail, type RailProps } from '../../src';
import {
  MARK,
  NOTIFICATIONS,
  PERSON,
  PhoneSideways,
  SEARCH,
  SETTINGS,
  TABS,
  TvScreen,
  VIEWS,
  WideScreen,
  nameOf,
  useCurrent,
} from '../_data/views';

const meta: Meta<RailProps> = {
  title: 'Components/navigation/rail',
  component: Rail,
  args: {
    views: VIEWS,
    current: '?view=films',
    inside: false,
    mark: MARK,
    foot: SETTINGS,
  },
  argTypes: {
    // the items hold icons, which the controls can't edit.
    views: { control: false },
    head: { control: false },
    foot: { control: false },
    mark: { control: 'object' },
    current: { control: 'text' },
    inside: { control: 'boolean' },
    // open belongs to a tv: see the tv stories.
    open: { control: false },
    label: { control: 'text' },
    onNavigate: { control: false },
    onClose: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A product's views as icons alone, down the left edge of the screen. Each view is a link; the current one is blue with a bar on its edge. With `data-nc-screen` on an ancestor it is the rail of a phone held sideways, or of a TV, where it opens with the views' names while the focus is in it.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<RailProps>;

const everything = [...VIEWS, ...TABS, SETTINGS, SEARCH, NOTIFICATIONS, PERSON];

// a wide screen: the product's mark at the rail's head, settings at its foot.
export const Playground: Story = {
  render: function RailOnAWideScreen(args) {
    const { current, onNavigate } = useCurrent(args.current);
    return (
      <WideScreen
        title={nameOf(current, everything) ?? <KeepCase>The Quiet Harbour</KeepCase>}
        rail={<Rail {...args} current={current} onNavigate={onNavigate} />}
      />
    );
  },
};

// a screen that is none of the views, such as a film's page: no view is current.
export const NoneCurrent: Story = {
  name: 'no current view',
  render: function RailWithoutACurrentView() {
    const { current, onNavigate } = useCurrent(undefined);
    return (
      <WideScreen
        title={nameOf(current, everything) ?? <KeepCase>The Quiet Harbour</KeepCase>}
        rail={<Rail views={VIEWS} mark={MARK} foot={SETTINGS} current={current} onNavigate={onNavigate} />}
      />
    );
  },
};

// a phone held sideways, a screen made for touch: the phone's five tabs and nothing else.
export const Sideways: Story = {
  name: 'on a phone held sideways',
  render: function RailOnAPhoneHeldSideways() {
    const { current, onNavigate } = useCurrent('?view=films');
    return <PhoneSideways title={nameOf(current, everything)} rail={<Rail views={TABS} current={current} onNavigate={onNavigate} />} />;
  },
};

// a tv: the rail holds what the top bar holds elsewhere. it opens when the
// focus moves into it: press tab, or a view.
export const Tv: Story = {
  name: 'on a tv',
  render: function RailOnATv() {
    const { current, onNavigate } = useCurrent('?view=films');
    return (
      <TvScreen
        title={nameOf(current, everything)}
        rail={<Rail head={[PERSON, SEARCH]} views={VIEWS} foot={[NOTIFICATIONS, SETTINGS]} current={current} onNavigate={onNavigate} />}
      />
    );
  },
};

// the same rail kept open, to look at: on a tv it opens and closes with the focus.
export const TvOpen: Story = {
  name: 'on a tv, open',
  render: function RailOpenOnATv() {
    const { current, onNavigate } = useCurrent('?view=films');
    return (
      <TvScreen
        title={nameOf(current, everything)}
        rail={<Rail head={[PERSON, SEARCH]} views={VIEWS} foot={[NOTIFICATIONS, SETTINGS]} current={current} onNavigate={onNavigate} open />}
      />
    );
  },
};
