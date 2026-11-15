import * as React from 'react';
import { builtInWords, english, type Counted, type Words } from './words';

/**
 * language — the page's language, said once, and what follows from it: how a
 * count and a date are written, and the words the components bring themselves.
 *
 * Without `<Language>`, the language is the `lang` of the page's root element,
 * English where there is none. A change of that attribute reaches every
 * component.
 */

/** The words of a `<Language>`: any part of a set; the rest comes from the built-in set. */
export type WordsOverride = { [K in keyof Words]?: Partial<Words[K]> };

interface LanguageValue {
  /** The language tag, as the page gave it: "en", "de", "de-CH". */
  lang: string;
  /** The components' own words in that language. */
  words: Words;
}

const LanguageContext = React.createContext<LanguageValue | null>(null);

export interface LanguageProps {
  /** The language of everything inside, as a language tag. Default: the page's own `lang`. */
  lang?: string;
  /** Words that replace the built-in ones: a whole set for another language, or single texts. */
  words?: WordsOverride;
  children?: React.ReactNode;
}

/**
 * Language — says the language of a page, or of a part of it, once. Every
 * component inside writes its counts and dates in that language and takes its
 * own words from the set for it.
 */
export function Language({ lang, words, children }: LanguageProps) {
  const outer = React.useContext(LanguageContext);
  const pageLang = usePageLanguage();
  // inside another Language: its language unless this one names its own, and
  // its words as long as the language stays the same.
  const tag = lang ?? outer?.lang ?? pageLang;
  const base = outer && outer.lang === tag ? outer.words : wordsFor(tag);
  const value = React.useMemo<LanguageValue>(() => ({ lang: tag, words: mergeWords(base, words) }), [tag, base, words]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** The language a component is in, and its words. */
export function useLanguage(): LanguageValue {
  const given = React.useContext(LanguageContext);
  const pageLang = usePageLanguage();
  return React.useMemo(() => given ?? { lang: pageLang, words: wordsFor(pageLang) }, [given, pageLang]);
}

/** The built-in set for a language tag: its own, its language's ("de-CH" takes "de"), else English. */
export function wordsFor(lang: string): Words {
  return builtInWords[lang.toLowerCase()] ?? builtInWords[lang.toLowerCase().split('-')[0]] ?? english;
}

function mergeWords(base: Words, over: WordsOverride | undefined): Words {
  if (!over) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(over) as (keyof Words)[]) {
    out[key] = { ...(base[key] as object), ...(over[key] as object) };
  }
  return out as unknown as Words;
}

// ---- the page's own language --------------------------------------------------

/** The `lang` of the page's root element; English where it has none, and outside a browser. */
export function pageLanguage(): string {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang || 'en';
}

// one observer for the whole page, however many components listen: a table
// draws thousands of cells, and each of them reads the language.
const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function subscribe(onChange: () => void): () => void {
  if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return () => {};
  listeners.add(onChange);
  if (!observer) {
    observer = new MutationObserver(() => {
      for (const listener of Array.from(listeners)) listener();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && observer) {
      observer.disconnect();
      observer = null;
    }
  };
}

function usePageLanguage(): string {
  return React.useSyncExternalStore(subscribe, pageLanguage, () => 'en');
}

// ---- writing in a language ------------------------------------------------------

const countFormats = new Map<string, Intl.NumberFormat>();

/**
 * formatCount — a count as the language writes it: "2,500" in English, "2.500"
 * in German. Without a language it is the page's.
 */
export function formatCount(n: number, lang: string = pageLanguage()): string {
  let f = countFormats.get(lang);
  if (!f) {
    try {
      f = new Intl.NumberFormat(lang);
    } catch {
      f = new Intl.NumberFormat('en');
    }
    countFormats.set(lang, f);
  }
  return f.format(n);
}

/** A text with its values in place: fill("select {name}", { name: "db-01" }). */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));
}

const pluralRules = new Map<string, Intl.PluralRules>();

/**
 * counted — the form of a text that counts for this number, with the count
 * written in the language: counted(words.toolbar.selected, 2500, "de") is
 * "2.500 ausgewählt". More values go in the same way as with `fill`.
 */
export function counted(text: Counted, n: number, lang: string, values: Record<string, string | number> = {}): string {
  let rules = pluralRules.get(lang);
  if (!rules) {
    try {
      rules = new Intl.PluralRules(lang);
    } catch {
      rules = new Intl.PluralRules('en');
    }
    pluralRules.set(lang, rules);
  }
  const form = text[rules.select(n) as keyof Counted] ?? text.other;
  return fill(form, { n: formatCount(n, lang), ...values });
}

/**
 * The language tag dates are written in. English without a region is written
 * the British way, day before month ("12 oct 2026"), as the system writes its
 * English dates; a page that names a region gets that region's order.
 */
export function dateLanguage(lang: string): string {
  return lang.toLowerCase() === 'en' ? 'en-GB' : lang;
}
