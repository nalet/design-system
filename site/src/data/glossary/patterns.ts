// the words the pattern pages use.
import type { GlossaryEntry } from './types';

export const PATTERN_TERMS: Record<string, GlossaryEntry> = {
  'tile-group': {
    term: 'tile group',
    explanation:
      'A set of tiles on the home page under one title, such as apps or settings. People look for their group first, then for the tile.',
  },
  'number-tile': {
    term: 'number tile',
    explanation:
      'A tile that shows a number someone acts on, such as 3 downloads that need attention. Pressing it opens the app, showing just those things.',
  },
  'task-tile': {
    term: 'task tile',
    explanation:
      'A tile that starts one frequent task straight away, such as requesting a title, instead of opening an app on its first view.',
  },
  addon: {
    term: 'addon',
    explanation:
      'An app that is installed into the platform on its own, after the platform itself. It brings its own tile and its own setup.',
  },
  'user-menu': {
    term: 'user menu',
    explanation:
      'The menu behind your initials or picture at the top right of every screen. It holds your account, settings, help and sign out.',
  },
  avatar: {
    term: 'avatar',
    explanation: 'The small square with your picture or your initials that stands for you on the screen.',
  },
  secret: {
    term: 'secret',
    explanation:
      'A password or a key that lets one system sign in to another. It is stored safely and never shown again; it can only be replaced.',
  },
  'status-vocabulary': {
    term: 'status vocabulary',
    explanation:
      'The fixed list of statuses one kind of item can have, with the words and the meaning of each. It is written down once and used everywhere the item appears.',
  },
  banner: {
    term: 'banner',
    explanation:
      'A bar above a list or a page with a message about all of it, such as a warning that some items can’t be checked. It stays as long as the message is true.',
  },
  toast: {
    term: 'toast',
    explanation:
      'A short message that pops up for a few seconds to confirm that something just happened, such as “8 episodes queued”. It goes away on its own.',
  },
  'empty-state': {
    term: 'empty state',
    explanation:
      'What a list or a page shows when it has nothing to show: a simple picture, a line that says why, and what to do next.',
  },
  skeleton: {
    term: 'skeleton',
    explanation:
      'Grey blocks in the shape of the content that is about to appear, shown while a list or a page loads for the first time.',
  },
  'bulk-action': {
    term: 'bulk action',
    explanation: 'One action applied to many selected items at once, such as grabbing eight episodes in one go.',
  },
  'selection-toolbar': {
    term: 'selection toolbar',
    explanation:
      'The bar above a list that shows how many items are selected, and the actions that apply to all of them.',
  },
  validation: {
    term: 'validation',
    explanation: 'Checking the values in a form before they are saved, and saying which ones need a fix and how.',
  },
  'tab-bar': {
    term: 'tab bar',
    explanation: 'The row of icons along the foot of a phone’s screen, one for each view of a product. Pressing one opens that view; the current one is blue, with a bar on its edge.',
  },
  rail: {
    term: 'rail',
    explanation: 'A narrow column of icons down the left edge of the screen, one for each view of a product: on a wide screen under the product’s mark, on a phone held sideways, and on a TV, where it opens to show their names once the focus moves into it.',
  },
  'touch-area': {
    term: 'touch area',
    explanation: 'The part of the screen around a control that answers to a finger. It is larger than the control looks, at least 48 by 48.',
  },
  'toggle-button': {
    term: 'toggle button',
    explanation: 'A button that stays on after one press and off after the next, such as one that saves a title to a list. A screen reader says whether it is pressed.',
  },
  slider: {
    term: 'slider',
    explanation: 'A control for a value in a range, such as the volume: a square thumb on a track, with the value in words beside it.',
  },
  'seek-bar': {
    term: 'seek bar',
    explanation: 'The slider in a player that shows where you are and moves you to another moment.',
  },
  stepper: {
    term: 'stepper',
    explanation: 'A whole number in small steps, such as a countdown in seconds: a minus and a plus on either side of the value.',
  },
  'progress-bar': {
    term: 'progress bar',
    explanation: 'A bar that fills as work gets done, with how far it has come in words under it.',
  },
  space: {
    term: 'space',
    explanation: 'One part of the portal’s home page: a page with the tiles of one kind of work, such as apps, manage or settings. A bar under the top bar lists the spaces; each has its own address.',
  },
};
