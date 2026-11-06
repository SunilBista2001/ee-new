import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import type { NewsletterCopy, NewsletterSectionContent } from '@/services/content';

/** "Stay connected": the newsletter sign-up, set between hairlines. */
export function Newsletter({ content, copy }: { content: NewsletterSectionContent; copy: NewsletterCopy }) {
  return (
    <section id="newsletter" className="newsletter" aria-labelledby="newsletter-title" tabIndex={-1}>
      <div className="wrap">
        <div className="newsletter__inner" data-reveal="fade">
          <div className="newsletter__copy">
            <p className="mono newsletter__label">{content.label}</p>
            <h2 id="newsletter-title" className="h2 newsletter__title">
              {content.heading}
            </h2>
          </div>
          <div className="newsletter__form">
            <p className="newsletter__text">{content.text}</p>
            <NewsletterForm copy={copy} />
            <p className="newsletter__note mono">{content.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
