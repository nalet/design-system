// storyboard drawings for the shell bar: one bar across the top of every
// screen, with the product's name, the app's name, notifications and one
// user menu.
import { Bell, Callout, Chevron, Chip, LabelButton, Line, Pointer, Sketch, Word } from './kit';

/** the avatar: a square with the person's initials. */
function Avatar({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect className="sk-avatar" x={x} y={y} width={16} height={14} />
      <Word x={x + 8} y={y + 10} size="xs" tone="strong" anchor="middle">
        au
      </Word>
    </g>
  );
}

/** the shell bar, w wide, with its top edge at y. */
function Bar({ x = 1, y = 1, w = 318, app = 'downloads', search = true, count = '2' }: { x?: number; y?: number; w?: number; app?: string; search?: boolean; count?: string }) {
  const right = x + w;
  return (
    <g>
      <rect className="sk-bar" x={x} y={y} width={w} height={22} />
      <line className="sk-rule" x1={x} x2={right} y1={y + 22} y2={y + 22} />
      <Chevron x={x + 8} y={y + 7.5} s={7} />
      <Line x={x + 20} y={y + 9} w={34} strong />
      {app ? (
        <g>
          <Word x={x + 60} y={y + 14.5} size="xs" tone="dim">
            /
          </Word>
          <Word x={x + 68} y={y + 14.5} size="xs" tone="strong">
            {app}
          </Word>
        </g>
      ) : null}
      {search ? (
        <g>
          <rect className="sk-planned" x={right - 76} y={y + 4} width={14} height={14} />
          <rect className="sk-lens" x={right - 72} y={y + 8} width={4} height={4} />
          <line className="sk-lens" x1={right - 68} y1={y + 12} x2={right - 66.5} y2={y + 13.5} />
        </g>
      ) : null}
      <Bell x={right - 54} y={y + 6} />
      {count ? <Chip x={right - 42} y={y + 6} text={count} tone="info" /> : null}
      <Avatar x={right - 22} y={y + 4} />
    </g>
  );
}

export function ShellBarOverview() {
  return (
    <Sketch h={150} label="An app inside the shell. Across the top, the shell bar: the chevron and the product's name, a slash and the app's name, downloads; on the right a search button drawn dashed because it is planned, a bell with 2 unread, and a square with the initials au.">
      <rect className="sk-screen" x={1} y={1} width={318} height={148} />
      <Bar />
      <rect className="sk-side" x={1} y={24} width={80} height={125} />
      {[36, 48, 60, 72, 92, 104].map((y, i) => (
        <g key={y}>
          <rect className="sk-icon" x={10} y={y} width={6} height={6} />
          <Line x={22} y={y + 1} w={[40, 32, 36, 28, 34, 30][i]} />
        </g>
      ))}
      <Line x={96} y={38} w={90} strong />
      {[52, 74, 96, 118].map((y) => (
        <rect key={y} className="sk-card" x={96} y={y} width={208} height={16} />
      ))}
    </Sketch>
  );
}

export function ShellBarAnatomy() {
  return (
    <Sketch h={84} label="The shell bar, close up: 1 the product's name, led by the chevron; 2 the app's name; 3 search, planned; 4 notifications, with 2 unread; 5 the user menu.">
      <Bar x={8} y={28} w={304} />
      <Callout x={36} y={12} n={1} />
      <Pointer x1={36} y1={18} x2={36} y2={34} />
      <Callout x={90} y={12} n={2} />
      <Pointer x1={90} y1={18} x2={90} y2={36} />
      <Callout x={243} y={70} n={3} />
      <Pointer x1={243} y1={64} x2={243} y2={47} />
      <Callout x={268} y={70} n={4} />
      <Pointer x1={268} y1={64} x2={268} y2={44} />
      <Callout x={298} y={70} n={5} />
      <Pointer x1={298} y1={64} x2={298} y2={47} />
    </Sketch>
  );
}

export function UserMenuOpen() {
  const items = ['account', 'settings', 'help'];
  return (
    <Sketch h={156} label="The user menu, open below the avatar: at the top, the person's name and email address; then account, settings and help; and, set apart at the bottom, sign out.">
      <rect className="sk-screen" x={1} y={1} width={318} height={154} />
      <Bar app="" search={false} count="" />
      <rect className="sk-sheet" x={176} y={26} width={138} height={122} />
      <Line x={186} y={36} w={70} strong />
      <Line x={186} y={45} w={100} />
      <line className="sk-rule" x1={176} x2={314} y1={55} y2={55} />
      {items.map((t, i) => (
        <g key={t}>
          <rect className="sk-icon" x={186} y={63 + i * 18} width={7} height={7} />
          <Word x={200} y={70 + i * 18} size="xs" tone="strong">
            {t}
          </Word>
        </g>
      ))}
      <line className="sk-rule" x1={176} x2={314} y1={118} y2={118} />
      <rect className="sk-icon" x={186} y={128} width={7} height={7} />
      <Word x={200} y={135} size="xs" tone="strong">
        sign out
      </Word>
    </Sketch>
  );
}

export function ConsumerBar() {
  const nav = ['home', 'films', 'series'];
  return (
    <Sketch h={40} label="A shell bar in a product for consumers: the product's name on the left, its own navigation, home, films and series, in the middle, and the same bell and user menu on the right.">
      <rect className="sk-bar" x={1} y={9} width={318} height={22} />
      <Chevron x={9} y={16.5} s={7} />
      <Line x={21} y={18} w={34} strong />
      {nav.map((t, i) => (
        <g key={t}>
          <Word x={96 + i * 46} y={23.5} size="xs" tone={i === 0 ? 'accent' : 'strong'}>
            {t}
          </Word>
          {i === 0 ? <rect className="sk-fill-info" x={96} y={27} width={20} height={2} /> : null}
        </g>
      ))}
      <Bell x={265} y={15} />
      <Avatar x={297} y={13} />
    </Sketch>
  );
}

export function ShellBarDo() {
  return (
    <Sketch w={240} h={40} label="A shell bar with the product's name, the app's name, a bell with 2 unread and a square avatar with initials.">
      <Bar x={4} y={9} w={232} search={false} />
    </Sketch>
  );
}

export function ShellBarDont() {
  return (
    <Sketch w={240} h={40} label="A shell bar with an email address shown as a badge, a separate sign out button, and a round avatar.">
      <rect className="sk-bar" x={4} y={9} width={232} height={22} />
      <Chevron x={11} y={16.5} s={7} />
      <Line x={23} y={18} w={34} strong />
      <rect className="sk-chip" x={90} y={14} width={62} height={12} />
      <Line x={95} y={18} w={52} />
      <LabelButton x={158} y={14.5} text="sign out" />
      <circle className="sk-avatar" cx={225} cy={20} r={7} />
    </Sketch>
  );
}
