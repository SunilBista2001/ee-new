import type { CSSProperties } from 'react';
import { ButtonLink, Photo } from '@/components/ee/primitives';
import type { PodcastHeroContent, PodcastShow } from '@/services/content';
import { platformLinks, LinkRow } from '../components/link-row';
import { Record } from '../components/record';
import { Waveform } from '../components/waveform';

/**
 * Podcast hero. The headline is the visual: "COMING" over "SOOOON", where the run of O's fades
 * like an echo (solid, brown, outline) and ends in a turning record. Under it "STAY TUNED." runs
 * straight into a sound-wave that swells under the pointer. Beside it, a microphone photograph
 * with a smaller studio frame set against it and quiet broadcast rings behind.
 *
 * The visual headline is aria-hidden; the h1 carries its plain text. Show details (title,
 * hosts, launch date, platforms) appear only once they are set in the content.
 *
 * Motion: components/podcast-motion.tsx (`data-pc-*` hooks), plus PageMotion's data-hero-item.
 */
export function PodcastHero({ content, show }: { content: PodcastHeroContent; show: PodcastShow }) {
  const [first = '', second = ''] = content.headline.split(/\s+/);
  const platforms = platformLinks(show.platforms);
  const launch = formatLaunch(show.launchDate);
  const hosts = show.hosts.map((h) => h.name).join(' & ');

  return (
    <section className="pc-hero" aria-labelledby="pc-hero-title" data-wave-zone data-pc-hero>
      <div className="wrap">
        <div className="pc-hero__top">
          <p className="pt-label" data-hero-item>
            <span className="pt-label__dot" aria-hidden="true" />
            {show.title ? (
              <>
                <span className="pc-hero__show">{show.title}</span>
                <span className="pc-hero__sep" aria-hidden="true">
                  ·
                </span>
              </>
            ) : null}
            <span>{content.label}</span>
          </p>
          <p className="pc-status" data-hero-item>
            <span className="pc-status__dot" aria-hidden="true" />
            {content.status}
          </p>
        </div>

        <div className="pc-hero__grid">
          <h1 id="pc-hero-title" className="pc-hero__title">
            <span className="sr-only">{content.headlineText}</span>
            <span className="pc-mega" aria-hidden="true">
              <MegaLine word={first} />
              <MegaLine word={second} echo />
            </span>
          </h1>

          <div className="pc-tuned">
            <p className="pc-tuned__text" data-pc-tuned>
              {content.subline}
            </p>
            <Waveform className="pc-tuned__wave" />
          </div>

          <div className="pc-hero__foot">
            <p className="pc-hero__lead" data-hero-item>
              {show.description || content.lead}
            </p>
            {hosts || launch ? (
              <dl className="pc-hero__meta" data-hero-item>
                {hosts ? (
                  <div>
                    <dt>Hosted by</dt>
                    <dd>{hosts}</dd>
                  </div>
                ) : null}
                {launch ? (
                  <div>
                    <dt>Launching</dt>
                    <dd>
                      <time dateTime={show.launchDate}>{launch}</time>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
            <div className="pc-hero__actions" data-hero-item>
              <ButtonLink link={content.cta} />
              <LinkRow label="Listen on" links={platforms} />
            </div>
          </div>

          <figure className="pc-hero__visual" data-pc-visual>
            <div className="pc-rings" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="pc-hero__photo" data-pc-photo data-pc-depth="10">
              <Photo image={content.image} sizes="(min-width: 992px) 30vw, 80vw" priority reveal={false} />
            </div>
            <div className="pc-hero__inset" data-pc-inset data-pc-depth="-18">
              <Photo image={content.inset} sizes="(min-width: 992px) 14vw, 38vw" priority reveal={false} />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

/**
 * One headline word as individually animatable letters. With `echo`, a run of repeated O's
 * steps down in weight and the last one becomes the record.
 */
function MegaLine({ word, echo }: { word: string; echo?: boolean }) {
  const chars = [...word];
  const runStart = echo ? chars.findIndex((c) => /o/i.test(c)) : -1;
  let runEnd = runStart;
  while (runEnd >= 0 && runEnd + 1 < chars.length && /o/i.test(chars[runEnd + 1]!)) runEnd++;
  const runLength = runStart >= 0 ? runEnd - runStart + 1 : 0;

  return (
    <span className="pc-mega__line" data-pc-line>
      {chars.map((char, i) => {
        const inRun = runLength > 1 && i >= runStart && i <= runEnd;
        if (!inRun) {
          return (
            <span key={i} className="pc-mega__ch" data-pc-ch>
              {char}
            </span>
          );
        }
        const step = i - runStart;
        if (i === runEnd) {
          return (
            <span key={i} className="pc-mega__ch pc-mega__ch--disc" data-pc-ch data-pc-echo>
              <Record />
            </span>
          );
        }
        return (
          <span
            key={i}
            className={`pc-mega__ch pc-mega__ch--echo is-${Math.min(step, 2)}`}
            style={{ '--step': step } as CSSProperties}
            data-pc-ch
            data-pc-echo
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

function formatLaunch(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}
