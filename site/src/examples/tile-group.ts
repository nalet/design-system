import { composeStories } from '@storybook/react';
import * as stories from '@stories/patterns/TileGroup.stories';
import { SITE } from './site';

export const { Playground, FixedColumns, WithAction, WithDescription, TabOrder } = composeStories(stories, SITE);
