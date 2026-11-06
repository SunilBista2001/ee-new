'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { NewsletterCopy } from '@/services/content';
import { createNewsletterSchema, type NewsletterInput } from './schema';

/**
 * "Stay connected" newsletter sign-up.
 *
 * No email provider is connected yet (the previous build had none either): a valid
 * submission shows the success state and nothing is sent. Connect a provider in `onValid`
 * (e.g. a Server Action).
 */
export function NewsletterForm({ copy }: { copy: NewsletterCopy }) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const schema = useMemo(() => createNewsletterSchema(copy.invalidEmailMessage), [copy.invalidEmailMessage]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: standardSchemaResolver(schema), defaultValues: { email: '' } });

  const onValid = async (): Promise<void> => {
    try {
      // Integration point for the email provider. Nothing is sent today.
    } catch {
      setError('root.server', { message: copy.errorMessage });
    }
  };

  const emailError = errors.email?.message;
  const serverError = errors.root?.server?.message;

  if (isSubmitSuccessful) {
    return (
      <p className="nl__done" role="status">
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {copy.successMessage}
      </p>
    );
  }

  return (
    <form className="nl" noValidate onSubmit={handleSubmit(onValid)}>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="nl__field">
        <input
          id={inputId}
          className="nl__input"
          maxLength={256}
          placeholder={copy.placeholder}
          type="email"
          autoComplete="email"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? errorId : undefined}
          {...register('email')}
        />
        <button type="submit" className="nl__submit" disabled={isSubmitting}>
          {copy.submitLabel}
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      {emailError ? (
        <p id={errorId} role="alert" className="nl__error">
          {emailError}
        </p>
      ) : null}
      {serverError ? (
        <p role="alert" className="nl__error">
          {serverError}
        </p>
      ) : null}
    </form>
  );
}
