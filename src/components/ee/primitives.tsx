import Image from 'next/image';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Headline, ImageAsset, Link } from '@/services/content';
import { cn } from '@/lib/utils';

/**
 * Shared building blocks of the Elite design system. All are Server Components; motion is
 * attached by `PageMotion` through `data-*` hooks, so nothing here ships client JS.
 */

export function ArrowIcon({ className, external }: { className?: string; external?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={cn('btn__icon', className)} aria-hidden="true">
      {external ? (
        <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path
          d="M3 8h10M9 4l4 4-4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

const externalProps = (link: Link) =>
  link.external ? ({ target: '_blank', rel: 'noopener noreferrer' } as const) : ({} as const);

type ButtonVariant = 'primary' | 'secondary' | 'light';

/** A link styled as a button. External links get a new-tab hint for screen readers. */
export function ButtonLink({
  link,
  variant = 'primary',
  size,
  className,
  icon = true,
  ...rest
}: {
  link: Link;
  variant?: ButtonVariant;
  size?: 'sm';
  icon?: boolean;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  return (
    <a
      href={link.href}
      className={cn('btn', `btn--${variant}`, size && `btn--${size}`, className)}
      {...externalProps(link)}
      {...rest}
    >
      <span className="btn__label">{link.label}</span>
      {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      {icon ? (
        <span className="btn__chip" aria-hidden="true">
          <ArrowIcon external={link.external} />
        </span>
      ) : null}
    </a>
  );
}

/** Underlined text link with an arrow. */
export function TextLink({ link, className }: { link: Link; className?: string }) {
  return (
    <a href={link.href} className={cn('tlink', className)} {...externalProps(link)}>
      <span>{link.label}</span>
      {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      <ArrowIcon external={link.external} />
    </a>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('eyebrow', className)}>{children}</p>;
}

/** Numbered section marker on a hairline with corner ticks, e.g. "01 — About Elite". */
export function SectionIndex({ index, label, aside }: { index: string; label: string; aside?: ReactNode }) {
  return (
    <div className="sx" data-reveal="fade">
      <p className="sx__label">
        <span className="sx__num">{index} —</span>
        {label}
      </p>
      {aside ? <div className="sx__aside">{aside}</div> : null}
    </div>
  );
}

/** Headline text with an optional closing phrase set in the italic serif. */
export function HeadlineText({ headline }: { headline: Headline }) {
  return (
    <>
      {headline.text}
      {headline.accent ? (
        <>
          {' '}
          <span className="serif">{headline.accent}</span>
        </>
      ) : null}
    </>
  );
}

/** Section index (or eyebrow) + heading (+ optional intro/side content). `split` puts the side column right on desktop. */
export function SectionHeader({
  id,
  index,
  label,
  heading,
  intro,
  side,
  split,
  className,
}: {
  id?: string;
  index?: string;
  label: string;
  heading: ReactNode;
  intro?: string;
  side?: ReactNode;
  split?: boolean;
  className?: string;
}) {
  return (
    <header className={cn('sh', split && 'sh--split', className)}>
      {index ? <SectionIndex index={index} label={label} /> : <Eyebrow>{label}</Eyebrow>}
      <h2 id={id} className="h2" data-reveal="lines">
        {heading}
      </h2>
      {intro || side ? (
        <div className="sh__side" data-reveal="fade">
          {intro ? <p className="sh__intro">{intro}</p> : null}
          {side}
        </div>
      ) : null}
    </header>
  );
}

/** Rounded image frame. `parallax` lets PageMotion drift the image a little on scroll. */
export function Photo({
  image,
  sizes,
  priority,
  className,
  parallax,
  reveal = true,
}: {
  image: ImageAsset;
  sizes: string;
  priority?: boolean;
  className?: string;
  parallax?: boolean;
  reveal?: boolean;
}) {
  return (
    <div className={cn('media', className)} data-reveal={reveal ? 'clip' : undefined}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        quality={85}
        style={image.focus ? { objectPosition: image.focus } : undefined}
        data-parallax={parallax ? '' : undefined}
      />
    </div>
  );
}

/** The Elite monogram, tinted with currentColor. Decorative: pair it with visible or sr-only text. */
export function BrandMark({ className }: { className?: string }) {
  return <span className={cn('mark', className)} aria-hidden="true" />;
}
