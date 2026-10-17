import * as React from 'react';
import { cx } from '../../lib/cx';
import { FilterTabs, filterTabId, type FilterTab } from '../../components/FilterTabs/FilterTabs';
import './Worklist.css';

export interface WorklistProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** what the list is, lowercase: "missing". */
  title: React.ReactNode;
  /** one line on what is in it and why: "aired, monitored and not in the library". */
  subtitle?: React.ReactNode;
  /** the title's heading level. 1 when the worklist is the page; 2 inside an app shell that owns the h1. */
  headingLevel?: 1 | 2 | 3;
  /** a quiet line of facts under the subtitle (last checked, what runs on its own). */
  headerInfo?: React.ReactNode;
  /** page-level actions, top right. rare: list actions belong in the toolbar. */
  headerActions?: React.ReactNode;

  /** key-figure tabs that filter the list ("needs attention 3"). */
  tabs?: FilterTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  /** the tablist's accessible name. default "filter the list". */
  tabsLabel?: string;

  /** at most one or two message strips about the list as a whole. */
  messages?: React.ReactNode;
  /** a FilterBar. */
  filterBar?: React.ReactNode;
  /** a Toolbar or SelectionToolbar, attached to the top of the table. */
  toolbar?: React.ReactNode;
  /** the toolbar sticks to the top while the list scrolls, and the table header under it. default true. */
  stickyToolbar?: boolean;
  /** the DataTable — or the IllustratedMessage when there is nothing to show. */
  children: React.ReactNode;
}

/**
 * Worklist — the floorplan for "the things that need doing": a header, key
 * figures as filter tabs, an optional message strip, a filter bar, a toolbar
 * with the one emphasized action, and the table (or its empty state). the tabs
 * and the content are a tablist and its tabpanel; the toolbar and the table
 * header stay in view while the list scrolls.
 */
export const Worklist = React.forwardRef<HTMLElement, WorklistProps>(function Worklist(
  {
    title,
    subtitle,
    headingLevel = 1,
    headerInfo,
    headerActions,
    tabs,
    activeTab,
    onTabChange,
    tabsLabel = 'filter the list',
    messages,
    filterBar,
    toolbar,
    stickyToolbar = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  const titleId = React.useId();
  const tabPrefix = React.useId();
  const panelId = React.useId();
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = React.useState(0);
  const Heading = `h${headingLevel}` as React.ElementType;
  const hasTabs = !!tabs?.length && activeTab != null;

  // the table header sticks just under the sticky toolbar: measure it.
  React.useLayoutEffect(() => {
    const el = toolbarRef.current;
    if (!el || !stickyToolbar || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setToolbarHeight(el.offsetHeight));
    ro.observe(el);
    setToolbarHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [stickyToolbar, toolbar]);

  return (
    <section ref={ref} aria-labelledby={titleId} className={cx('nc-worklist', className)} {...rest}>
      <header className="nc-worklist__header">
        <div className="nc-worklist__titles">
          <Heading id={titleId} className="nc-worklist__title">
            {title}
          </Heading>
          {subtitle != null ? <p className="nc-worklist__subtitle">{subtitle}</p> : null}
          {headerInfo != null ? <div className="nc-worklist__info">{headerInfo}</div> : null}
        </div>
        {headerActions != null ? <div className="nc-worklist__header-actions">{headerActions}</div> : null}
      </header>

      {hasTabs ? (
        <FilterTabs
          className="nc-worklist__tabs"
          tabs={tabs!}
          value={activeTab!}
          onChange={(id) => onTabChange?.(id)}
          label={tabsLabel}
          panelId={panelId}
          idPrefix={tabPrefix}
        />
      ) : null}

      <div
        id={panelId}
        role={hasTabs ? 'tabpanel' : undefined}
        aria-labelledby={hasTabs ? filterTabId(tabPrefix, activeTab!) : undefined}
        className="nc-worklist__panel"
        style={{ ['--nc-dt-sticky-top' as string]: stickyToolbar && toolbar ? `${toolbarHeight}px` : '0px' }}
      >
        {messages != null ? <div className="nc-worklist__messages">{messages}</div> : null}
        {filterBar != null ? <div className="nc-worklist__filters">{filterBar}</div> : null}
        <div className="nc-worklist__content">
          {toolbar != null ? (
            <div ref={toolbarRef} className={cx('nc-worklist__toolbar', stickyToolbar && 'nc-worklist__toolbar--sticky')}>
              {toolbar}
            </div>
          ) : null}
          <div className="nc-worklist__body">{children}</div>
        </div>
      </div>
    </section>
  );
});
