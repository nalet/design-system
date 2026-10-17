import * as stories from '@stories/components/Card.stories';
import { compose } from './site';

export const { Playground, Plain, WithHeaderAndFooter, HeaderAside, Sunken, Flush, AsSection } = compose(stories);
