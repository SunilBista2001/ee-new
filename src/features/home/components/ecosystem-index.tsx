import Image from 'next/image';
import { ArrowIcon, SlotText } from '@/components/ee/primitives';
import { cn } from '@/lib/utils';
import type { EcosystemItem } from '@/services/content';

/**
 * The ecosystem as a giant-type index. Each format is one hairline-ruled row; on desktop,
 * hovering (or tabbing to) a row slides its name over and opens that format's photo in the
 * empty space on the right. Below 992px there is no hover, so each row carries its photo
 * above the name. Pure CSS: no client JS.
 */
export function EcosystemIndex({ items }: { items: EcosystemItem[] }) {
  return (
    <ol className="eco" data-stagger>
      {items.map((item, i) => (
        <li key={item.name} className={cn('eco__row', item.href && 'is-link')} data-stagger-item>
          <div className="eco__media">
            <Image
              src={item.image.src}
              alt=""
              width={item.image.width}
              height={item.image.height}
              sizes="(min-width: 992px) 300px, (min-width: 640px) 46vw, 92vw"
              style={item.image.focus ? { objectPosition: item.image.focus } : undefined}
            />
          </div>

          <div className="eco__main">
            <h3 className="eco__name">
              {item.href ? (
                <a href={item.href} className="eco__link">
                  <SlotText text={item.name} />
                </a>
              ) : (
                <SlotText text={item.name} />
              )}
              <span className="eco__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </h3>
            {item.text ? <p className="eco__text">{item.text}</p> : null}
          </div>

          <span className="eco__end">
            {item.status ? <span className="tag">{item.status}</span> : null}
            {item.href ? (
              <span className="eco__go" aria-hidden="true">
                <ArrowIcon />
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
