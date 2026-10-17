import * as stories from '@stories/patterns/Portal.stories';
import { compose } from './site';

export const { Playground, WithFavorites, KpiDashboard, Compact, NoMatches } = compose(stories);
