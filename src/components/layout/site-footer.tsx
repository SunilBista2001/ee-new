import { Wordmark } from '@/components/icons/wordmark';
import { NewsletterForm } from '@/features/newsletter/newsletter-form';
import type { FooterColumn as FooterColumnContent, Link, SiteSettings } from '@/services/content';

/** Webflow grid ids of the footer link columns, by position (the CSS places cells by id). */
const COLUMN_NODE_IDS = ['w-node-d468ba35-6def-841d-9685-8f1cdf26c2c0-df26c2b8'];

const externalProps = (link: Link) => (link.external ? { target: '_blank', rel: 'noopener noreferrer' } : null);

function FooterColumn({ column, nodeId }: { column: FooterColumnContent; nodeId?: string }) {
  const social = column.variant === 'social';
  return (
    <div id={nodeId} className="footer1_link-column">
      <div className="margin-bottom margin-xlarge">
        <h3>{column.title}</h3>
      </div>
      <div className="footer1_link-list">
        {column.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={social ? 'footer1_social-link w-inline-block' : 'footer1_link'}
            {...externalProps(link)}
          >
            {social ? <div>{link.label}</div> : link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { brand, footer, newsletter } = settings;
  return (
    <div>
      <section aria-hidden="true">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-top padding-xhuge">
              <div className="w-embed">
                <Wordmark title={brand.name} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-hor-grid" aria-hidden="true">
        <div className="padding-global">
          <div className="container-large" />
        </div>
      </section>
      <footer className="footer1_component">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-vertical">
              <div className="padding-bottom padding-xxlarge">
                <div className="w-layout-grid footer1_top-wrapper">
                  <div id="w-node-d468ba35-6def-841d-9685-8f1cdf26c2b9-df26c2b8" className="footer1_left-wrapper">
                    <div className="margin-bottom margin-xlarge">
                      <h3 className="heading-style-h2">{footer.newsletterHeading}</h3>
                    </div>
                    <NewsletterForm copy={newsletter} />
                  </div>
                  <div className="w-layout-grid footer1_menu-wrapper">
                    {footer.columns.map((column, index) => (
                      <FooterColumn key={column.title} column={column} nodeId={COLUMN_NODE_IDS[index]} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="padding-bottom padding-large">
                <div className="padding-top padding-medium">
                  <div className="footer1_bottom-wrapper">
                    <div className="footer1_credit-text">
                      {footer.copyright}{' '}
                      <span className="footer1_powered-by">
                        <span className="footer1_powered-by-separator" aria-hidden="true">
                          ·
                        </span>{' '}
                        Powered by{' '}
                        <a
                          href={brand.poweredBy.href}
                          className="footer1_powered-by-name"
                          {...externalProps(brand.poweredBy)}
                        >
                          {brand.poweredBy.label}
                        </a>
                      </span>
                    </div>
                    <nav aria-label="Legal" className="w-layout-grid footer1_legal-list">
                      {footer.legal.map((link) => (
                        <a key={link.label} href={link.href} className="footer1_legal-link" {...externalProps(link)}>
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
