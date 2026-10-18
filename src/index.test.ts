// the package's entry: the names it exports.
import { describe, expect, expectTypeOf, it } from 'vitest';
import * as ds from './index';

describe('the old names', () => {
  it('are the new exports under the names they had in 0.3.0, until 0.5.0', () => {
    expect(ds.ObjectStatus).toBe(ds.Status);
    expect(ds.MessageStrip).toBe(ds.Banner);
    expect(ds.IllustratedMessage).toBe(ds.EmptyState);
    expect(ds.OBJECT_STATES).toBe(ds.STATES);
    // the types are checked by `npm run lint`.
    expectTypeOf<ds.ObjectStatusProps>().toEqualTypeOf<ds.StatusProps>();
    expectTypeOf<ds.ObjectState>().toEqualTypeOf<ds.State>();
    expectTypeOf<ds.MessageStripProps>().toEqualTypeOf<ds.BannerProps>();
    expectTypeOf<ds.IllustratedMessageProps>().toEqualTypeOf<ds.EmptyStateProps>();
    expectTypeOf<ds.IllustratedMessageSize>().toEqualTypeOf<ds.EmptyStateSize>();
  });
});
