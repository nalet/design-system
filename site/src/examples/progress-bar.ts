import * as stories from '@stories/components/ProgressBar.stories';
import { compose } from './site';

export const { Playground, States, Stopping, Waiting, Live, Failed, OnTouch, OnTv } = compose(stories);
