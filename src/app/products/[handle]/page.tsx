import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { byHandle, byCategory, categories, money, products } from "@/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { Icon } from "@/components/site/Icon";
import { ProductForm } from "@/components/product/ProductForm";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return { title: byHandle(handle)?.title ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = byHandle(handle);
  if (!p) notFound();
  const cat = categories.find((c) => c.slug === p.category)!;
  const related = byCategory(p.category).filter((x) => x.handle !== p.handle).slice(0, 4);

  return (
    <div className="page pt-8 lg:pt-12">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        /{" "}
        <Link href={`/collections/${cat.slug}`} className="hover:text-ink">
          {cat.name}
        </Link>{" "}
        / {p.title}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal mode="block" className="card gloss relative aspect-[4/5] lg:sticky lg:top-24 lg:self-start">
          <Image src={p.image} alt={p.title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-10" />
          {p.featured && <span className="badge badge-feature absolute left-4 top-4">Best seller</span>}
        </Reveal>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="t-eyebrow text-ink">
              {p.vendor} · {p.type}
            </p>
            <Reveal as="h1" className="t-heading text-ink">
              {p.title}
            </Reveal>
            <p className="tnum t-lead text-ink">{money(p.price)}</p>
          </div>

          <p className="t-body max-w-[52ch] text-ink">{p.description}</p>

          {p.benefits && (
            <ul className="flex flex-wrap gap-2">
              {p.benefits.map((b) => (
                <li key={b} className="chip pointer-events-none">
                  {b}
                </li>
              ))}
            </ul>
          )}

          <ProductForm sizes={p.sizes} available={p.availableForSale} />

          <ul className="divide-y divide-faint border-y border-faint">
            {[
              ["truck", "Free US shipping over $75. Ships in 1–2 business days."],
              ["shieldCheck", "Authentic stock from the brand's US distributor."],
              ["leaf", "Vegan formula where the brand states it."],
            ].map(([icon, text]) => (
              <li key={text} className="t-body-sm flex items-center gap-4 py-4 text-ink">
                <Icon name={icon as "truck"} size={22} />
                {text}
              </li>
            ))}
          </ul>

          <Magnetic>
            <Link href={`/collections/${cat.slug}`} className="link t-ui">
              More {cat.name.toLowerCase()}
            </Link>
          </Magnetic>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-24 lg:pt-32">
          <div className="mb-10 flex items-end justify-between gap-6">
            <Reveal as="h2" className="t-heading-lg text-ink">
              Pairs well with
            </Reveal>
          </div>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((r, i) => (
              <li key={r.handle} className="min-w-0">
                <Reveal mode="block" delay={i * 0.07}>
                  <ProductCard product={r} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
