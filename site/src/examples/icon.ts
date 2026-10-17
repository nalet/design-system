import { composeStories } from '@storybook/react';
import * as stories from '@stories/components/Icon.stories';
import { SITE } from './site';

export const { Playground, Gallery, Sizes } = composeStories(stories, SITE);
