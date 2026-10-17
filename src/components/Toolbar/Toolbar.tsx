import * as React from 'react';
import { cx } from '../../lib/cx';
import { formatCount } from '../../lib/format';
import { useElementWidth } from '../../lib/useElementWidth';
import { Button } from '../Button/Button';
import { ActionMenu, type ActionMenuItem } from '../ActionMenu/ActionMenu';
import '../../lib/a11y.css';
import './Toolbar.css';

export interface ToolbarAction {
  id: string;
  /** a verb and its object, lowercase: "grab 8 selected". */
  label: string;
  onSelect: () => void;
  /** decoration before the label. */
  icon?: React.ReactNode;
  /** the one emphasized action of the toolbar. at most one. */
  emphasized?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** an action that deletes or cannot be undone. */
  danger?: boolean;
  /** always in the overflow menu, never inline. */
  overflow?: boolean;
}

export interface ToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** the toolbar's accessible name ("missing episodes"). */
  label: string;
  /** the left side: what the actions act on, often with a count. */
  heading?: React.ReactNode;
  /** emphasized first, then default actions, then the overflow menu. */
  actions?: ToolbarAction[];
  /** below this width (px) every non-emphasized action moves into the overflow menu. default 560. */
  collapseBelow?: number;
  /** the overflow trigger's accessible name. default "more actions". */
  overflowLabel?: string;
  /** extra content between the heading and the actions. */
  children?: React.ReactNode;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled])';

/**
 * Toolbar — a row of actions above the content they act on. one action may be
 * emphasized (primary); the others are default buttons, and whatever does not
 * fit — or is marked overflow — goes into a "more" menu. role=toolbar with one
 * tab stop: arrow keys move between its controls.
 */
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  {
    label,
    heading,
    actions = [],
    collapseBelow = 560,
    overflowLabel = 'more actions',
    className,
    children,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
  const width = useElementWidth(innerRef);
  const narrow = width != null && width < collapseBelow;
  const activeIndex = React.useRef(0);

  const emphasizedAll = actions.filter((a) => a.emphasized);
  React.useEffect(() => {
    if (emphasizedAll.length > 1 && typeof console !== 'undefined') {
      console.warn(`Toolbar "${label}": ${emphasizedAll.length} emphasized actions; only the first is emphasized.`);
    }
  }, [emphasizedAll.length, label]);
  const emphasized = emphasizedAll[0];

  // when the control that has focus goes away (clear, or the action for a
  // selection that is now empty), focus stays in the toolbar instead of
  // falling to the page.
  const focusWithin = React.useRef(false);
  React.useLayoutEffect(() => {
    const root = innerRef.current;
    if (!root || !focusWithin.current) return;
    const active = document.activeElement;
    if (!active || active === document.body) root.focus();
  });
  const others = actions.filter((a) => a !== emphasized);
  const inline = narrow ? [] : others.filter((a) => !a.overflow);
  const overflow = narrow ? others : others.filter((a) => a.overflow);

  // roving tabindex: exactly one control in the toolbar is in the tab order.
  React.useLayoutEffect(() => {
    const root = innerRef.current;
    if (!root) return;
    const list = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!list.length) return;
    const focused = list.indexOf(document.activeElement as HTMLElement);
    if (focused >= 0) activeIndex.current = focused;
    const current = Math.min(activeIndex.current, list.length - 1);
    list.forEach((el, i) => {
      el.tabIndex = i === current ? 0 : -1;
    });
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const target = e.target as HTMLElement;
    if (target.matches('input, select, textarea')) return;
    const list = Array.from(innerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const idx = list.indexOf(target);
    if (idx < 0) return;
    e.preventDefault();
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? list.length - 1
          : (idx + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length;
    list.forEach((el, i) => {
      el.tabIndex = i === next ? 0 : -1;
    });
    activeIndex.current = next;
    list[next]?.focus();
  };

  const menuItems: ActionMenuItem[] = overflow.map((a) => ({
    id: a.id,
    label: a.label,
    onSelect: a.onSelect,
    disabled: a.disabled || a.loading,
    icon: a.icon,
    danger: a.danger,
  }));

  return (
    <div
      ref={innerRef}
      role="toolbar"
      aria-label={label}
      tabIndex={-1}
      className={cx('nc-toolbar', narrow && 'nc-toolbar--narrow', className)}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        focusWithin.current = true;
      }}
      onBlur={(e) => {
        // a null relatedTarget is a control removed under the focus: still "within".
        if (e.relatedTarget && !innerRef.current?.contains(e.relatedTarget as Node)) focusWithin.current = false;
      }}
      {...rest}
    >
      {heading != null ? <div className="nc-toolbar__heading">{heading}</div> : null}
      {children}
      <div className="nc-toolbar__actions">
        {emphasized ? (
          <Button
            size="sm"
            variant={emphasized.danger ? 'danger' : 'primary'}
            leading={emphasized.icon}
            disabled={emphasized.disabled}
            loading={emphasized.loading}
            onClick={emphasized.onSelect}
          >
            {emphasized.label}
          </Button>
        ) : null}
        {inline.map((a) => (
          <Button
            key={a.id}
            size="sm"
            variant={a.danger ? 'danger' : 'default'}
            leading={a.icon}
            disabled={a.disabled}
            loading={a.loading}
            onClick={a.onSelect}
          >
            {a.label}
          </Button>
        ))}
        {menuItems.length ? <ActionMenu items={menuItems} label={overflowLabel} /> : null}
      </div>
    </div>
  );
});

