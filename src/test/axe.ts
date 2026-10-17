import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * run axe-core over a rendered node and fail with a readable list of
 * violations. `region` is off: a component rendered alone is not a page.
 */
export async function expectNoAxeViolations(node: Element): Promise<void> {
  const result = await axe.run(node, {
    rules: { region: { enabled: false } },
  });
  const found = result.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
  expect(found).toEqual([]);
}
