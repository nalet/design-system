// the site's table of contents: the six sections of the top bar and the pages
// of each, in order. the left navigation, the section index pages and the
// "next" links read it. a page that isn't listed here has no place in the nav.
import { COMPONENTS, ROLES, guidanceHref } from './components';
import { url } from './site';

export interface NavPage {
  title: string;
  href: string;
  /** one line for the section index and the home page. */
  summary?: string;
  /** a page whose content is a proposal under review. */
  draft?: boolean;
}

export interface NavGroup {
  /** omitted for a section with one flat list. */
  title?: string;
  /** one line under the group's title on the section's index page. */
  summary?: string;
  pages: NavPage[];
}

export interface NavSection {
  key: 'get-started' | 'foundations' | 'styles' | 'components' | 'patterns' | 'develop';
  title: string;
  href: string;
  summary: string;
  groups: NavGroup[];
}

export const SECTIONS: NavSection[] = [
  {
    key: 'get-started',
    title: 'get started',
    href: url('get-started/'),
    summary: 'What the system is, who it is for, and how to start designing or building with it.',
    groups: [
      {
        pages: [
          { title: 'overview', href: url('get-started/'), summary: 'The system, its identity in one paragraph, who it is for and how this site is organised.' },
          { title: 'designing with it', href: url('get-started/designing/'), summary: 'How to work from the principles to a screen, and what to hand over.' },
          { title: 'developing with it', href: url('get-started/developing/'), summary: 'The React components, the tokens, and installing a release.' },
          { title: 'versioning & changelog', href: url('get-started/versioning/'), summary: 'What a version number promises, and every change so far.' },
          { title: 'resources', href: url('get-started/resources/'), summary: 'The repository, the brand files and the React subsite.' },
        ],
      },
    ],
  },
  {
    key: 'foundations',
    title: 'foundations',
    href: url('foundations/'),
    summary: 'The principles every screen follows, and the rules underneath every component.',
    groups: [
      {
        pages: [
          { title: 'principles', href: url('foundations/principles/'), summary: 'Five principles that decide what a screen does and what it leaves out.', draft: true },
          { title: 'accessibility', href: url('foundations/accessibility/'), summary: 'The WCAG 2.2 AA baseline, how it is checked, and the known gaps.' },
          { title: 'content & voice', href: url('foundations/content-voice/'), summary: 'Two voices, one per typeface, short and true: how the words on a screen are written.' },
          { title: 'interaction', href: url('foundations/interaction/'), summary: 'States, focus, the keyboard model and selection, the same in every component.' },
          { title: 'layout', href: url('foundations/layout/'), summary: 'The space scale, control heights, density and phone width.' },
        ],
      },
    ],
  },
  {
    key: 'styles',
    title: 'styles',
    href: url('styles/'),
    summary: 'The visual language: colour, type, icons, shape, motion and the brand marks.',
    groups: [
      {
        pages: [
          { title: 'colour', href: url('styles/colour/'), summary: 'A dark canvas, four greys of text, one blue and five semantic states, with the contrast table.' },
          { title: 'typography', href: url('styles/typography/'), summary: 'Two families and six roles: mono names things, Inter carries what people read.' },
          { title: 'iconography', href: url('styles/iconography/'), summary: 'Line icons at 16px with a 1.75 stroke, decoration unless named.' },
          { title: 'shape', href: url('styles/shape/'), summary: 'Square frames, hairlines and the one rounded shape.' },
          { title: 'motion', href: url('styles/motion/'), summary: 'Small, quick and only to say something.' },
          { title: 'brand', href: url('styles/brand/'), summary: 'The chevron, the lockup and the app icons.' },
        ],
      },
    ],
  },
  {
    key: 'components',
    title: 'components',
    href: url('components/'),
    summary: 'Every component as design guidance: when to use it, its parts, states, behaviour and content.',
    groups: ROLES.map(({ role, summary }) => ({
      title: role,
      summary,
      pages: COMPONENTS.filter((c) => c.role === role).map((c) => ({ title: c.name, href: guidanceHref(c), summary: c.summary })),
    })),
  },
  {
    key: 'patterns',
    title: 'patterns',
    href: url('patterns/'),
    summary: 'Whole floorplans and the problems that recur across them.',
    groups: [
      {
        title: 'floorplans',
        pages: [{ title: 'worklist', href: url('patterns/worklist/'), summary: 'A list of things that need doing, and the one next step for each.' }],
      },
      {
        title: 'navigation',
        pages: [
          { title: 'shell bar', href: url('patterns/shell-bar/'), summary: 'One header for every surface: the lockup, notifications and the user menu.', draft: true },
          { title: 'app navigation', href: url('patterns/app-navigation/'), summary: "Side navigation for an app's views, and when tabs are the better fit.", draft: true },
          { title: 'launchpad & tiles', href: url('patterns/launchpad-and-tiles/'), summary: 'The portal home page, and when a tile is the right way in.', draft: true },
          { title: 'settings and setup', href: url('patterns/settings-and-setup/'), summary: 'Where each kind of configuration lives, and where it is edited.', draft: true },
        ],
      },
      {
        title: 'feedback & status',
        pages: [
          { title: 'status vocabulary', href: url('patterns/status-vocabulary/'), summary: "One status per object, in the object's own words, from one table." },
          { title: 'message handling', href: url('patterns/message-handling/'), summary: 'Say each thing once, in the one place that fits it.' },
          { title: 'empty states', href: url('patterns/empty-states/'), summary: 'The five kinds of empty, and what each says.' },
          { title: 'loading and progress', href: url('patterns/loading-and-progress/'), summary: 'Nothing for a blink, a value when it is known, the shape of the content for a page.', draft: true },
        ],
      },
      {
        title: 'lists & forms',
        pages: [
          { title: 'selection and bulk actions', href: url('patterns/selection-and-bulk-actions/'), summary: 'Choosing rows to act on, and acting on all of them at once.', draft: true },
          { title: 'forms and settings', href: url('patterns/forms-and-settings/'), summary: 'Switches that apply at once, a form that waits for save, errors on save.' },
        ],
      },
    ],
  },
  {
    key: 'develop',
    title: 'develop',
    href: url('develop/'),
    summary: 'The React implementation, the tokens, apps inside a shell, and contributing.',
    groups: [
      {
        pages: [
          { title: 'react', href: url('develop/react/'), summary: 'What the React subsite holds, install, peer dependencies, the CSS and the fonts.' },
          { title: 'tokens', href: url('develop/tokens/'), summary: 'CSS custom properties, typed tokens and the Tailwind preset.' },
          { title: 'apps in a shell', href: url('develop/apps-in-a-shell/'), summary: 'Federated apps take the design system from the shell, so a page carries one version.' },
          { title: 'contributing', href: url('develop/contributing/'), summary: 'The rules of the repository, and how to add a component.' },
        ],
      },
    ],
  },
];

/** floorplans that are planned, listed on the patterns index. */
export const PLANNED_FLOORPLANS = [
  { title: 'object page', summary: 'One object in depth: its header, its facets as tabs, its history.' },
  { title: 'settings form', summary: 'A whole page of settings with one save, built from the forms pattern.' },
];

const strip = (href: string) => href.split('#')[0];

/** the section a path belongs to, by its first segment after the base. */
export function sectionOf(pathname: string): NavSection | undefined {
  return SECTIONS.find((s) => pathname.startsWith(strip(s.href)));
}

/** every page in reading order, for the previous / next links. */
export function flatPages(section: NavSection): NavPage[] {
  return section.groups.flatMap((g) => g.pages);
}
