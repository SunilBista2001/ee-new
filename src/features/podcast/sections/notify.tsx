import type { PodcastNotifyContent, PodcastShow } from '@/services/content';
import { LinkRow, platformLinks } from '../components/link-row';
import { NotifyForm } from '../components/notify-form';
import { Record } from '../components/record';
import { Waveform } from '../components/waveform';

/**
 * Closing sign-up on an espresso panel: "Stay tuned." with the launch-list form, the listening
 * platforms once they exist, and the verified profiles to follow in the meantime. A large
 * record turns half out of frame behind the copy; a quieter sound-wave runs along the foot.
 */
export function PodcastNotify({ content, show }: { content: PodcastNotifyContent; show: PodcastShow }) {
  return (
    <section id="stay-tuned" className="section pc-notify" aria-labelledby="pc-notify-title" tabIndex={-1}>
      <div className="wrap">
        <div className="pc-notify__panel" data-wave-zone data-reveal="fade">
          <Record className="pc-notify__record" />

          <div className="pc-notify__grid">
            <div className="pc-notify__copy">
              {show.title ? <p className="mono pc-notify__show">{show.title}</p> : null}
              <h2 id="pc-notify-title" className="pc-notify__title" data-reveal="lines">
                {content.heading}
              </h2>
              <p className="pc-notify__text">{content.text}</p>
            </div>

            <div className="pc-notify__action">
              <NotifyForm copy={content} />
              <LinkRow label={content.listenLabel} links={platformLinks(show.platforms)} tone="dark" />
            </div>
          </div>

          <div className="pc-notify__foot">
            <LinkRow label={content.followLabel} links={content.follow} tone="dark" className="pc-notify__follow" />
            <Waveform className="pc-notify__wave" barWidth={2} gap={5} seed={7} />
          </div>
        </div>
      </div>
    </section>
  );
}
