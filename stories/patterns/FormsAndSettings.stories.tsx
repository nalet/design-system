import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Field,
  Heading,
  Input,
  MessageStrip,
  ObjectStatus,
  Select,
  Stack,
  Switch,
  Text,
  Toaster,
  toast,
} from '../../src';

/**
 * forms and settings — a settings page built from the real components:
 * switches that apply at once, a form that waits for save, one footer with one
 * emphasized action, errors on save, and what to say afterwards.
 */

const meta: Meta = {
  title: 'Patterns/forms and settings',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'switches for what applies at once, a form for what waits for save, one footer, errors on save.',
      },
    },
  },
  decorators: [
    (Story, { viewMode }) => (
      <>
        <Story />
        {/* the docs page mounts one toaster for all its examples; a story on its own mounts this one. */}
        {viewMode === 'story' ? <Toaster /> : null}
      </>
    ),
  ],
};
export default meta;

type Story = StoryObj;

interface Values {
  host: string;
  compression: string;
  retention: string;
  databases: boolean;
  volumes: boolean;
  configuration: boolean;
  times: 'local' | 'utc';
}

type Checked = 'host' | 'retention';
type Errors = Partial<Record<Checked, string>>;

const SAVED: Values = {
  host: 'storage-01.example.com',
  compression: 'fast',
  retention: '14',
  databases: true,
  volumes: true,
  configuration: false,
  times: 'local',
};

/** the field labels, so the summary names what needs a fix in the same words. */
const LABELS: Record<Checked, string> = { host: 'backup host', retention: 'retention (days)' };
const ORDER: Checked[] = ['host', 'retention'];

const HOST = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

function check(field: Checked, v: Values): string | undefined {
  if (field === 'host') {
    const host = v.host.trim().toLowerCase();
    if (!host) return 'enter a host name, such as storage-01.example.com';
    if (!HOST.test(host)) return 'use a full host name, such as storage-01.example.com';
  }
  if (field === 'retention') {
    const days = v.retention.trim();
    if (!/^\d+$/.test(days) || Number(days) < 1 || Number(days) > 90) return 'use a whole number from 1 to 90';
  }
  return undefined;
}

function validate(v: Values): Errors {
  const errors: Errors = {};
  for (const field of ORDER) {
    const message = check(field, v);
    if (message) errors[field] = message;
  }
  return errors;
}

const same = (a: Values, b: Values) => (Object.keys(a) as (keyof Values)[]).every((k) => a[k] === b[k]);

const and = (names: string[]) =>
  names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

const cardTitle: CSSProperties = { margin: 0, font: 'inherit' };
const fieldset: CSSProperties = { border: 0, margin: 0, padding: 0, minWidth: 0 };
const legend: CSSProperties = {
  padding: 0,
  marginBottom: 'var(--s-2)',
  fontFamily: 'var(--ff-ui)',
  fontWeight: 500,
  fontSize: 13,
  lineHeight: 1.4,
  color: 'var(--fg-2)',
};

interface SettingsPageProps {
  /** show the page title and the card of instant settings above the form. */
  page?: boolean;
  /** values that differ from the saved ones when the example starts. */
  start?: Partial<Values>;
  /** start as if a save had just found these values wrong. */
  startWithErrors?: boolean;
  /** start as if the last save had failed on the server. */
  startFailed?: boolean;
  /** the form's title, which also names it. each example on a page needs its own. */
  title?: string;
}

