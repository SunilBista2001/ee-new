import { SectionIndex } from '@/components/ee/primitives';
import { PartnerStoryStage } from '@/features/partners/components/partner-story-stage';
import type { PartnerStoriesContent } from '@/services/content';

/** Partner stories: one story at a time, chosen from the row of partner logos. */
export function PartnersStories({ content }: { content: PartnerStoriesContent }) {
  return (
    <section id="stories" className="section pt-stories" aria-labelledby="pt-stories-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />
        <h2 id="pt-stories-title" className="hm-h2 pt-stories__title" data-reveal="lines">
          {content.heading}
        </h2>
        <div data-reveal="fade">
          <PartnerStoryStage stories={content.stories} emptyState={content.emptyState} />
        </div>
      </div>
    </section>
  );
}
