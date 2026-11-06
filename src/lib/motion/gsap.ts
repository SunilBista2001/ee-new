'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/** GSAP with its plugins registered exactly once. Import gsap from here, never from 'gsap'. */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'expo.out', duration: 1 });
  // Mobile browsers resize the viewport when the address bar shows/hides; without this every
  // trigger is re-measured mid-scroll and content jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };
