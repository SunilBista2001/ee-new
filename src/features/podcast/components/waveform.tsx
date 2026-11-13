'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Decorative sound-wave strip, drawn on a canvas.
 *
 * It idles with a slow, layered sine motion and swells around the pointer while the pointer
 * moves over the nearest `[data-wave-zone]` (or the canvas itself). It never claims audio is
 * playing: no timecodes, no controls, and it settles back to the idle swell on its own.
 *
 * Cost control: the loop only runs while the canvas is on screen and the tab is visible; the
 * backing store is capped at 2× DPR. With prefers-reduced-motion one static frame is drawn.
 * Colours come from CSS: `color` for the bars, `--wave-accent` for the bars near the pointer.
 */
export function Waveform({
  className,
  barWidth = 3,
  gap = 4,
  seed = 1,
}: {
  className?: string;
  barWidth?: number;
  gap?: number;
  /** Changes the bar texture so two strips on a page don't look identical. */
  seed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const zone = canvas.closest<HTMLElement>('[data-wave-zone]') ?? canvas;

    let width = 0;
    let height = 0;
    let bars = 0;
    let texture: number[] = [];
    let base = '#8b6348';
    let accent = '#a07d45';

    // Pointer state, in canvas-relative 0..1 units. `energy` rises while the pointer moves.
    const pointer = { x: 0.5, targetX: 0.5, energy: 0, inside: false };
    let intro = reduced ? 1 : 0;
    let start = 0;
    let raf = 0;
    let running = false;
    let onScreen = false;

    const hash = (n: number) => {
      const s = Math.sin(n * 127.1 + seed * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bars = Math.max(8, Math.floor((width + gap) / (barWidth + gap)));
      texture = Array.from({ length: bars }, (_, i) => 0.55 + 0.45 * hash(i));
      const style = getComputedStyle(canvas);
      base = style.color || base;
      accent = style.getPropertyValue('--wave-accent').trim() || accent;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = time / 1000;
      const mid = height / 2;
      const step = width / bars;
      const minH = Math.max(2, height * 0.06);

      for (let i = 0; i < bars; i++) {
        const x = (i + 0.5) / bars;
        // Edges taper so the strip reads as a phrase, not a meter.
        const envelope = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, x))), 0.45);
        const idle =
          0.5 +
          0.5 *
            (0.5 * Math.sin(x * 13 + t * 0.9) + 0.3 * Math.sin(x * 29 - t * 1.3) + 0.2 * Math.sin(x * 5 + t * 0.45));
        const d = x - pointer.x;
        const bump = Math.exp(-(d * d) / (2 * 0.055 * 0.055)) * pointer.energy;
        const amp = Math.min(1, ((0.2 + idle * 0.7) * texture[i]! + bump * 0.6) * envelope) * intro;
        const h = minH + amp * (height - minH);

        ctx.globalAlpha = 0.35 + 0.65 * Math.min(1, amp * 1.4 + bump * 0.5);
        ctx.fillStyle = bump > 0.35 ? accent : base;
        const left = i * step + (step - barWidth) / 2;
        ctx.beginPath();
        ctx.roundRect(left, mid - h / 2, barWidth, h, barWidth / 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (time: number) => {
      if (!start) start = time;
      if (intro < 1) intro = Math.min(1, 1 - Math.pow(2, (-10 * (time - start)) / 1400));
      pointer.x += (pointer.targetX - pointer.x) * 0.12;
      // The swell fades whenever the pointer rests or leaves; movement feeds it again.
      pointer.energy *= pointer.inside ? 0.985 : 0.95;
      draw(time);
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (onScreen && !document.hidden ? play() : stop());

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left) / rect.width;
      if (!pointer.inside) pointer.x = pointer.targetX;
      pointer.inside = true;
      pointer.energy = Math.min(1, pointer.energy + 0.08);
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    measure();
    draw(0);

    const resize = new ResizeObserver(() => {
      measure();
      draw(performance.now());
    });
    resize.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      sync();
    });
    io.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    if (!reduced) {
      zone.addEventListener('pointermove', onMove, { passive: true });
      zone.addEventListener('pointerleave', onLeave);
    }

    return () => {
      stop();
      resize.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      zone.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerleave', onLeave);
    };
  }, [barWidth, gap, seed]);

  return <canvas ref={canvasRef} className={cn('pc-wave', className)} aria-hidden="true" />;
}
