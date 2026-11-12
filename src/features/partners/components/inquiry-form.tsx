'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect, useId, useRef, useState } from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import { ButtonLink, SlotText } from '@/components/ee/primitives';
import {
  BUDGET_LABELS,
  BUDGET_OPTIONS,
  EVENT_LABELS,
  EVENT_OPTIONS,
  inquirySchema,
  type InquiryInput,
  type InquiryResponse,
} from '@/features/partners/schema';
import { cn } from '@/lib/utils';
import type { InquiryContent, Link } from '@/services/content';

const ENDPOINT = '/api/partner-inquiry';

type Status = { kind: 'idle' } | { kind: 'error'; message: string } | { kind: 'sent' };

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: FieldError;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('fm-field', error && 'is-invalid')}>
      <label htmlFor={id} className="fm-label">
        {label}
        <span className="fm-req" aria-hidden="true">
          *
        </span>
      </label>
      {children}
      {error?.message ? (
        <p id={`${id}-error`} className="fm-error">
          {error.message}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="fm-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Partnership inquiry form (React Hook Form + the shared Zod schema).
 *
 * Posts to /api/partner-inquiry, which delivers to the CRM and Slack. Success is shown only
 * when the server confirms delivery; there is no simulated success. Double submissions are
 * blocked twice over: the button is disabled while a request is in flight, and every attempt
 * from this form carries the same submission id, which the server de-duplicates.
 */
export function InquiryForm({
  content,
  bookCall,
  contactEmail,
}: {
  content: InquiryContent;
  bookCall: Link | null;
  contactEmail: string;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const submissionId = useRef<string | null>(null);
  const inFlight = useRef(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: standardSchemaResolver(inquirySchema),
    defaultValues: { name: '', company: '', role: '', email: '', goals: '', events: [] },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (status.kind === 'sent') doneRef.current?.focus();
    if (status.kind === 'error') errorRef.current?.focus();
  }, [status]);

  const onValid = async (values: InquiryInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    submissionId.current ??= crypto.randomUUID();
    setStatus({ kind: 'idle' });

    const honeypot = (document.getElementById(id('website')) as HTMLInputElement | null)?.value ?? '';
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId: submissionId.current, website: honeypot }),
      });
      const data = (await response.json().catch(() => null)) as InquiryResponse | null;
      if (response.ok && data?.ok) {
        setStatus({ kind: 'sent' });
        return;
      }
      const error = data && !data.ok ? data.error : 'failed';
      setStatus({
        kind: 'error',
        message:
          error === 'unavailable'
            ? content.unavailableMessage
            : error === 'rate_limited'
              ? 'Too many attempts in a short time. Please wait a few minutes and try again.'
              : error === 'invalid'
                ? 'Some details could not be accepted. Please check the form and try again.'
                : content.errorMessage,
      });
    } catch {
      setStatus({ kind: 'error', message: content.errorMessage });
    } finally {
      inFlight.current = false;
    }
  };

  if (status.kind === 'sent') {
    return (
      <div ref={doneRef} className="fm-done" role="status" tabIndex={-1}>
        <span className="fm-done__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="18" height="18">
            <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <p className="fm-done__title">
          <SlotText text={content.successMessage} />
        </p>
        {bookCall ? (
          <div className="fm-done__next">
            <p className="fm-done__text">Want to lock in a time now?</p>
            <ButtonLink link={bookCall} />
          </div>
        ) : (
          <p className="fm-done__text">
            Anything to add? Email{' '}
            <a className="tlink" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          </p>
        )}
      </div>
    );
  }

  const describedBy = (name: keyof InquiryInput, hint = false) =>
    errors[name] ? `${id(name)}-error` : hint ? `${id(name)}-hint` : undefined;
  const busy = isSubmitting;

  return (
    <form
      className="fm"
      noValidate
      onSubmit={(event) => void handleSubmit(onValid)(event)}
      aria-busy={busy}
      aria-labelledby="pt-inq-title"
    >
      <p className="fm-note">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="fm-grid">
        <Field id={id('name')} label="Name" error={errors.name}>
          <input
            id={id('name')}
            className="fm-input"
            type="text"
            autoComplete="name"
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy('name')}
            {...register('name')}
          />
        </Field>
        <Field id={id('company')} label="Company" error={errors.company}>
          <input
            id={id('company')}
            className="fm-input"
            type="text"
            autoComplete="organization"
            aria-required="true"
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={describedBy('company')}
            {...register('company')}
          />
        </Field>
        <Field id={id('role')} label="Role" error={errors.role}>
          <input
            id={id('role')}
            className="fm-input"
            type="text"
            autoComplete="organization-title"
            aria-required="true"
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={describedBy('role')}
            {...register('role')}
          />
        </Field>
        <Field id={id('email')} label="Work email" error={errors.email}>
          <input
            id={id('email')}
            className="fm-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy('email')}
            {...register('email')}
          />
        </Field>

        <div className="fm-span">
          <Field
            id={id('goals')}
            label="What do you want to achieve?"
            error={errors.goals}
            hint="Audience, outcomes, timing: whatever helps us understand the fit."
          >
            <textarea
              id={id('goals')}
              className="fm-input fm-textarea"
              rows={5}
              aria-required="true"
              aria-invalid={errors.goals ? true : undefined}
              aria-describedby={describedBy('goals', true)}
              {...register('goals')}
            />
          </Field>
        </div>

        <fieldset
          className={cn('fm-span fm-set', errors.budget && 'is-invalid')}
          aria-describedby={errors.budget ? `${id('budget')}-error` : undefined}
        >
          <legend className="fm-label">
            Budget
            <span className="fm-req" aria-hidden="true">
              *
            </span>
          </legend>
          <div className="fm-chips">
            {BUDGET_OPTIONS.map((option) => (
              <label key={option} className="fm-chip">
                <input type="radio" value={option} required {...register('budget')} />
                <span>{BUDGET_LABELS[option]}</span>
              </label>
            ))}
          </div>
          {errors.budget?.message ? (
            <p id={`${id('budget')}-error`} className="fm-error">
              {errors.budget.message}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="fm-span fm-set">
          <legend className="fm-label">
            Events of interest <span className="fm-optional">Optional, choose any</span>
          </legend>
          <div className="fm-chips">
            {EVENT_OPTIONS.map((option) => (
              <label key={option} className="fm-chip fm-chip--check">
                <input type="checkbox" value={option} {...register('events')} />
                <span>{EVENT_LABELS[option]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field. */}
        <div className="fm-hp" aria-hidden="true">
          <label htmlFor={id('website')}>Website</label>
          <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
      </div>

      {status.kind === 'error' ? (
        <div ref={errorRef} className="fm-alert" role="alert" tabIndex={-1}>
          <p>{status.message}</p>
          <a className="tlink" href={`mailto:${contactEmail}?subject=Partnering%20with%20Elite%20Entrepreneurs`}>
            {contactEmail}
          </a>
        </div>
      ) : null}

      <div className="fm-actions">
        <button type="submit" className="btn btn--primary fm-submit" disabled={busy} aria-disabled={busy}>
          <span className="btn__label">{busy ? 'Sending…' : content.submitLabel}</span>
          <span className="btn__chip" aria-hidden="true">
            {busy ? (
              <span className="fm-spinner" />
            ) : (
              <svg viewBox="0 0 16 16" className="btn__icon">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
