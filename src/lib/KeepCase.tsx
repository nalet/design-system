import * as React from 'react';
import { cx } from './cx';
import './case.css';

export interface KeepCaseProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * KeepCase — a name inside monospace chrome keeps its own capitals. Buttons,
 * dialog titles, tabs and status chips lowercase their label; a series title,
 * a language or an acronym inside one is wrapped in KeepCase so it reads as it
 * is written: "find <KeepCase>German</KeepCase> for 4 selected".
 */
export function KeepCase({ className, ...rest }: KeepCaseProps) {
  return <span className={cx('nc-keep-case', className)} {...rest} />;
}
