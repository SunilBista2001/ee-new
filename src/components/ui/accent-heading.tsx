import type { HTMLAttributes } from 'react';
import type { AccentHeading as AccentHeadingContent } from '@/services/content';

const ZERO_WIDTH_JOINER = '‍';

interface AccentHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  heading: AccentHeadingContent;
  as?: 'h1' | 'h2';
  /** Scramble the accent word into view (original custom GSAP effect). */
  scrambleAccent?: boolean;
}

/** Heading with one word set in the pixel display font (`.h1-span`). */
export function AccentHeading({ heading, as: Tag = 'h2', scrambleAccent = true, ...rest }: AccentHeadingProps) {
  return (
    <Tag {...rest}>
      {heading.before}
      {heading.breakBeforeAccent ? (
        <>
          <br />
          {ZERO_WIDTH_JOINER}
        </>
      ) : null}
      <span data-scramble={scrambleAccent ? '' : undefined} className="h1-span">
        {heading.accent}
      </span>
      {heading.after}
    </Tag>
  );
}
