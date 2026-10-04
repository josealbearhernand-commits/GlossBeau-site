"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/site/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ProductTile } from "@/components/product/ProductTile";
import { SectionHeading } from "./SectionHeading";
import { tabs, type Tab } from "@/data/home";
import type { ShopProduct } from "@/lib/shopify";

/**
 * Peak Design "Best sellers": serif heading + rule (40px below), squared tabs (40px tall, 4px radius,
 * 14px uppercase, 4px apart) with prev/next 48px circle buttons on the right (40px below), then a
 * horizontal carousel of 328px product cards 24px apart (Peak's card width: 3.7 visible at 1440px).
 * Scrolls natively (swipe on phones); dots underneath, the active one a short dash.
 */
export function BestSellers({ products, now }: { products: Record<Tab, ShopProduct[]>; now: number }) {
  const [tab, setTab] = useState<Tab>("hair-care");
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const track = useRef<HTMLUListElement>(null);
  const items = products[tab];

  // A "page" is one visible width of the track, so the dots are right at every size:
  // 3.7 cards per page at 1440px, 2.5 on a tablet, 1.35 on a phone.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const n = Math.max(1, Math.ceil((el.scrollWidth - 1) / el.clientWidth));
      setPages(n);
      setPage(Math.min(n - 1, Math.round(el.scrollLeft / el.clientWidth)));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [items]);

  const scrollTo = (p: number) => {
    const el = track.current;
    if (!el) return;
    const target = ((p % pages) + pages) % pages;
    el.scrollTo({ left: target * el.clientWidth, behavior: "smooth" });
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
        {/* Tabs follow the WAI-ARIA pattern: one tab stop, Left/Right arrows move and select, Home/End jump. */}
        <div
          role="tablist"
          aria-label="Best seller categories"
          className="-mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:px-0"
          onKeyDown={(e) => {
            const i = tabs.findIndex((t) => t.key === tab);
            const next =
              e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -1;
            if (next < 0) return;
            e.preventDefault();
            pick(tabs[next].key);
            (e.currentTarget.children[next] as HTMLElement | undefined)?.focus();
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              aria-controls="best-sellers-panel"
              tabIndex={tab === t.key ? 0 : -1}
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
          id="best-sellers-panel"
          role="tabpanel"
          aria-label={`${tabs.find((t) => t.key === tab)?.label} best sellers`}
          className="carousel -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0"
        >
          {items.map((p) => (
            <li key={p.handle} className="carousel-item snap-start">
              <ProductTile product={p} now={now} />
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Page dots: plain buttons with 44px hit areas; the active one is a short dash. Hidden when everything fits. */}
      {pages > 1 && (
        <nav aria-label="Carousel pages" className="mt-2 flex justify-center">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Page ${i + 1} of ${pages}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => scrollTo(i)}
              className="grid size-11 place-items-center"
            >
              <span className={`block h-[6px] rounded-full transition-all duration-300 ${i === page ? "w-6 bg-ink" : "w-[6px] bg-hairline"}`} />
            </button>
          ))}
        </nav>
      )}
    </section>
  );
}
