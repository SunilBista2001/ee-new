import { PlainImage } from '@/components/media/plain-image';
import type { ReactNode } from 'react';

/** One icon + text line of event details (time, location, price). */
export function EventDetail({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <div className="detail-container">
      <PlainImage image={{ src: `/assets/images/${icon}`, alt: label }} />
      {children}
    </div>
  );
}
