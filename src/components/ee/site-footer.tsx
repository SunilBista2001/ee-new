import type { SiteSettings } from '@/services/content';
import { BrandMark } from './primitives';

/** Light footer: brand, navigation, social, contact, legal. */
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { footer, contact, brand } = settings;
  return (
    <footer className="footer" id="contact" tabIndex={-1}>
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" className="footer__logo" aria-label={`${brand.name}, back to top`}>
              <BrandMark className="footer__mark" />
              <span aria-hidden="true">
                Elite <span>Entrepreneurs</span>
              </span>
            </a>
            <p className="footer__tagline">{brand.tagline}</p>
            <p className="footer__desc">{footer.description}</p>
          </div>

          <div className="footer__cols">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title} className="footer__col">
                <p className="footer__title">{col.title}</p>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="footer__link"
                        {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {link.label}
                        {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="footer__col">
              <p className="footer__title">Contact</p>
              <address>
                <a href={`mailto:${contact.email}`} className="footer__link footer__email">
                  {contact.email}
                </a>
                <span className="footer__location">{contact.location}</span>
              </address>
            </div>
          </div>
        </div>

        {/* Decorative: the text is CSS-generated so it stays out of the accessibility tree. */}
        <div className="footer__wordmark" data-text="Elite Entrepreneurs" aria-hidden="true" />

        <div className="footer__legal">
          <p>{footer.copyright}</p>
          <div className="footer__legal-links">
            <a href={footer.credit.href} target="_blank" rel="noopener noreferrer" className="footer__link">
              {footer.credit.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href="#top" className="footer__link">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
