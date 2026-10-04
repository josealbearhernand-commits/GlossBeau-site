"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "@/components/motion/gsap";
import { Icon } from "@/components/site/Icon";
import { Wordmark } from "@/components/site/Wordmark";
import type { Product } from "@/data/catalog";

export interface HeroSlide {
  product: Product;
  /** Optional Higgsfield clip (mp4). When present it plays once, then the show glides to the next slide. */
  video?: string;
  /** Approved still used as the poster and reduced-motion fallback. */
  poster?: string;
}

const HOLD_MS = 5000;
const GLIDE_S = 1.6;

/**
 * Hero slideshow: one product at a time in a large rounded card. A slide with a clip plays
 * the pour-and-splash, then the next slide glides in slowly; a photo-only slide holds 5 seconds.
 * Dots and arrows; pauses while hovered or when the tab is hidden.
 */
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const animating = useRef(false);
  const timer = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (next: number, dir: 1 | -1 = 1) => {
      if (animating.current || count < 2) return;
      const target = (next + count) % count;
      if (target === index) return;
      const track = ref.current;
      const from = track?.querySelector<HTMLElement>(`[data-slide="${index}"]`);
      const to = track?.querySelector<HTMLElement>(`[data-slide="${target}"]`);
      if (!from || !to || reducedMotion()) {
        setIndex(target);
        return;
      }
      animating.current = true;
      gsap.set(to, { autoAlpha: 1, xPercent: 12 * dir, scale: 0.96 });
      gsap
        .timeline({
          defaults: { duration: GLIDE_S, ease: "power2.inOut" },
          onComplete: () => {
            animating.current = false;
            setIndex(target);
          },
        })
        .to(from, { xPercent: -12 * dir, scale: 0.96, autoAlpha: 0 }, 0)
        .to(to, { xPercent: 0, scale: 1 }, 0);
    },
    [index, count],
  );

  // Hold timer for photo-only slides
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    const slide = slides[index];
    if (paused || slide.video) return;
    timer.current = window.setTimeout(() => go(index + 1), HOLD_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, paused, slides, go]);

  // Play the active clip from the start; advance when it ends
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLVideoElement>(`[data-slide="${index}"] video`);
    if (!el) return;
    el.currentTime = 0;
    const play = el.play();
    if (play) play.catch(() => go(index + 1));
    const onEnd = () => {
      if (!paused) window.setTimeout(() => go(index + 1), 600);
    };
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, [index, paused, go]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from(".hero-stage", { y: 40, opacity: 0, scale: 0.97, duration: 1.4, ease: "power4.out" });
      gsap.from(".hero-mark", { y: 16, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: ref },
  );

  const current = slides[index].product;

  return (
    <section ref={ref} className="page flex flex-col items-center pb-4 pt-6 lg:pt-10">
      <div
        className="hero-stage card relative w-full max-w-[1120px] overflow-hidden"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        aria-roledescription="carousel"
        aria-label="Featured products"
      >
        <div className="frame relative aspect-[4/3] sm:aspect-[16/10]">
          {slides.map((s, i) => (
            <div
              key={s.product.handle}
              data-slide={i}
              className="absolute inset-0"
              style={{ opacity: i === index ? 1 : 0, visibility: i === index ? "visible" : "hidden" }}
              aria-hidden={i !== index}
            >
              {s.video ? (
                <video
                  src={s.video}
                  poster={s.poster ?? s.product.image}
                  muted
                  playsInline
                  preload={i === index ? "auto" : "metadata"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={s.product.image}
                  alt={s.product.title}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1200px) 1120px, 100vw"
                  className="object-contain p-8 sm:p-14"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index - 1, -1)}
          aria-label="Previous product"
          className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform hover:scale-105"
        >
          <Icon name="caretDown" size={18} className="rotate-90" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1, 1)}
          aria-label="Next product"
          className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform hover:scale-105"
        >
          <Icon name="caretDown" size={18} className="-rotate-90" />
        </button>

        <Link
          href={`/products/${current.handle}`}
          className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-full bg-accent text-on-accent shadow-[var(--shadow-accent)] transition-colors hover:bg-accent-deep"
          aria-label={`View ${current.title}`}
        >
          <Icon name="arrowUpRight" size={20} />
        </Link>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-surface/85 px-3 py-2 backdrop-blur-sm" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.product.handle}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${s.product.title}`}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={`h-2 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-accent" : "w-2 bg-stone hover:bg-muted"}`}
            />
          ))}
        </div>
      </div>

      <div className="hero-mark mt-8 flex flex-col items-center">
        <Wordmark size={56} className="sm:[font-size:84px]" />
      </div>
    </section>
  );
}
