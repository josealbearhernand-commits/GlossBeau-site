import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CollectionTile } from "./CollectionTile";
import { SectionHeading } from "./SectionHeading";
import { site } from "@/config/site";

// Three real destinations (an "Our story" page does not exist yet; add a tile when it is written).
const tiles = [
  { label: "Hair care", href: "/hair-care", image: "/stills/silver-poster.jpg" },
  { label: "Brands we carry", href: "/brands", image: "/stills/thermoliss-poster.jpg" },
  {
    label: "Contact",
    href: `mailto:${site.supportEmail}`,
    image: "https://cdn.shopify.com/s/files/1/0752/7546/8972/files/inoar-blends-collection-antioxidant-hair-care-range-vegan.jpg?v=1787784762",
  },
];

/**
 * Copy of Peak Design's "Radical company, radical products": heading, three 3:2 tiles 24px apart,
 * then (its own 64px section) a featured split: 16:9 photo on the left (2/3) and a dark panel on
 * the right (1/3) padded 64px with eyebrow, 40px serif headline, paragraph and a white outline button.
 */
export function Company() {
  return (
    <>
      <section className="pd-section container-pd">
        <div className="pb-6 lg:pb-8">
          <SectionHeading>Salon-grade, open to everyone</SectionHeading>
        </div>
        <Reveal as="ul" stagger={0.08} effect="grow" className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.label}>
              <CollectionTile href={t.href} label={t.label} image={t.image} ratio="landscape" />
            </li>
          ))}
        </Reveal>
      </section>

      <section className="pd-section container-pd">
        <Reveal effect="float" className="grid grid-cols-1 overflow-hidden rounded-[8px] lg:grid-cols-[2fr_1fr]">
          <div className="relative aspect-[123/95] bg-slate-ink">
            {/* The BaBylissPRO tools from the Diamond Pro hero slider (shop_images/hero-14-clean.jpg, 1920×1080 original),
                cropped to the tools (1230×950) so they sit centred; the box takes that same shape. */}
            <Image src="/images/babyliss-tools-centered.jpg" alt="BaBylissPRO Nano Titanium flat irons and dryers" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
          </div>
          <div className="on-dark flex items-center bg-slate-ink p-8 text-on-dark lg:p-16">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <p className="pd-eyebrow">Featured</p>
                <h2 className="font-serif text-[2rem] leading-[2.1875rem] tracking-[-0.01em] lg:text-[2.5rem] lg:leading-[2.75rem]">
                  The brands behind every great chair.
                </h2>
                <p className="text-[1rem] leading-6">
                  Inoar, Genus, Nirvel, BaBylissPRO and more: the professional lines salons reach for every day, sold
                  here to everyone, with trade pricing for licensed pros.
                </p>
              </div>
              <div>
                <Link href="/brands" className="pd-btn pd-btn-lg pd-btn-outline">
                  Meet the brands
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
