import Image from 'next/image';
import { SectionIndex } from '@/components/ee/primitives';
import type { PodcastEpisode, PodcastEpisodesContent } from '@/services/content';
import { LinkRow, platformLinks } from '../components/link-row';

/**
 * Featured episode and archive. Renders nothing until episodes are published, so the
 * pre-launch page never shows empty or stand-in episodes. Add entries to the content's
 * `episodes` (newest first) and this section appears between the studio and the sign-up.
 */
export function PodcastEpisodes({
  content,
  episodes,
}: {
  content: PodcastEpisodesContent;
  episodes: PodcastEpisode[];
}) {
  if (!episodes.length) return null;
  const featured = episodes.find((e) => e.slug === content.featured) ?? episodes[0]!;
  const archive = episodes.filter((e) => e !== featured);

  return (
    <section id="episodes" className="section pc-episodes" aria-labelledby="pc-episodes-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="pc-episodes-title" className="hm-h2 pc-episodes__title" data-reveal="lines">
          {content.heading}
        </h2>

        <article id={featured.slug} className="pc-feature" data-reveal="fade">
          {featured.artwork ? (
            <div className="media pc-feature__art">
              <Image
                src={featured.artwork.src}
                alt={featured.artwork.alt}
                width={featured.artwork.width}
                height={featured.artwork.height}
                sizes="(min-width: 992px) 30vw, 92vw"
              />
            </div>
          ) : null}
          <div className="pc-feature__body">
            <EpisodeMeta episode={featured} />
            <h3 className="pc-feature__title">{featured.title}</h3>
            {featured.summary ? <p className="pc-feature__summary">{featured.summary}</p> : null}
            {featured.guests?.length ? (
              <p className="pc-feature__guests">With {featured.guests.map((g) => g.name).join(', ')}</p>
            ) : null}
            <LinkRow label={content.listenLabel} links={platformLinks(featured.links)} />
          </div>
        </article>

        {archive.length ? (
          <ol className="pc-archive" data-stagger>
            {archive.map((episode) => (
              <li key={episode.slug} id={episode.slug} className="pc-archive__item" data-stagger-item>
                <EpisodeMeta episode={episode} />
                <h3 className="pc-archive__title">{episode.title}</h3>
                <LinkRow label={content.listenLabel} links={platformLinks(episode.links)} />
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}

function EpisodeMeta({ episode }: { episode: PodcastEpisode }) {
  const parts = [
    episode.number != null ? `Ep. ${String(episode.number).padStart(2, '0')}` : null,
    episode.publishedAt
      ? new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(
          new Date(`${episode.publishedAt}T12:00:00`),
        )
      : null,
    episode.duration ?? null,
  ].filter(Boolean);
  if (!parts.length) return null;
  return <p className="mono pc-episode-meta">{parts.join(' · ')}</p>;
}
