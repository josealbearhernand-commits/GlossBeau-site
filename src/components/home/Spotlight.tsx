"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "@/components/motion/gsap";
import { Icon } from "@/components/site/Icon";
import { money, type Product } from "@/data/catalog";

/**
 * The advertising moment: the page pins while one product line tells its story in three beats.
 * Scrolling scrubs the bottle from one to the next and swaps the headline. This is the
 * "motion on products" section; swap the products and copy per campaign.
 */
export function Spotlight({
  products,
  eyebrow = "Spotlight · Genus Argan",
  beats,
}: {
  products: [Product, Product, Product];
  eyebrow?: string;
  beats: { title: string; copy: string }[];
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const shots = gsap.utils.toArray<HTMLElement>(".spot-shot");
      const texts = gsap.utils.toArray<HTMLElement>(".spot-beat");
      const dots = gsap.utils.toArray<HTMLElement>(".spot-dot");

      gsap.set(shots.slice(1), { autoAlpha: 0, scale: 0.86, yPercent: 10 });
      gsap.set(texts.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(dots[0], { backgroundColor: "#f15730" });

      if (reducedMotion()) {
        // Static: the first beat stays, the others stack below it in normal flow
        root.dataset.static = "true";
        gsap.set([...shots, ...texts], { clearProps: "all" });
        gsap.set(shots.slice(1), { display: "none" });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=" + window.innerHeight * 2.2,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      for (let i = 1; i < shots.length; i++) {
        tl.to(shots[i - 1], { autoAlpha: 0, scale: 1.08, yPercent: -10, duration: 1, ease: "power2.inOut" }, i)
          .to(shots[i], { autoAlpha: 1, scale: 1, yPercent: 0, duration: 1, ease: "power2.inOut" }, i)
          .to(texts[i - 1], { autoAlpha: 0, y: -24, duration: 0.6 }, i)
          .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.6 }, i + 0.3)
          .to(dots[i - 1], { backgroundColor: "rgba(64,58,52,0.25)", duration: 0.3 }, i)
          .to(dots[i], { backgroundColor: "#f15730", duration: 0.3 }, i);
      }
      // ember ring rotates slowly through the whole scrub
      tl.to(".spot-ring", { rotate: 180, ease: "none", duration: shots.length }, 0);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative mt-24 border-y border-faint bg-canvas lg:mt-32">
      <div className="page grid min-h-[100svh] grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 mx-auto aspect-square w-full max-w-[560px] lg:order-1">
          {/* ember ring: a stroke, not a fill, so the photo stays the hero */}
          <div
            className="spot-ring absolute inset-[6%] rounded-full border-[1.5px] border-dashed border-accent"
            aria-hidden="true"
          />
          <div className="absolute inset-[14%] rounded-full bg-surface" aria-hidden="true" />
          {products.map((p, i) => (
            <div key={p.handle} className="spot-shot absolute inset-[16%]">
              <Image src={p.image} alt={p.title} fill sizes="(min-width: 1024px) 420px, 70vw" className="object-contain" priority={i === 0} />
            </div>
          ))}
        </div>

        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <p className="t-eyebrow text-ink">{eyebrow}</p>
          <div className="spot-beats relative min-h-[260px] sm:min-h-[300px]">
            {beats.map((b, i) => (
              <div key={b.title} className="spot-beat absolute inset-0 flex flex-col gap-5">
                <p className="t-label text-accent">0{i + 1} / 0{beats.length}</p>
                <h2 className="t-display text-ink">{b.title}</h2>
                <p className="t-body max-w-[42ch] text-ink">{b.copy}</p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href={`/products/${products[i].handle}`} className="btn btn-primary">
                    {products[i].type} · {money(products[i].price)}
                    <Icon name="arrowRight" size={16} />
                  </Link>
                  <Link href="/collections/hair-care" className="link t-ui">
                    See the full line
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2" aria-hidden="true">
            {beats.map((b) => (
              <span key={b.title} className="spot-dot h-1.5 w-10 rounded-full bg-stone" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
