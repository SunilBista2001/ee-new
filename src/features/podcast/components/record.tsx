import { BrandMark } from '@/components/ee/primitives';
import { cn } from '@/lib/utils';

const GROOVES = [46, 52, 58, 64, 70, 76, 82, 88, 94];

/**
 * A record with the Elite mark on its label. The disc turns (CSS, paused off screen and with
 * reduced motion); the sheen sits on a separate layer that stays put, as light would.
 * Decorative only.
 */
export function Record({ className }: { className?: string }) {
  return (
    <span className={cn('pc-record', className)} aria-hidden="true">
      <span className="pc-record__disc">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="99" className="pc-record__vinyl" />
          {GROOVES.map((r) => (
            <circle key={r} cx="100" cy="100" r={r} className="pc-record__groove" />
          ))}
          <circle cx="100" cy="100" r="36" className="pc-record__label" />
          <circle cx="100" cy="100" r="30" className="pc-record__label-ring" />
          <circle cx="100" cy="100" r="3.2" className="pc-record__hole" />
        </svg>
        <BrandMark className="pc-record__mark" />
      </span>
      <span className="pc-record__sheen" />
    </span>
  );
}
