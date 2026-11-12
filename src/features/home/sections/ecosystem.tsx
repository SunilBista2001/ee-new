import { SectionIndex } from '@/components/ee/primitives';
import { EcosystemIndex } from '@/features/home/components/ecosystem-index';
import type { EcosystemContent } from '@/services/content';

/** The ecosystem: one row per format, each linking to its section on the Events page. */
export function Ecosystem({ content }: { content: EcosystemContent }) {
  return (
    <section id="ecosystem" className="section hm-eco" aria-labelledby="eco-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="eco-title" className="hm-h2 hm-head" data-reveal="lines">
          {content.heading}
        </h2>
        <EcosystemIndex items={content.items} />
      </div>
    </section>
  );
}
