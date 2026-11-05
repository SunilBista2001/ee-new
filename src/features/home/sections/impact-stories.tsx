import Image from 'next/image';
import { TestimonialTabs } from '../components/testimonial-tabs';
import { PlainImage } from '@/components/media/plain-image';
import type { ImpactStoriesContent, Testimonial } from '@/services/content';

const MARQUEE_COPIES = 8;

/** Webflow grid ids of each pane's cells, by position (the CSS places cells by id). */
const PANE_SLOTS: readonly { imageNode?: string; contentNode: string }[] = [
  { contentNode: 'w-node-_15985e47-4f88-6170-64f3-ea32c6c3838f-a6a2ca3f' },
  { contentNode: 'w-node-_15985e47-4f88-6170-64f3-ea32c6c383a0-a6a2ca3f' },
  {
    imageNode: 'w-node-_15985e47-4f88-6170-64f3-ea32c6c383af-a6a2ca3f',
    contentNode: 'w-node-_15985e47-4f88-6170-64f3-ea32c6c383b1-a6a2ca3f',
  },
];

function TestimonialPane({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const slot = PANE_SLOTS[index];
  return (
    <div className="testimonial1_component">
      <div id={slot?.imageNode} className="testimonial-img-wrapper">
        <Image
          src={testimonial.photo.src}
          alt={testimonial.photo.alt}
          width={testimonial.photo.width}
          height={testimonial.photo.height}
          sizes="100vw"
          className="testimonial-img"
        />
      </div>
      <div id={slot?.contentNode} className="testimonial1_content">
        <div className="margin-bottom margin-medium">
          <div className="testimonial1_logo-wrapper">
            <PlainImage image={{ src: '/assets/images/quote.gif', alt: '' }} className="quote" />
          </div>
        </div>
        <h3 className="heading-style-h2">{testimonial.quote}</h3>
        <div className="margin-top margin-medium">
          <div className="testimonial1_client">
            <h4>
              <span className="highlight-h4-white">{testimonial.author}</span>
            </h4>
            <div>{testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImpactStories({ content }: { content: ImpactStoriesContent }) {
  return (
    <section aria-label={content.tagline} className="section_testimonial1 bg-green">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-top padding-xlarge">
            <div>
              <div className="text-style-tagline outline">{content.tagline}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="marquee-container" aria-hidden="true">
        <div className="marquee-horizontal-headline">
          <div className="marquee-horizontal-alt-right">
            {Array.from({ length: MARQUEE_COPIES }, (_, i) => (
              <h2 key={i} className="testimonial-header">
                {content.marqueeText}
              </h2>
            ))}
          </div>
        </div>
      </div>
      <div className="padding-global">
        <div className="container-large">
          <div className="margin-top margin-large">
            <div className="padding-bottom padding-xhuge">
              <TestimonialTabs
                label={content.tagline}
                tabs={content.testimonials.map((testimonial, index) => ({
                  key: testimonial.company,
                  logo: testimonial.logo,
                  pane: <TestimonialPane testimonial={testimonial} index={index} />,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
