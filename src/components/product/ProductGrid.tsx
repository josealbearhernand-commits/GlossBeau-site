import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import type { Page, ShopProduct } from "@/lib/shopify";

/** Grid of product cards for a collection or brand page, with a "Show more" link that carries the Shopify cursor. */
export function ProductGrid({ page, base }: { page: Page<ShopProduct>; base: string }) {
  if (page.items.length === 0) {
    return <p className="t-lead py-16 text-center text-muted">No products here yet.</p>;
  }
  return (
    <>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {page.items.map((p, i) => (
          <li key={p.handle} className="min-w-0">
            <Reveal effect="float" delay={(i % 4) * 0.06}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          </li>
        ))}
      </ul>
      {page.hasNextPage && page.endCursor && (
        <div className="mt-12 flex justify-center">
          <Link href={`${base}?after=${encodeURIComponent(page.endCursor)}`} className="pd-btn pd-btn-lg pd-btn-dark">
            Show more
          </Link>
        </div>
      )}
    </>
  );
}

/** Page header shared by collection and brand pages: breadcrumb, title and product count. */
export function ListingHeader({ crumb, title, count, description }: { crumb: string; title: string; count: number; description?: string }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / {crumb} / {title}
      </nav>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-faint pb-10">
        <div className="flex flex-col gap-3">
          <Reveal as="h1" className="t-display text-ink">
            {title}
          </Reveal>
          {description && <p className="t-lead max-w-[60ch] text-ink">{description}</p>}
        </div>
        <p className="tnum t-caption text-muted">
          {count} {count === 1 ? "product" : "products"}
        </p>
      </div>
    </>
  );
}
