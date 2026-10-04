"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/site/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ProductTile } from "@/components/product/ProductTile";
import { SectionHeading } from "./SectionHeading";
import { tabs, type HomeProduct, type Tab } from "@/data/home";

/**
 * Peak Design "Best sellers": serif heading + rule (40px below), squared tabs (40px tall, 4px radius,
 * 14px uppercase, 4px apart) with prev/next 48px circle buttons on the right (40px below), then a
 * horizontal carousel of 328px product cards 24px apart (Peak's card width: 3.7 visible at 1440px).
 * Scrolls natively (swipe on phones); dots underneath, the active one a short dash.
 */
export function BestSellers({ products, now }: { products: Record<Tab, HomeProduct[]>; now: number }) {
  const [tab, setTab] = useState<Tab>("hair-care");
  const [page, setPage] = useState(0);
  const track = useRef<HTMLUListElement>(null);
  const items = products[tab];
  const perPage = 4;
  const pages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      const step = card.offsetWidth + 24;
      setPage(Math.min(pages - 1, Math.round(el.scrollLeft / (step * perPage))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [pages]);

  const scrollTo = (p: number) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const target = ((p % pages) + pages) % pages;
    el.scrollTo({ left: target * perPage * (card.offsetWidth + 24), behavior: "smooth" });
    setPage(target);
  };

  const pick = (t: Tab) => {
    setTab(t);
    setPage(0);
    track.current?.scrollTo({ left: 0 });
  };

  return (
    <section id="best-sellers" className="pd-section container-pd scroll-mt-24">
      <div className="pb-6 lg:pb-10">
        <SectionHeading>Best sellers</SectionHeading>
      </div>

      <div className="flex items-center justify-between gap-6 pb-5 lg:pb-10">
        <div role="tablist" aria-label="Best seller categories" className="-mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:px-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              aria-controls={`best-${t.key}`}
              onClick={() => pick(t.key)}
              className="pd-tab shrink-0"
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="hidden shrink-0 gap-4 sm:flex">
          <button type="button" className="pd-circle" aria-label="Previous products" onClick={() => scrollTo(page - 1)}>
            <Icon name="arrowRight" size={24} className="rotate-180" />
          </button>
          <button type="button" className="pd-circle" aria-label="Next products" onClick={() => scrollTo(page + 1)}>
            <Icon name="arrowRight" size={24} />
          </button>
        </div>
      </div>

      <Reveal key={tab} stagger={0.08} selector=".carousel-item" effect="float">
        <ul
          ref={track}
          id={`best-${tab}`}
          role="tabpanel"
          className="carousel -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0"
        >
          {items.map((p, i) => (
            <li key={p.handle} className="carousel-item snap-start">
              <ProductTile product={p} priority={i < 4} now={now} />
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-6 flex justify-center gap-0" role="tablist" aria-label="Carousel pages">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === page}
            aria-label={`Page ${i + 1}`}
            onClick={() => scrollTo(i)}
            className="grid size-6 place-items-center"
          >
            <span className={`block h-[6px] rounded-full transition-all duration-300 ${i === page ? "w-6 bg-ink" : "w-[6px] bg-stone"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
