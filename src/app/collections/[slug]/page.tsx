import Link from "next/link";
import { notFound } from "next/navigation";
import { byCategory, categories, type Category } from "@/data/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  return { title: c?.name ?? "Collection" };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const items = byCategory(slug as Category);

  return (
    <div className="page pt-12 lg:pt-20">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / {cat.name}
      </nav>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-faint pb-10">
        <div className="flex flex-col gap-3">
          <Reveal as="h1" className="t-display text-ink">
            {cat.name}
          </Reveal>
          <p className="t-lead max-w-[40ch] text-ink">{cat.tagline}.</p>
        </div>
        <p className="t-caption text-muted">
          Showing {items.length} of {cat.count} products in this preview
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="chip" aria-pressed={c.slug === slug}>
            {c.name}
          </Link>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {items.map((p, i) => (
          <li key={p.handle} className="min-w-0">
            <Reveal mode="block" delay={(i % 4) * 0.06}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
