import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/catalog";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";

/** Shop's product-image tiles: the image is the card, a translucent white label chip bottom-left. */
export function CategoryTiles() {
  return (
    <section className="page pt-16 lg:pt-20">
      <SectionHeader title="Shop by category" href="/collections/hair-care" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {categories.map((c, i) => {
          const banner = c.slug === "barber" || c.slug === "tools";
          return (
            <li key={c.slug} className="min-w-0">
              <Reveal mode="block" delay={i * 0.06}>
                <Link
                  href={`/collections/${c.slug}`}
                  className={`group relative block aspect-[4/5] overflow-hidden rounded-[28px] ${
                    banner ? "bg-ink" : "bg-surface shadow-[var(--shadow-card)]"
                  }`}
                >
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className={`transition-transform duration-[1.2s] ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.06] ${
                      banner ? "object-cover opacity-85" : "object-contain p-10"
                    }`}
                  />
                  <span className="absolute bottom-3 left-3 rounded-[12px] bg-surface/85 px-3 py-2 backdrop-blur-sm">
                    <span className="t-ui-sm block text-ink">{c.name}</span>
                    <span className="t-micro block text-muted">{c.count} products</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
