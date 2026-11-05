import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="main-wrapper">
      <section className="section_header-centered">
        <div className="padding-global">
          <div className="container-large">
            <div className="padding-section-large text-align-center">
              <h1>Page not found</h1>
              <div className="margin-top margin-medium">
                <p>This page doesn’t exist yet.</p>
              </div>
              <div className="margin-top margin-medium">
                <Link href="/" className="button w-button">
                  Back to the homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
