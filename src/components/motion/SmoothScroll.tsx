"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "./gsap";

/** Keeps ScrollTrigger measurements fresh after fonts and images settle. */
export function SmoothScroll() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);
  return null;
}
