'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { GalleryContent } from '@/services/content';

/**
 * Recap video: a poster with a play button. The video file is only requested once the visitor
 * presses play, then it takes over the frame with native controls.
 */
export function RecapVideo({ video }: { video: GalleryContent['video'] }) {
  const [playing, setPlaying] = useState(false);
  const { poster } = video;

  return (
    <div className="recap" data-reveal="mask">
      {playing ? (
        <video className="recap__video" src={video.src} poster={poster.src} controls autoPlay playsInline />
      ) : (
        <>
          <Image
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            sizes="(min-width: 1400px) 1320px, 94vw"
            quality={85}
            className="recap__poster"
            style={poster.focus ? { objectPosition: poster.focus } : undefined}
            data-parallax=""
          />
          <button type="button" className="recap__play" onClick={() => setPlaying(true)} aria-label={video.playLabel}>
            <span className="recap__disc" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M9 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
