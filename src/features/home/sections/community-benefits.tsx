import Image from 'next/image';
import { WipeImage } from '@/components/media/wipe-image';
import { AccentHeading } from '@/components/ui/accent-heading';
import { INITIAL_STYLE, MOTION_IDS } from '@/lib/motion/reveal-config';
import type { CommunityBenefitsContent, FeatureBlock, ImageAsset } from '@/services/content';

function SectionImage({ image, sizes }: { image: ImageAsset; sizes?: string }) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      className="layout1_image"
    />
  );
}

function CtaLink({ block }: { block: FeatureBlock }) {
  return (
    <a href={block.cta.href} className="button is-secondary w-button">
      {block.cta.label}
    </a>
  );
}

/** "Learn from the Best": gradient block with overlapping images. */
function LearnFromTheBest({ block }: { block: CommunityBenefitsContent['learn'] }) {
  const ids = MOTION_IDS.learn;
  return (
    <div data-w-id={ids.section} style={INITIAL_STYLE.hidden} className="margin-top margin-negative">
      <section className="section_layout1 bg-gradient-blue">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-top padding-xhuge">
              <div className="padding-section-medium">
                <div className="layout1_component">
                  <div
                    id="w-node-_9928ca7b-955a-2e3c-edaa-c2b220ce90ea-a6a2ca3f"
                    className="w-layout-layout quick-stack-2 wf-layout-layout"
                  >
                    <div id="w-node-_9928ca7b-955a-2e3c-edaa-c2b220ce90eb-a6a2ca3f" className="w-layout-cell">
                      <div className="max-width-small">
                        <AccentHeading heading={block.heading} className="heading-style-h1" />
                      </div>
                    </div>
                    <div id="w-node-_9928ca7b-955a-2e3c-edaa-c2b220ce90f1-a6a2ca3f" className="w-layout-cell">
                      <div className="img-wrappers-home">
                        <div className="img-larg-home">
                          <SectionImage image={block.images.main} sizes="100vw" />
                        </div>
                        <div data-w-id={ids.overlay} className="img-small-home img-parallax">
                          <WipeImage>
                            <SectionImage image={block.images.overlay} />
                          </WipeImage>
                        </div>
                      </div>
                    </div>
                    <div id="w-node-_9928ca7b-955a-2e3c-edaa-c2b220ce90f7-a6a2ca3f" className="w-layout-cell cell">
                      <div className="max-width-small">
                        <div className="margin-bottom margin-medium">
                          <h3 data-w-id={ids.text} style={INITIAL_STYLE.hidden}>
                            {block.text}
                          </h3>
                        </div>
                        <CtaLink block={block} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** "Expand Your Network": full-bleed illustrated banner. */
function ExpandYourNetwork({ block }: { block: FeatureBlock }) {
  const ids = MOTION_IDS.network;
  return (
    <section data-w-id={ids.section} style={INITIAL_STYLE.hidden} className="section_cta8">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-small">
            <div className="cta8_content-2">
              <div className="max-width-large">
                <AccentHeading heading={block.heading} className="heading-style-h1" />
              </div>
              <div>
                <div className="margin-bottom margin-medium">
                  <h3 data-w-id={ids.text} style={INITIAL_STYLE.hidden}>
                    {block.text}
                  </h3>
                </div>
                <CtaLink block={block} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Stay Ahead": newsletter teaser with overlapping images. */
function StayAhead({ block }: { block: CommunityBenefitsContent['stayAhead'] }) {
  const ids = MOTION_IDS.stayAhead;
  return (
    <section data-w-id={ids.section} style={INITIAL_STYLE.hidden} className="section_layout1">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-xlarge padding-mobile-sm">
            <div className="layout1_component">
              <div
                id="w-node-_2dd87a21-0182-f49b-1484-fe6ddb1cc347-a6a2ca3f"
                className="w-layout-layout quick-stack-3 wf-layout-layout"
              >
                <div id="w-node-_7d2e2bed-5dfa-7963-7cf3-625957e85456-a6a2ca3f" className="w-layout-cell cell-4">
                  <div className="img-wrappers-2">
                    <div className="layout1_image-wrapper-copy">
                      <SectionImage image={block.images.main} sizes="100vw" />
                    </div>
                    <div data-w-id={ids.overlay} className="layout1_image-wrapper-3 img-parallax">
                      <WipeImage>
                        <SectionImage image={block.images.overlay} />
                      </WipeImage>
                    </div>
                  </div>
                </div>
                <div id="w-node-_2803b418-caff-4450-7348-22eb0918df50-a6a2ca3f" className="w-layout-cell cell-2">
                  <div className="max-width-small">
                    <AccentHeading heading={block.heading} className="heading-style-h1" />
                  </div>
                </div>
                <div className="w-layout-cell cell-3">
                  <div className="max-width-small">
                    <div className="margin-bottom margin-medium">
                      <h3 data-w-id={ids.text} style={INITIAL_STYLE.hidden}>
                        {block.text}
                      </h3>
                    </div>
                    <CtaLink block={block} />
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

export function CommunityBenefits({ content }: { content: CommunityBenefitsContent }) {
  return (
    <>
      <LearnFromTheBest block={content.learn} />
      <ExpandYourNetwork block={content.network} />
      <StayAhead block={content.stayAhead} />
    </>
  );
}
