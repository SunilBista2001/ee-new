import { NextResponse, type NextRequest } from 'next/server';
import { siteConfig } from '@/config/site';
import { notifyRequestSchema, type NotifyResponse } from '@/features/podcast/schema';
import { deliverSignup } from '@/services/podcast/notify';

/**
 * POST /api/podcast-notify: validates a launch-list sign-up and hands it to the configured
 * webhook (services/podcast/notify.ts). Responds `{ ok: true }` only once it has been accepted.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 2 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 8;
const hits = new Map<string, number[]>();

/** Best-effort, per-instance throttle; the destination's own de-duplication is the real safeguard. */
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

const reply = (body: NotifyResponse, status: number) =>
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

  const parsed = notifyRequestSchema.safeParse(json);
  if (!parsed.success) return reply({ ok: false, error: 'invalid' }, 422);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) return reply({ ok: false, error: 'rate_limited' }, 429);

  const result = await deliverSignup({
    email: parsed.data.email,
    submissionId: parsed.data.submissionId,
    submittedAt: new Date(),
    pageUrl: new URL('/podcast', siteConfig.url).toString(),
  });

  if (result === 'delivered') return reply({ ok: true }, 200);
  if (result === 'unavailable') return reply({ ok: false, error: 'unavailable' }, 503);
  return reply({ ok: false, error: 'failed' }, 502);
}
