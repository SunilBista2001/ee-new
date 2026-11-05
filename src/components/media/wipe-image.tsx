import type { ReactNode } from 'react';

interface WipeImageProps {
  /** "wipe-container" in the hero, "wipe-wrapper" in content sections. */
  wrapperClass?: 'wipe-container' | 'wipe-wrapper';
  children: ReactNode;
}

/** Image with the `.img-highlight` cover that wipes away on scroll (IX2 a-46 "Highlight"). */
export function WipeImage({ wrapperClass = 'wipe-wrapper', children }: WipeImageProps) {
  return (
    <div className={wrapperClass}>
      <div className="img-highlight" aria-hidden="true" />
      {children}
    </div>
  );
}
