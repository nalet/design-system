import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeepCase, TabBar, type TabBarProps } from '../../src';
import { PhoneUpright, TABS, nameOf, useCurrent } from '../_data/views';

const meta: Meta<TabBarProps> = {
  title: 'Components/navigation/tab bar',
  component: TabBar,
  args: {
    views: TABS,
    current: '?view=films',
    inside: false,
  },
  argTypes: {
    // the items hold icons, which the controls can't edit.
    views: { control: false },
    current: { control: 'text' },
    inside: { control: 'boolean' },
    label: { control: 'text' },
    onNavigate: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A product's views as icons alone, side by side, at the foot of a phone held upright. Each tab is a link and an equal share of the width; the current one is blue with a bar on its top edge.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<TabBarProps>;

// a phone held upright: the tab bar at the foot, under the page.
export const Playground: Story = {
  render: function TabBarOnAPhone(args) {
    const { current, onNavigate } = useCurrent(args.current);
    return (
      <PhoneUpright
        title={nameOf(current, args.views) ?? <KeepCase>The Quiet Harbour</KeepCase>}
        tabBar={<TabBar {...args} current={current} onNavigate={onNavigate} />}
      />
    );
  },
};

// a screen opened from several views, such as a film's page: the tab bar stays, and no tab is current.
export const NoneCurrent: Story = {
  name: 'no current tab',
  render: function TabBarWithoutACurrentTab() {
    const { current, onNavigate } = useCurrent(undefined);
    return (
      <PhoneUpright
        title={nameOf(current, TABS) ?? <KeepCase>The Quiet Harbour</KeepCase>}
        tabBar={<TabBar views={TABS} current={current} onNavigate={onNavigate} />}
      />
    );
  },
};

// three views: each tab is still an equal share of the width.
export const ThreeViews: Story = {
  name: 'three views',
  render: function TabBarWithThreeViews() {
    const views = TABS.slice(0, 3);
    const { current, onNavigate } = useCurrent('?view=home');
    return <PhoneUpright title={nameOf(current, views)} tabBar={<TabBar views={views} current={current} onNavigate={onNavigate} />} />;
  },
};
