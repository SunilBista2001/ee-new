// `zod/mini` is Zod's tree-shakable build: same validation, a fraction of the client bundle.
import * as z from 'zod/mini';

/** Newsletter sign-up input. Shared by the client form and any future server handler. */
export function createNewsletterSchema(invalidEmailMessage: string) {
  const error = { error: invalidEmailMessage };
  return z.object({
    email: z.pipe(z.string().check(z.trim()), z.email(error).check(z.maxLength(256, error))),
  });
}

export type NewsletterInput = z.infer<ReturnType<typeof createNewsletterSchema>>;
