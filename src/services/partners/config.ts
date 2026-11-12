import 'server-only';
import { z } from 'zod';

/**
 * Server-only configuration for the partnership inquiry pipeline. Nothing here reaches the
 * browser. Each destination is optional so the site still builds without credentials; the
 * API route refuses submissions (503) until at least one destination is configured.
 *
 * PARTNER_CRM_WEBHOOK_URL     Endpoint that receives each inquiry as flat JSON (a HubSpot or
 *                             GoHighLevel inbound workflow webhook, Zapier, Make, n8n, or your
 *                             own endpoint). The CRM is the system of record.
 * PARTNER_CRM_WEBHOOK_TOKEN   Optional. Sent as `Authorization: Bearer <token>`.
 * SLACK_PARTNER_WEBHOOK_URL   Slack incoming-webhook URL for the channel that is notified.
 */
/** HTTPS only; plain HTTP is accepted for loopback hosts so the pipeline can be tested locally. */
const webhookUrl = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
}, 'must be an https:// URL');

const schema = z.object({
  PARTNER_CRM_WEBHOOK_URL: webhookUrl.optional(),
  PARTNER_CRM_WEBHOOK_TOKEN: z.string().min(1).optional(),
  SLACK_PARTNER_WEBHOOK_URL: webhookUrl.optional(),
});

export interface InquiryIntegrations {
  crm: { url: string; token?: string } | null;
  slack: { url: string } | null;
}

/** Read per request (not at import) so a misconfigured variable never breaks the build. */
export function getInquiryIntegrations(): InquiryIntegrations {
  const parsed = schema.safeParse({
    PARTNER_CRM_WEBHOOK_URL: process.env.PARTNER_CRM_WEBHOOK_URL || undefined,
    PARTNER_CRM_WEBHOOK_TOKEN: process.env.PARTNER_CRM_WEBHOOK_TOKEN || undefined,
    SLACK_PARTNER_WEBHOOK_URL: process.env.SLACK_PARTNER_WEBHOOK_URL || undefined,
  });
  if (!parsed.success) {
    console.error('[partner-inquiry] Invalid integration configuration:', z.prettifyError(parsed.error));
    return { crm: null, slack: null };
  }
  const env = parsed.data;
  return {
    crm: env.PARTNER_CRM_WEBHOOK_URL
      ? { url: env.PARTNER_CRM_WEBHOOK_URL, token: env.PARTNER_CRM_WEBHOOK_TOKEN }
      : null,
    slack: env.SLACK_PARTNER_WEBHOOK_URL ? { url: env.SLACK_PARTNER_WEBHOOK_URL } : null,
  };
}
