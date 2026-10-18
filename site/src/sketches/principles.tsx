// storyboard drawings for the five principles: for each, what it looks like
// when the principle is followed, and when it isn't.
import { Box, Button, Chevron, Dots, Line, Screen, Sketch, Status, Word } from './kit';

/* 1 — the system does the work; people handle the exceptions */

export function ExceptionsFirst() {
  return (
    <Sketch label="A screen that opens on 3 things needing attention and 12 on their way, with the full list of 2,500 one link away.">
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={40} strong />
      <Word x={14} y={50} size="lg" tone="warn">3</Word>
      <Word x={14} y={63} size="xs" tone="dim">needs attention</Word>
      <Word x={110} y={50} size="lg" tone="accent">12</Word>
      <Word x={110} y={63} size="xs" tone="dim">on its way</Word>
      <line className="sk-rule" x1={1} x2={319} y1={74} y2={74} />
      {[86, 110, 134].map((y) => (
        <g key={y}>
          <Status x={14} y={y} tone="warn" />
          <Line x={26} y={y} w={120} strong />
          <Line x={26} y={y + 9} w={78} />
        </g>
      ))}
      <Word x={14} y={182} size="sm" tone="accent">see all 2,500 →</Word>
    </Sketch>
  );
}

export function EverythingAtOnce() {
  const rows = Array.from({ length: 11 }, (_, i) => 36 + i * 14);
  return (
    <Sketch label="A screen that lists 2,500 rows at once, each with its own blue button.">
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={40} strong />
      <Word x={12} y={29} size="xs" tone="dim">2,500 missing</Word>
      {rows.map((y) => (
        <g key={y}>
          <Line x={12} y={y + 3} w={140} />
          <Line x={166} y={y + 3} w={56} />
          <Button x={268} y={y} w={32} primary />
        </g>
      ))}
      <rect className="sk-scroll" x={310} y={34} width={4} height={160} />
      <rect className="sk-scroll-thumb" x={310} y={34} width={4} height={6} />
    </Sketch>
  );
}

/* 2 — the outcome is the status */

export function OneStatus() {
  return (
    <Sketch label="Two items, each with one status in plain words: ready to watch, and needs attention because it can't be converted.">
      <Screen bar={false} />
      {[
        { x: 16, tone: 'ok' as const, word: 'ready to watch', note: '' },
        { x: 166, tone: 'warn' as const, word: 'needs attention', note: "can't be converted" },
      ].map((c) => (
        <g key={c.x}>
          <rect className="sk-card" x={c.x} y={22} width={138} height={156} />
          <Box x={c.x + 12} y={34} w={42} h={60} />
          <Line x={c.x + 64} y={40} w={60} strong />
          <Line x={c.x + 64} y={50} w={44} />
          <Status x={c.x + 12} y={108} tone={c.tone} text={c.word} />
          {c.note ? (
            <Word x={c.x + 12} y={128} size="xs" tone="dim" mono={false}>
              {c.note}
            </Word>
          ) : null}
          <Word x={c.x + 12} y={160} size="xs" tone="dim">details ▸</Word>
        </g>
      ))}
    </Sketch>
  );
}

export function StatusPerStep() {
  return (
    <Sketch label="An item that shows three statuses from internal steps; it says completed in green although it will never play.">
      <Screen bar={false} />
      <rect className="sk-card" x={60} y={22} width={200} height={156} />
      <Box x={74} y={34} w={42} h={60} />
      <Line x={126} y={40} w={90} strong />
      <Line x={126} y={50} w={60} />
      <Status x={74} y={108} tone="ok" text="downloaded" />
      <Status x={74} y={124} tone="ok" text="completed" />
      <Status x={74} y={140} tone="neutral" text="transcode: refused (dv p5)" />
      <g className="sk-broken">
        <rect x={208} y={100} width={30} height={30} />
        <path d="M218 108 L230 115 L218 122 Z" />
        <line x1={204} y1={134} x2={242} y2={96} />
      </g>
    </Sketch>
  );
}

/* 3 — people's words first, the system's detail one click away */

export function PeoplesWords() {
  return (
    <Sketch label="A row that says The Quiet Harbour, episode S04E07, can't be converted, with the technical details behind a details toggle.">
      <Screen bar={false} />
      <rect className="sk-card" x={16} y={60} width={288} height={64} />
      <Word x={30} y={84} size="md" tone="strong" mono={false}>
        The Quiet Harbour · S04E07
      </Word>
      <Status x={30} y={98} tone="warn" text="can't be converted" />
      <Word x={292} y={84} size="xs" tone="dim" anchor="end">details ▸</Word>
      <Line x={16} y={30} w={140} />
      <Line x={16} y={150} w={200} />
      <Line x={16} y={160} w={160} />
    </Sketch>
  );
}

