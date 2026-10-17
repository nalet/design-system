import { composeStories } from '@storybook/react';
import * as stories from '@stories/patterns/Portal.stories';
import { SITE } from './site';

export const { Playground, WithFavorites, KpiDashboard, Compact, NoMatches } = composeStories(stories, SITE);
