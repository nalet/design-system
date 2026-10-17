import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Activity,
  Bell,
  Copy,
  Cpu,
  Database,
  Download,
  FileText,
  Folder,
  GitBranch,
  HardDrive,
  Lock,
  Play,
  Rocket,
  RotateCw,
  Search,
  Server,
  Settings,
  Terminal,
  Timer,
  Trash2,
  Upload,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Icon, type IconProps } from '../../src';

const label = { fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--fg-muted)' } as const;

const meta: Meta<IconProps> = {
  title: 'Components/brand & icons/icon',
  component: Icon,
  args: { icon: Server, size: 16, strokeWidth: 1.75 },
  argTypes: {
    icon: { control: false },
    size: { control: { type: 'number', min: 8, max: 48, step: 2 } },
    strokeWidth: { control: { type: 'number', min: 1, max: 3, step: 0.25 } },
  },
  decorators: [
    (Story) => (
      <div style={{ color: 'var(--fg-2)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: 'A Lucide icon at the system defaults: 16px, a 1.75 stroke, currentColor, hidden from assistive tech unless named.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<IconProps>;

export const Playground: Story = {};

const GLYPHS: [string, LucideIcon][] = [
  ['Terminal', Terminal],
  ['Server', Server],
  ['Database', Database],
  ['HardDrive', HardDrive],
  ['Cpu', Cpu],
  ['Activity', Activity],
  ['Timer', Timer],
  ['GitBranch', GitBranch],
  ['Rocket', Rocket],
  ['Play', Play],
  ['RotateCw', RotateCw],
  ['Copy', Copy],
  ['Trash2', Trash2],
  ['Download', Download],
  ['Upload', Upload],
  ['Search', Search],
  ['Folder', Folder],
  ['FileText', FileText],
  ['Bell', Bell],
  ['Lock', Lock],
  ['Users', Users],
  ['Settings', Settings],
];

/** A few Lucide glyphs at the default size. */
export const Gallery: Story = {
  name: 'gallery',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))', gap: 'var(--s-2)', width: '100%' }}>
      {GLYPHS.map(([name, glyph]) => (
        <div
          key={name}
          style={{
            display: 'grid',
            justifyItems: 'center',
            gap: 'var(--s-2)',
            padding: 'var(--s-3) var(--s-2)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--fg-2)',
          }}
        >
          <Icon icon={glyph} />
          <span style={label}>{name}</span>
        </div>
      ))}
    </div>
  ),
};

/** The four sizes the components use. */
export const Sizes: Story = {
  name: 'sizes',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--s-6)', color: 'var(--fg-2)' }}>
      {[12, 16, 20, 22].map((s) => (
        <div key={s} style={{ display: 'grid', justifyItems: 'center', gap: 'var(--s-2)' }}>
          <Icon icon={Server} size={s} />
          <span style={label}>{s}px</span>
        </div>
      ))}
    </div>
  ),
};
