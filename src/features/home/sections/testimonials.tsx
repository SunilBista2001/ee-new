import { SectionIndex } from '@/components/ee/primitives';
import { TestimonialStage } from '@/features/home/components/testimonial-stage';
import type { TestimonialsContent } from '@/services/content';

/** What people say: one testimonial at a time (quote, name, company, portrait). */
export function Testimonials({ content }: { content: TestimonialsContent }) {
  return (
    <section id="speakers" className="section hm-tst" aria-labelledby="tst-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} />
        <h2 id="tst-title" className="hm-h2 hm-head" data-reveal="lines">
          {content.heading}
        </h2>
        <div data-reveal="fade">
          <TestimonialStage items={content.items} />
        </div>
      </div>
    </section>
  );
}
