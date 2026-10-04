import Link from "next/link";
import { CatalogError, tryCatalog } from "@/components/site/CatalogError";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/motion/Reveal";
import { searchProducts } from "@/lib/shopify";

export const revalidate = 300;

type Search = Promise<{ q?: string; after?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: Search }) {
  const { q } = await searchParams;
  return { title: q?.trim() ? `Search: ${q.trim()}` : "Search" };
}

/** The header search form lands here: Shopify's own product search for the typed words, best sellers first. */
export default async function SearchPage({ searchParams }: { searchParams: Search }) {
  const { q = "", after } = await searchParams;
  const query = q.trim().replace(/["\\]/g, "").slice(0, 100);
  const result = query ? await tryCatalog(() => searchProducts(query, 48, after ?? null)) : null;
  if (result?.error) return <CatalogError error={result.error} title="Search is not available right now" />;
  const page = result?.data ?? null;

  return (
    <div className="page pt-12 lg:pt-20">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="max-lg:py-3 hover:text-ink">
          Home
        </Link>{" "}
        / Search
      </nav>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-faint pb-10">
        <Reveal as="h1" className="t-display text-ink">
          {query ? `Results for “${query}”` : "Search"}
        </Reveal>
        {page && (
          <p className="tnum t-caption text-muted">
            {page.items.length}
            {page.hasNextPage ? "+" : ""} {page.items.length === 1 && !page.hasNextPage ? "product" : "products"}
          </p>
        )}
      </div>

      {!query && (
        <form role="search" action="/search" className="flex max-w-[520px] flex-col gap-3 sm:flex-row">
          <label htmlFor="search-page-q" className="sr-only">
            Search products
          </label>
          <input id="search-page-q" name="q" type="search" placeholder="Brand, product or type" className="pd-input h-12 w-full bg-surface px-4 sm:flex-1" autoFocus />
          <button type="submit" className="pd-btn pd-btn-lg pd-btn-dark">
            Search
          </button>
        </form>
      )}

      {page && (
        <ProductGrid
          page={page}
          base={`/search?q=${encodeURIComponent(query)}`}
          empty={
            <>
              No products match “{query}”. Try a brand name, a product type like “clippers”, or browse{" "}
              <Link href="/brands" className="link">
                every brand
              </Link>
              .
            </>
          }
        />
      )}
    </div>
  );
}
