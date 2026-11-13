import 'server-only';
import { z } from 'zod';

/**
 * Podcast launch list: hands each sign-up to an email provider or CRM through a webhook.
 *
 * PODCAST_NOTIFY_WEBHOOK_URL    Endpoint that receives each sign-up as flat JSON
 *                               ({ submissionId, source, email, submittedAt, pageUrl }): a
 *                               Mailchimp / Kit / Beehiiv automation, a HubSpot or GoHighLevel
 *                               inbound webhook, Zapier, Make, n8n or your own endpoint.
 * PODCAST_NOTIFY_WEBHOOK_TOKEN  Optional. Sent as `Authorization: Bearer <token>`.
 *
 * Unset: every sign-up is refused (`unavailable`) and the visitor is told sign-ups are not open
 * yet. A success is only ever reported after the destination has accepted the address.
 */

export type NotifyResult = 'delivered' | 'unavailable' | 'failed';

/** HTTPS only; plain HTTP is accepted for loopback hosts so the pipeline can be tested locally. */
const webhookUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
}, 'must be an https:// URL');

const configSchema = z.object({
  PODCAST_NOTIFY_WEBHOOK_URL: webhookUrl.optional(),
  PODCAST_NOTIFY_WEBHOOK_TOKEN: z.string().min(1).optional(),
});

/** Read per request (not at import) so a misconfigured variable never breaks the build. */
function getDestination(): { url: string; token?: string } | null {
  const parsed = configSchema.safeParse({
    PODCAST_NOTIFY_WEBHOOK_URL: process.env.PODCAST_NOTIFY_WEBHOOK_URL || undefined,
    PODCAST_NOTIFY_WEBHOOK_TOKEN: process.env.PODCAST_NOTIFY_WEBHOOK_TOKEN || undefined,
  });
  if (!parsed.success) {
    console.error('[podcast-notify] Invalid configuration:', z.prettifyError(parsed.error));
    return null;
  }
  const { PODCAST_NOTIFY_WEBHOOK_URL: url, PODCAST_NOTIFY_WEBHOOK_TOKEN: token } = parsed.data;
  return url ? { url, token } : null;
}

const TIMEOUT_MS = 8000;
const DEDUPE_TTL_MS = 15 * 60 * 1000;
const recent = new Map<string, { at: number; result: Promise<NotifyResult> }>();

export interface NotifySignup {
  email: string;
  submissionId: string;
  submittedAt: Date;
  pageUrl: string;
}

/** Repeated calls with the same submission id inside this instance return the first result. */
export function deliverSignup(signup: NotifySignup): Promise<NotifyResult> {
  const now = Date.now();
  for (const [key, entry] of recent) if (now - entry.at > DEDUPE_TTL_MS) recent.delete(key);

  const existing = recent.get(signup.submissionId);
  if (existing) return existing.result;

  const result = send(signup);
  recent.set(signup.submissionId, { at: now, result });
  // A failed attempt may be retried with the same id.
  void result.then((r) => r !== 'delivered' && recent.delete(signup.submissionId));
  return result;
}

async function send(signup: NotifySignup): Promise<NotifyResult> {
  const destination = getDestination();
  if (!destination) {
    console.warn('[podcast-notify] PODCAST_NOTIFY_WEBHOOK_URL is not set; sign-up not accepted.');
    return 'unavailable';
  }
  try {
    const response = await fetch(destination.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(destination.token ? { Authorization: `Bearer ${destination.token}` } : {}),
      },
      body: JSON.stringify({
        submissionId: signup.submissionId,
        source: 'Podcast launch list',
        email: signup.email,
        submittedAt: signup.submittedAt.toISOString(),
        pageUrl: signup.pageUrl,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`[podcast-notify] destination responded ${response.status}`);
      return 'failed';
    }
    return 'delivered';
  } catch (error) {
    console.error('[podcast-notify] request failed:', error instanceof Error ? error.message : error);
    return 'failed';
  }
}
