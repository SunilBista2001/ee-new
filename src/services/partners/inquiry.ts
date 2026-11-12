import 'server-only';
import { BUDGET_LABELS, EVENT_LABELS, type InquiryInput } from '@/features/partners/schema';
import { getInquiryIntegrations, type InquiryIntegrations } from './config';

/**
 * Delivers a partnership inquiry to the CRM (system of record) and notifies Slack.
 *
 *  - Nothing configured        → `unavailable`. The visitor sees an error, never a fake success.
 *  - CRM configured            → the CRM must accept the inquiry; Slack is then notified.
 *                                If the CRM fails but Slack accepts, the lead is still captured
 *                                and the Slack message flags it for manual entry.
 *  - Only Slack configured     → Slack must accept it.
 *
 * A submission id travels with every request so the CRM can de-duplicate, and repeated calls
 * with the same id inside this server instance return the first result instead of resending.
 */

export type DeliveryResult = 'delivered' | 'unavailable' | 'failed';

export interface InquiryMeta {
  submissionId: string;
  submittedAt: Date;
  pageUrl: string;
}

const TIMEOUT_MS = 8000;
const DEDUPE_TTL_MS = 15 * 60 * 1000;
const recent = new Map<string, { at: number; result: Promise<DeliveryResult> }>();

function remember(id: string, result: Promise<DeliveryResult>) {
  const now = Date.now();
  for (const [key, entry] of recent) if (now - entry.at > DEDUPE_TTL_MS) recent.delete(key);
  recent.set(id, { at: now, result });
}

export function deliverInquiry(input: InquiryInput, meta: InquiryMeta): Promise<DeliveryResult> {
  const existing = recent.get(meta.submissionId);
  if (existing && Date.now() - existing.at < DEDUPE_TTL_MS) return existing.result;

  const result = send(input, meta, getInquiryIntegrations());
  remember(meta.submissionId, result);
  // A failed attempt may be retried with the same id.
  void result.then((r) => r !== 'delivered' && recent.delete(meta.submissionId));
  return result;
}

async function send(input: InquiryInput, meta: InquiryMeta, integrations: InquiryIntegrations) {
  const { crm, slack } = integrations;
  if (!crm && !slack) {
    console.warn('[partner-inquiry] No CRM or Slack destination configured; inquiry not accepted.');
    return 'unavailable';
  }

  let crmOk: boolean | null = null;
  if (crm) {
    crmOk = await post(
      'crm',
      crm.url,
      crmPayload(input, meta),
      crm.token ? { Authorization: `Bearer ${crm.token}` } : undefined,
    );
  }

  let slackOk: boolean | null = null;
  if (slack) slackOk = await post('slack', slack.url, slackPayload(input, meta, crmOk));

  if (crm) return crmOk || slackOk ? 'delivered' : 'failed';
  return slackOk ? 'delivered' : 'failed';
}

async function post(name: string, url: string, body: unknown, headers?: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`[partner-inquiry] ${name} responded ${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[partner-inquiry] ${name} request failed:`, error instanceof Error ? error.message : error);
    return false;
  }
}

/** Flat JSON, so any CRM workflow or automation tool can map the fields without code. */
function crmPayload(input: InquiryInput, meta: InquiryMeta) {
  const [firstName, ...rest] = input.name.split(/\s+/);
  return {
    submissionId: meta.submissionId,
    source: 'Partners page inquiry',
    submittedAt: meta.submittedAt.toISOString(),
    pageUrl: meta.pageUrl,
    name: input.name,
    firstName: firstName ?? input.name,
    lastName: rest.join(' '),
    email: input.email,
    company: input.company,
    role: input.role,
    goals: input.goals,
    budget: BUDGET_LABELS[input.budget],
    budgetKey: input.budget,
    events: input.events.map((key) => EVENT_LABELS[key]).join(', '),
    eventKeys: input.events,
  };
}

/** Escapes Slack mrkdwn control characters in visitor-supplied text. */
const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function slackPayload(input: InquiryInput, meta: InquiryMeta, crmOk: boolean | null) {
  const events = input.events.length ? input.events.map((key) => EVENT_LABELS[key]).join(', ') : 'None selected';
  const field = (label: string, value: string) => ({ type: 'mrkdwn', text: `*${label}*\n${esc(value)}` });
  const blocks: unknown[] = [
    { type: 'header', text: { type: 'plain_text', text: 'New partnership inquiry', emoji: false } },
    {
      type: 'section',
      fields: [
        field('Name', input.name),
        field('Company', input.company),
        field('Role', input.role),
        field('Work email', input.email),
        field('Budget', BUDGET_LABELS[input.budget]),
        field('Events of interest', events),
      ],
    },
    { type: 'section', text: { type: 'mrkdwn', text: `*What they want to achieve*\n${esc(input.goals)}` } },
    {
      type: 'context',
      elements: [{ type: 'mrkdwn', text: `Submission ${meta.submissionId} · ${meta.submittedAt.toISOString()}` }],
    },
  ];
  if (crmOk === false) {
    blocks.splice(1, 0, {
      type: 'section',
      text: { type: 'mrkdwn', text: ':warning: *CRM sync failed.* Add this inquiry to the CRM manually.' },
    });
  }
  return { text: esc(`New partnership inquiry from ${input.name} (${input.company})`), blocks };
}
