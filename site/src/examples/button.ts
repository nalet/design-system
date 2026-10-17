import { composeStories } from '@storybook/react';
import * as stories from '@stories/components/Button.stories';
import { SITE } from './site';

export const { Playground, Variants, Sizes, States, WithIcons, Block } = composeStories(stories, SITE);
