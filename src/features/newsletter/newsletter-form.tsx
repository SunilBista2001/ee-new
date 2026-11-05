'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { PlainImage } from '@/components/media/plain-image';
import type { NewsletterCopy } from '@/services/content';
import { createNewsletterSchema, type NewsletterInput } from './schema';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  copy: NewsletterCopy;
}

/**
 * Newsletter sign-up, used in the nav dropdown, the Subscribe section and the footer.
 *
 * No email provider is connected yet (the approved build had none either): a valid
 * submission shows Webflow's success state. Connect a provider in `onValid`.
 *
 * Markup and classes match the Webflow form 1:1. Additions for accessibility are either
 * visually hidden (label) or only rendered on error (message), so the approved layout is
 * unchanged.
 */
export function NewsletterForm({ copy }: NewsletterFormProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const schema = useMemo(() => createNewsletterSchema(copy.invalidEmailMessage), [copy.invalidEmailMessage]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<NewsletterInput>({ resolver: standardSchemaResolver(schema), defaultValues: { email: '' } });

  const onValid = async (): Promise<void> => {
    // Integration point for the email provider (e.g. a Server Action). Nothing is sent today.
  };

  const emailError = errors.email?.message;

  return (
    <div className={cn('footer1_form-block w-form', isSubmitSuccessful && 'is-submitted')}>
      <form className="footer1_form" noValidate onSubmit={handleSubmit(onValid)}>
        <Label htmlFor={inputId} className="tw:sr-only">
          Email address
        </Label>
        <input
          id={inputId}
          className="form_input-3 w-input"
          maxLength={256}
          placeholder={copy.placeholder}
          type="email"
          autoComplete="email"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? errorId : undefined}
          {...register('email')}
        />
        <input type="submit" className="button stretch blue w-button" value={copy.submitLabel} />
        {/*
          The live site's Cloudflare Turnstile injects an empty <div><div/></div> here. It renders
          nothing but, as an extra flex item, adds one gap to the layout; kept for spacing parity.
        */}
        <div aria-hidden="true">
          <div />
        </div>
      </form>
      {emailError ? (
        <p id={errorId} role="alert" className="tw:mt-2 tw:text-sm tw:text-destructive">
          {emailError}
        </p>
      ) : null}
      <div className="form_message-success-wrapper-2 w-form-done" role="status">
        <div className="form_message-success">
          <PlainImage image={{ src: '/assets/images/icon-check.svg', alt: '' }} />
          <div>{copy.successMessage}</div>
        </div>
      </div>
      <div className="form_message-error-wrapper w-form-fail">
        <div className="form_message-error">
          <div>{copy.errorMessage}</div>
        </div>
      </div>
    </div>
  );
}
