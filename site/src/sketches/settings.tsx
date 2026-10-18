// storyboard drawings for settings and setup: an app's setup is found from
// three places and changed in one, the app itself.
import { Arrow, Chevron, Field, LabelButton, Line, Screen, Sketch, Status, Strip, Tile, Word } from './kit';

/** the app's own setup form: the one place it is changed. */
function SetupForm({ x, y, w = 130 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <rect className="sk-screen" x={x} y={y} width={w} height={122} />
      <Word x={x + 10} y={y + 16} size="xs" tone="strong">
        search sources
      </Word>
      <Field x={x + 10} y={y + 26} w={w - 20} label={36} value={50} />
      <Field x={x + 10} y={y + 52} w={w - 20} label={44} value={36} />
      <LabelButton x={x + w - 83} y={y + 98} text="save changes" primary />
    </g>
  );
}

export function ThreeWaysIn() {
  return (
    <Sketch h={238} label="Three ways in, one form. In settings, under addons, the downloads row says needs setup and has a configure button. On the launchpad, the downloads tile carries a needs setup badge. In the app, the setup group marks the views that need setup, and a message says so. Arrows lead from all three to the same form inside the app: search sources, with save changes.">
      <Word x={4} y={10} size="xs" tone="dim" mono={false}>
        In settings, under addons
      </Word>
      <rect className="sk-screen" x={4} y={15} width={150} height={52} />
      <Word x={12} y={30} size="xs" tone="strong">
        downloads
      </Word>
      <Status x={64} y={25.5} tone="warn" text="needs setup" glyph />
      <Line x={12} y={38} w={86} />
      <LabelButton x={90} y={48} text="configure" />
      <Word x={4} y={84} size="xs" tone="dim" mono={false}>
        On the launchpad
      </Word>
      <rect className="sk-screen" x={4} y={89} width={150} height={56} />
      <Tile x={12} y={96} w={132} h={42} name="downloads" icon={false} badge="needs setup" badgeTone="warn" />
      <Word x={4} y={162} size="xs" tone="dim" mono={false}>
        In the app
      </Word>
      <Screen x={4} y={167} w={150} h={68} bar={false} />
      <rect className="sk-side" x={4} y={167} width={56} height={68} />
      <Word x={10} y={180} size="xs" tone="dim">
        setup
      </Word>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="sk-icon" x={10} y={186 + i * 14} width={6} height={6} />
          <Line x={20} y={187 + i * 14} w={[22, 18, 24][i]} />
          {i < 2 ? <rect className="sk-fill-warn" x={50} y={187 + i * 14} width={4} height={4} /> : null}
        </g>
      ))}
      <Strip x={66} y={176} w={82} tone="warn" text={0.7} />
      <Line x={66} y={200} w={70} />
      <Line x={66} y={210} w={56} />
      <Arrow x1={158} y1={44} x2={186} y2={88} />
      <Arrow x1={158} y1={117} x2={186} y2={117} />
      <Arrow x1={158} y1={198} x2={186} y2={150} />
      <Word x={190} y={52} size="xs" tone="dim" mono={false}>
        One form, in the app
      </Word>
      <SetupForm x={188} y={58} />
    </Sketch>
  );
}

const ROWS: { name: string; tone: 'ok' | 'warn' | 'err'; state: string }[] = [
  { name: 'downloads', tone: 'warn', state: 'needs setup' },
  { name: 'catalog', tone: 'ok', state: 'ready' },
  { name: 'requests', tone: 'err', state: 'degraded' },
];

export function SetupChecklist() {
  return (
    <Sketch h={138} label="Settings, addons: a checklist with one row per app. Downloads needs setup, catalog is ready, requests is degraded. Each row has a one-line summary and a configure button.">
      <Screen h={136} />
      <Chevron x={8} y={5} />
      <Line x={20} y={7} w={36} strong />
      <Word x={12} y={34} size="md" tone="strong">
        addons
      </Word>
      {ROWS.map((r, i) => {
        const y = 44 + i * 30;
        return (
          <g key={r.name}>
            <rect className="sk-card" x={12} y={y} width={296} height={26} />
            <Word x={20} y={y + 11} size="xs" tone="strong">
              {r.name}
            </Word>
            <Status x={86} y={y + 6.5} tone={r.tone} text={r.state} glyph />
            <Line x={20} y={y + 17} w={[150, 110, 130][i]} />
            <LabelButton x={238} y={y + 7.5} text="configure" />
          </g>
        );
      })}
    </Sketch>
  );
}

export function ShellLinks() {
  return (
    <Sketch w={240} h={124} label="In settings, a row for the downloads app: needs setup, a summary, and a configure button. An arrow leads from the button out of settings and into the app, to its own search sources form.">
      <rect className="sk-screen" x={1} y={1} width={238} height={62} />
      <Word x={10} y={17} size="sm" tone="strong">
        addons
      </Word>
      <rect className="sk-card" x={10} y={26} width={220} height={28} />
      <Word x={18} y={37} size="xs" tone="strong">
        downloads
      </Word>
      <Status x={74} y={32.5} tone="warn" text="needs setup" glyph />
      <Line x={18} y={44} w={100} />
      <LabelButton x={164} y={34.5} text="configure" />
      <Arrow x1={192} y1={47} x2={192} y2={76} />
      <rect className="sk-screen" x={110} y={78} width={120} height={44} />
      <Word x={118} y={92} size="xs" tone="strong">
        search sources
      </Word>
      <rect className="sk-input" x={118} y={100} width={104} height={11} />
      <Word x={100} y={104} size="xs" tone="dim" mono={false} anchor="end">
        In the app
      </Word>
    </Sketch>
  );
}

export function ShellDrawsForm() {
  return (
    <Sketch w={240} h={110} label="In settings, a form for the downloads app drawn by the shell, with its connection details and two password fields.">
      <rect className="sk-screen" x={1} y={1} width={238} height={108} />
      <Word x={10} y={18} size="sm" tone="strong">
        addons / downloads
      </Word>
      <Field x={10} y={28} w={104} label={40} value={70} />
      <Field x={124} y={28} w={104} label={34} value={60} />
      <Line x={10} y={60} w={50} strong />
      <rect className="sk-input" x={10} y={67} width={104} height={11} />
      <Word x={14} y={75.5} size="xs" tone="strong">
        ••••••••••
      </Word>
      <Line x={124} y={60} w={44} strong />
      <rect className="sk-input" x={124} y={67} width={104} height={11} />
      <Word x={128} y={75.5} size="xs" tone="strong">
        ••••••••••••
      </Word>
      <LabelButton x={156} y={90} text="save changes" primary />
    </Sketch>
  );
}
