/**
 * Homepage motion, ported from the React build (which replaced Webflow IX2 + the site's
 * custom GSAP script). Timings, easings, offsets and delays are the original IX2 values:
 *   fadeIn       – Webflow "Fade In": opacity 0 → 1, 1000ms outQuart
 *   fadeSlide    – a-44 "Fade Slide": opacity 0 → 1, y 25% → 0, 500ms outQuad
 *   highlight    – a-46 "Highlight": .img-highlight scaleX 1 → 0, 500ms outQuart (image wipe)
 *   eventsTitle  – a-45 "Events Title"
 *   logoStack / sponsors – a-43 "Logo Stack" / a-49 "Exclusive Sponsorships" staggers
 *
 * Server Components render each animated element with its pre-animation inline style and a
 * `data-w-id`; this module (run once from <MotionRoot>) finds them and plays the reveals.
 *
 * Reduced motion: when the user prefers reduced motion every element is shown in its final
 * state immediately and the decorative loops (scramble, bounce) are skipped.
 */
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { LOGO_STACK_IDS, REVEALS, SPONSOR_IDS, type RevealType } from './reveal-config';

gsap.registerPlugin(ScrambleTextPlugin);

const OUT_QUART = 'power3.out';
const OUT_QUAD = 'power1.out';

type Cleanup = () => void;

const byId = (root: ParentNode, id: string): HTMLElement | null =>
  root.querySelector<HTMLElement>(`[data-w-id="${id}"]`);

const byIds = (root: ParentNode, ids: readonly string[]): HTMLElement[] =>
  ids.map((id) => byId(root, id)).filter((el): el is HTMLElement => el !== null);

/** Initial (pre-trigger) state, mirroring the first action group of each IX2 list. */
function setInitial(el: HTMLElement, type: RevealType, root: ParentNode): void {
  switch (type) {
    case 'fadeIn':
      gsap.set(el, { opacity: 0 });
      break;
    case 'fadeSlide':
      gsap.set(el, { opacity: 0, yPercent: 25, y: 0, x: 0 });
      break;
    case 'highlight':
      gsap.set(el.querySelectorAll('.img-highlight'), { scaleX: 1, x: 0, y: 0 });
      break;
    case 'eventsTitle':
      // y: 0 discards the px offset GSAP parses from the inline translate3d(0, 25%, 0).
      gsap.set(el, { opacity: 0, yPercent: 25, y: 0 });
      gsap.set(root.querySelectorAll('.events-subheading'), { opacity: 0 });
      break;
    case 'logoStack':
      gsap.set(byIds(el, LOGO_STACK_IDS), { opacity: 0, y: '2rem' });
      break;
    case 'sponsors':
      gsap.set(byIds(el, SPONSOR_IDS), { opacity: 0, yPercent: 20, y: 0 });
      break;
  }
}

function play(el: HTMLElement, type: RevealType, delayMs: number, root: ParentNode): void {
  const delay = delayMs / 1000;
  switch (type) {
    case 'fadeIn':
      gsap.to(el, { opacity: 1, duration: 1, ease: OUT_QUART, delay });
      break;
    case 'fadeSlide':
      gsap.to(el, { opacity: 1, yPercent: 0, duration: 0.5, ease: OUT_QUAD, delay });
      break;
    case 'highlight':
      gsap.to(el.querySelectorAll('.img-highlight'), { scaleX: 0, duration: 0.5, ease: OUT_QUART, delay });
      break;
    case 'eventsTitle':
      gsap
        .timeline({ delay })
        .to(el, { opacity: 1, duration: 0.5, ease: 'none' }, 0)
        .to(el, { yPercent: 0, duration: 0.5, ease: OUT_QUART }, 0)
        .to(el.querySelectorAll('.img-highlight'), { scaleX: 0, duration: 0.5, ease: OUT_QUART }, 0.2)
        .to(root.querySelectorAll('.events-subheading'), { opacity: 1, duration: 0.5, ease: 'none' }, 0.7);
      break;
    case 'logoStack':
      byIds(el, LOGO_STACK_IDS).forEach((item, i) =>
        gsap.to(item, { opacity: 1, y: 0, duration: 0.5, ease: OUT_QUART, delay: delay + i * 0.1 }),
      );
      break;
    case 'sponsors':
      byIds(el, SPONSOR_IDS).forEach((item, i) =>
        gsap.to(item, { opacity: 1, yPercent: 0, duration: 0.5, ease: OUT_QUART, delay: delay + i * 0.1 }),
      );
      break;
  }
}

