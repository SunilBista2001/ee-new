import { ButtonLink, SectionIndex } from '@/components/ee/primitives';
import { InquiryForm } from '@/features/partners/components/inquiry-form';
import type { InquiryContent, Link } from '@/services/content';

/**
 * Partnership inquiry: the final conversion point. Heading, intro and the booking option on
 * the left; the form on a raised panel on the right.
 */
export function PartnersInquiry({
  content,
  bookCall,
  contactEmail,
}: {
  content: InquiryContent;
  /** The external booking link, or null when none is configured. */
  bookCall: Link | null;
  contactEmail: string;
}) {
  return (
    <section id="inquiry" className="section pt-inq" aria-labelledby="pt-inq-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} label={content.label} />

        <div className="pt-inq__grid">
          <div className="pt-inq__head">
            <h2 id="pt-inq-title" className="hm-h2" data-reveal="lines">
              {content.heading}
            </h2>
            <p className="pt-inq__intro" data-reveal="fade">
              {content.intro}
            </p>
            <div className="pt-inq__alt" data-reveal="fade">
              {bookCall ? (
                <>
                  <p className="pt-inq__alt-label mono">Rather talk first?</p>
                  <ButtonLink link={bookCall} variant="secondary" />
                </>
              ) : null}
              <p className="pt-inq__alt-label mono">{bookCall ? 'Or email' : 'Prefer email?'}</p>
              <a className="tlink" href={`mailto:${contactEmail}?subject=Partnering%20with%20Elite%20Entrepreneurs`}>
                {contactEmail}
              </a>
            </div>
          </div>

          <div className="pt-inq__panel" data-reveal="fade">
            <InquiryForm content={content} bookCall={bookCall} contactEmail={contactEmail} />
          </div>
        </div>
      </div>
    </section>
  );
}
