import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, type AvatarProps } from '../../src';
import { PERSON, PICTURE } from '../_data/person';

const meta: Meta<AvatarProps> = {
  title: 'Components/data display/avatar',
  component: Avatar,
  args: {
    name: PERSON.name,
    size: 'md',
    decorative: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    src: { control: 'text' },
    initials: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'The square that stands for a person: their picture, cropped to a square, or their initials.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<AvatarProps>;

const row = { display: 'flex', alignItems: 'center', gap: 'var(--s-4)' } as const;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Avatar name={PERSON.name} size="sm" />
      <Avatar name={PERSON.name} size="md" />
      <Avatar name={PERSON.name} size="lg" />
    </div>
  ),
};

export const Picture: Story = {
  name: 'a picture, and initials',
  render: () => (
    <div style={row}>
      <Avatar name={PERSON.name} src={PICTURE} size="lg" />
      <Avatar name={PERSON.name} size="lg" />
    </div>
  ),
};

export const OwnInitials: Story = {
  name: 'initials of its own',
  render: () => (
    <div style={row}>
      <Avatar name="Dr. Ada Urban" />
      <Avatar name="Dr. Ada Urban" initials="au" />
    </div>
  ),
};

export const BesideAName: Story = {
  name: 'beside the name',
  render: () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)', color: 'var(--fg)', fontFamily: 'var(--ff-ui)', fontSize: '0.875rem' }}>
      <Avatar name={PERSON.name} size="sm" decorative />
      {PERSON.name}
    </div>
  ),
};
