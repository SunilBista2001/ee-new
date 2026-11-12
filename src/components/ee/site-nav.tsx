'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Brand, ContactInfo, Navigation } from '@/services/content';
import { gsap } from '@/lib/motion/gsap';
import { getLenis } from '@/lib/motion/smooth-scroll';
import { cn } from '@/lib/utils';
import { BrandMark, ButtonLink } from './primitives';

/**
 * Sticky light navigation. Sits flush on the page at the top, gains a hairline border and a
 * soft frosted background once scrolled, and tucks away while scrolling down (back on the way
 * up). Active section is tracked with IntersectionObserver. Below 992px the links move into a
 * sheet menu (focus trapped, Escape closes, focus returns to the toggle).
 */
export function SiteNav({
  brand,
  navigation,
  contact,
  homeHref = '#top',
}: {
  brand: Brand;
  navigation: Navigation;
  contact: ContactInfo;
  /** Target of the logo: back to the top on the homepage, the homepage elsewhere. */
  homeHref?: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Scroll state.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > window.innerHeight * 0.8 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y < 80) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section.
  useEffect(() => {
    const ids = navigation.primary.map((l) => l.href.replace('#', ''));
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Sections outside the nav (hero, gallery…) clear the highlight.
        setActive(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [navigation.primary]);

  // Menu open/close animation.
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      timeline.current = gsap
        .timeline({ paused: true })
        .set(menu, { visibility: 'visible' })
        .fromTo(menu, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.3, ease: 'power2.out' })
        .fromTo(
          '[data-menu-item]',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: reduced ? 0 : 0.5, ease: 'expo.out', stagger: 0.04 },
          reduced ? 0 : '-=0.15',
        )
        .fromTo('[data-menu-fade]', { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.4 }, '<0.15');
    }, menu);
    return () => ctx.revert();
  }, []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const tl = timeline.current;
    const lenis = getLenis();
    if (open) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
      tl?.timeScale(1).play();
      // Visible right away (the timeline's own set runs on the next tick) so focus can land.
      if (menuRef.current) gsap.set(menuRef.current, { visibility: 'visible' });
      menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    } else {
      document.body.style.overflow = '';
      lenis?.start();
      tl?.timeScale(1.8).reverse();
    }
  }, [open]);

  // Close the menu when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 992px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab' || !menuRef.current) return;
    const focusables = [toggleRef.current, ...menuRef.current.querySelectorAll<HTMLElement>('a[href], button')].filter(
      Boolean,
    ) as HTMLElement[];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  return (
    <header
      className={cn('nav', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', open && 'is-open')}
      onKeyDown={open ? onMenuKeyDown : undefined}
    >
      <div className="nav__bar wrap">
        <a
          href={homeHref}
          className="nav__brand"
          aria-label={homeHref === '#top' ? `${brand.name}, back to top` : `${brand.name}, home`}
        >
          <BrandMark className="nav__mark" />
          <span className="nav__wordmark" aria-hidden="true">
            Elite <span>Entrepreneurs</span>
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {navigation.primary.map((link) => {
              const id = link.href.replace('#', '');
              const isPage = link.href === pathname;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn('nav__link', (active === id || isPage) && 'is-active')}
                    aria-current={isPage ? 'page' : active === id ? 'location' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav__actions">
          <ButtonLink link={navigation.cta} size="sm" className="nav__cta" />
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nav__burger" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu__inner wrap">
          <nav aria-label="Mobile">
            <ul className="menu__list">
              {navigation.primary.map((link) => (
                <li key={link.href} data-menu-item>
                  <a href={link.href} className="menu__link" onClick={() => close(false)}>
                    {link.label}
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="menu__foot" data-menu-fade>
            <ButtonLink link={navigation.cta} onClick={() => close(false)} className="menu__cta" />
            <div className="menu__contact">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <p>{contact.location}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
