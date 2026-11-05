import { BenefitIcon } from '@/components/icons/benefit-icons';
import { PlainImage } from '@/components/media/plain-image';
import { INITIAL_STYLE, MOTION_IDS } from '@/lib/motion/reveal-config';
import type { MembershipBenefit, MembershipBenefitsContent } from '@/services/content';

/**
 * Per-position card layout. The Webflow CSS styles each card through its own (slightly
 * irregular) class names and grid id, so layout is tied to position, not to content.
 */
const CARD_SLOTS = [
  {
    node: 'w-node-da61fb54-1ff7-46f4-2aaf-d5610cf34402-a6a2ca3f',
    topClass: 'div-block-5',
    iconContainer: 'icon-container',
    embedClass: 'code-embed-2',
    tagClass: 'new-to-canadian-tech',
    tagTextClass: undefined,
    bottomClass: 'div-block-4',
    textClass: 'benefit-text',
    textFirst: false,
  },
  {
    node: 'w-node-eb25088e-da0d-9be0-fdbf-0b8b81a8b743-a6a2ca3f',
    topClass: 'div-block-5',
    iconContainer: 'icon-container-tall',
    embedClass: 'code-embed-3',
    tagClass: 'new-to-canadian-tech',
    tagTextClass: undefined,
    bottomClass: 'div-block-4',
    textClass: 'benefit-text-2',
    textFirst: true,
  },
  {
    node: 'w-node-_53d0acdd-627b-e9f0-f703-e452bf87d690-a6a2ca3f',
    topClass: 'div-block-5-copy',
    iconContainer: 'icon-container-long',
    embedClass: 'code-embed-4',
    tagClass: 'seed-to-series-a',
    tagTextClass: 'paragraph-3',
    bottomClass: 'div-block-4-copy',
    textClass: 'benefit-text-copy',
    textFirst: false,
  },
] as const;

type CardSlot = (typeof CARD_SLOTS)[number];

function BenefitCard({ benefit, slot, motionId }: { benefit: MembershipBenefit; slot: CardSlot; motionId?: string }) {
  const title = (
    // Styled by the legacy `h4` rules; announced as level 3 under the section's h2.
    <h4 aria-level={3}>
      <span className="text-highlight-span">{benefit.title}</span>
    </h4>
  );
  const text = <p className="indent-32">{benefit.text}</p>;
  return (
    <div id={slot.node} className="w-layout-cell">
      <div className="div-block-3">
        <div className={slot.topClass}>
          <div className={slot.iconContainer} aria-hidden="true">
            <div className={`${slot.embedClass} w-embed`}>
              <BenefitIcon name={benefit.icon} />
            </div>
            <PlainImage image={{ src: benefit.animation, alt: '' }} className="img-gif" />
          </div>
          <div data-w-id={motionId} style={INITIAL_STYLE.slideUp} className={`${slot.tagClass} img-parallax`}>
            <div className="tag white">
              <p className={slot.tagTextClass}>{benefit.tag}</p>
            </div>
          </div>
        </div>
        <div className={slot.bottomClass}>
          <div className={slot.textClass}>
            {slot.textFirst ? text : title}
            {slot.textFirst ? title : text}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MembershipBenefits({ content }: { content: MembershipBenefitsContent }) {
  return (
    <section data-w-id={MOTION_IDS.membership.section} style={INITIAL_STYLE.hidden} className="section_blog44">
      <div className="padding-global">
        <div className="container-large-6">
          <div className="padding-section-medium">
            <div className="blog44_component">
              <div className="margin-bottom margin-small">
                <div className="blog44_heading-wrapper">
                  <div id="w-node-_4f0978ae-6696-e7f7-e7bc-315a18192664-a6a2ca3f" className="blog44_heading">
                    <div className="max-width-xsmall">
                      <div className="margin-bottom margin-xsmall">
                        <h2 data-scramble="">{content.heading}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="button-group is-right hide-mobile-landscape">
                    <a href={content.cta.href} className="button w-button">
                      {content.cta.label}
                    </a>
                  </div>
                </div>
              </div>
              <div
                id="w-node-da61fb54-1ff7-46f4-2aaf-d5610cf34401-a6a2ca3f"
                className="w-layout-layout quick-stack-4 wf-layout-layout"
              >
                {content.benefits.map((benefit, index) => {
                  const slot = CARD_SLOTS[index % CARD_SLOTS.length] ?? CARD_SLOTS[0];
                  return (
                    <BenefitCard
                      key={benefit.title}
                      benefit={benefit}
                      slot={slot}
                      motionId={MOTION_IDS.membership.tags[index]}
                    />
                  );
                })}
                <div id="w-node-_6384534d-38a4-17d2-3c29-88a5a550a845-a6a2ca3f" className="w-layout-cell cell-24" />
              </div>
              <div className="show-mobile-landscape">
                <div className="margin-top margin-xxlarge">
                  <div className="button-group is-center">
                    <a href={content.cta.href} className="button w-button">
                      {content.cta.label}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gradient-2" />
    </section>
  );
}
