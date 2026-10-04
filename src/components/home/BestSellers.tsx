import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "./SectionHeader";
import type { Product } from "@/data/catalog";

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section id="best-sellers" className="page scroll-mt-20 pt-16 lg:pt-20">
      <SectionHeader title="Best sellers" href="/collections/hair-care" eyebrow="What stylists buy twice" />
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {products.map((p, i) => (
          <li key={p.handle} className="min-w-0">
            <Reveal mode="block" delay={(i % 4) * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
