"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "@/components/motion/gsap";
import { Icon } from "@/components/site/Icon";
import { Logo } from "@/components/site/Logo";
export type HeroSlide =
  | {
      handle: string;
      title: string;
      /** Higgsfield clip (mp4): plays once, then the show glides to the next slide. */
      video: string;
      /** Approved still used as the poster and reduced-motion fallback. */
      poster: string;
      focus?: string;
    }
  | { image: string; alt: string; href: string; title: string; focus?: string; ratio?: number; soft?: [number, number] };

const HOLD_MS = 5000;
const GLIDE_S = 1.6;

const key = (s: HeroSlide) => ("handle" in s ? s.handle : s.image);

/**
 * Hero slideshow: a square-edged block that runs edge to edge, 600px tall on desktop (never more than
 * 70% of the screen height) and 420px on phones. One slide at a time: a product slide plays its pour
 * clip, then the next slide glides in slowly; a photo slide holds 5 seconds. Arrows only; the show
 * pauses while hovered or when the tab is hidden. No scale or zoom is ever applied to the slides, so
 * the clips (1112×834) and photos stay as sharp as their source.
 */
export function Hero({ slides }: { slides: HeroSlide[] }) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  // `paused` is automatic (hover, keyboard focus inside, hidden tab); `stopped` is the visitor's own pause button.
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const halted = paused || stopped;
  const animating = useRef(false);
  const timer = useRef<number | null>(null);
  const count = slides.length;

  // Only the current slide and its two neighbours carry media; the rest are empty until the show reaches them.
  // That keeps the first paint to one clip and one poster instead of six clips (3.4MB) and twelve posters.
  const near = (i: number) => i === index || i === (index + 1) % count || i === (index - 1 + count) % count;
  // The first slide's poster is the largest contentful paint: ask for it before the clip arrives.
  const first = slides[0];
  preload("video" in first ? first.poster : first.image, { as: "image" });

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
      gsap.set(to, { autoAlpha: 1, xPercent: 12 * dir });
      gsap
        .timeline({
          defaults: { duration: GLIDE_S, ease: "power2.inOut" },
          onComplete: () => {
            animating.current = false;
            setIndex(target);
          },
        })
        .to(from, { xPercent: -12 * dir, autoAlpha: 0 }, 0)
        .to(to, { xPercent: 0 }, 0);
    },
    [index, count],
  );

  // Hold timer for photo-only slides
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    const slide = slides[index];
    if (halted || "video" in slide) return;
    timer.current = window.setTimeout(() => go(index + 1), HOLD_MS);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, halted, slides, go]);

  // Play the active clip from the start; advance when it ends
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLVideoElement>(`[data-slide="${index}"] video`);
    if (!el) return;
    el.currentTime = 0;
    if (!halted) {
      const play = el.play();
      if (play) play.catch(() => go(index + 1));
    }
    const onEnd = () => {
      if (!halted) window.setTimeout(() => go(index + 1), 600);
    };
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
    // Only the slide change restarts the clip; the effect below handles pause/resume in place
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, go]);

  // Pause or resume the active clip in place (no restart) when the show is halted or released
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLVideoElement>(`[data-slide="${index}"] video`);
    if (!el) return;
    if (halted) el.pause();
    else if (el.ended) go(index + 1);
    else el.play()?.catch(() => {});
  }, [halted, index, go]);

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

  return (
    <section ref={ref} className="bg-hero-tail flex flex-col items-center pb-4">
      <div
        className="hero-stage relative h-[420px] w-full overflow-hidden bg-faint lg:h-[min(600px,70svh)]"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured products"
        aria-live={halted ? "polite" : "off"}
      >
        {slides.map((s, i) => (
          <div
            key={key(s)}
            data-slide={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.title}`}
            className="absolute inset-0"
            style={{ opacity: i === index ? 1 : 0, visibility: i === index ? "visible" : "hidden" }}
            aria-hidden={i !== index}
          >
            {!near(i) ? null : "video" in s ? (
              <>
                {/* Desktop: the 4:3 clip is taller than the hero, so it shows whole (contain) and a blurred copy
                    of its own still fills the sides. Phones (390×420) are nearly square, so the clip covers. */}
                <Image src={s.poster} alt="" fill aria-hidden sizes="100vw" quality={60} className="hidden object-cover blur-2xl lg:block" />
                <video
                  src={s.video}
                  poster={s.poster}
                  muted
                  playsInline
                  preload={i === index ? "auto" : "metadata"}
                  className="hero-media-soft absolute inset-0 h-full w-full object-cover lg:object-contain"
                  style={{ objectPosition: s.focus ?? "50% 50%", "--ar": 1112 / 834 } as React.CSSProperties}
                />
              </>
            ) : (
              <>
                {/* Desktop: same treatment as the clips. The photo is far squarer than the 1440×600 hero, so covering
                    magnified it ~1.7× and cut her face and the bottles; it now shows whole (contain, centred) with a
                    blurred copy of itself filling the sides. Phones keep cover, framed by `focus`. */}
                <Image src={s.image} alt="" fill aria-hidden sizes="100vw" quality={50} className="hidden object-cover blur-2xl lg:block" />
                <Image
                  src={s.image}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  quality={90}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className={`object-cover [object-position:var(--focus)] lg:object-contain lg:[object-position:50%_50%] ${s.ratio ? "hero-media-soft" : ""}`}
                  style={
                    {
                      "--focus": s.focus ?? "50% 50%",
                      "--ar": s.ratio,
                      ...(s.soft ? { "--soft-l": `${s.soft[0]}px`, "--soft-r": `${s.soft[1]}px` } : {}),
                    } as React.CSSProperties
                  }
                />
              </>
            )}
          </div>
        ))}

        {/* The photo melts into the page below instead of ending on a hard line */}
        <div className="hero-fade" aria-hidden="true" />

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
        {/* Pause / play: the one control WCAG 2.2.2 asks for on moving content; same 48px white circle as the arrows */}
        <button
          type="button"
          onClick={() => setStopped((v) => !v)}
          aria-pressed={stopped}
          aria-label={stopped ? "Play slideshow" : "Pause slideshow"}
          className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform hover:scale-105 lg:bottom-6 lg:right-8"
        >
          <Icon name={stopped ? "play" : "pause"} size={18} />
        </button>
      </div>

      {/* The page's h1: the big wordmark, with the store's one-line description for screen readers and search engines */}
      <h1 className="hero-mark bloom mt-8 flex flex-col items-center">
        <Logo tone="dark" height={72} />
        <span className="sr-only">: salon-grade hair care, nails, barber supplies and styling tools, open to everyone</span>
      </h1>
    </section>
  );
}
