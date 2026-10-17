import { composeStories } from '@storybook/react';
import * as stories from '@stories/patterns/Tile.stories';
import { SITE } from './site';

export const { Playground, App, Kpi, Badges, Status, States, Sizes } = composeStories(stories, SITE);
