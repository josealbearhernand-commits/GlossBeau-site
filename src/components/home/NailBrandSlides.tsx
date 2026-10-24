"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/site/Icon";
import { nailBrandSlides } from "@/data/home";

const HOLD_MS = 6000;

/**
 * "Nail brands" slider, copied from nailsbestbuy.com's slideshow: one wide brand photo per slide (16:9 on
 * desktop, 4:3 cover on phones), a frosted "Shop <brand>" pill at the bottom centre and, under it, a frosted
 * pill of slide numbers between two round arrows (on phones both sit under the photo instead of on it). Slides cross-fade every 6 s; the show pauses while hovered,
 * while focused, and never moves on its own for visitors who ask for reduced motion.
 */
export function NailBrandSlides() {
  const slides = nailBrandSlides;
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (paused || reduced || count < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), HOLD_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduced, count]);

  if (count === 0) return null;
  const go = (i: number) => setIndex((i + count) % count);
  const current = slides[index];

  return (
    <section className="bg-brands pt-14 lg:pt-16" aria-labelledby="nail-brands-title">
      <div className="page">
        <div className="mb-8 text-center">
          <Reveal as="p" effect="fade" className="t-eyebrow mb-2 uppercase tracking-[0.2em]">
            Nail brands
          </Reveal>
          <Reveal as="h2" effect="slide" className="t-heading-lg text-ink">
            <span id="nail-brands-title">Every shade, one place</span>
          </Reveal>
        </div>

        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Nail brands"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-image)] bg-surface sm:aspect-[16/9]">
          {slides.map((s, i) => (
            <div
              key={s.brand}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${s.brand}`}
              aria-hidden={i !== index}
              className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1440px) 1360px, 100vw"
                className="object-cover"
              />
            </div>
          ))}
          </div>

          {/* On phones the controls sit under the photo so they never cover the bottles */}
          <div className="mt-4 flex flex-col items-center gap-3 px-4 sm:absolute sm:inset-x-0 sm:bottom-6 sm:mt-0">
            <Link
              href={current.href}
              className="glass-pill inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-[0.9375rem] font-semibold text-ink"
            >
              Shop {current.brand}
              <span className="grid size-8 place-items-center rounded-full bg-surface" aria-hidden="true">
                <Icon name="arrowRight" size={16} className="-rotate-45" />
              </span>
            </Link>

            {count > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous brand"
                  className="grid size-10 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform hover:scale-105"
                >
                  <Icon name="caretDown" size={16} className="rotate-90" />
                </button>
                <div className="glass-pill flex items-center gap-1 rounded-full p-1">
                  {slides.map((s, i) => (
                    <button
                      key={s.brand}
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show ${s.brand}`}
                      aria-current={i === index}
                      className={`tnum grid size-8 place-items-center rounded-full text-[0.9375rem] font-semibold transition-colors ${
                        i === index ? "bg-accent text-white" : "text-ink hover:bg-surface/70"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next brand"
                  className="grid size-10 place-items-center rounded-full bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform hover:scale-105"
                >
                  <Icon name="caretDown" size={16} className="-rotate-90" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
