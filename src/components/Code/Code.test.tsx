import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Code } from './Code';
import { expectNoAxeViolations } from '../../test/axe';

describe('Code', () => {
  it('forwards its ref to the element it renders, inline and as a block', () => {
    const inline = React.createRef<HTMLElement>();
    const block = React.createRef<HTMLElement>();
    render(
      <>
        <Code ref={inline}>npm test</Code>
        <Code ref={block} block>
          npm run build
        </Code>
      </>,
    );
    expect(inline.current?.tagName).toBe('CODE');
    expect(block.current?.tagName).toBe('PRE');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Code>npm test</Code>
        <Code block>npm run build</Code>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
