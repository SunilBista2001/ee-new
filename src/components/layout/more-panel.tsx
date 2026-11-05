import Image from 'next/image';
import { PlainImage } from '@/components/media/plain-image';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import type { NewsletterCopy, Navigation } from '@/services/content';

interface MorePanelProps {
  more: Navigation['more'];
  newsletter: NewsletterCopy;
}

/** Content of the navbar "More" dropdown: newsletter, podcasts and contact CTA (Server Component). */
export function MorePanel({ more, newsletter }: MorePanelProps) {
  return (
    <div id="w-node-be271d11-17d1-f19b-0c69-e2996a085c56-6a085c49" className="padding-global">
      <div id="w-node-be271d11-17d1-f19b-0c69-e2996a085c57-6a085c49" className="container-large bg-gradient-dropdown">
        <div id="w-node-be271d11-17d1-f19b-0c69-e2996a085c58-6a085c49" className="nav-bg-container">
          <div
            id="w-node-be271d11-17d1-f19b-0c69-e2996a085c59-6a085c49"
            className="w-layout-layout quick-stack-11 wf-layout-layout"
          >
            <div className="w-layout-cell max-width-small max-width-full-tablet">
              <div className="div-block-40">
                <div className="margin-bottom margin-small">
                  <div className="max-width-small">
                    <h2>{more.newsletterHeading}</h2>
                  </div>
                </div>
                <NewsletterForm copy={newsletter} />
              </div>
            </div>
            <div id="w-node-be271d11-17d1-f19b-0c69-e2996a085c6c-6a085c49" className="w-layout-cell">
              <div className="margin-bottom margin-small">
                <div className="icon-h2">
                  <PlainImage image={{ src: '/assets/images/icon_podcast.svg', alt: '' }} />
                  <h2>{more.podcastsHeading}</h2>
                </div>
              </div>
              {more.podcasts.map((podcast) => (
                <div key={podcast.href} className="margin-bottom margin-xsmall">
                  <a href={podcast.href} className="pocast-container w-inline-block">
                    <div className="nav-img-wrapper">
                      <Image
                        src={podcast.image.src}
                        alt={podcast.image.alt}
                        width={podcast.image.width}
                        height={podcast.image.height}
                        className="nav-img"
                      />
                    </div>
                    <div>
                      <div className="margin-bottom margin-xsmall">
                        <h3>{podcast.title}</h3>
                      </div>
                      <p>{podcast.description}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div className="w-layout-cell max-width-small">
              <div className="dropdown-container">
                <div className="margin-bottom margin-small">
                  <h3>{more.contactHeading}</h3>
                </div>
                <a href={more.contactCta.href} className="button is-alternate w-button">
                  {more.contactCta.label}
                </a>
              </div>
            </div>
          </div>
          <div className="bg-gradient-menu-mobile" />
        </div>
      </div>
    </div>
  );
}
