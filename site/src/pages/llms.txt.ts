// the guidelines for agents: the rules in a compact, plain-text form, without
// the explanations, sketches and examples the pages carry for people. it is
// built from the same data as the site, so the lists stay current; the rules
// themselves are short on purpose and link to the page that explains each.
import { COMPONENTS, guidanceHref } from '../data/components';
import { SECTIONS } from '../data/nav';
import { GLOSSARY_SORTED } from '../data/glossary';
import { REACT, REPO, VERSION, url } from '../data/site';

const site = (path: string) => `https://nalet.github.io${url(path)}`;

export function GET() {
  const patterns = SECTIONS.find((s) => s.key === 'patterns')?.groups.flatMap((g) => g.pages) ?? [];
  const text = `# nalet design system

> A dark, square, calm design system for admin consoles inside a portal shell. React components (v${VERSION}), design tokens, and guidelines.
> Human guidelines: ${site('')} · React implementation: https://nalet.github.io${REACT} · Source: ${REPO}

## principles (in priority order; the earlier wins a conflict) — ${site('foundations/principles/')}
1. The system does the work; people handle the exceptions. Automate routine work; a screen opens on what needs a person, then what is on its way; the full list is a drill-down.
2. The outcome is the status. One status per object, answering "can I use it yet?", the same in every app; internal steps are detail. Colour follows meaning; unknown says so.
3. People's words first, the system's detail one click away. No ids, file names or error codes as the message; keep them under details.
4. One platform, many apps. The shell owns sign-in, navigation, search, notifications, settings and the design system; one tile per app; setup found in settings, edited in the app; one shell bar everywhere.
5. Calm and quick. One emphasized (primary) action per view, toolbar or dialog; no decoration; keyboard complete.
Baseline (never traded): WCAG 2.2 AA (text contrast >= 4.5:1, tested), named controls, visible focus, keyboard complete, works at phone width, docs state known gaps.

## voice — ${site('foundations/content-voice/')}
- Monospace (titles, headings, buttons, tabs, navigation, status chips, table headers, menu items, codes) is lowercase in every language; names and codes inside keep their case.
- The body face (descriptions, messages, toasts, dialog bodies, empty states, field labels and hints, docs prose) follows the language: sentence case, acronyms, German nouns capitalised.
- Messages: what is true, what it means, what to do. Buttons: a verb and its object ("grab 8 selected"), never "ok"/"submit".

## identity — ${site('styles/brand/')}
Dark canvas only; the blue chevron (--cloud-blue) is the brand glyph and the colour of links and the primary action; square frames (border-radius 0); JetBrains Mono for display and labels, Inter for body; 4px spacing scale.

## components — guidance pages (React APIs: https://nalet.github.io${REACT})
${COMPONENTS.map((c) => `- ${c.name}: ${c.summary} ${'https://nalet.github.io' + guidanceHref(c)}`).join('\n')}

## patterns
${patterns.map((p) => `- ${p.title}${p.draft ? ' (draft)' : ''}: ${p.summary ?? ''} https://nalet.github.io${p.href}`).join('\n')}

## glossary — ${site('get-started/glossary/')} (as data: ${site('glossary.json')})
${GLOSSARY_SORTED.map((e) => `- ${e.term}: ${e.explanation}`).join('\n')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
