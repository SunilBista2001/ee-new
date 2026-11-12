import Image from 'next/image';
import { SectionIndex } from '@/components/ee/primitives';
import { RecapVideo } from '@/features/home/components/recap-video';
import type { GalleryContent, ImageAsset } from '@/services/content';

function Row({ photos, shift, variant }: { photos: ImageAsset[]; shift: number; variant: 'a' | 'b' }) {
  return (
    <ul className={`hm-gal__row hm-gal__row--${variant}`} data-scrub-x={shift}>
      {photos.map((photo) => (
        <li key={photo.src} className="hm-gal__tile">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 768px) 38vw, 60vw"
            style={photo.focus ? { objectPosition: photo.focus } : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * What it feels like: the recap video, then two full-bleed rows of photos that slide in
 * opposite directions as the page scrolls.
 */
export function Gallery({ content }: { content: GalleryContent }) {
  const half = Math.ceil(content.photos.length / 2);
  return (
    <section id="gallery" className="section hm-gal" aria-labelledby="gal-title" tabIndex={-1}>
      <div className="wrap">
        <SectionIndex index={content.index} />
        <h2 id="gal-title" className="hm-h2 hm-head" data-reveal="lines">
          {content.heading}
        </h2>
        <RecapVideo video={content.video} />
      </div>

      <div className="hm-gal__rows">
        <Row photos={content.photos.slice(0, half)} shift={-6} variant="a" />
        <Row photos={content.photos.slice(half)} shift={6} variant="b" />
      </div>
    </section>
  );
}
