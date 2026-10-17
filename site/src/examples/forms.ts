import { composeStories } from '@storybook/react';
import * as stories from '@stories/patterns/FormsAndSettings.stories';
import { SITE } from './site';

export const { Settings, FailedValidation, SaveFails } = composeStories(stories, SITE);
