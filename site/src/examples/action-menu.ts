import * as stories from '@stories/components/ActionMenu.stories';
import { compose } from './site';

export const {
  Playground,
  InARow,
  TextTrigger,
  DisabledAndDanger,
  Busy,
  Alignment,
  OneChoice,
  OneChoiceNamedByItsTrigger,
  Large,
  OnATouchScreen,
} = compose(stories);
