'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText } from './gsap';

/**
 * Restrained page motion, attached through data attributes:
 *
 *  [data-hero-title]     headline lines rise out of a mask on load
 *  [data-hero-item]      hero copy, buttons and cards fade up on load
 *  [data-hero-float]     floating hero photos pop in, then drift at their own pace on scroll
 *  [data-hero-pill]      the photo pill inside the headline widens open
 *  [data-reveal=words]   a statement fills in from grey to ink, word by word, with the scroll
 *  [data-reveal=lines]   section headings: line-by-line reveal on scroll
 *  [data-reveal=fade]    gentle fade-up on scroll
 *  [data-reveal=clip]    images rise and settle into place on scroll (compositor-only)
 *  [data-stagger]        a grid revealed as one group (children: [data-stagger-item])
 *  [data-parallax]       images drift a few percent while in view (≥768px only)
 *
 * Nothing runs with prefers-reduced-motion: the CSS pre-states only apply under `has-motion`.
 * Scrolling is never pinned or hijacked.
 */
export function PageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('has-motion')) {
      root.classList.add('motion-ready');
      return;
    }

    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const ease = 'expo.out';
      const once = { start: 'top 88%', once: true } as const;

      const splitLines = (el: Element) => {
        const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
        splits.push(split);
        gsap.set(el, { opacity: 1 });
        return split.lines;
      };

      // Hero: one short, orchestrated entrance.
      const hero = gsap.timeline({ defaults: { ease } });
      const heroTitle = document.querySelector('[data-hero-title]');
      if (heroTitle) {
        hero.fromTo(splitLines(heroTitle), { yPercent: 105 }, { yPercent: 0, duration: 1.2, stagger: 0.08 }, 0.1);
      }
      hero.fromTo(
        '[data-hero-item]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.08, clearProps: 'transform' },
        0.35,
      );
      hero.fromTo(
        '[data-hero-pill]',
        { clipPath: 'inset(0% 50% 0% 50% round 999px)', opacity: 1 },
        { clipPath: 'inset(0% 0% 0% 0% round 999px)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' },
        0.2,
      );
      hero.fromTo(
        '[data-hero-float]',
        { opacity: 0, scale: 0.85, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 1.4, stagger: 0.1, clearProps: 'transform' },
        0.5,
      );

      // Statement: words fill from grey to ink while the paragraph crosses the viewport.
      gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
        const split = new SplitText(el, { type: 'words' });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { color: '#cdbfae' } /* light taupe, before the words fill in */,
          {
            color: (i, target: Element) => getComputedStyle(target.parentElement ?? el).color,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        );
      });

      // Section headings.
      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        const lines = splitLines(el);
        gsap.fromTo(
          lines,
          { yPercent: 105 },
          { yPercent: 0, duration: 1.1, ease, stagger: 0.07, scrollTrigger: { trigger: el, ...once } },
        );
      });

      // Fades.
      gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease,
            clearProps: 'transform',
            scrollTrigger: { trigger: el, ...once },
          },
        );
      });

      // Image reveals: transform + opacity only, so they run on the compositor (no repaint per
      // frame). The frame is animated, never the image inside it, whose transform belongs to
      // the parallax tween; two tweens on one transform is a classic source of jitter.
      gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.3,
            ease,
            force3D: true,
            clearProps: 'transform,opacity',
            scrollTrigger: { trigger: el, ...once },
          },
        );
      });

      // Grids reveal as one group with a short stagger.
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = group.querySelectorAll('[data-stagger-item]');
        gsap.fromTo(
          items,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease,
            stagger: { each: 0.06, from: 'start' },
            force3D: true,
            clearProps: 'transform',
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          },
        );
      });

      // Subtle parallax on large images, larger screens only.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 992px)', () => {
        // Hero photos drift at different speeds as the page leaves the hero.
        gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el) => {
          const speed = [-60, 40, -30, 70][Number(el.dataset.float) % 4] ?? 0;
          gsap.to(el, {
            y: speed,
            ease: 'none',
            force3D: true,
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          });
        });
      });
      mm.add('(min-width: 768px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((img) => {
          const frame = img.parentElement ?? img;
          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              // Keep the GPU layer for the whole scrub; with force3D "auto" GSAP drops it at
              // progress 0/1 and re-creates it on the next frame, which stutters.
              force3D: true,
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      });
    });

    root.classList.add('motion-ready');
    // Fonts can change line breaks; recompute trigger positions once they settle.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return null;
}
