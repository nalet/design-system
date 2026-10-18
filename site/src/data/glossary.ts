// the glossary: plain-language explanations of the words these guidelines use.
// a page marks a word with <Term id="…">; a reader who doesn't know it can
// hover or tap it. the explanations are not printed in the page's text, so
// someone (or something) that knows the words reads straight through. they are
// published at /glossary.json and on the glossary page.
//
// the entries live in glossary/: core (principles, shell, basics), patterns,
// and general (components, foundations, styles, develop). an id is defined once.
import type { GlossaryEntry } from './glossary/types';
import { CORE } from './glossary/core';
import { PATTERN_TERMS } from './glossary/patterns';
import { GENERAL_TERMS } from './glossary/general';

export type { GlossaryEntry };

function merge(...parts: Record<string, GlossaryEntry>[]): Record<string, GlossaryEntry> {
  const out: Record<string, GlossaryEntry> = {};
  for (const part of parts) {
    for (const [id, entry] of Object.entries(part)) {
      if (out[id]) throw new Error(`glossary: "${id}" is defined twice`);
      out[id] = entry;
    }
  }
  return out;
}

export const GLOSSARY = merge(CORE, PATTERN_TERMS, GENERAL_TERMS);

/** the entries in alphabetical order, for the glossary page. */
export const GLOSSARY_SORTED = Object.entries(GLOSSARY)
  .map(([id, e]) => ({ id, ...e }))
  .sort((a, b) => a.term.localeCompare(b.term, 'en'));
