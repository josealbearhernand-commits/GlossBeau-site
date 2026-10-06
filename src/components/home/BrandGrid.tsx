import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/site/Icon";
import { featuredBrands } from "@/data/home";
import type { Brand } from "@/lib/shopify";

/**
 * The brands wall: 11 featured brands in the owner's order, plus a 12th "More brands (X)" tile in
 * the same style, so the grid is a full 6 × 2 on desktop. X is counted from the live Shopify vendor list
 * (every brand not shown above); without Shopify the tile just says "More brands".
 */
export function BrandGrid({ brands }: { brands?: Brand[] }) {
  const shown = new Set(featuredBrands.map((b) => b.vendor.toLowerCase()));
  const more = brands ? brands.filter((b) => !shown.has(b.vendor.toLowerCase())).length : null;
  return (
    <section id="brands" className="bg-brands scroll-mt-32 pt-14 lg:pt-16">
      <div className="page">
      <div className="mb-8 text-center">
        <Reveal as="p" effect="fade" className="t-eyebrow mb-2 uppercase tracking-[0.2em]">
          Stocked brands
        </Reveal>
        <Reveal as="h2" effect="slide" className="t-heading-lg text-ink">
          The brands we carry
        </Reveal>
      </div>
      <Reveal as="ul" stagger={0.05} className="halo grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4">
        {featuredBrands.map((b) => (
          <li key={b.vendor} className="min-w-0">
            <Link href={b.href} className="brand-card" aria-label={b.name}>
              <Image src={b.logo} alt={b.name} width={240} height={160} sizes="(min-width: 1024px) 180px, 40vw" />
            </Link>
          </li>
        ))}
        <li className="min-w-0">
          <Link href="/brands" className="brand-card brand-card-more" aria-label={more != null ? `More brands, ${more} more` : "More brands"}>
            <span className="relative z-10 flex flex-col items-center gap-1 text-ink">
              <span className="text-[1rem] font-semibold leading-tight">More brands</span>
              {more != null && <span className="tnum text-[0.875rem] text-muted">({more})</span>}
              <span className="brand-card-more-arrow" aria-hidden="true">
                <Icon name="arrowRight" size={18} />
              </span>
            </span>
          </Link>
        </li>
      </Reveal>
      </div>
    </section>
  );
}
