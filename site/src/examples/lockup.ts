import { composeStories } from '@storybook/react';
import * as stories from '@stories/components/Lockup.stories';
import { SITE } from './site';

export const { Playground, Variants } = composeStories(stories, SITE);
