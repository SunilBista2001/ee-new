// `zod/mini`: the same validation on the client and the server, at a fraction of the bundle.
import * as z from 'zod/mini';

/**
 * Partnership inquiry: the contract shared by the form (client) and the API route (server).
 * Option values are stable keys sent to the CRM; labels live in the page content.
 */
export const BUDGET_OPTIONS = ['5k-10k', '10k-25k', '25k-50k', '50k-plus'] as const;
export const EVENT_OPTIONS = ['summit', 'the-fifteen', 'sidequests', 'mixers', 'podcast', 'not-sure'] as const;

export type BudgetOption = (typeof BUDGET_OPTIONS)[number];
export type EventOption = (typeof EVENT_OPTIONS)[number];

/** Human labels, used by the form and in the CRM / Slack payloads. */
export const BUDGET_LABELS: Record<BudgetOption, string> = {
  '5k-10k': '$5K to $10K',
  '10k-25k': '$10K to $25K',
  '25k-50k': '$25K to $50K',
  '50k-plus': '$50K+',
};

/** The formats of the ecosystem (homepage › The ecosystem). */
export const EVENT_LABELS: Record<EventOption, string> = {
  summit: 'The Summit',
  'the-fifteen': 'The Fifteen',
  sidequests: 'Sidequests',
  mixers: 'AI and Commerce mixers',
  podcast: 'Keeping It Real (podcast)',
  'not-sure': 'Not sure yet',
};

const text = (label: string, max: number, min = 1) =>
  z.pipe(
    z.string().check(z.trim()),
    z
      .string()
      .check(
        z.minLength(min, { error: min > 1 ? `${label} needs at least ${min} characters.` : `${label} is required.` }),
        z.maxLength(max, { error: `${label} must be ${max} characters or fewer.` }),
      ),
  );

export const inquirySchema = z.object({
  name: text('Your name', 120),
  company: text('Company', 160),
  role: text('Role', 120),
  email: z.pipe(
    z.string().check(z.trim(), z.toLowerCase()),
    z.email({ error: 'Enter a valid work email.' }).check(z.maxLength(254, { error: 'Enter a valid work email.' })),
  ),
  goals: text('A short description', 4000, 10),
  budget: z.enum(BUDGET_OPTIONS, { error: 'Choose a budget range.' }),
  events: z.array(z.enum(EVENT_OPTIONS)).check(z.maxLength(EVENT_OPTIONS.length)),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** Request body of POST /api/partner-inquiry: the form values plus delivery metadata. */
export const inquiryRequestSchema = z.extend(inquirySchema, {
  /** One id per form session, so a retried or doubled request is only delivered once. */
  submissionId: z.uuid(),
  /** Honeypot. Hidden from people; anything in it marks the request as automated. */
  website: z.optional(z.string().check(z.maxLength(0))),
});

export type InquiryRequest = z.infer<typeof inquiryRequestSchema>;

/** Response body of POST /api/partner-inquiry. */
export type InquiryResponse =
  { ok: true } | { ok: false; error: 'invalid' | 'rate_limited' | 'unavailable' | 'failed' };
