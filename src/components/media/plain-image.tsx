import type { ImgHTMLAttributes } from 'react';
import type { PlainImage as PlainImageAsset } from '@/services/content';

type PlainImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & { image: PlainImageAsset };

/**
 * For SVG logos/icons, animated GIFs and small logos: next/image cannot optimise these
 * (SVG/GIF are served as-is), and the approved layout relies on their intrinsic sizing,
 * so they render as a native lazy <img>.
 */
export function PlainImage({ image, loading = 'lazy', ...rest }: PlainImageProps) {
  // eslint-disable-next-line @next/next/no-img-element -- see component doc
  return <img src={image.src} alt={image.alt} loading={loading} {...rest} />;
}