export function SystemsWords() {
  return (
    <Sketch label="A row that shows a raw file name and an error code instead of words a person understands.">
      <Screen bar={false} />
      <rect className="sk-card" x={16} y={60} width={288} height={64} />
      <Word x={30} y={84} size="xs" tone="strong">Quiet.Harbour.S04E07.2160p.h265-GRP</Word>
      <Word x={30} y={102} size="xs" tone="err">FAILURE/PAR · 0x80070057</Word>
      <Line x={16} y={30} w={140} />
      <Line x={16} y={150} w={200} />
      <Line x={16} y={160} w={160} />
    </Sketch>
  );
}

/* 4 — one platform, many apps */

function ShellBar() {
  return (
    <g>
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <rect className="sk-icon" x={278} y={4} width={9} height={9} />
      <rect className="sk-avatar" x={296} y={3} width={13} height={11} />
    </g>
  );
}

export function OneTilePerApp() {
  const tiles = [
    { x: 16, badge: false },
    { x: 116, badge: true },
    { x: 216, badge: false },
  ];
  return (
    <Sketch label="A home page with the same top bar as every app, and one tile per app; one tile shows 3 things that need attention.">
      <Screen />
      <ShellBar />
      <Line x={16} y={32} w={80} strong />
      {tiles.map((t) => (
        <g key={t.x}>
          <rect className="sk-card" x={t.x} y={48} width={88} height={64} />
          <rect className="sk-icon sk-icon--accent" x={t.x + 10} y={58} width={10} height={10} />
          <Line x={t.x + 10} y={78} w={50} strong />
          <Line x={t.x + 10} y={88} w={64} />
          {t.badge ? <Word x={t.x + 78} y={67} size="sm" tone="warn" anchor="end">3</Word> : null}
        </g>
      ))}
      <rect className="sk-card" x={16} y={124} width={88} height={64} />
      <rect className="sk-icon" x={26} y={134} width={10} height={10} />
      <Line x={26} y={154} w={40} />
    </Sketch>
  );
}

export function TilePerTab() {
  const labels = ['requests', 'downloads', 'search', 'sources', 'clients', 'profiles'];
  return (
    <Sketch label="A home page with six tiles that all open the same app, one for each of its tabs, under a top bar that looks different from the apps'.">
      <Screen />
      <Line x={8} y={7} w={60} strong />
      <rect className="sk-button" x={230} y={3} width={60} height={10} />
      <rect className="sk-button" x={294} y={3} width={20} height={10} />
      {labels.map((l, i) => {
        const x = 16 + (i % 3) * 100;
        const y = 34 + Math.floor(i / 3) * 80;
        return (
          <g key={l}>
            <rect className="sk-card" x={x} y={y} width={88} height={66} />
            <rect className="sk-icon sk-icon--accent" x={x + 10} y={y + 10} width={10} height={10} />
            <Word x={x + 10} y={y + 36} size="xs" tone="strong">{l}</Word>
            <Line x={x + 10} y={y + 44} w={56} />
          </g>
        );
      })}
    </Sketch>
  );
}

/* 5 — calm and quick */

export function OneEmphasis() {
  const rows = Array.from({ length: 7 }, (_, i) => 50 + i * 20);
  return (
    <Sketch label="A list with one blue button for the next step at the top, and a small menu on each row.">
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={40} strong />
      <Line x={14} y={30} w={90} strong />
      <Button x={238} y={26} w={68} primary />
      <Button x={200} y={26} w={32} />
      {rows.map((y) => (
        <g key={y}>
          <Line x={14} y={y} w={150} />
          <Line x={14} y={y + 8} w={90} />
          <Dots x={292} y={y + 2} />
        </g>
      ))}
    </Sketch>
  );
}

export function EverythingShouts() {
  const rows = Array.from({ length: 7 }, (_, i) => 50 + i * 20);
  return (
    <Sketch label="A list where the toolbar and every row have blue buttons, so nothing stands out.">
      <Screen />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={40} strong />
      <Line x={14} y={30} w={60} strong />
      <Button x={158} y={26} w={46} primary />
      <Button x={208} y={26} w={46} primary />
      <Button x={258} y={26} w={48} primary />
      {rows.map((y) => (
        <g key={y}>
          <Line x={14} y={y} w={150} />
          <Line x={14} y={y + 8} w={90} />
          <Button x={234} y={y} w={34} primary />
          <Button x={272} y={y} w={34} primary />
        </g>
      ))}
    </Sketch>
  );
}
