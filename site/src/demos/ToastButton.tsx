// a button that raises a toast: the live half of the examples about toasts.
// its props are plain values, so a page can hydrate it (client:visible).
import { Button, toast, type ButtonProps, type ObjectState } from '@nalet/design-system';

interface ToastButtonProps {
  /** the button's label. */
  label: string;
  /** what the toast says. */
  message: string;
  state?: ObjectState;
  /** a fixed id: pressing again replaces the toast instead of stacking another. */
  id?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
}

export function ToastButton({ label, message, state, id, variant, size }: ToastButtonProps) {
  return (
    <Button variant={variant} size={size} onClick={() => toast(message, { state, id })}>
      {label}
    </Button>
  );
}
