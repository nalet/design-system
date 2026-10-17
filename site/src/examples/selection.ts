import { composeStories } from '@storybook/react';
import * as stories from '@stories/patterns/SelectionAndBulkActions.stories';
import { SITE } from './site';

export const { SelectAndAct, GroupActions } = composeStories(stories, SITE);
