import * as React from 'react';
import { cx } from '../../lib/cx';
import './Avatar.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The person's name. The initials come from it, and it is what a screen reader says for the avatar. */
  name: string;
  /** The person's picture. It is cropped to a square. Without one, or when it can't be loaded, the initials show. */
  src?: string;
  /** The person's initials, where the ones made from the name aren't theirs. */
  initials?: string;
  /** The height of a control: sm 28, md 34 (the default), lg 42. */
  size?: AvatarSize;
  /**
   * Decoration: beside the person's name, or inside a button that has a name
   * of its own. Assistive technology then skips the avatar.
   */
  decorative?: boolean;
}

/**
 * The initials of a name: the first letter of its first and of its last word,
 * in lowercase, as monospace chrome is written. A name of one word gives one
 * letter.
 */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : '';
  return (first + last).toLowerCase();
}

/**
 * Avatar — the square that stands for a person: their picture, cropped to a
 * square, or their initials. It is a picture named after the person; inside a
 * button, or beside the name, it is decoration.
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, initials, size = 'md', decorative = false, className, ...rest },
  ref,
) {
  // a picture that can't be loaded gives way to the initials; a new one gets its own try.
  const [failed, setFailed] = React.useState<string | null>(null);
  const picture = src && failed !== src ? src : null;
  const letters = (initials ?? initialsOf(name)).toLowerCase();

  return (
    <span
      ref={ref}
      className={cx('nc-avatar', `nc-avatar--${size}`, className)}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      {picture ? (
        <img className="nc-avatar__picture" src={picture} alt="" onError={() => setFailed(picture)} />
      ) : (
        <span className="nc-avatar__initials" aria-hidden="true">
          {letters}
        </span>
      )}
    </span>
  );
});
