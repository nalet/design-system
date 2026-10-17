// a button that opens a modal, built from plain data: the live half of the
// modal page's do and don't. the modal keeps its open state, and its footer
// takes elements, so it is written here. interactive: hydrate it
// (client:visible).
import { useCallback, useState } from 'react';
import { Button, Field, Input, Modal, type ButtonProps } from '@nalet/design-system';

interface DemoAction {
  label: string;
  variant?: ButtonProps['variant'];
}

interface DemoModalProps {
  /** the opener's label. */
  opener: string;
  openerVariant?: ButtonProps['variant'];
  title: string;
  /** one or two sentences for the body. */
  body?: string;
  /** a field with an input for each label. */
  fields?: string[];
  /** the footer's buttons, in order; each one closes the modal. */
  actions?: DemoAction[];
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
}

export function DemoModal({
  opener,
  openerVariant = 'default',
  title,
  body,
  fields = [],
  actions = [],
  closeOnEsc = true,
  closeOnBackdrop = true,
}: DemoModalProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <Button variant={openerVariant} onClick={() => setOpen(true)}>
        {opener}
      </Button>
      <Modal
        open={open}
        onClose={close}
        title={title}
        closeOnEsc={closeOnEsc}
        closeOnBackdrop={closeOnBackdrop}
        footer={
          actions.length
            ? actions.map((a) => (
                <Button key={a.label} variant={a.variant} onClick={close}>
                  {a.label}
                </Button>
              ))
            : undefined
        }
      >
        {body}
        {fields.length ? (
          <div style={{ display: 'grid', gap: 'var(--s-3)' }}>
            {fields.map((f) => (
              <Field key={f} label={f}>
                <Input />
              </Field>
            ))}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
