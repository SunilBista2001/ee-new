'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger, SplitText } from './gsap';

/**
 * Restrained page motion, attached through data attributes:
 *
 *  [data-hero-title]     headline lines rise out of a mask on load
 *  [data-hero-item]      hero copy, buttons and cards fade up on load
 *  [data-reveal=words]   a statement fills in from grey to ink, word by word, with the scroll
 *  [data-reveal=lines]   section headings: line-by-line reveal on scroll
 *  [data-reveal=fade]    gentle fade-up on scroll
 *  [data-reveal=clip]    images rise and settle into place on scroll (compositor-only)
 *  [data-reveal=mask]    image frames wipe open from the bottom while the image settles
 *  [data-stagger]        a grid revealed as one group (children: [data-stagger-item])
 *  [data-count]          a number counts up from zero when it enters ("1,000+" keeps its format)
 *  [data-inview]         gets the class `in-view` once on screen (drives CSS-only effects)
 *  [data-expand]         a full-bleed panel grows from an inset, rounded frame to the full width
 *                        with the scroll (`data-expand="load"`: tied to the first screen)
 *  [data-scrub-x="n"]    a row slides n% sideways across its pass through the viewport
 *  [data-parallax]       images drift a few percent inside their frame (≥768px only)
 *  [data-drift="n"]      a whole element floats n px against the scroll (≥768px only)
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
    const restores: (() => void)[] = [];
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

      // Mask reveals: the frame wipes open while the image inside eases back from a zoom.
      gsap.utils.toArray<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
        const inner = el.querySelector('img, video');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, ...once } });
        tl.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' },
          0,
        );
        if (inner) tl.fromTo(inner, { scale: 1.22 }, { scale: 1, duration: 1.9, ease, force3D: true }, 0);
      });

      // Counters: server-rendered with the final value, counted up from zero on entry.
      const numberFormat = new Intl.NumberFormat('en-US');
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const text = el.textContent ?? '';
        const match = /[\d,]+/.exec(text);
        if (!match) return;
        const target = Number(match[0].replace(/,/g, ''));
        const prefix = text.slice(0, match.index);
        const suffix = text.slice(match.index + match[0].length);
        const state = { value: 0 };
        const render = () => {
          el.textContent = prefix + numberFormat.format(Math.round(state.value)) + suffix;
        };
        render();
        restores.push(() => {
          el.textContent = text;
        });
        gsap.to(state, {
          value: target,
          duration: 2.2,
          ease: 'power3.out',
          onUpdate: render,
          // Start as soon as the number is on screen, so it is never seen resting at zero.
          scrollTrigger: { trigger: el, start: 'top bottom', once: true },
        });
      });

      // CSS-driven effects (rules drawing in, strike-throughs): just flag the element.
      gsap.utils.toArray<HTMLElement>('[data-inview]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          once: true,
          onEnter: () => el.classList.add('in-view'),
        });
        restores.push(() => el.classList.remove('in-view'));
      });

      // Full-bleed panels open out from an inset frame. clip-path keeps it on the compositor.
      gsap.utils.toArray<HTMLElement>('[data-expand]').forEach((el) => {
        const onLoad = el.dataset.expand === 'load';
        gsap.fromTo(
          el,
          { clipPath: 'inset(0% 2.5% 0% 2.5% round 20px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: onLoad
              ? { start: 0, end: () => window.innerHeight * 0.55, scrub: true }
              : { trigger: el, start: 'top 92%', end: 'top 40%', scrub: true },
          },
        );
      });

      // Rows that slide sideways with the scroll (gallery).
      gsap.utils.toArray<HTMLElement>('[data-scrub-x]').forEach((el) => {
        const amount = Number(el.dataset.scrubX) || 0;
        gsap.fromTo(
          el,
          { xPercent: amount > 0 ? -amount : 0 },
          {
            xPercent: amount > 0 ? 0 : amount,
            ease: 'none',
            force3D: true,
            scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
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
      mm.add('(min-width: 768px)', () => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((img) => {
          const frame = img.parentElement ?? img;
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: 'none',
              // Keep the GPU layer for the whole scrub; with force3D "auto" GSAP drops it at
              // progress 0/1 and re-creates it on the next frame, which stutters.
              force3D: true,
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });

        // Floating elements move against the scroll at their own pace.
        gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
          const amount = Number(el.dataset.drift) || 0;
          gsap.fromTo(
            el,
            { y: amount },
            {
              y: -amount,
              ease: 'none',
              force3D: true,
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
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
      restores.forEach((restore) => restore());
    };
  }, []);

  return null;
}
