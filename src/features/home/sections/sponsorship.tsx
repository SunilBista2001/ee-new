import { Fragment } from 'react';
import { PlainImage } from '@/components/media/plain-image';
import { INITIAL_STYLE, MOTION_IDS, SPONSOR_IDS } from '@/lib/motion/reveal-config';
import type { SponsorRow, SponsorshipContent } from '@/services/content';

/** Perks are laid out in three Webflow columns of 2, 2 and 1 items (class per column). */
const PERK_COLUMNS = [
  { className: 'div-block-13', size: 2 },
  { className: 'div-block-14', size: 2 },
  { className: undefined, size: 1 },
] as const;

/** Marquee track class per direction (animations from the original embed CSS). */
const TRACK_CLASS: Record<SponsorRow['direction'], string> = {
  left: 'track-horizontal',
  right: 'marquee-horizontal-alt-right',
};

/** Decorative marquee word; the rows are aria-hidden and sponsors are listed for screen readers below. */
function ThankYou({ thankYou }: { thankYou: SponsorshipContent['thankYou'] }) {
  return (
    <h2 className="heading-style-h1">
      {thankYou.before}
      <span className="h1-span">{thankYou.accent}</span>
    </h2>
  );
}

function SponsorMarquee({ row, thankYou }: { row: SponsorRow; thankYou: SponsorshipContent['thankYou'] }) {
  return (
    <div className="padding-bottom padding-xxhuge">
      <div className="marquee-horizontal-headline">
        <div className={TRACK_CLASS[row.direction]}>
          <ThankYou thankYou={thankYou} />
          {row.logos.map((logo) => (
            <Fragment key={logo.src}>
              <div className="logo-pill">
                <PlainImage image={logo} className="logo-tile" />
              </div>
              <ThankYou thankYou={thankYou} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Splits the perks list into the three fixed Webflow columns. */
function toColumns(perks: SponsorshipContent['perks']) {
  let start = 0;
  return PERK_COLUMNS.map((column) => {
    const items = perks.slice(start, start + column.size).map((perk, i) => ({ perk, index: start + i }));
    start += column.size;
    return { ...column, items };
  });
}

export function Sponsorship({ content }: { content: SponsorshipContent }) {
  return (
    <section aria-labelledby="sponsorship-heading">
      <div data-w-id={MOTION_IDS.sponsorship.section} style={INITIAL_STYLE.hidden} className="padding-global">
        <div className="container-large">
          <div className="padding-section-large padding-mobile-small">
            <div className="cta8_component-3">
              <div data-w-id={MOTION_IDS.sponsorship.grid} className="w-layout-grid grid">
                <div id="w-node-_224b7677-c11e-e977-3d6a-5d5ec77b7efc-a6a2ca3f" className="div-block-36">
                  <div className="margin-bottom margin-xsmall">
                    <div className="text-style-tagline outline">{content.tagline}</div>
                  </div>
                  <h2 id="sponsorship-heading" data-scramble="">
                    {content.heading}
                  </h2>
                </div>
                {toColumns(content.perks).map((column) => (
                  <div key={column.className ?? 'last'} className={column.className}>
                    {column.items.map(({ perk, index }, i) => (
                      <div
                        key={perk.title}
                        data-w-id={SPONSOR_IDS[index]}
                        style={INITIAL_STYLE.slideUpSmall}
                        className={i === 0 ? 'margin-bottom margin-medium' : undefined}
                      >
                        <div className="margin-bottom margin-xsmall">
                          <p>
                            <span className="text-highlight-h1">{perk.title}</span>
                          </p>
                        </div>
                        <p>{perk.text}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-large">
        <ul className="tw:sr-only" aria-label="Sponsors">
          {content.sponsorRows
            .flatMap((row) => row.logos)
            .map((logo) => (
              <li key={logo.src}>{logo.alt}</li>
            ))}
        </ul>
        <div aria-hidden="true">
          {content.sponsorRows.map((row, index) => (
            <SponsorMarquee key={index} row={row} thankYou={content.thankYou} />
          ))}
        </div>
        <div className="padding-global">
          <div className="container-large">
            <div className="margin-top margin-medium">
              <div className="button-group is-right is-center-mobile">
                <a href={content.cta.href} className="button w-button">
                  {content.cta.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
