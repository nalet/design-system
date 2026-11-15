import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { Code } from './Code';
import { Language } from '../../lib/language';
import { expectNoAxeViolations } from '../../test/axe';

// jsdom lays nothing out: a stand-in ResizeObserver, and a block narrower than
// its lines, so the block is the region that scrolls.
function longLines() {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockReturnValue(800);
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(400);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

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

  it('a block that scrolls is a region named "code" in English, as before; one that fits is not', () => {
    const { unmount } = render(<Code block>npm run build</Code>);
    expect(screen.queryByRole('region')).toBeNull();
    unmount();
    longLines();
    render(<Code block>npm run build</Code>);
    expect(screen.getByRole('region', { name: 'code' })).toHaveAttribute('tabindex', '0');
  });

  it('takes that name from the words of the page’s language, and a name of its own before that', () => {
    longLines();
    const { rerender } = render(
      <Language lang="de">
        <Code block>npm run build</Code>
      </Language>,
    );
    // German calls it by the same word.
    expect(screen.getByRole('region', { name: 'code' })).toBeInTheDocument();
    rerender(
      <Language lang="de" words={{ code: { region: 'quelltext' } }}>
        <Code block>npm run build</Code>
      </Language>,
    );
    expect(screen.getByRole('region', { name: 'quelltext' })).toBeInTheDocument();
    rerender(
      <Language lang="de">
        <Code block aria-label="befehl zum installieren">
          npm run build
        </Code>
      </Language>,
    );
    expect(screen.getByRole('region', { name: 'befehl zum installieren' })).toBeInTheDocument();
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
