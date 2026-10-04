import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogError, tryCatalog } from "@/components/site/CatalogError";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/site/Icon";
import { brandDisplayName, brandSlug } from "@/data/home";
import { getProduct, searchProducts } from "@/lib/shopify";

export const revalidate = 300;

type Params = Promise<{ handle: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { handle } = await params;
  const { data } = await tryCatalog(() => getProduct(handle));
  return { title: data?.title ?? "Product" };
}

/** One Shopify product: its photos, price, options and variants, plus four more from the same brand. */
export default async function ProductPage({ params }: { params: Params }) {
  const { handle } = await params;
  const result = await tryCatalog(async () => {
    const product = await getProduct(handle);
    if (!product) return null;
    const more = await searchProducts(`vendor:'${product.vendor.replace(/'/g, "\\'")}'`, 8);
    return { product, related: more.items.filter((p) => p.handle !== product.handle).slice(0, 4) };
  });
  if (result.error) return <CatalogError error={result.error} title="This product could not be loaded" />;
  if (!result.data) notFound();
  const { product, related } = result.data;
  const brand = brandDisplayName(product.vendor);
  const brandHref = `/brands/${brandSlug(product.vendor)}`;

  return (
    <div className="page pt-8 lg:pt-12">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        /{" "}
        <Link href={brandHref} className="hover:text-ink">
          {brand}
        </Link>{" "}
        / {product.title}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <ProductGallery product={product} />
      </div>

      <ul className="mt-10 divide-y divide-faint border-y border-faint lg:max-w-[52ch]">
        {[
          ["truck", "Free US shipping over $75. Ships in 1–2 business days."],
          ["shieldCheck", "Authentic stock from the brand's US distributor."],
        ].map(([icon, text]) => (
          <li key={text} className="t-body-sm flex items-center gap-4 py-4 text-ink">
            <Icon name={icon as "truck"} size={22} />
            {text}
          </li>
        ))}
      </ul>

      {related.length > 0 && (
        <section className="pt-24 lg:pt-32">
          <div className="mb-10 flex items-end justify-between gap-6">
            <Reveal as="h2" className="t-heading-lg text-ink">
              More from {brand}
            </Reveal>
            <Link href={brandHref} className="link t-ui">
              All {brand}
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((r, i) => (
              <li key={r.handle} className="min-w-0">
                <Reveal effect="float" delay={i * 0.07}>
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
