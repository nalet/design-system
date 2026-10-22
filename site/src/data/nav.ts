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
          { title: 'overview', href: url('get-started/'), summary: 'What the system is, its look in a few lines, who it is for, and how this site is organised.' },
          { title: 'designing with it', href: url('get-started/designing/'), summary: 'How to go from what people need to a finished screen, and what to hand over.' },
          { title: 'developing with it', href: url('get-started/developing/'), summary: 'The React components, the tokens, and installing a release.' },
          { title: 'versioning & changelog', href: url('get-started/versioning/'), summary: 'What a version number promises, and every change so far.' },
          { title: 'resources', href: url('get-started/resources/'), summary: 'The repository, the brand files and the React subsite.' },
          { title: 'glossary', href: url('get-started/glossary/'), summary: 'The words these guidelines use, explained in plain language.' },
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
          { title: 'accessibility', href: url('foundations/accessibility/'), summary: 'Screens everyone can use: the standard we meet, how it is checked, and what is still missing.' },
          { title: 'content & voice', href: url('foundations/content-voice/'), summary: 'How the words on a screen are written: two voices, one per typeface, short and true.' },
          { title: 'meaningful text', href: url('foundations/meaningful-text/'), summary: 'Where the words on a screen come from, what they leave out, and how people and agents check them before they ship.', draft: true },
          { title: 'interaction', href: url('foundations/interaction/'), summary: 'States, focus, the keys and selecting rows: the same in every component.' },
          { title: 'layout', href: url('foundations/layout/'), summary: 'One scale for space, three control heights, density, and screens that work on a phone.' },
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
          { title: 'colour', href: url('styles/colour/'), summary: 'A dark canvas, four greys for text, one blue for actions and five colours for states, with the contrast of every pair.' },
          { title: 'typography', href: url('styles/typography/'), summary: 'Two typefaces and six text styles: monospace names things, Inter carries what people read.' },
          { title: 'iconography', href: url('styles/iconography/'), summary: 'Small line icons in the colour of the text, and when an icon needs a name.' },
          { title: 'shape', href: url('styles/shape/'), summary: 'Square frames, thin lines, and the one rounded shape.' },
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
    summary: 'Every component: when to use it, its parts and states, how it behaves, and how to write its words.',
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
    summary: 'Proven ways to build whole pages, and to solve the problems that come up in every app.',
    groups: [
      {
        title: 'page layouts',
        pages: [{ title: 'worklist', href: url('patterns/worklist/'), summary: 'A page for working through what needs doing, with the one next step for each item.' }],
      },
      {
        title: 'navigation',
        pages: [
          { title: 'top bar', href: url('patterns/top-bar/'), summary: 'The bar across the top of every screen: where you are, the one search, what is new for you, and your account.', draft: true },
          { title: 'app navigation', href: url('patterns/app-navigation/'), summary: "Side navigation for an app's views, and when tabs are the better fit.", draft: true },
          { title: 'home & tiles', href: url('patterns/home-and-tiles/'), summary: 'The home page: one page of tiles in a few fixed groups, found with the search in the top bar, and when something gets a tile.', draft: true },
          { title: 'settings and setup', href: url('patterns/settings-and-setup/'), summary: 'Where each kind of setting lives, and the one place it is changed.', draft: true },
        ],
      },
      {
        title: 'feedback & status',
        pages: [
          { title: 'status vocabulary', href: url('patterns/status-vocabulary/'), summary: 'One status per item, in words people understand, the same everywhere.' },
          { title: 'message handling', href: url('patterns/message-handling/'), summary: 'Where each message goes, so that every thing is said once, in the place that fits it.' },
          { title: 'empty states', href: url('patterns/empty-states/'), summary: 'What a list says when it has nothing to show: five kinds of empty, and the way forward from each.' },
          { title: 'loading and progress', href: url('patterns/loading-and-progress/'), summary: 'What to show while people wait: nothing for a blink, then the loader, a value, or the shape of the content.', draft: true },
        ],
      },
      {
        title: 'lists & forms',
        pages: [
          { title: 'selection and bulk actions', href: url('patterns/selection-and-bulk-actions/'), summary: 'Ticking the rows to act on, and acting on all of them at once.', draft: true },
          { title: 'forms and settings', href: url('patterns/forms-and-settings/'), summary: 'Switches that apply at once, forms that wait for save, and errors that say how to fix them.' },
        ],
      },
      {
        title: 'watching',
        pages: [
          { title: 'tv focus', href: url('patterns/tv-focus/'), summary: 'How the one focused thing on a TV screen stands out from across the room: a ring, a lighter surface and a little growth.', draft: true },
          { title: 'downloads and offline', href: url('patterns/downloads-and-offline/'), summary: "Taking titles along on a phone: one status per title, the downloads screen, and what the app does when it can't reach the server.", draft: true },
          { title: 'casting', href: url('patterns/casting/'), summary: "Watching on a TV from the phone: the Cast button, the controls while casting, and what happens when the TV can't play a title.", draft: true },
          { title: 'subtitles', href: url('patterns/subtitles/'), summary: 'How subtitles look and how people pick them: one look for every title, one at a time, and a menu in their words.', draft: true },
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
          { title: 'react', href: url('develop/react/'), summary: 'What the React subsite holds, and how to install the package, its styles and the fonts.' },
          { title: 'tokens', href: url('develop/tokens/'), summary: 'The colours, type and spacing for CSS, JavaScript and Tailwind, all from one file.' },
          { title: 'apps in a shell', href: url('develop/apps-in-a-shell/'), summary: "Apps inside the shell use the shell's copy of the design system, so a page carries one version." },
          { title: 'contributing', href: url('develop/contributing/'), summary: 'The rules of the repository, and how to add a component.' },
        ],
      },
    ],
  },
];

/** page layouts that are planned, listed on the patterns index. */
export const PLANNED_PAGE_LAYOUTS = [
  { title: 'detail page', summary: 'One item in depth: its summary at the top, its parts as tabs, and its history.' },
  { title: 'settings form', summary: 'A whole page of settings with one save button, built from the forms pattern.' },
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
