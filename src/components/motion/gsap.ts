"use client";

import gsap from "gsap";

// Only the GSAP core ships: the scroll reveals use IntersectionObserver (Reveal.tsx) and the hero
// glide is a plain timeline, so ScrollTrigger and SplitText would be dead weight in the bundle.
if (typeof window !== "undefined") {
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap };
