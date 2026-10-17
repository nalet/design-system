// project annotations for every story this site renders through storybook's
// portable stories (composeStories). the stories are written once, in
// stories/**/*.stories.tsx, and appear both here and on the react subsite.
//
// embedded: the story sits inside a page that mounts one <Toaster /> and
// gives it its frame; a story that brings its own toaster or a full-height
// frame for the storybook leaves them out here (see the stories' decorators).
export const SITE = { parameters: { embedded: true } };
