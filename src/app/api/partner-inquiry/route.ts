import { NextResponse, type NextRequest } from 'next/server';
import { siteConfig } from '@/config/site';
import { inquiryRequestSchema, type InquiryResponse } from '@/features/partners/schema';
import { deliverInquiry } from '@/services/partners/inquiry';

/**
 * POST /api/partner-inquiry: validates a partnership inquiry and hands it to the CRM and Slack
 * (services/partners). Responds `{ ok: true }` only once a destination has accepted it.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 6;
const hits = new Map<string, number[]>();

/** Best-effort, per-instance throttle; the CRM's own de-duplication is the real safeguard. */
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

const reply = (body: InquiryResponse, status: number) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: NextRequest) {
  // Same-origin only: the form is the one legitimate caller.
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin && origin !== siteConfig.url.origin) {
    return reply({ ok: false, error: 'invalid' }, 403);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: 'invalid' }, 413);

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: 'invalid' }, 400);
  }

  const parsed = inquiryRequestSchema.safeParse(json);
  if (!parsed.success) return reply({ ok: false, error: 'invalid' }, 422);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return reply({ ok: false, error: 'rate_limited' }, 429);

  // The honeypot was required to be empty by the schema; the payload builders pick fields
  // explicitly, so delivery metadata never leaks into the CRM record.
  const result = await deliverInquiry(parsed.data, {
    submissionId: parsed.data.submissionId,
    submittedAt: new Date(),
    pageUrl: new URL('/partners', siteConfig.url).toString(),
  });

  if (result === 'delivered') return reply({ ok: true }, 200);
  if (result === 'unavailable') return reply({ ok: false, error: 'unavailable' }, 503);
  return reply({ ok: false, error: 'failed' }, 502);
}