export interface SelectionToolbarAction extends Omit<ToolbarAction, 'id' | 'emphasized' | 'overflow'> {}

export interface SelectionToolbarProps extends Omit<ToolbarProps, 'heading' | 'actions'> {
  /** how many items are selected. */
  selectedCount: number;
  /** shown on the left while nothing is selected: what the list holds ("2,500 missing"). */
  heading?: React.ReactNode;
  /**
   * the one emphasized action, given the selection: `(n) => ({ label: \`grab ${n} selected\`, … })`.
   * return null for no emphasized action (e.g. while nothing is selected).
   */
  primaryAction?: (selectedCount: number) => SelectionToolbarAction | null;
  /** the other actions; never emphasized. */
  actions?: ToolbarAction[];
  /** shows "clear" next to the count while something is selected. */
  onClearSelection?: () => void;
  /** the clear button's label. default "clear". */
  clearLabel?: string;
  /** offer to extend the selection, e.g. "select all 2,500" when only the visible rows are selected. */
  selectAll?: { label: string; onSelect: () => void } | null;
  /** how the count reads. default "8 selected". */
  formatSelected?: (selectedCount: number) => string;
}

/**
 * SelectionToolbar — the toolbar of a list whose rows can be selected. while
 * nothing is selected it shows the heading; once something is, it shows the
 * count, a clear button and the emphasized action for exactly that selection
 * ("grab 8 selected"). changes of the count are announced politely.
 */
export const SelectionToolbar = React.forwardRef<HTMLDivElement, SelectionToolbarProps>(
  function SelectionToolbar(
    {
      selectedCount,
      heading,
      primaryAction,
      actions = [],
      onClearSelection,
      clearLabel = 'clear',
      selectAll,
      formatSelected = (n) => `${formatCount(n)} selected`,
      className,
      ...rest
    },
    ref,
  ) {
    const primary = primaryAction?.(selectedCount) ?? null;
    const all: ToolbarAction[] = [
      ...(primary ? [{ ...primary, id: 'nc-selection-primary', emphasized: true }] : []),
      ...actions.map((a) => ({ ...a, emphasized: false })),
    ];
    const selected = selectedCount > 0;

    // announce changes of the selection, not its initial state.
    const [announcement, setAnnouncement] = React.useState('');
    const first = React.useRef(true);
    React.useEffect(() => {
      if (first.current) {
        first.current = false;
        return;
      }
      setAnnouncement(selected ? formatSelected(selectedCount) : 'selection cleared');
    }, [selectedCount]);

    return (
      <Toolbar
        ref={ref}
        className={cx('nc-seltoolbar', selected && 'nc-seltoolbar--active', className)}
        heading={
          <>
            {selected ? (
              <span className="nc-seltoolbar__count">
                <span className="nc-seltoolbar__number">{formatSelected(selectedCount)}</span>
                {onClearSelection ? (
                  <Button size="sm" variant="ghost" onClick={onClearSelection}>
                    {clearLabel}
                  </Button>
                ) : null}
                {selectAll ? (
                  <Button size="sm" variant="ghost" onClick={selectAll.onSelect}>
                    {selectAll.label}
                  </Button>
                ) : null}
              </span>
            ) : (
              heading
            )}
            <span className="nc-sr-only" aria-live="polite">
              {announcement}
            </span>
          </>
        }
        actions={all}
        {...rest}
      />
    );
  },
);
