import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { screenOf } from './screen';

describe('screenOf', () => {
  it('is null where the app says nothing: a screen for a pointer and a keyboard', () => {
    const { container } = render(<button type="button">check now</button>);
    expect(screenOf(container.querySelector('button'))).toBeNull();
    expect(screenOf(null)).toBeNull();
  });

  it('is what the nearest ancestor says, and only touch or tv', () => {
    const { container } = render(
      <div data-nc-screen="tv">
        <button type="button" id="on-a-tv">
          play
        </button>
        <div data-nc-screen="touch">
          <button type="button" id="on-touch">
            play
          </button>
        </div>
        <div data-nc-screen="watch">
          <button type="button" id="unknown">
            play
          </button>
        </div>
      </div>,
    );
    expect(screenOf(container.querySelector('#on-a-tv'))).toBe('tv');
    expect(screenOf(container.querySelector('#on-touch'))).toBe('touch');
    expect(screenOf(container.querySelector('#unknown'))).toBeNull();
  });
});
