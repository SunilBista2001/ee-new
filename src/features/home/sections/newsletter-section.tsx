import Image from 'next/image';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import { INITIAL_STYLE, MOTION_IDS } from '@/lib/motion/reveal-config';
import type { NewsletterCopy, NewsletterSectionContent } from '@/services/content';

interface NewsletterSectionProps {
  content: NewsletterSectionContent;
  copy: NewsletterCopy;
}

export function NewsletterSection({ content, copy }: NewsletterSectionProps) {
  const { image, headlineImage, consent } = content;
  return (
    <section id="newsletter" aria-label={headlineImage.alt} className="section_cta8-2">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div data-w-id={MOTION_IDS.newsletter.card} style={INITIAL_STYLE.slideUp} className="cta8_component-3">
              <div className="cta8_content-3">
                <div
                  id="w-node-_3729d26b-a229-0841-51ef-949ff94f7274-a6a2ca3f"
                  className="w-layout-layout quick-stack-5 wf-layout-layout"
                >
                  <div
                    id="w-node-_3729d26b-a229-0841-51ef-949ff94f7275-a6a2ca3f"
                    className="w-layout-cell subscribe-cell"
                  >
                    <div className="cta-img-wrapper">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        sizes="100vw"
                        className="layout1_image"
                      />
                    </div>
                  </div>
                  <div id="w-node-_3729d26b-a229-0841-51ef-949ff94f7276-a6a2ca3f" className="w-layout-cell">
                    <div className="div-block-7">
                      <Image
                        src={headlineImage.src}
                        alt={headlineImage.alt}
                        width={headlineImage.width}
                        height={headlineImage.height}
                      />
                    </div>
                  </div>
                  <div className="w-layout-cell cell-23">
                    <div className="margin-bottom margin-medium">
                      <div className="margin-bottom margin-xsmall">
                        <h3>{content.heading}</h3>
                      </div>
                      <p>{content.text}</p>
                    </div>
                    <NewsletterForm copy={copy} />
                    <div className="text-size-tiny">
                      {consent.before}
                      <a href={consent.link.href} target="_blank" rel="noopener noreferrer" className="text-link">
                        {consent.link.label}
                      </a>
                      {consent.after}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
