import 'server-only';

/**
 * Upcoming events from the public Luma calendar (the same data the Luma embed shows).
 *
 * Read on the server and cached for an hour (ISR), so the page ships real, crawlable event
 * rows without client-side requests. Any failure (network, API change, no events) resolves
 * to an empty list and the caller falls back to the Luma embed: the homepage never breaks.
 * This is Luma's public calendar feed, not a documented API, hence the fallback.
 */

export interface UpcomingEvent {
  id: string;
  title: string;
  /** Link to the event page on Luma. */
  href: string;
  /** Cover image; Luma-hosted. */
  image: string;
  /** ISO start time. */
  startsAt: string;
  timeZone: string;
  /** Short, public place name, e.g. "Fashion District, Toronto". */
  place: string | null;
  /** Formatted price or range, "Free", or null when unknown. */
  price: string | null;
  soldOut: boolean;
}

interface LumaPrice {
  cents: number;
  currency: string;
}

interface LumaEntry {
  api_id: string;
  event: {
    name: string;
    url: string;
    cover_url?: string;
    start_at: string;
    timezone: string;
    geo_address_info?: { sublocality?: string; city?: string; city_state?: string; short_address?: string } | null;
  };
  ticket_info?: {
    is_free?: boolean;
    is_sold_out?: boolean;
    price?: LumaPrice | null;
    max_price?: LumaPrice | null;
  } | null;
}

const money = (price: LumaPrice) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: price.currency.toUpperCase(),
    maximumFractionDigits: price.cents % 100 === 0 ? 0 : 2,
  }).format(price.cents / 100);

function formatPrice(info: LumaEntry['ticket_info']): string | null {
  if (!info) return null;
  if (info.is_free) return 'Free';
  if (!info.price) return null;
  const low = money(info.price);
  if (info.max_price && info.max_price.cents > info.price.cents) return `${low} to ${money(info.max_price)}`;
  return low;
}

function formatPlace(geo: LumaEntry['event']['geo_address_info']): string | null {
  if (!geo) return null;
  if (geo.sublocality && geo.city) return `${geo.sublocality}, ${geo.city}`;
  return geo.short_address ?? geo.city_state ?? geo.city ?? null;
}

export async function getUpcomingEvents(calendarId: string, limit = 8): Promise<UpcomingEvent[]> {
  try {
    const url = new URL('https://api.lu.ma/calendar/get-items');
    url.search = new URLSearchParams({
      calendar_api_id: calendarId,
      period: 'future',
      pagination_limit: String(limit),
    }).toString();

    const res = await fetch(url, {
      // Luma rate-limits anonymous default clients (429); an identified one is served.
      headers: { 'User-Agent': 'EliteEntrepreneursWebsite/1.0', Accept: 'application/json' },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { entries?: LumaEntry[] };

    return (data.entries ?? []).flatMap((entry): UpcomingEvent[] => {
      const { event } = entry;
      if (!event?.name || !event.url || !event.start_at || !event.cover_url) return [];
      return [
        {
          id: entry.api_id,
          title: event.name,
          href: `https://luma.com/${event.url}`,
          image: event.cover_url,
          startsAt: event.start_at,
          timeZone: event.timezone,
          place: formatPlace(event.geo_address_info),
          price: formatPrice(entry.ticket_info),
          soldOut: Boolean(entry.ticket_info?.is_sold_out),
        },
      ];
    });
  } catch {
    return [];
  }
}
