// storyboard drawings for the overlays: a dialog that is a sheet on a phone.
// like every sketch, it shows the idea, not the component, and says in its
// label what it shows.
import { Checkbox, Line, Sketch, Word } from './kit';

/** a dialog's parts inside a frame w wide: the title and close, three choices, and the footer's two buttons. */
function DialogParts({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <Line x={x + 6} y={y + 6} w={34} strong />
      <path className="sk-icon" d={`M${x + w - 11} ${y + 5} L${x + w - 6} ${y + 10} M${x + w - 6} ${y + 5} L${x + w - 11} ${y + 10}`} />
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 15} y2={y + 15} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Checkbox x={x + 6} y={y + 21 + i * 11} state={i === 0 ? 'on' : 'off'} />
          <Line x={x + 18} y={y + 22.5 + i * 11} w={[30, 38, 26][i]} />
        </g>
      ))}
      <line className="sk-rule" x1={x} x2={x + w} y1={y + 56} y2={y + 56} />
      <Line x={x + w - 48} y={y + 63} w={14} />
      <rect className="sk-button sk-button--primary" x={x + w - 30} y={y + 60} width={24} height={9} />
    </g>
  );
}

function Caption({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <Word x={x} y={y} size="xs" tone="dim" mono={false} anchor="middle">
      {children}
    </Word>
  );
}

export function SheetOnAPhone() {
  return (
    <Sketch h={186} label="One dialog twice: a title and a close button, three choices with checkboxes, and two buttons in its footer. In a wide window, it sits in the middle of the dimmed page, with room on every side. On a phone, it sits on the foot of the screen across its whole width, over the tabs, and the dimmed page shows above it.">
      {/* in a wide window: in the middle */}
      <rect className="sk-screen" x={4} y={26} width={186} height={118} />
      <rect className="sk-bar" x={4} y={26} width={186} height={12} />
      <Line x={10} y={30} w={28} strong />
      {[48, 66, 84, 102, 120].map((y) => (
        <rect key={y} className="sk-card" x={12} y={y} width={170} height={12} />
      ))}
      <rect className="sk-fade" x={4} y={26} width={186} height={118} />
      <rect className="sk-sheet" x={49} y={48} width={96} height={74} />
      <DialogParts x={49} y={48} w={96} />
      <Caption x={97} y={160}>
        In a wide window:
      </Caption>
      <Caption x={97} y={171}>
        in the middle
      </Caption>

      {/* on a phone: on the foot of the screen */}
      <rect className="sk-screen" x={226} y={4} width={72} height={140} />
      <rect className="sk-bar" x={226} y={4} width={72} height={14} />
      <Line x={232} y={9} w={20} strong />
      {[26, 44, 62, 80, 98].map((dy) => (
        <rect key={dy} className="sk-card" x={232} y={4 + dy} width={60} height={12} />
      ))}
      <line className="sk-rule" x1={226} x2={298} y1={130} y2={130} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} className={i === 0 ? 'sk-icon sk-icon--accent' : 'sk-icon'} x={232 + i * 13.5} y={134} width={6} height={6} />
      ))}
      <rect className="sk-fade" x={226} y={4} width={72} height={140} />
      <rect className="sk-sheet" x={226} y={70} width={72} height={74} />
      <DialogParts x={226} y={70} w={72} />
      <Caption x={262} y={160}>
        On a phone:
      </Caption>
      <Caption x={262} y={171}>
        on the foot of the screen
      </Caption>
    </Sketch>
  );
}
