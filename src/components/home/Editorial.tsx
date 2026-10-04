import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Icon } from "@/components/site/Icon";

/** Two-column hero-and-grid composition: sticky text, rounded photography. */
export function Editorial() {
  return (
    <section className="page grid gap-8 pt-16 lg:grid-cols-2 lg:gap-16 lg:pt-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Reveal as="p" mode="block" className="t-eyebrow mb-3">
          Why GlossBeau
        </Reveal>
        <Reveal as="h2" className="t-heading-lg mb-6 max-w-[16ch] text-ink">
          Salon shelves, without the salon markup
        </Reveal>
        <Reveal mode="block">
          <p className="t-body mb-8 max-w-[48ch] text-muted">
            We are the supplier behind working salons and barbershops. The same keratin treatments, argan masks and
            professional tools now ship to your door, with the stylist&apos;s notes on how to use them.
          </p>
        </Reveal>
        <ul className="mb-8 flex flex-col gap-2">
          {[
            ["drop", "Formulas made for professional use, sized for home"],
            ["scissors", "Barber and nail lines chosen by people who use them daily"],
            ["sparkle", "Authentic stock straight from the brands' distributors"],
          ].map(([icon, text], i) => (
            <li key={text}>
              <Reveal mode="block" delay={i * 0.06} className="card flex items-center gap-4 px-4 py-3 text-ink">
                <span className="grid size-10 flex-none place-items-center rounded-full bg-canvas">
                  <Icon name={icon as "drop"} size={20} />
                </span>
                <span className="t-body-sm">{text}</span>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal mode="block">
          <Link href="/#brands" className="btn btn-secondary">
            Brands we carry
          </Link>
        </Reveal>
      </div>

      <div className="grid gap-3 lg:gap-4">
        <Parallax amount={6} className="overflow-hidden rounded-[28px]">
          <div className="relative aspect-[4/5] bg-ink">
            <Image
              src="https://cdn.shopify.com/s/files/1/0752/7546/8972/collections/banner_tools.jpg?v=1787786809"
              alt="Professional styling tools on a salon station"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
          <Parallax amount={10} className="card overflow-hidden">
            <div className="frame aspect-[4/5]">
              <Image
                src="https://cdn.shopify.com/s/files/1/0752/7546/8972/files/inoar-rejutherapy-hair-care-collection-3-piece-set.jpg?v=1787784807"
                alt="Inoar Rejutherapy collection"
                fill
                sizes="25vw"
                className="p-4"
              />
            </div>
          </Parallax>
          <Parallax amount={4} className="overflow-hidden rounded-[28px]">
            <div className="relative aspect-[4/5] bg-ink">
              <Image
                src="https://cdn.shopify.com/s/files/1/0752/7546/8972/collections/banner_barber.jpg?v=1787786808"
                alt="Barber at work"
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  );
}
