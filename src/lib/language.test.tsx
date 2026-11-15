import { describe, it, expect, afterEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Language, counted, dateLanguage, fill, formatCount, useLanguage, wordsFor } from './language';
import { english, german } from './words';

function Probe() {
  const { lang, words } = useLanguage();
  return (
    <p>
      {lang}: {words.modal.close}, {counted(words.toolbar.selected, 2500, lang)}
    </p>
  );
}

afterEach(() => {
  document.documentElement.removeAttribute('lang');
});

describe('language', () => {
  it('is English where the page names no language', () => {
    render(<Probe />);
    expect(screen.getByText('en: close, 2,500 selected')).toBeInTheDocument();
  });

  it('follows the lang of the page, and a change of it', () => {
    document.documentElement.lang = 'de';
    render(<Probe />);
    expect(screen.getByText('de: schließen, 2.500 ausgewählt')).toBeInTheDocument();
    act(() => {
      document.documentElement.lang = 'en';
    });
    return screen.findByText('en: close, 2,500 selected');
  });

  it('watches the page with one observer, however many components listen', async () => {
    const made = vi.spyOn(window, 'MutationObserver');
    const { unmount } = render(
      <>
        <Probe />
        <Probe />
        <Probe />
      </>,
    );
    expect(made).toHaveBeenCalledTimes(1);
    act(() => {
      document.documentElement.lang = 'de';
    });
    expect(await screen.findAllByText('de: schließen, 2.500 ausgewählt')).toHaveLength(3);
    // the last listener gone, the observer goes too; the next one starts a new one.
    unmount();
    made.mockClear();
    render(<Probe />);
    expect(made).toHaveBeenCalledTimes(1);
    act(() => {
      document.documentElement.lang = 'en';
    });
    await screen.findByText('en: close, 2,500 selected');
    made.mockRestore();
  });

  it('takes the language and single words from <Language>', () => {
    render(
      <Language lang="de" words={{ modal: { close: 'zu' } }}>
        <Probe />
      </Language>,
    );
    expect(screen.getByText('de: zu, 2.500 ausgewählt')).toBeInTheDocument();
  });

  it('gives a region its language’s words and its own numbers', () => {
    expect(wordsFor('de-CH')).toBe(german);
    expect(wordsFor('fr')).toBe(english);
    expect(formatCount(2500, 'de-CH')).toBe("2'500");
  });

  it('writes a count in the language it is given, the page’s without one', () => {
    expect(formatCount(2500)).toBe('2,500');
    expect(formatCount(2500, 'de')).toBe('2.500');
    document.documentElement.lang = 'de';
    expect(formatCount(2500)).toBe('2.500');
  });

  it('fills a text and picks the form a number asks for', () => {
    expect(fill('select {name}', { name: 'db-01' })).toBe('select db-01');
    expect(fill('{shown} of {total}', { shown: '100', total: '2,500' })).toBe('100 of 2,500');
    const rows = { one: '{n} row', other: '{n} rows' };
    expect(counted(rows, 1, 'en')).toBe('1 row');
    expect(counted(rows, 2500, 'en')).toBe('2,500 rows');
    expect(counted({ other: '{n} of {total}' }, 3, 'en', { total: 9 })).toBe('3 of 9');
  });

  it('writes English dates day first unless the page names a region', () => {
    expect(dateLanguage('en')).toBe('en-GB');
    expect(dateLanguage('en-US')).toBe('en-US');
    expect(dateLanguage('de')).toBe('de');
  });

  it('has every English text in German too', () => {
    for (const block of Object.keys(english) as (keyof typeof english)[]) {
      expect(Object.keys(german[block]).sort()).toEqual(Object.keys(english[block]).sort());
    }
  });
});
