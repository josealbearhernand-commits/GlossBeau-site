import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Our Story | GlossBeau" },
  description:
    "GlossBeau brings professional hair care, nail and barber products to everyone, from a Kenner, Louisiana beauty supplier. Authentic brands like Nirvel, Inoar, Genus and OPI.",
};

/**
 * Our story: one of our own product stills at the top (the Genus serum from the hero), then the story in a
 * 680px reading column with serif section headings, the pro-pricing line and two buttons. Same tokens,
 * fonts and spacing as the policy pages.
 */
export default function OurStoryPage() {
  return (
    <div className="page pt-8 lg:pt-12">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="max-lg:py-3 hover:text-ink">
          Home
        </Link>{" "}
        / Our story
      </nav>

      <Reveal effect="grow" className="relative aspect-[16/9] overflow-hidden bg-surface lg:aspect-[21/9]">
        <Image src="/stills/serum-still-1-pump.jpg" alt="Genus Argan Moisturizing Serum on linen" fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
      </Reveal>

      <article className="story mx-auto max-w-[680px] pb-24 pt-12 lg:pt-16">
        <Reveal as="h1" effect="slide" className="t-heading-lg mb-8 text-ink">
          Salon-grade, open to everyone.
        </Reveal>
        <p className="t-lead text-ink">
          GlossBeau brings the professional hair care, nail and barber products that stylists use every day straight to your
          door. The same brands, the same formulas, and no salon license needed.
        </p>

        <h2>Where we come from</h2>
        <p>
          GlossBeau is run by Beauty Innovation LLC, a professional beauty supplier based in Kenner, Louisiana. Our day-to-day
          is keeping working salons, barbershops and nail techs stocked with the products they trust. GlossBeau opens that
          same professional shelf to everyone.
        </p>

        <h2>What we stand for</h2>
        <p>
          <strong>Authentic, always.</strong> Every product comes straight from the brand or its authorized distributor. No
          look-alikes, no gray-market stock.
        </p>
        <p>
          <strong>Brands the pros use.</strong> Nirvel, Inoar, Genus, Olivia Garden, BaBylissPRO, OPI, DND, New Adara and
          more, chosen by people who use them every day.
        </p>
        <p>
          <strong>Real people behind it.</strong> Questions about a product or your order? Email us at{" "}
          <a className="link" href={`mailto:${site.supportEmail}`}>
            {site.supportEmail}
          </a>{" "}
          and a real person on our team will answer.
        </p>

        <h2>For professionals</h2>
        <p>
          Licensed stylists, barbers and nail techs get pro pricing.{" "}
          <Link href="/#pro" className="link whitespace-nowrap">
            Apply for pro pricing →
          </Link>
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/hair-care" className="pd-btn pd-btn-lg pd-btn-dark">
            Shop hair care
          </Link>
          <Link href="/brands" className="pd-btn pd-btn-lg pd-btn-outline-light">
            Meet the brands
          </Link>
        </div>
      </article>
    </div>
  );
}
