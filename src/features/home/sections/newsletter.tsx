import { SlotText } from '@/components/ee/primitives';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import type { NewsletterCopy, NewsletterSectionContent } from '@/services/content';

/** Newsletter sign-up template, set between hairlines. */
export function Newsletter({ content, copy }: { content: NewsletterSectionContent; copy: NewsletterCopy }) {
  return (
    <section id="newsletter" className="newsletter" aria-labelledby="newsletter-title" tabIndex={-1}>
      <div className="wrap">
        <div className="newsletter__inner" data-reveal="fade">
          <div className="newsletter__copy">
            <p className="mono newsletter__label">{content.label}</p>
            <h2 id="newsletter-title" className="hm-h2 newsletter__title">
              <SlotText text={content.heading} />
            </h2>
          </div>
          <div className="newsletter__form">
            <NewsletterForm copy={{ ...copy, submitLabel: content.submitLabel }} />
          </div>
        </div>
      </div>
    </section>
  );
}
