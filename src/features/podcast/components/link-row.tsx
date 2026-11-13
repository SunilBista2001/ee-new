import type { Link, PodcastPlatformLinks } from '@/services/content';
import { cn } from '@/lib/utils';
import { iconForHref, LinkIcon } from './icons';

const PLATFORM_LABELS: Record<keyof PodcastPlatformLinks, string> = {
  spotify: 'Spotify',
  apple: 'Apple Podcasts',
  youtube: 'YouTube',
};

/** The configured listening platforms, in a fixed order. Empty URLs are dropped. */
export function platformLinks(platforms: PodcastPlatformLinks): Link[] {
  return (Object.keys(PLATFORM_LABELS) as (keyof PodcastPlatformLinks)[])
    .filter((key) => Boolean(platforms[key]))
    .map((key) => ({ label: PLATFORM_LABELS[key], href: platforms[key]!, external: true }));
}

/**
 * A labelled row of icon links (listening platforms, social profiles). Renders nothing when
 * there are no links, so unconfigured platforms never leave an empty block behind.
 */
export function LinkRow({
  label,
  links,
  className,
  tone = 'light',
}: {
  label: string;
  links: Link[];
  className?: string;
  tone?: 'light' | 'dark';
}) {
  if (!links.length) return null;
  return (
    <nav className={cn('pc-links', `pc-links--${tone}`, className)} aria-label={label}>
      <p className="pc-links__label">{label}</p>
      <ul className="pc-links__list">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="pc-links__item"
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="pc-links__icon">
                <LinkIcon name={iconForHref(link.href)} />
              </span>
              <span>{link.label}</span>
              {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
