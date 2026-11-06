import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

/** Same copy as before the redesign, rendered with the Elite design system. */
export default function NotFound() {
  return (
    <main id="main-content" className="not-found wrap">
      <p className="eyebrow">404</p>
      <h1 className="display">Page not found</h1>
      <p className="not-found__text">This page doesn’t exist yet.</p>
      <Link href="/" className="btn btn--primary">
        <span>Back to the homepage</span>
      </Link>
    </main>
  );
}
