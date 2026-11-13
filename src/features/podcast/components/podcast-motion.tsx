'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';

/**
 * Motion specific to the podcast page. Generic reveals (data-reveal, data-hero-item, parallax,
 * drift) stay with PageMotion; this adds:
 *
 *  [data-pc-ch]       headline letters rise out of their line, word by word
 *  [data-pc-echo]     the run of O's answers with an echo, again on hover (pointer devices)
 *  [data-pc-tuned]    "Stay tuned." tunes in: tracking closes up as it fades in
 *  [data-pc-photo]    the microphone frame wipes open; [data-pc-inset] follows
 *  [data-pc-depth=n]  frames shift up to n px against the pointer (≥992px, fine pointers)
 *  [data-pc-dial]     the dial needle tunes across the scale with the scroll
 *
 * The hero gets `is-offscreen` while out of view so its CSS loops (record, rings) pause.
 * Everything is scoped to one gsap.context and reverted on unmount.
 */
export function PodcastMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-pc-hero]');
    const cleanups: (() => void)[] = [];

    // Pause CSS loops off screen (cheap, and runs with or without motion preferences).
    if (hero) {
      const io = new IntersectionObserver(([entry]) => {
        hero.classList.toggle('is-offscreen', !entry?.isIntersecting);
      });
      io.observe(hero);
      cleanups.push(() => io.disconnect());
    }

    if (!document.documentElement.classList.contains('has-motion')) {
      return () => cleanups.forEach((fn) => fn());
    }

    const ctx = gsap.context(() => {
      const ease = 'expo.out';

      // ── Hero entrance ────────────────────────────────────────────────────────
      if (hero) {
        const tl = gsap.timeline({ defaults: { ease } });
        hero.querySelectorAll<HTMLElement>('[data-pc-line]').forEach((line, i) => {
          tl.fromTo(
            line.querySelectorAll('[data-pc-ch]'),
            { yPercent: 110, rotate: 4 },
            { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.045 },
            0.1 + i * 0.16,
          );
        });

        const echoes = hero.querySelectorAll<HTMLElement>('[data-pc-echo]');
        if (echoes.length) tl.add(echo(echoes), 1.55);

        // The disc itself turns with CSS; the wind-up turns its contents so the two never clash.
        const disc = hero.querySelectorAll('.pc-mega__ch--disc .pc-record__disc > *');
        if (disc.length) {
          tl.fromTo(
            disc,
            { rotate: -240 },
            { rotate: 0, duration: 2, ease: 'power3.out', clearProps: 'transform' },
            0.4,
          );
        }

        const tuned = hero.querySelector('[data-pc-tuned]');
        if (tuned) {
          tl.fromTo(
            tuned,
            { opacity: 0, letterSpacing: '0.35em' },
            { opacity: 1, letterSpacing: '-0.03em', duration: 1.6, ease: 'power4.out', clearProps: 'letterSpacing' },
            0.55,
          );
        }

        const photo = hero.querySelector<HTMLElement>('[data-pc-photo]');
        if (photo) {
          tl.fromTo(
            photo,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' },
            0.15,
          );
          const img = photo.querySelector('img');
          if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2, force3D: true }, 0.15);
        }

        const inset = hero.querySelector('[data-pc-inset]');
        if (inset) {
          tl.fromTo(
            inset,
            { opacity: 0, y: 40, rotate: -4 },
            { opacity: 1, y: 0, rotate: 0, duration: 1.3, clearProps: 'opacity' },
            0.8,
          );
        }

        tl.fromTo('.pc-rings', { opacity: 0 }, { opacity: 1, duration: 1.2, clearProps: 'opacity' }, 1);

        // Echo again on hover, once the entrance is done and only if one isn't running.
        const soon = hero.querySelectorAll<HTMLElement>('[data-pc-line]')[1];
        if (soon && echoes.length && window.matchMedia('(hover: hover)').matches) {
          let running: gsap.core.Timeline | null = null;
          const onEnter = () => {
            if (tl.isActive() || running?.isActive()) return;
            running = echo(echoes);
          };
          soon.addEventListener('pointerenter', onEnter);
          cleanups.push(() => soon.removeEventListener('pointerenter', onEnter));
        }
      }

      // ── Pointer depth on the hero frames ───────────────────────────────────────
      const mm = gsap.matchMedia();
      mm.add('(min-width: 992px) and (pointer: fine)', () => {
        if (!hero) return;
        const layers = [...hero.querySelectorAll<HTMLElement>('[data-pc-depth]')].map((el) => ({
          depth: Number(el.dataset.pcDepth) || 0,
          x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
        }));
        const onMove = (event: PointerEvent) => {
          const rect = hero.getBoundingClientRect();
          const nx = (event.clientX - rect.left) / rect.width - 0.5;
          const ny = (event.clientY - rect.top) / rect.height - 0.5;
          layers.forEach((l) => {
            l.x(-nx * l.depth * 2);
            l.y(-ny * l.depth * 2);
          });
        };
        const onLeave = () => layers.forEach((l) => (l.x(0), l.y(0)));
        hero.addEventListener('pointermove', onMove, { passive: true });
        hero.addEventListener('pointerleave', onLeave);
        return () => {
          hero.removeEventListener('pointermove', onMove);
          hero.removeEventListener('pointerleave', onLeave);
        };
      });

      // ── Dial: the needle tunes in with the scroll and locks on the station ──────────
      gsap.utils.toArray<HTMLElement>('[data-pc-dial]').forEach((dial) => {
        const track = dial.querySelector<HTMLElement>('[data-pc-dial-track]');
        const needle = dial.querySelector<HTMLElement>('[data-pc-needle]');
        if (!track || !needle) return;
        const lock = parseFloat(getComputedStyle(dial).getPropertyValue('--lock')) / 100 || 0.8;
        dial.classList.remove('is-locked');
        gsap.set(needle, { left: 0 });
        gsap.fromTo(
          needle,
          { x: 0 },
          {
            x: () => track.offsetWidth * lock,
            ease: 'power1.inOut',
            force3D: true,
            scrollTrigger: {
              trigger: dial,
              start: 'top 95%',
              end: 'top 45%',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => dial.classList.toggle('is-locked', self.progress > 0.97),
            },
          },
        );
      });
    });

    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}

/** The O's answer one another: each lifts and settles a beat after the last, like an echo. */
function echo(targets: NodeListOf<HTMLElement>) {
  return gsap
    .timeline()
    .to(targets, { yPercent: -9, duration: 0.32, ease: 'power2.out', stagger: 0.09 })
    .to(targets, { yPercent: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', stagger: 0.09 }, 0.3);
}
