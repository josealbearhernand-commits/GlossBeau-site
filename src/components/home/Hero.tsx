"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "@/components/motion/gsap";
import { Icon } from "@/components/site/Icon";
import { Logo } from "@/components/site/Logo";
import type { Product } from "@/data/catalog";

export type HeroSlide =
  | {
      product: Product;
      /** Higgsfield clip (mp4): plays once, then the show glides to the next slide. */
      video: string;
      /** Approved still used as the poster and reduced-motion fallback. */
      poster: string;
      focus?: string;
    }
  | { image: string; alt: string; href: string; title: string; focus?: string };

const HOLD_MS = 5000;
const GLIDE_S = 1.6;

const key = (s: HeroSlide) => ("product" in s ? s.product.handle : s.image);
const linkOf = (s: HeroSlide) => ("product" in s ? { href: `/products/${s.product.handle}`, title: s.product.title } : { href: s.href, title: s.title });

/**
 * Hero slideshow, sized like Peak Design's hero (measured 2026-10-04): a square-edged block that
 * runs edge to edge, 1440 × 727 on desktop and 390 × 397 on phones (Peak's phone hero is that photo
 * plus a 360px text panel; ours has no text panel). One slide at a time: a product slide plays its
 * pour clip, then the next slide glides in slowly; a photo slide holds 5 seconds. Arrows only; the
 * show pauses while hovered or when the tab is hidden.
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
      gsap.set(to, { autoAlpha: 1, xPercent: 12 * dir, scale: 1.04 });
      gsap
        .timeline({
          defaults: { duration: GLIDE_S, ease: "power2.inOut" },
          onComplete: () => {
            animating.current = false;
            setIndex(target);
          },
        })
        .to(from, { xPercent: -12 * dir, scale: 1.04, autoAlpha: 0 }, 0)
        .to(to, { xPercent: 0, scale: 1 }, 0);
    },
    [index, count],
  );

  // Hold timer for photo-only slides
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    const slide = slides[index];
    if (paused || "video" in slide) return;
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
      gsap.from(".hero-stage", { opacity: 0, duration: 1.4, ease: "power4.out" });
      gsap.from(".hero-mark", { y: 16, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
    },
    { scope: ref },
  );

  const current = linkOf(slides[index]);

  return (
    <section ref={ref} className="flex flex-col items-center pb-4">
      <div
        className="hero-stage relative aspect-[390/397] w-full overflow-hidden bg-surface lg:aspect-[1440/727]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        aria-roledescription="carousel"
        aria-label="Featured products"
      >
        {slides.map((s, i) => (
          <div
            key={key(s)}
            data-slide={i}
            className="absolute inset-0"
            style={{ opacity: i === index ? 1 : 0, visibility: i === index ? "visible" : "hidden" }}
            aria-hidden={i !== index}
          >
            {"video" in s ? (
              <>
                {/* Desktop: the 4:3 clip is taller than the 2:1 hero, so it shows whole (contain) and a blurred
                    copy of its own still fills the sides. Phones (390×397) are nearly square, so the clip covers. */}
                <Image src={s.poster} alt="" fill aria-hidden sizes="100vw" className="hidden scale-110 object-cover blur-2xl lg:block" />
                <video
                  src={s.video}
                  poster={s.poster}
                  muted
                  playsInline
                  preload={i === index ? "auto" : "metadata"}
                  className="absolute inset-0 h-full w-full object-cover lg:object-contain"
                  style={{ objectPosition: s.focus ?? "50% 50%" }}
                />
              </>
            ) : (
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.focus ?? "50% 50%" }}
              />
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => go(index - 1, -1)}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform hover:scale-105 lg:left-8"
        >
          <Icon name="caretDown" size={18} className="rotate-90" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1, 1)}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform hover:scale-105 lg:right-8"
        >
          <Icon name="caretDown" size={18} className="-rotate-90" />
        </button>

        <Link
          href={current.href}
          className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-full bg-accent text-on-accent shadow-[var(--shadow-accent)] transition-colors hover:bg-accent-deep lg:bottom-8 lg:left-8"
          aria-label={`View ${current.title}`}
        >
          <Icon name="arrowUpRight" size={20} />
        </Link>
      </div>

      <div className="hero-mark mt-8 flex flex-col items-center">
        <Logo size={56} className="sm:[font-size:84px]" />
      </div>
    </section>
  );
}
