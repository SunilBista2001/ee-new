import { PlainImage } from '@/components/media/plain-image';
import { INITIAL_STYLE, LOGO_STACK_IDS, MOTION_IDS } from '@/lib/motion/reveal-config';
import type { TrustedCompaniesContent } from '@/services/content';

/** Webflow grid placement per logo position: [node id, size variant]. */
const LOGO_SLOTS = [
  ['w-node-_21ef2c0d-5db0-00af-aa33-d53cf610cad8-a6a2ca3f', '_1'],
  ['w-node-_7da3bbf3-8f8b-ea8a-1996-5c45993bac63-a6a2ca3f', '_2'],
  ['w-node-a3e6dfbc-797e-d371-107f-46b7ded3b2ce-a6a2ca3f', '_2'],
  ['w-node-_94f97c73-c136-463a-f2a1-49a1e9daf043-a6a2ca3f', '_2'],
  ['w-node-_28aa4f18-fd77-c968-096e-38f1bd407fa4-a6a2ca3f', '_2'],
] as const;

/** Stagger order follows the original DOM (logo 3 and 4 swap ids between grid and IX2). */
const LOGO_MOTION_IDS = [LOGO_STACK_IDS[0], LOGO_STACK_IDS[1], LOGO_STACK_IDS[3], LOGO_STACK_IDS[2], LOGO_STACK_IDS[4]];

export function TrustedCompanies({ content }: { content: TrustedCompaniesContent }) {
  return (
    <section className="section_logo1">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-top padding-medium">
            <div className="logo1_component">
              <div className="logo1_content">
                <div className="margin-bottom margin-medium">
                  <h3 className="heading-style-h2-1 align-center-mobile">{content.heading}</h3>
                </div>
                <div
                  id="w-node-_21ef2c0d-5db0-00af-aa33-d53cf610cad7-a6a2ca3f"
                  data-w-id={MOTION_IDS.trusted.grid}
                  className="w-layout-layout quick-stack wf-layout-layout"
                >
                  {content.logos.map((logo, index) => {
                    const [nodeId, variant] = LOGO_SLOTS[index] ?? [undefined, '_2'];
                    return (
                      <div
                        key={logo.src}
                        id={nodeId}
                        data-w-id={LOGO_MOTION_IDS[index]}
                        style={INITIAL_STYLE.rise}
                        className={`w-layout-cell logo-card ${variant}`}
                      >
                        <PlainImage image={logo} className="logo1_logo" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