/** Final state for reduced motion: everything visible, no offsets, wipes removed. */
function showFinal(el: HTMLElement, type: RevealType, root: ParentNode): void {
  gsap.set(el, { opacity: 1, yPercent: 0, y: 0 });
  gsap.set(el.querySelectorAll('.img-highlight'), { scaleX: 0 });
  if (type === 'eventsTitle') gsap.set(root.querySelectorAll('.events-subheading'), { opacity: 1 });
  if (type === 'logoStack') gsap.set(byIds(el, LOGO_STACK_IDS), { opacity: 1, y: 0 });
  if (type === 'sponsors') gsap.set(byIds(el, SPONSOR_IDS), { opacity: 1, yPercent: 0 });
}

/** Fires `cb` once when the element's top passes `offset`% above the viewport bottom. */
function onceInView(el: Element, offsetPercent: number, cb: () => void): Cleanup {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin: `0px 0px -${offsetPercent}% 0px`, threshold: 0 },
  );
  io.observe(el);
  return () => io.disconnect();
}

function initReveals(root: ParentNode, reducedMotion: boolean): Cleanup {
  const cleanups: Cleanup[] = [];
  for (const { id, type, offset, delay } of REVEALS) {
    // Repeated list items share one data-w-id, so every match gets its own trigger.
    root.querySelectorAll<HTMLElement>(`[data-w-id="${id}"]`).forEach((el) => {
      if (reducedMotion) {
        showFinal(el, type, root);
        return;
      }
      setInitial(el, type, root);
      cleanups.push(onceInView(el, offset, () => play(el, type, delay, root)));
    });
  }
  return () => cleanups.forEach((fn) => fn());
}

/** `[data-scramble]` headings scramble into view once (original custom GSAP code). */
function initScrambleHeadings(root: ParentNode): Cleanup {
  const cleanups: Cleanup[] = [];
  root.querySelectorAll<HTMLElement>('[data-scramble]').forEach((heading, index) => {
    const timer = window.setTimeout(() => {
      cleanups.push(
        onceInView(heading, 5, () =>
          gsap.to(heading, {
            duration: 0.4,
            scrambleText: { text: '{original}', chars: 'weruoaszxcvnm', speed: 0.3 },
          }),
        ),
      );
    }, index * 100);
    cleanups.push(() => window.clearTimeout(timer));
  });
  return () => cleanups.forEach((fn) => fn());
}

/** Buttons scramble their label on hover (delegated, so re-rendered buttons keep working). */
function initButtonScramble(root: HTMLElement): Cleanup {
  const running = new WeakSet<HTMLElement>();
  const onOver = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const el = event.target.closest<HTMLElement>('.button');
    if (!el || !root.contains(el) || running.has(el) || el.tagName === 'INPUT') return;
    if (event.relatedTarget instanceof Node && el.contains(event.relatedTarget)) return;
    const original = el.textContent ?? '';
    const reset = () => {
      el.textContent = original;
      running.delete(el);
    };
    running.add(el);
    gsap.to(el, {
      duration: 0.3,
      scrambleText: { text: '{original}', chars: 'lowerCase' },
      onComplete: reset,
      onInterrupt: reset,
    });
  };
  root.addEventListener('mouseover', onOver);
  return () => root.removeEventListener('mouseover', onOver);
}

/** "Slight bounce for the images": infinite yoyo on every .img-parallax. */
function initImageBounce(root: ParentNode): Cleanup {
  const targets = root.querySelectorAll('.img-parallax');
  if (!targets.length) return () => undefined;
  const tl = gsap.timeline({ repeat: -1, yoyo: true });
  tl.to(targets, { y: '-0.8rem', duration: 2, ease: 'power1.inOut' });
  return () => tl.kill();
}

export function initInteractions(root: HTMLElement, { reducedMotion }: { reducedMotion: boolean }): Cleanup {
  const cleanups = [initReveals(root, reducedMotion)];
  if (!reducedMotion) {
    cleanups.push(initScrambleHeadings(root), initButtonScramble(root), initImageBounce(root));
  }
  return () => cleanups.forEach((fn) => fn());
}
