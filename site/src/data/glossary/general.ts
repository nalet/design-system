// the words of the component, foundation, style and develop pages.
import type { GlossaryEntry } from './types';

export const GENERAL_TERMS: Record<string, GlossaryEntry> = {
  // tv
  'ten-foot': {
    term: '10-foot',
    explanation:
      'Made to be used from a sofa, about three metres (ten feet) away, with a remote control instead of a mouse or a touch screen. TV apps are 10-foot screens: their text, focus and spacing are larger and stronger than on a laptop.',
  },
  dp: {
    term: 'dp',
    explanation:
      'Density-independent pixels, the layout unit of Android and Android TV. A TV screen is 960 × 540 dp whatever its resolution, so on a 1920 × 1080 screen 1 dp is 2 pixels.',
  },
  'safe-area': {
    term: 'safe area',
    explanation:
      'The part of a TV picture that every TV shows in full. Some TVs cut off a few percent at the edges, so text and everything that can take focus stays at least 5% away from them.',
  },
  // building with agents
  'ai-agent': {
    term: 'AI agent',
    explanation:
      'A program built on a large language model that carries out a piece of work on its own, such as writing code and the text of an interface, and then checks its results. People give it the work as a prompt.',
  },
  prompt: {
    term: 'prompt',
    explanation:
      'The instruction a person gives an AI agent: what to build or change, and often why. It describes the work, not the words the finished screen should show.',
  },
  // using a screen: the keyboard, assistive technology, states
  'tab-stop': {
    term: 'tab stop',
    explanation:
      'A place the Tab key stops at as it moves through a page. A group of controls that is one tab stop is entered with one press of Tab; the arrow keys then move inside it.',
  },
  'accessible-name': {
    term: 'accessible name',
    explanation:
      'The name a screen reader announces for a control, like “save changes” for a button. It usually comes from the visible label; a control without visible words needs a name written for it.',
  },
  'assistive-technology': {
    term: 'assistive technology',
    explanation:
      'Software and devices people use to work with a computer in their own way, such as screen readers, screen magnifiers, voice control and switches.',
  },
  'live-region': {
    term: 'live region',
    explanation:
      'A part of the page that a screen reader reads out when its text changes, without people having to go there. Counts and short messages use one.',
  },
  'speech-input': {
    term: 'speech input',
    explanation:
      'Software that lets people control a computer by talking to it, for example by saying the name of a button to press it.',
  },
  'forced-colours': {
    term: 'forced colours',
    explanation:
      'A high-contrast setting in some operating systems that replaces a page’s colours with a few the person chose. Anything shown only by a fill or a shadow can disappear in it.',
  },
  disabled: {
    term: 'disabled',
    explanation: 'A control that is shown but can’t be used right now. It is dimmed, and the keyboard passes over it.',
  },
  hover: {
    term: 'hover',
    explanation:
      'Resting the mouse pointer on something without clicking it. Touch screens and keyboards have no hover, so nothing may depend on it alone.',
  },
  'target-size': {
    term: 'target size',
    explanation:
      'The area you can click or tap to use a control. A bigger target is easier to hit on a touch screen, or with an unsteady hand.',
  },
  landmark: {
    term: 'landmark',
    explanation:
      'A named region of a page, such as the navigation or the main content. Screen-reader users can jump straight to it.',
  },
  'heading-level': {
    term: 'heading level',
    explanation:
      'A heading’s rank, from 1 for the page’s title down to 6. Screen-reader users move through a page by its headings, so the levels follow the page’s outline.',
  },
  'mixed-state': {
    term: 'mixed state',
    explanation:
      'A checkbox that is neither on nor off, drawn with a dash. It means that some, but not all, of the options it stands for are on.',
  },
  disclosure: {
    term: 'disclosure',
    explanation: 'A control that shows or hides more content below it, like “details”. A small arrow turns as it opens.',
  },
  trigger: {
    term: 'trigger',
    explanation: 'The button that opens something, such as a menu or a list of options.',
  },
  'overflow-menu': {
    term: 'overflow menu',
    explanation: 'A menu that holds the actions that don’t fit in a row, behind one button such as “more actions”.',
  },

  // lists and tables
  'row-header': {
    term: 'row header',
    explanation:
      'The cell that names a row, usually the first one, such as an episode’s code. Screen readers read it out with every other cell of that row.',
  },
  'sticky-header': {
    term: 'sticky header',
    explanation: 'A header that stays at the top while the content scrolls underneath it, so its labels stay in view.',
  },
  'pop-in': {
    term: 'pop-in',
    explanation:
      'How a table makes room when it is narrow: its less important columns leave the header row, and their values show under each row’s name instead.',
  },
  facet: {
    term: 'facet',
    explanation: 'One property a list can be filtered by, such as status or quality, with a few values to pick from.',
  },
  density: {
    term: 'density',
    explanation:
      'How tightly a screen is packed. A dense table has less space around each row, so more rows fit on the screen at once.',
  },
  ellipsis: {
    term: 'ellipsis',
    explanation: 'The three dots (…) that show where text was cut short because it didn’t fit.',
  },
  placeholder: {
    term: 'placeholder',
    explanation:
      'Pale example text inside an empty field. It disappears as soon as people type, so it can’t take the place of a label.',
  },
  'semantic-state': {
    term: 'semantic state',
    explanation:
      'One of five meanings a status or a message can have: neutral, information, success, warning or error. Its colour and its symbol follow from the meaning.',
  },

  // the visual language
  canvas: {
    term: 'canvas',
    explanation: 'The dark background of every screen, and the few slightly lighter steps of it that panels sit on.',
  },
  hairline: {
    term: 'hairline',
    explanation: 'A line one pixel wide, used for frames, rules and dividers.',
  },
  tint: {
    term: 'tint',
    explanation: 'A faint wash of colour behind something, like the pale amber behind a warning.',
  },
  'leading-edge': {
    term: 'leading edge',
    explanation: 'The side where reading starts: the left edge in English and other languages written from left to right.',
  },
  glyph: {
    term: 'glyph',
    explanation: 'A small symbol drawn as part of the text, such as a check, a cross or a triangle.',
  },
  chrome: {
    term: 'chrome',
    explanation:
      'The parts of a screen that frame and operate the content, such as titles, buttons, tabs, menus and labels, as opposed to the content itself.',
  },
  'sentence-case': {
    term: 'sentence case',
    explanation: 'Writing with a capital letter only at the start of a sentence and for names, like this sentence.',
  },
  'type-role': {
    term: 'type role',
    explanation:
      'A named text style, such as a page title or body text, whose typeface, size, weight and spacing are decided once.',
  },
  'font-weight': {
    term: 'weight',
    explanation: 'How thick the strokes of a typeface are. 400 is regular, 600 semi-bold and 700 bold.',
  },
  'letter-spacing': {
    term: 'letter-spacing',
    explanation:
      'Extra space between the letters of a word. Small labels get a little more so they stay readable; large titles get a little less.',
  },
  'tabular-figures': {
    term: 'tabular figures',
    explanation:
      'Digits that all have the same width, so the numbers in a column line up and a changing count doesn’t push the text beside it.',
  },
  'thousands-separator': {
    term: 'thousands separator',
    explanation: 'The comma in 2,500 that groups the digits in threes, so a long number can be read at a glance.',
  },
  'fallback-font': {
    term: 'fallback font',
    explanation:
      'The font a browser uses when the intended one hasn’t loaded: the next one in the list, down to the computer’s own.',
  },
  easing: {
    term: 'easing',
    explanation: 'How a movement speeds up and slows down. “Ease” starts and ends gently; “linear” keeps one speed throughout.',
  },
  millisecond: {
    term: 'millisecond',
    explanation:
      'A thousandth of a second, written ms. A change that takes 120 ms feels immediate, yet the eye still sees it happen.',
  },
  chevron: {
    term: 'chevron',
    explanation:
      'The › sign. It is the brand’s mark, always in blue, and reads like the prompt of a terminal: this is where something starts.',
  },
  lockup: {
    term: 'lockup',
    explanation: 'The brand’s mark and its name, set together in a fixed arrangement and used as one logo.',
  },
  wordmark: {
    term: 'wordmark',
    explanation: 'A name written in a set typeface and used as a logo.',
  },
  'app-icon': {
    term: 'app icon',
    explanation:
      'The small square picture that stands for the product on a phone’s home screen, in a browser tab or in a dock.',
  },
  viewport: {
    term: 'viewport',
    explanation: 'The part of a page you can see at once, in a browser window or on a phone’s screen.',
  },
  breakpoint: {
    term: 'breakpoint',
    explanation: 'A width at which a layout changes, for example from two columns to one.',
  },

  // building with it
  'react-subsite': {
    term: 'React subsite',
    explanation:
      'The part of this documentation for developers: every component’s live examples, its code, its settings and how it is built.',
  },
  react: {
    term: 'React',
    explanation:
      'A widely used JavaScript library for building user interfaces. The components of this design system are written in it.',
  },
  css: {
    term: 'CSS',
    explanation: 'The language that describes how a web page looks: its colours, sizes, fonts, spacing and layout.',
  },
  'css-custom-property': {
    term: 'CSS custom property',
    explanation:
      'A named value in CSS, such as --cloud-blue, that other styles refer to. It is how the design tokens reach a page.',
  },
  prop: {
    term: 'prop',
    explanation: 'A setting passed to a component in code, such as its size or its label.',
  },
  playground: {
    term: 'playground',
    explanation:
      'A live example on the React subsite where you can change a component’s settings and see the result straight away.',
  },
  'native-element': {
    term: 'native element',
    explanation:
      'A control the browser provides itself, such as a button, a checkbox or a select. It comes with keyboard and screen-reader support built in.',
  },
  aria: {
    term: 'ARIA',
    explanation:
      'A set of attributes that tell assistive technology what an element is and what state it is in, where plain HTML can’t say it.',
  },
  'peer-dependency': {
    term: 'peer dependency',
    explanation: 'A package an app installs itself, next to this one, so the app and the design system share one copy of it.',
  },
  bundle: {
    term: 'bundle',
    explanation: 'The files a build tool packs together for the browser to download when an app opens.',
  },
  'federated-module': {
    term: 'federated module',
    explanation:
      'An app that is built and released on its own, but loaded into the shell’s page while it runs, so it appears inside the shell.',
  },
  tarball: {
    term: 'tarball',
    explanation: 'One packed file that holds a release of the package, ready to install.',
  },
  'semantic-versioning': {
    term: 'semantic versioning',
    explanation:
      'Version numbers in three parts, like 0.3.1. Which part changes says how big the change is: the first for changes that break things, the second for new features, the last for fixes.',
  },
  changelog: {
    term: 'changelog',
    explanation: 'The list of what changed in each version.',
  },
  repository: {
    term: 'repository',
    explanation: 'The place where the code and the history of every change to it are kept. This one is public, on GitHub.',
  },
};
