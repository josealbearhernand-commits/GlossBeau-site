"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, reducedMotion } from "./gsap";

/**
 * Text reveal: lines slide up from behind a mask as the element scrolls into view.
 * Headlines use `lines`, short labels use `chars`.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  mode = "lines",
  delay = 0,
  once = true,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  mode?: "lines" | "chars" | "block";
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;

      if (mode === "block") {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 1,
          delay,
          scrollTrigger: { trigger: el, start: "top 88%", once },
        });
        return;
      }

      const split = SplitText.create(el, {
        type: mode === "lines" ? "lines" : "chars,words",
        mask: mode === "lines" ? "lines" : "chars",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(mode === "lines" ? self.lines : self.chars, {
            yPercent: 110,
            duration: mode === "lines" ? 1.1 : 0.8,
            stagger: mode === "lines" ? 0.09 : 0.012,
            ease: "power4.out",
            delay,
            scrollTrigger: { trigger: el, start: "top 88%", once },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
