// storyboard drawings for message handling: each message in the one place
// that fits what it is about and how long it is true.
import type { ReactNode } from 'react';
import { Callout, Chevron, Glyph, Input, LabelButton, Line, Pointer, Screen, Sketch, Status, Strip, Toast, Word } from './kit';

export function FourPlaces() {
  return (
    <Sketch w={344} h={212} label="A screen with four kinds of message: 1 an amber message strip above the list, about the list as a whole; 2 a red status on one row; 3 a red error under one field in the panel on the right; 4 a short message in the corner: 8 episodes queued.">
      <Screen x={24} w={296} h={208} />
      <Chevron x={31} y={5} />
      <Line x={43} y={7} w={36} strong />
      <Line x={34} y={30} w={80} strong />
      <Strip x={34} y={40} w={170} tone="warn" text={0.6} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <Line x={36} y={70 + i * 18} w={[60, 46, 54, 40, 50, 56][i]} strong />
          {i === 1 ? <Status x={112} y={69.5 + i * 18} tone="err" text="needs attention" glyph /> : <Status x={112} y={69.5 + i * 18} tone="neutral" text="missing" glyph />}
          <line className="sk-rule" x1={34} x2={204} y1={78 + i * 18} y2={78 + i * 18} />
        </g>
      ))}
      <rect className="sk-side" x={212} y={17} width={107} height={191} />
      <Line x={220} y={32} w={60} strong />
      <Line x={220} y={50} w={40} strong />
      <Input x={220} y={57} w={90} invalid />
      <Word x={224} y={65.5} size="xs" tone="strong">
        fifty
      </Word>
      <Word x={220} y={80} size="xs" tone="err" mono={false}>
        Use a number
      </Word>
      <Line x={220} y={96} w={46} strong />
      <Input x={220} y={103} w={90} />
      <Toast x={196} y={180} w={118} lines={['8 episodes queued']} />
      <Callout x={10} y={48} n={1} />
      <Pointer x1={16} y1={48} x2={33} y2={48} />
      <Callout x={99} y={90} n={2} />
      <Callout x={334} y={77} n={3} />
      <Pointer x1={328} y1={77} x2={276} y2={77} />
      <Callout x={334} y={189} n={4} />
      <Pointer x1={328} y1={189} x2={315} y2={189} />
    </Sketch>
  );
}

export function StaleData() {
  return (
    <Sketch h={128} label="A list whose refresh failed. An amber strip says: Couldn't refresh the list; it shows what was loaded 4 minutes ago, with a try again button. The rows from before are still there.">
      <rect className="sk-screen" x={1} y={1} width={318} height={126} />
      <Line x={12} y={14} w={70} strong />
      <rect className="sk-strip sk-strip--warn" x={12} y={24} width={296} height={30} />
      <rect className="sk-fill-warn" x={12} y={24} width={2} height={30} />
      <Glyph x={19} y={30} tone="warn" />
      <Word x={31} y={36} size="xs" tone="strong" mono={false}>
        Couldn't refresh the list; it shows what
      </Word>
      <Word x={31} y={47} size="xs" tone="strong" mono={false}>
        was loaded 4 minutes ago.
      </Word>
      <LabelButton x={248} y={33.5} text="try again" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Line x={14} y={66 + i * 14} w={[90, 70, 84, 64][i]} strong />
          <Status x={196} y={65.5 + i * 14} tone="neutral" text="missing" glyph />
        </g>
      ))}
    </Sketch>
  );
}

/* ---- do and don't ------------------------------------------------------------------ */

function Page({ children, label }: { children: ReactNode; label: string }) {
  return (
    <Sketch w={240} h={110} label={label}>
      <rect className="sk-screen" x={1} y={1} width={238} height={108} />
      <Line x={12} y={12} w={70} strong />
      {children}
    </Sketch>
  );
}

function Rows({ y, n = 4 }: { y: number; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <Line x={14} y={y + i * 14} w={[90, 70, 84, 64, 76][i]} strong />
          <Line x={150} y={y + i * 14} w={40} />
        </g>
      ))}
    </g>
  );
}

export function ErrorStrip() {
  return (
    <Page label="A red error strip above the list: Couldn't queue the grab, with details one click away.">
      <rect className="sk-strip sk-strip--err" x={10} y={22} width={220} height={18} />
      <rect className="sk-fill-err" x={10} y={22} width={2} height={18} />
      <Glyph x={17} y={28} tone="err" />
      <Word x={29} y={34} size="xs" tone="strong" mono={false}>
        Couldn't queue the grab.
      </Word>
      <Word x={222} y={34} size="xs" tone="dim" anchor="end">
        details ▸
      </Word>
      <Rows y={52} />
    </Page>
  );
}

export function ErrorToast() {
  return (
    <Page label="An error shown in a short message in the corner, Error 503: service unavailable, which leaves after a few seconds.">
      <Rows y={26} />
      <Toast x={100} y={78} w={130} tone="err" lines={['Error 503: service', 'unavailable']} />
    </Page>
  );
}

export function ResultToast() {
  return (
    <Page label="After an action, a short message in the corner says 8 episodes queued; it leaves on its own.">
      <Rows y={26} />
      <Toast x={120} y={84} w={110} lines={['8 episodes queued']} />
    </Page>
  );
}

export function StripForever() {
  return (
    <Page label="A green strip above the list that says: Success! Your grab request was submitted successfully. It stays on the page.">
      <rect className="sk-strip sk-strip--ok" x={10} y={22} width={220} height={18} />
      <rect className="sk-fill-ok" x={10} y={22} width={2} height={18} />
      <Glyph x={17} y={28} tone="ok" />
      <Word x={29} y={34} size="xs" tone="strong" mono={false}>
        Success! Your grab request was submitted…
      </Word>
      <Rows y={52} />
    </Page>
  );
}
