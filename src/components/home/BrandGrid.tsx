import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/site/Icon";
import { featuredBrands, moreBrandCount } from "@/data/home";

/**
 * The brands wall: 11 featured brands in the owner's order, plus a 12th "More brands (X)" tile in
 * the same style, so the grid is a full 6 × 2 on desktop. X is counted from the Shopify vendor list.
 */
export function BrandGrid({ vendors }: { vendors?: string[] }) {
  const more = moreBrandCount(vendors);
  return (
    <section id="brands" className="page scroll-mt-32 pt-14 lg:pt-16">
      <div className="mb-8 text-center">
        <Reveal as="p" effect="fade" className="t-eyebrow mb-2 uppercase tracking-[0.2em]">
          Stocked brands
        </Reveal>
        <Reveal as="h2" effect="slide" className="t-heading-lg text-ink">
          The brands we carry
        </Reveal>
      </div>
      <Reveal as="ul" stagger={0.05} className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4">
        {featuredBrands.map((b) => (
          <li key={b.vendor} className="min-w-0">
            <Link href={b.href} className="brand-card" aria-label={b.name}>
              <Image src={b.logo} alt={b.name} width={240} height={160} sizes="(min-width: 1024px) 180px, 40vw" />
            </Link>
          </li>
        ))}
        <li className="min-w-0">
          <Link href="/brands" className="brand-card brand-card-more" aria-label={`More brands, ${more} more`}>
            <span className="relative z-10 flex flex-col items-center gap-1 text-ink">
              <span className="text-[16px] font-semibold leading-tight">More brands</span>
              <span className="tnum text-[14px] text-muted">({more})</span>
              <Icon name="arrowRight" size={18} className="mt-1" />
            </span>
          </Link>
        </li>
      </Reveal>
    </section>
  );
}
