'use client';

import { gsap } from 'gsap';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Logo } from '@/components/icons/logo';
import { ArrowDownIcon, ArrowRightIcon, ChevronDownIcon } from '@/components/icons/nav-icons';
import { useMediaQuery } from '@/lib/use-media-query';
import type { Navigation } from '@/services/content';
import { cn } from '@/lib/utils';

const COLLAPSE_QUERY = '(max-width: 991px)'; // Webflow data-collapse="medium"
const NAV_DURATION = 0.4; // Webflow data-duration="400"
const MORE_PANEL_ID = 'nav-more-panel';
const MENU_ID = 'nav-menu';

/** Reads a colour token from theme.css (the --tt-nav-* tokens). */
function themeToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * IX2 a-18 "Nav scroll bg": between 0% and 2% of page scroll the pill goes from transparent
 * and outlined to filled with a shadow (smoothing 50). Skipped while the mobile menu owns the pill.
 */
function useNavScrollStyle(
  containerRef: RefObject<HTMLDivElement | null>,
  shadowRef: RefObject<HTMLDivElement | null>,
  overrideRef: RefObject<boolean>,
): void {
  useEffect(() => {
    const fillRgb = themeToken('--tt-nav-scrolled-rgb');
    const borderRgb = themeToken('--tt-nav-border-rgb');
    let current = 0;
    let raf = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? Math.min(1, window.scrollY / (max * 0.02)) : 0;
      current += (target - current) * 0.5;
      if (Math.abs(target - current) < 0.001) current = target;
      const container = containerRef.current;
      const shadow = shadowRef.current;
      if (container && shadow && !overrideRef.current) {
        container.style.backgroundColor = `rgba(${fillRgb}, ${current})`;
        container.style.borderColor = `rgba(${borderRgb}, ${1 - current})`;
        shadow.style.opacity = String(current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [containerRef, shadowRef, overrideRef]);
}

interface SiteHeaderProps {
  navigation: Navigation;
  brandName: string;
  /** Server-rendered content of the "More" dropdown. */
  morePanel: ReactNode;
}

export function SiteHeader({ navigation, brandName, morePanel }: SiteHeaderProps) {
  const collapsed = useMediaQuery(COLLAPSE_QUERY);
  const [menuOpen, setMenuOpen] = useState(false); // mobile/tablet menu
  const [menuMounted, setMenuMounted] = useState(false); // menu lives in the overlay
  const [overlayHeight, setOverlayHeight] = useState<number>();
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const overrideRef = useRef(false);

  useNavScrollStyle(containerRef, shadowRef, overrideRef);

  const openMenu = useCallback(() => {
    setOverlayHeight(document.documentElement.scrollHeight);
    setMenuOpen(true);
    setMenuMounted(true);
  }, []);

  /** Opens/closes "More". Visibility outlives `open` on desktop until the fade-out completes. */
  const setMore = useCallback(
    (open: boolean) => {
      setMoreOpen(open);
      if (open) setMoreVisible(true);
      else if (collapsed) setMoreVisible(false);
    },
    [collapsed],
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMore(false);
  }, [setMore]);

  // Mobile menu slide (Webflow w-nav, data-animation="default").
  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!collapsed || !menu || !menuMounted) return;
    if (menuOpen) {
      gsap.fromTo(menu, { y: -menu.offsetHeight }, { y: 0, duration: NAV_DURATION, ease: 'power1.inOut' });
    } else {
      gsap.to(menu, {
        y: -menu.offsetHeight,
        duration: NAV_DURATION,
        ease: 'power1.inOut',
        onComplete: () => setMenuMounted(false),
      });
    }
  }, [menuOpen, menuMounted, collapsed]);

  // Icon rotation (a-2 / a-3) and pill colour (a-36 / a-37) while the menu is open.
  useEffect(() => {
    const icon = iconRef.current;
    const container = containerRef.current;
    if (!icon || !container) return;
    gsap.to(icon, { rotation: menuOpen ? 180 : 0, duration: 0.4, ease: 'power4.inOut' });
    if (menuOpen) {
      // a-2 also sets the icon colour (otherwise `.w-nav-button.w--open` makes it white).
      gsap.to(icon, { color: themeToken('--tt-nav-icon'), duration: 0.5, delay: 0.4 });
      overrideRef.current = true;
      gsap.to(container, {
        backgroundColor: themeToken('--tt-nav-open-bg'),
        borderColor: `rgba(${themeToken('--tt-nav-border-rgb')}, 0)`,
        duration: 0.5,
      });
      gsap.to(shadowRef.current, { opacity: 1, duration: 0.5 });
    } else if (overrideRef.current) {
      gsap.to(container, {
        backgroundColor: `rgba(${themeToken('--tt-nav-scrolled-rgb')}, 0)`,
        borderColor: `rgba(${themeToken('--tt-nav-border-rgb')}, 1)`,
        duration: 0.5,
        onComplete: () => {
          overrideRef.current = false;
        },
      });
    }
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  // Leaving the collapsed breakpoint resets the mobile menu (state derived from a prop change).
  const [wasCollapsed, setWasCollapsed] = useState(collapsed);
  if (wasCollapsed !== collapsed) {
    setWasCollapsed(collapsed);
    if (!collapsed) {
      setMenuOpen(false);
      setMenuMounted(false);
    }
  }
  useEffect(() => {
    if (!collapsed) overrideRef.current = false;
  }, [collapsed]);

  // "More" dropdown (w-dropdown + IX2 a-23 / a-24 on desktop).
  useLayoutEffect(() => {
    const list = listRef.current;
    const chevron = chevronRef.current;
    if (!list || !chevron) return;
    if (moreOpen) {
      if (!collapsed) {
        gsap.fromTo(list, { y: '3rem', opacity: 0 }, { y: 0, duration: 0.3, ease: 'power1.out' });
        gsap.to(list, { opacity: 1, duration: 0.2, ease: 'power1.out' });
      }
      gsap.to(chevron, { rotation: 180, duration: 0.3, ease: 'power1.out' });
      return;
    }
    gsap.to(chevron, { rotation: 0, duration: 0.3, delay: 0.1, ease: 'power1.out' });
    if (collapsed) return;
    gsap.to(list, {
      opacity: 0,
      duration: 0.2,
      delay: 0.2,
      ease: 'power1.out',
      onComplete: () => setMoreVisible(false),
    });
  }, [moreOpen, collapsed]);

  // Close on outside click and Escape (Webflow behaviour); Escape returns focus to the toggle.
  useEffect(() => {
    if (!moreOpen && !menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;
      if (moreOpen && !event.target.closest('.navbar2_menu-dropdown')) setMore(false);
      if (menuOpen && !navRef.current?.contains(event.target)) closeMenu();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (menuOpen) menuButtonRef.current?.focus();
      setMore(false);
      closeMenu();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [moreOpen, menuOpen, closeMenu, setMore]);

  const inOverlay = collapsed && menuMounted;
  const { primary, cta, more } = navigation;

  const menu = (
    <nav
      ref={menuRef}
      id={MENU_ID}
      aria-label="Main"
      className="navbar2_menu is-page-height-tablet w-nav-menu"
      data-nav-menu-open={inOverlay ? '' : undefined}
    >
      <div className="div-block-11">
        {primary.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="navbar2_link current w-nav-link"
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
          >
            {link.label}
          </a>
        ))}
        <div className={cn('navbar2_menu-dropdown w-dropdown', moreOpen && collapsed && 'w--nav-dropdown-open')}>
          <button
            type="button"
            className={cn(
              'ui-unstyled navbar2_dropdwn-toggle w-dropdown-toggle',
              moreOpen && 'w--open',
              moreOpen && collapsed && 'w--nav-dropdown-toggle-open',
            )}
            aria-expanded={moreOpen}
            aria-controls={MORE_PANEL_ID}
            onClick={() => setMore(!moreOpen)}
          >
            <div>{more.label}</div>
            <div ref={chevronRef} className="dropdown-chevron hide-mobile w-embed">
              <ChevronDownIcon />
            </div>
            <div className="dropdown-chevron hide-desktop w-embed">
              <ArrowRightIcon />
            </div>
          </button>
          <nav
            ref={listRef}
            id={MORE_PANEL_ID}
            aria-label={more.label}
            className={cn(
              'navbar2_dropdown-list w-dropdown-list',
              (moreVisible || moreOpen) && 'w--open',
              moreOpen && collapsed && 'w--nav-dropdown-list-open',
            )}
          >
            {morePanel}
          </nav>
        </div>
      </div>
      <a href={cta.href} className="button w-button">
        {cta.label}
      </a>
    </nav>
  );

  return (
    <div ref={navRef} className="navbar2_component w-nav" data-collapse="medium" role="banner">
      <div ref={containerRef} className="navbar2_container">
        <Link
          href="/"
          id="w-node-_854e75ae-8084-bd6f-a7d5-e8f06c0acf0e-6c0acf0c"
          aria-current="page"
          aria-label={`${brandName} home`}
          className="navbar2_logo-link w-nav-brand w--current"
        >
          <div className="navbar2_logo w-embed">
            <Logo title={brandName} />
          </div>
        </Link>
        {!inOverlay && menu}
        <div id="w-node-_854e75ae-8084-bd6f-a7d5-e8f06c0acf26-6c0acf0c" className="navbar2_button-wrapper">
          <button
            ref={menuButtonRef}
            type="button"
            className={cn('ui-unstyled navbar2_menu-button w-nav-button', menuOpen && 'w--open')}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
          >
            <div ref={iconRef} className="menu-icon2">
              <div className="w-embed">
                <ArrowDownIcon />
              </div>
            </div>
          </button>
        </div>
        <div ref={shadowRef} className="nav-box-shadow" />
      </div>
      <div
        className={cn('w-nav-overlay', inOverlay && 'is-open')}
        style={inOverlay ? { height: overlayHeight } : undefined}
      >
        {inOverlay && menu}
      </div>
    </div>
  );
}
