// the words of the principles, the shell and the basics.
import type { GlossaryEntry } from './types';

export const CORE: Record<string, GlossaryEntry> = {
  'design-system': {
    term: 'design system',
    explanation:
      'A shared set of rules, building blocks and examples that a team uses to make screens look and work the same way. It saves people from solving the same problem twice.',
  },
  component: {
    term: 'component',
    explanation:
      'A reusable building block of a screen, such as a button, a table or a message. It is built once and used everywhere, so it looks and behaves the same in every app.',
  },
  pattern: {
    term: 'pattern',
    explanation:
      'A proven way to combine components to solve a recurring problem, like showing a list of things to do or asking for settings.',
  },
  principle: {
    term: 'principle',
    explanation:
      'A short statement of what we value. When two good ideas compete, the principles help decide which one wins.',
  },
  token: {
    term: 'design token',
    explanation:
      'A named value, such as a colour, a size or a font, stored once and used by every component. Changing the token changes every place that uses it.',
  },
  floorplan: {
    term: 'floorplan',
    explanation:
      'The layout of a whole page for one kind of task, such as working through a list or editing settings. Pages of the same kind then feel familiar.',
  },
  worklist: {
    term: 'worklist',
    explanation:
      'A page that lists things someone needs to look at or act on, with filters, a count for each group and actions for several items at once.',
  },
  shell: {
    term: 'shell',
    explanation:
      'The frame around every app: sign-in, the bar at the top, notifications and settings. Apps open inside it, so moving between them feels like one product.',
  },
  'shell-bar': {
    term: 'shell bar',
    explanation:
      'The bar across the top of every screen, with the product name, notifications and your account menu. It is the same everywhere.',
  },
  launchpad: {
    term: 'launchpad',
    explanation: 'The start page of the shell. It shows a tile for each app you can open.',
  },
  tile: {
    term: 'tile',
    explanation: 'A square on the launchpad that opens an app. It can also show a number that needs attention.',
  },
  app: {
    term: 'app',
    explanation:
      'A part of the product with its own job, such as managing downloads or browsing the catalogue. It opens inside the shell.',
  },
  view: {
    term: 'view',
    explanation: 'One screen inside an app, such as a list of downloads or a settings form.',
  },
  'side-navigation': {
    term: 'side navigation',
    explanation:
      'A list of an app’s views down the left side of the screen. It stays visible, so you always see where you are and where you can go.',
  },
  tabs: {
    term: 'tabs',
    explanation:
      'A row of labels above content that switch between parts of the same thing, like the overview and the history of one item.',
  },
  status: {
    term: 'status',
    explanation:
      'A short word that says what state something is in, like “ready” or “needs attention”. Its colour tells you how urgent it is.',
  },
  exception: {
    term: 'exception',
    explanation:
      'Something that did not go as expected and needs a person, for example a download that failed. The opposite of the routine work the system handles alone.',
  },
  automation: {
    term: 'automation',
    explanation: 'Work the system does by itself, without someone clicking a button each time.',
  },
  backlog: {
    term: 'backlog',
    explanation: 'Everything that is still to do, including the items that are not urgent.',
  },
  'drill-down': {
    term: 'drill-down',
    explanation: 'A more detailed view you open from a summary, for example the full list behind a number.',
  },
  'emphasized-action': {
    term: 'emphasized action',
    explanation:
      'The one button on a screen that stands out, usually filled with colour. It is the step most people take next.',
  },
  monospace: {
    term: 'monospace',
    explanation:
      'A typeface where every letter has the same width, like on an old typewriter or in a terminal. We use it for titles, labels and codes.',
  },
  'body-face': {
    term: 'body face',
    explanation: 'The typeface for longer text that people read, like descriptions and messages. Ours is Inter.',
  },
  accessibility: {
    term: 'accessibility',
    explanation:
      'Making sure everyone can use a screen, including people who use a keyboard instead of a mouse, a screen reader, or have low vision.',
  },
  wcag: {
    term: 'WCAG',
    explanation:
      'The Web Content Accessibility Guidelines: the international standard for accessible websites. “AA” is the level most organisations aim for.',
  },
  contrast: {
    term: 'contrast ratio',
    explanation:
      'How much a colour stands out from the colour behind it. Text needs enough contrast (at least 4.5 to 1) to be readable for people with low vision.',
  },
  'screen-reader': {
    term: 'screen reader',
    explanation: 'Software that reads a screen out loud, used by people who are blind or have low vision.',
  },
  'reduced-motion': {
    term: 'reduced motion',
    explanation:
      'A setting on phones and computers for people who get dizzy or distracted by animation. We stop movement when it is on.',
  },
  focus: {
    term: 'focus',
    explanation:
      'The highlight on the element a keyboard is currently on. Pressing Tab moves it to the next button or field.',
  },
  'portal': {
    term: 'portal',
    explanation: 'The website you sign in to first. It holds the shell, the launchpad and every app.',
  },
};
