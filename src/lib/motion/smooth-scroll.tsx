'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';

let instance: Lenis | null = null;

/** The active Lenis instance, or null (reduced motion, or not mounted yet). */
export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger and Lenis share one
 * frame loop. Native scrolling stays in charge of touch devices (Lenis default), and nothing
 * is hijacked: wheel input is only eased, never redirected or pinned.
 *
 * Also routes in-page anchor links (`href="#…"`) through Lenis and moves focus to the target
 * for keyboard and screen-reader users. With reduced motion Lenis is not created and the
 * browser handles anchors natively.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tick: ((time: number) => void) | null = null;

    if (!reduced) {
      // Duration mode with an ease-out-quart curve. Measured against lerp mode on simulated
      // trackpad input (irregular event timing), this produced the steadier scroll velocity.
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        anchors: false,
        autoRaf: false,
      });
      instance = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href') ?? '';
      const target = hash === '#top' || hash === '#' ? document.body : document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();

      const focusTarget = () => {
        const el = target === document.body ? document.getElementById('main-content') : target;
        if (!el) return;
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      };

      if (instance) {
        instance.scrollTo(target === document.body ? 0 : target, {
          duration: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          onComplete: focusTarget,
        });
      } else {
        (target === document.body ? document.documentElement : target).scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
        });
        focusTarget();
      }
      if (hash !== '#top') history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
    };
  }, []);

  return null;
}
