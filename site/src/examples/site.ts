// every story this site renders goes through storybook's portable stories
// (composeStories): the stories are written once, in stories/**/*.stories.tsx,
// and appear both here and on the react subsite.
import { createElement, type ComponentType } from 'react';
import { composeStories } from '@storybook/react';

// embedded: the story sits inside a page that mounts one <Toaster /> and
// gives it its frame; a story that brings its own toaster or a full-height
// frame for the storybook leaves them out here (see the stories' decorators).
export const SITE = { parameters: { embedded: true } };

/**
 * composeStories, for this site. astro hydrates an island with an explicit
 * `children: undefined` when it has no slot, and a composed story takes its
 * props as args: that would wipe a story's own `children` arg on the client
 * only, and the hydrated html would no longer match. the wrapper drops it.
 */
export function compose<T extends Parameters<typeof composeStories>[0]>(stories: T) {
  const composed = composeStories(stories, SITE) as Record<string, ComponentType<Record<string, unknown>>>;
  const out: Record<string, ComponentType<Record<string, unknown>>> = {};
  for (const [name, Story] of Object.entries(composed)) {
    const Embedded = ({ children, ...args }: Record<string, unknown>) =>
      createElement(Story, children === undefined ? args : { ...args, children });
    Embedded.displayName = name;
    out[name] = Embedded;
  }
  return out as unknown as ReturnType<typeof composeStories<T>>;
}