function SettingsPage({
  page = true,
  start,
  startWithErrors = false,
  startFailed = false,
  title = 'backups',
}: SettingsPageProps) {
  const [saved, setSaved] = useState<Values>(SAVED);
  const [values, setValues] = useState<Values>({ ...SAVED, ...start });
  const [errors, setErrors] = useState<Errors>(() => (startWithErrors ? validate({ ...SAVED, ...start }) : {}));
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(startFailed);
  const [pageChanged, setPageChanged] = useState<Values['times'] | null>(null);
  // a strip that is there when the example first renders is a frozen state, not
  // news: keep it quiet (as the other docs examples do) until the person acts.
  const [live, setLive] = useState<'off' | undefined>(startWithErrors || startFailed ? 'off' : undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const wasSaving = useRef(false);
  const titleId = useId();
  const dirty = !same(values, saved);

  // after a save that found errors: focus the first invalid control, in reading
  // order. field marks it with aria-invalid, so the form can find it.
  useEffect(() => {
    if (attempt) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [attempt]);

  // `loading` disables the save button, and a disabled button cannot keep
  // focus. when the save ends, put focus back on save if it fell to the page.
  useEffect(() => {
    if (wasSaving.current && !saving && (document.activeElement == null || document.activeElement === document.body)) {
      saveRef.current?.focus();
    }
    wasSaving.current = saving;
  }, [saving]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    setLive(undefined);
    // a field that shows an error is checked again on every change, so the
    // error goes as soon as the value is right.
    if (key in errors) {
      const field = key as Checked;
      const message = check(field, next);
      setErrors((current) => {
        const updated = { ...current };
        if (message) updated[field] = message;
        else delete updated[field];
        return updated;
      });
    }
  };

  const save = () => {
    setLive(undefined);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setFailed(false);
      setAttempt((n) => n + 1);
      return;
    }
    if (!dirty) {
      toast('no changes to save', { id: 'backup-settings' });
      return;
    }
    setFailed(false);
    setSaving(true);
    // a stand-in for the request.
    window.setTimeout(() => {
      setSaving(false);
      const timesChanged = values.times !== saved.times;
      setSaved(values);
      if (timesChanged) setPageChanged(values.times);
      else toast('settings saved', { state: 'success', id: 'backup-settings' });
    }, 700);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!saving) save();
  };

  const cancel = () => {
    setValues(saved);
    setErrors({});
    setFailed(false);
  };

  const wrong = ORDER.filter((field) => errors[field]);

  const form = (
    <form ref={formRef} noValidate aria-labelledby={titleId} onSubmit={onSubmit}>
      <Card
        header={
          <h3 id={titleId} style={cardTitle}>
            {title}
          </h3>
        }
        footer={
          <Stack direction="horizontal" gap={8} align="center" justify="end" wrap>
            {dirty ? (
              <ObjectStatus appearance="text" state="information">
                unsaved changes
              </ObjectStatus>
            ) : null}
            <Button variant="ghost" onClick={cancel} disabled={saving}>
              cancel
            </Button>
            <Button ref={saveRef} type="submit" variant="primary" loading={saving}>
              save changes
            </Button>
          </Stack>
        }
      >
        <Stack gap={24}>
          {wrong.length ? (
            <MessageStrip state="error" live={live}>
              couldn&apos;t save. {wrong.length === 1 ? '1 setting needs' : `${wrong.length} settings need`} a fix:{' '}
              {and(wrong.map((field) => LABELS[field]))}.
            </MessageStrip>
          ) : null}
          {failed ? (
            <MessageStrip
              state="error"
              live={live}
              actions={
                <Button size="sm" variant="ghost" onClick={save}>
                  try again
                </Button>
              }
              details="the settings service answered 503 service unavailable"
            >
              couldn&apos;t save the settings. your changes are still here.
            </MessageStrip>
          ) : null}
          <Stack gap={16}>
            <Field label={LABELS.host} hint="a full host name, such as storage-01.example.com" error={errors.host}>
              <Input
                value={values.host}
                required
                spellCheck={false}
                onChange={(e) => set('host', e.target.value)}
              />
            </Field>
            <Field label="compression" hint="small takes longer and uses less storage">
              <Select
                value={values.compression}
                onChange={(e) => set('compression', e.target.value)}
                options={[
                  { label: 'fast', value: 'fast' },
                  { label: 'small', value: 'small' },
                  { label: 'none', value: 'none' },
                ]}
              />
            </Field>
            <Field label={LABELS.retention} hint="how long a backup is kept, from 1 to 90 days" error={errors.retention}>
              <Input
                value={values.retention}
                required
                inputMode="numeric"
                onChange={(e) => set('retention', e.target.value)}
              />
            </Field>
          </Stack>
          <fieldset style={fieldset}>
            <legend style={legend}>back up</legend>
            <Stack gap={8}>
              <Checkbox label="databases" checked={values.databases} onChange={(e) => set('databases', e.target.checked)} />
              <Checkbox label="volumes" checked={values.volumes} onChange={(e) => set('volumes', e.target.checked)} />
              <Checkbox
                label="configuration"
                checked={values.configuration}
                onChange={(e) => set('configuration', e.target.checked)}
              />
            </Stack>
          </fieldset>
          <Field label="show times in" hint="for every time on this page">
            <Select
              value={values.times}
              onChange={(e) => set('times', e.target.value === 'utc' ? 'utc' : 'local')}
              options={[
                { label: 'local time', value: 'local' },
                { label: 'utc', value: 'utc' },
              ]}
            />
          </Field>
        </Stack>
      </Card>
    </form>
  );

  if (!page) return <div style={{ width: '100%', maxWidth: 560 }}>{form}</div>;

  return (
    <div style={{ display: 'grid', gap: 'var(--s-5)', width: '100%', maxWidth: 560 }}>
      <Stack gap={4}>
        {/* in an app this is the page's h1; here the docs page owns the h1. */}
        <Heading level={2}>backup settings</Heading>
        <Text variant="muted">last backup: today at {saved.times === 'utc' ? '00:00 utc' : '02:00 local time'}</Text>
      </Stack>
      {pageChanged ? (
        <MessageStrip state="success" onDismiss={() => setPageChanged(null)}>
          saved. times on this page now show in {pageChanged === 'utc' ? 'utc' : 'local time'}.
        </MessageStrip>
      ) : null}
      <Card
        header={
          <h3 style={cardTitle}>alerts</h3>
        }
      >
        <Field hint="a mail to you when a backup fails">
          <Switch
            label="email alerts"
            defaultChecked
            onChange={(e) => toast(e.target.checked ? 'email alerts on' : 'email alerts off', { id: 'email-alerts' })}
          />
        </Field>
      </Card>
      {form}
    </div>
  );
}

/** the whole page: change a value, save with an error, fix it, save; switch the times to utc and save. */
export const Settings: Story = {
  name: 'settings page',
  render: () => <SettingsPage />,
};

/** right after a save that found two wrong values: the summary at the top, each error at its field. */
export const FailedValidation: Story = {
  name: 'after a save with errors',
  render: () => (
    <SettingsPage page={false} title="backups, after a save with errors" start={{ host: 'storage-01', retention: '120' }} startWithErrors />
  ),
};

/** right after a save the server refused: the values are kept, and "try again" sends them again. */
export const SaveFails: Story = {
  name: 'when the save fails',
  render: () => <SettingsPage page={false} title="backups, when saving fails" start={{ retention: '30' }} startFailed />,
};
