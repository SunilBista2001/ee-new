import { BrandMark, Photo } from '@/components/ee/primitives';
import type { AboutPhotoSlot } from '@/services/content';
import { cn } from '@/lib/utils';

/**
 * A captioned photo slot. With an image it is a regular framed photo; without one it keeps the
 * same frame and proportions, quietly labelled, so the layout is final before the photo exists
 * and nothing stands in for a moment that is not ours.
 */
export function PhotoSlot({ slot, sizes, className }: { slot: AboutPhotoSlot; sizes: string; className?: string }) {
  return (
    <figure className={cn('ab-slot', !slot.image && 'is-pending', className)}>
      {slot.image ? (
        <Photo image={slot.image} sizes={sizes} className="ab-slot__frame" />
      ) : (
        <div className="media ab-slot__frame ab-slot__empty" data-reveal="fade">
          <BrandMark className="ab-slot__mark" />
          <p className="ab-slot__note">{slot.pendingNote}</p>
        </div>
      )}
      <figcaption className="ab-slot__caption">
        <span className="ab-slot__tag">{slot.tag}</span>
        {slot.caption}
      </figcaption>
    </figure>
  );
}
