"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brandLogos } from "@/data/catalog";
import { Reveal } from "@/components/motion/Reveal";

const VISIBLE = 12;

/** The brands wall from diamondprosalonsupply.com: logo tiles, warm light rising on hover, "More brands". */
export function BrandGrid() {
  const [open, setOpen] = useState(false);
  const shown = open ? brandLogos : brandLogos.slice(0, VISIBLE);

  return (
    <section id="brands" className="page scroll-mt-20 pt-14 lg:pt-16">
      <div className="mb-8 text-center">
        <Reveal as="p" mode="block" className="t-eyebrow mb-2 uppercase tracking-[0.2em]">
          Stocked brands
        </Reveal>
        <Reveal as="h2" className="t-heading-lg text-ink">
          The brands we carry
        </Reveal>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4">
        {shown.map((b, i) => (
          <li key={b.name} className="min-w-0">
            <Reveal mode="block" delay={(i % 6) * 0.04}>
              <Link href={b.href} className="brand-card" aria-label={b.name}>
                <Image src={b.logo} alt={b.name} width={240} height={160} sizes="(min-width: 1024px) 180px, 40vw" />
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
      {brandLogos.length > VISIBLE && (
        <div className="mt-8 flex justify-center">
          <button type="button" className="btn btn-secondary" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? "Show less" : `More brands (${brandLogos.length - VISIBLE})`}
          </button>
        </div>
      )}
    </section>
  );
}
