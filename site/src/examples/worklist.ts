import { composeStories } from '@storybook/react';
import * as stories from '@stories/patterns/Worklist.stories';
import { SITE } from './site';

export const { FullExample, NothingMissing, HoldingsUnknown } = composeStories(stories, SITE);
