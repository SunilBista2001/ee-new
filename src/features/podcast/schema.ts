// `zod/mini`: the same validation on the client and the server, at a fraction of the bundle.
import * as z from 'zod/mini';

/** Podcast launch list: the contract shared by the form (client) and the API route (server). */
export const INVALID_EMAIL_MESSAGE = 'Please enter a valid email address.';

export const notifySchema = z.object({
  email: z.pipe(
    z.string().check(z.trim(), z.toLowerCase()),
    z.email({ error: INVALID_EMAIL_MESSAGE }).check(z.maxLength(254, { error: INVALID_EMAIL_MESSAGE })),
  ),
});

export type NotifyInput = z.infer<typeof notifySchema>;

/** Request body of POST /api/podcast-notify. */
export const notifyRequestSchema = z.extend(notifySchema, {
  /** One id per form session, so a retried or doubled request is only delivered once. */
  submissionId: z.uuid(),
  /** Honeypot. Hidden from people; anything in it marks the request as automated. */
  website: z.optional(z.string().check(z.maxLength(0))),
});

/** Response body of POST /api/podcast-notify. */
export type NotifyResponse = { ok: true } | { ok: false; error: 'invalid' | 'rate_limited' | 'unavailable' | 'failed' };
