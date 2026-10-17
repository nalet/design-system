// made-up, deterministic sample data for the stories: a media backlog of about
// 2,500 episodes across ~120 invented series, plus movies. every name is
// generated from neutral word lists; none is a real title.

export type BacklogState = 'wanted' | 'queued' | 'grabbed' | 'downloaded' | 'waiting' | 'failed';

export interface BacklogItem {
  id: string;
  /** the series or movie. */
  title: string;
  kind: 'series' | 'movie';
  season: number | null;
  episode: number | null;
  /** iso date. */
  aired: string;
  state: BacklogState;
  /** why a failed item failed, or what an item on its way is doing. */
  reason?: string;
  /** the last search, for wanted items. */
  search?: 'none' | 'found' | 'nothing' | 'error';
}

/** the fixed "today" every story uses, so relative dates never drift. */
export const STORY_NOW = new Date('2026-10-17T12:00:00Z');

const ADJ = [
  'Quiet', 'Copper', 'Northern', 'Silver', 'Hollow', 'Amber', 'Distant', 'Paper', 'Iron', 'Glass',
  'Velvet', 'Winter', 'Salt', 'Cedar', 'Lunar', 'Signal', 'Hidden', 'Golden', 'Restless', 'Coastal',
];
const NOUN = [
  'Harbour', 'Valley', 'Orchard', 'Engine', 'Garden', 'Station', 'Meridian', 'Circuit', 'Archive', 'Lantern',
  'Ridge', 'Bureau', 'Atlas', 'Current', 'Quarter', 'Ledger', 'Compass', 'Hearth', 'Frontier', 'Assembly',
];
const REASONS = [
  'no release passed the quality profile: every one was below 720p',
  'the download client refused the release: disk below the storage floor',
  'the release was removed by its source before it finished',
  'the download finished but the file did not match the episode',
  'every source that answered timed out',
];

// a small seeded generator (mulberry32), so every render gets the same data.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seriesNames(count: number): string[] {
  const names: string[] = [];
  for (let i = 0; names.length < count && i < ADJ.length * NOUN.length; i++) {
    const a = ADJ[(i * 7) % ADJ.length];
    const n = NOUN[(i * 3 + Math.floor(i / ADJ.length)) % NOUN.length];
    const name = i % 3 === 0 ? `The ${a} ${n}` : `${a} ${n}`;
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

function iso(daysAgo: number): string {
  return new Date(STORY_NOW.getTime() - daysAgo * 86_400_000).toISOString();
}

/**
 * makeBacklog — about `episodes` missing episodes across `series` series, and
 * `movies` movies. mostly wanted; some queued or on their way; a few failed.
 */
export function makeBacklog({ episodes = 2500, series = 120, movies = 140, seed = 7 } = {}): BacklogItem[] {
  const r = rng(seed);
  const names = seriesNames(series);
  const out: BacklogItem[] = [];
  let id = 0;
  const pickState = (): Pick<BacklogItem, 'state' | 'reason' | 'search'> => {
    const x = r();
    if (x < 0.04) return { state: 'failed', reason: REASONS[Math.floor(r() * REASONS.length)] };
    if (x < 0.06) return { state: 'queued' };
    if (x < 0.08) return { state: 'grabbed' };
    if (x < 0.09) return { state: 'downloaded' };
    if (x < 0.1) return { state: 'waiting' };
    const s = r();
    return { state: 'wanted', search: s < 0.5 ? 'none' : s < 0.8 ? 'nothing' : s < 0.95 ? 'found' : 'error' };
  };
  // spread the episodes over the series, unevenly: a few long backlogs, many short ones.
  const weights = names.map((_, i) => 1 / (1 + (i % 17)) + r() * 0.2);
  const total = weights.reduce((a, b) => a + b, 0);
  names.forEach((name, i) => {
    const n = Math.max(1, Math.round((weights[i] / total) * episodes));
    const seasons = 1 + Math.floor(r() * 4);
    const firstSeason = 1 + Math.floor(r() * 5);
    let left = n;
    for (let s = 0; s < seasons && left > 0; s++) {
      const season = firstSeason + s;
      const inSeason = s === seasons - 1 ? left : Math.max(1, Math.round(left / (seasons - s)));
      const startDaysAgo = (seasons - s) * 120 + Math.floor(r() * 60) - (i % 5 === 0 ? 400 : 0);
      for (let e = 1; e <= inSeason; e++) {
        const daysAgo = Math.max(0, startDaysAgo - e * 7);
        out.push({
          id: `t${++id}`,
          title: name,
          kind: 'series',
          season,
          episode: e,
          aired: iso(daysAgo),
          ...pickState(),
        });
      }
      left -= inSeason;
    }
  });
  for (let m = 0; m < movies; m++) {
    const a = ADJ[(m * 11) % ADJ.length];
    const n = NOUN[(m * 13 + 5) % NOUN.length];
    const year = 2019 + (m % 8);
    out.push({
      id: `m${m + 1}`,
      title: `${m % 2 ? 'The ' : ''}${a} ${n} (${year})`,
      kind: 'movie',
      season: null,
      episode: null,
      aired: iso(Math.floor(r() * 900)),
      ...pickState(),
    });
  }
  return out;
}

export const code = (b: BacklogItem) =>
  b.season == null || b.episode == null
    ? 'movie'
    : `S${String(b.season).padStart(2, '0')}E${String(b.episode).padStart(2, '0')}`;
