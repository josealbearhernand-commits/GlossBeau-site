"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "./gsap";

export type RevealEffect = "float" | "slide" | "grow" | "fade";

/**
 * Scroll-in effects copied from newadaranails.com (Wix "motion" presets), tuned to 0.6–0.8s ease-out,
 * each running once as the element enters the viewport (IntersectionObserver, 12% from the bottom edge):
 *  - float: fades in while rising 60px            (Wix motion-floatIn)
 *  - slide: text revealed from the bottom edge     (Wix motion-slideIn: clip + translate)
 *  - grow:  fades in from 92% scale                (Wix motion-growIn, used on images)
 *  - fade:  opacity only                           (Wix motion-fadeIn)
 * `stagger` animates the items one after another instead of the element (cards in a row).
 * Off entirely for prefers-reduced-motion. The legacy `mode` prop maps lines/chars → slide, block → float.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  effect,
  mode,
  delay = 0,
  stagger,
  selector,
  once = true,
  style,
  id,
}: {
  id?: string;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  effect?: RevealEffect;
  mode?: "lines" | "chars" | "block";
  delay?: number;
  /** Seconds between items; when set, the items animate instead of the element. */
  stagger?: number;
  /** With `stagger`: CSS selector for the staggered items (defaults to the direct children). */
  selector?: string;
  once?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const kind: RevealEffect = effect ?? (mode === "block" ? "float" : mode ? "slide" : "float");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      const targets: Element[] =
        stagger != null ? (selector ? Array.from(el.querySelectorAll(selector)) : Array.from(el.children)) : [el];
      if (targets.length === 0) return;

      const from =
        kind === "float"
          ? { y: 60, opacity: 0 }
          : kind === "grow"
            ? { scale: 0.92, opacity: 0, transformOrigin: "50% 60%" }
            : kind === "fade"
              ? { opacity: 0 }
              : { clipPath: "inset(100% 0 0 0)", y: "40%" };
      const to =
        kind === "float"
          ? { y: 0, opacity: 1 }
          : kind === "grow"
            ? { scale: 1, opacity: 1 }
            : kind === "fade"
              ? { opacity: 1 }
              : { clipPath: "inset(0% 0 0 0)", y: 0 };

      gsap.set(targets, from);
      let played = false;
      const play = () => {
        played = true;
        gsap.to(targets, {
          ...to,
          duration: kind === "grow" ? 0.8 : 0.7,
          ease: "power2.out",
          delay,
          stagger: stagger ?? 0,
          overwrite: "auto",
          clearProps: kind === "slide" ? "clipPath,transform" : "transform",
        });
      };
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          play();
          if (once) io.disconnect();
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0 },
      );
      io.observe(el);
      // Already past the viewport (e.g. restored scroll position): show immediately.
      if (el.getBoundingClientRect().bottom < 0) play();
      return () => {
        io.disconnect();
        if (!played) gsap.set(targets, { clearProps: "all" });
      };
    },
    { scope: ref, dependencies: [kind, delay, stagger, selector, once] },
  );

  return (
    <Tag ref={ref} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}
