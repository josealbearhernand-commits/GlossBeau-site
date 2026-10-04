"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "./gsap";

/** Infinite horizontal ribbon. Slows on hover; stops entirely under reduced motion. */
export function Marquee({
  children,
  speed = 60,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.querySelector<HTMLElement>(".marquee__track");
      if (!track || reducedMotion()) return;
      const width = track.scrollWidth / 2;
      const tween = gsap.to(track, {
        x: -width,
        duration: width / speed,
        ease: "none",
        repeat: -1,
      });
      const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6 });
      const fast = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
      ref.current?.addEventListener("pointerenter", slow);
      ref.current?.addEventListener("pointerleave", fast);
      return () => {
        ref.current?.removeEventListener("pointerenter", slow);
        ref.current?.removeEventListener("pointerleave", fast);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`marquee ${className ?? ""}`} aria-hidden="true">
      <div className="marquee__track">
        {children}
        {children}
      </div>
    </div>
  );
}
