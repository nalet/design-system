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
4. One platform, many apps. The shell owns sign-in, navigation, search, notifications, settings and the design system; one tile per app; setup found in settings, edited in the app; one top bar everywhere.
5. Calm and quick. One emphasized (primary) action per view, toolbar or dialog; no decoration; keyboard complete.
Baseline (never traded): WCAG 2.2 AA (text contrast >= 4.5:1, tested), named controls, visible focus, keyboard complete, works at phone width, docs state known gaps.

## voice — ${site('foundations/content-voice/')}
- Monospace (titles, headings, buttons, tabs, navigation, status chips, table headers, menu items, codes) is lowercase in every language; names and codes inside keep their case. The components lowercase by CSS, so wrap a name inside such a label in <KeepCase> (or class nc-keep-case): \`find <KeepCase>German</KeepCase> for 4 selected\`.
- The body face (descriptions, messages, toasts, dialog bodies, empty states, field labels and hints, docs prose) follows the language: sentence case, acronyms, German nouns capitalised.
- Messages: what is true, what it means, what to do. Buttons: a verb and its object ("grab 8 selected"), never "ok"/"submit".

## writing ui text — ${site('foundations/meaningful-text/')}
- Write from the facts of the running system (states, numbers, settings), not from the prompt: the prompt says what to build, not what the screen says.
- Keep the conversation off the screen: no request, ADR or plan wording, review notes or commit messages. Never mention a feature that isn't built.
- True on every installation: values that come from settings (languages, sources, limits, scope, where something is configured) are read from the configuration when the screen is shown, or left out. Never type one installation's setup into a sentence.
- Use the reader's words and speak to them ("you"); internal names, setting keys and error codes go under details.
- Leave out: repeats of what is visible; praise and promise words (seamless, effortless, smart, powerful, simply, successfully); hedges and padding (may, some, various, in order to, please note); decoration (emoji, exclamation marks, three-adjective lists, stacked dashes and colons).
- One number and one word per thing, across the whole screen.
- Before shipping, ask of every text: true right now? true on every installation? would anyone miss it? the reader's words? agrees with the rest of the screen? speaks to the reader? promises nothing unbuilt? reads well in a screenshot with real data?
- Find every text, including what the server writes (statuses, reasons, errors); search it for the request's wording and the project's internal words; list the texts you changed for review.

## tv focus (10-foot) — ${site('patterns/tv-focus/')}
- One focus style for every focusable item in a TV app, never a per-screen style: a 3 dp ring in --focus-ring (#00A4DC), the focused surface --surface-focus (#2A3142) behind rows, plain buttons and chips, growth 1.05 for cards, buttons and chips and 1.02 for rows, and text one step brighter (title --fg).
- Cards, buttons and chips: the ring outside with a 2 dp gap where the background shows. Rows: the ring inside the edge, no gap.
- The ring means focus only: "where you came from" is a 4 dp left-edge bar in --cloud-blue. 150 ms ease-out; none when animations are off. At least 12 dp between cards; everything focusable and all text inside the safe area (48 dp left and right, 27 dp top and bottom).
- dp = 1/960 of the screen width (2 CSS px on a 1920 × 1080 web screen). Screenshot tests of every kind, focused and at rest.

## downloads and offline (phone, tablet) — ${site('patterns/downloads-and-offline/')}
- One download control next to "play", one status: "download · 1.4 GB" | "queued" | "waiting for Wi-Fi" (Wi-Fi only, no Wi-Fi) | "waiting for a connection" | "downloading 42%" + bar | "downloaded · 1.4 GB" | "downloaded · check needed" + "Downloads are checked with the server every 30 days. This one plays again once the server can be reached." | "couldn't download" + the reason (not an instruction) + "try again" | "can't be downloaded" + "This title can only be streamed." (never "yet" or "for now": no promises).
- Sizes from the server at the chosen quality, left out when unknown; one decimal without a trailing zero ("18 GB"), MB below 1 GB; progress at most once a second. Seasons: "download season 1 · 8 episodes · 9.6 GB", then "download 2 more episodes · 724 MB"; partial series "3 of 8 downloaded".
- Downloads belong to the account that made them. Sign out / remove account / change server ask first: title = the action, body "Your 23 downloads, 12.4 GB, are deleted from this phone.", buttons "cancel" + the action (danger). A title the account may no longer watch is deleted: "This title isn't available to this account anymore, so it was deleted from this phone."
- Downloads screen: newest first, by series and season, "movies" apart; "12.4 GB used by downloads · 18 GB free on this phone"; a failed title shows its reason and no size; "delete all" asks once in a dialog titled "delete all downloads", counting only what is on the phone. Quality names as the player's menu ("720p · about 932 MB an hour").
- Server unreachable: open on Downloads with "Can't reach the server. Your downloads still play." ("Can't reach the server." alone when nothing is downloaded); a downloaded title's page is built from what is on the phone, without watchlist, lists, watched mark, trailer and people. Words: "downloads", "on this phone" ("on this tablet" from 600 dp); never "offline mode", "sync", "cache".

## casting (phone) — ${site('patterns/casting/')}
- Google's Cast icon, bar and full controls in our colours; the button only when a device is on the network, in the top bar of the player and a title's page, on the right.
- The bar sits above the bottom navigation: title, "playing on {device name from the network}", play/pause. Full controls: artwork, title, seek bar, play/pause, ±10 s, subtitles and audio if offered, "stop casting".
- The position hands over both ways. When the TV can't play: "{device} can't play this title." with the reason under details; casting stops.

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
