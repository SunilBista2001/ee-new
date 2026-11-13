'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { PodcastNotifyContent } from '@/services/content';
import { notifySchema, type NotifyInput, type NotifyResponse } from '../schema';

const ENDPOINT = '/api/podcast-notify';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

/**
 * Launch-list sign-up. Posts to /api/podcast-notify and shows success only when the server
 * confirms the address was accepted. One submission at a time: the button locks while a
 * request is in flight, and a retry reuses the same submission id so the server can de-duplicate.
 */
export function NotifyForm({ copy }: { copy: PodcastNotifyContent }) {
  const uid = useId();
  const inputId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const noteId = `${uid}-note`;
  const submissionId = useRef<string | null>(null);
  const inFlight = useRef(false);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NotifyInput>({
    resolver: standardSchemaResolver(notifySchema),
    defaultValues: { email: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (status.kind === 'sent') doneRef.current?.focus();
  }, [status]);

  const onValid = async (values: NotifyInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    submissionId.current ??= crypto.randomUUID();
    setStatus({ kind: 'sending' });

    const honeypot = (document.getElementById(`${uid}-website`) as HTMLInputElement | null)?.value ?? '';
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submissionId: submissionId.current, website: honeypot }),
      });
      const data = (await response.json().catch(() => null)) as NotifyResponse | null;
      if (response.ok && data?.ok) {
        setStatus({ kind: 'sent' });
        return;
      }
      const error = data && !data.ok ? data.error : 'failed';
      setStatus({
        kind: 'error',
        message:
          error === 'unavailable'
            ? copy.unavailableMessage
            : error === 'rate_limited'
              ? 'Too many attempts in a short time. Please wait a few minutes and try again.'
              : error === 'invalid'
                ? 'That address could not be accepted. Please check it and try again.'
                : copy.errorMessage,
      });
    } catch {
      setStatus({ kind: 'error', message: copy.errorMessage });
    } finally {
      inFlight.current = false;
    }
  };

  if (status.kind === 'sent') {
    return (
      <p ref={doneRef} className="pc-form__done" role="status" tabIndex={-1}>
        <span className="pc-form__done-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        {copy.successMessage}
      </p>
    );
  }

  const sending = status.kind === 'sending';
  const emailError = errors.email?.message;
  const describedBy = [emailError ? errorId : null, noteId].filter(Boolean).join(' ');

  return (
    <form
      className="pc-form"
      noValidate
      onSubmit={(event) => void handleSubmit(onValid)(event)}
      aria-busy={sending || undefined}
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="pc-form__field" data-invalid={emailError ? '' : undefined}>
        <input
          id={inputId}
          className="pc-form__input"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          placeholder={copy.placeholder}
          readOnly={sending}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={describedBy}
          {...register('email')}
        />
        <button type="submit" className="pc-form__submit" disabled={sending}>
          <span>{sending ? copy.submittingLabel : copy.submitLabel}</span>
          {sending ? (
            <span className="pc-form__spinner" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Honeypot: off-screen and out of the tab order; people never fill it. */}
      <div className="pc-form__hp" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="pc-form__messages" aria-live="polite">
        {emailError ? (
          <p id={errorId} className="pc-form__error">
            {emailError}
          </p>
        ) : null}
        {status.kind === 'error' ? (
          <p className="pc-form__error" role="alert">
            {status.message}
          </p>
        ) : null}
      </div>
      <p id={noteId} className="pc-form__note">
        {copy.privacyNote}
      </p>
    </form>
  );
}
