import { notFound } from "next/navigation";
import { CatalogError, tryCatalog } from "@/components/site/CatalogError";
import { ListingHeader, ProductGrid } from "@/components/product/ProductGrid";
import { brandDisplayName } from "@/data/home";
import { getBrand, getBrandProducts } from "@/lib/shopify";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;
type Search = Promise<{ after?: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const { data } = await tryCatalog(() => getBrand(slug));
  return { title: data ? brandDisplayName(data.vendor) : "Brand" };
}

/** One brand: only the products whose Shopify vendor is that brand (vendor:'<exact name>' query). */
export default async function BrandPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { slug } = await params;
  const { after } = await searchParams;
  const result = await tryCatalog(async () => {
    const brand = await getBrand(slug);
    if (!brand) return null;
    const page = await getBrandProducts(brand, 48, after ?? null);
    return { brand, page };
  });
  if (result.error) return <CatalogError error={result.error} />;
  if (!result.data) notFound();
  const { brand, page } = result.data;

  return (
    <div className="page pt-12 lg:pt-20">
      <ListingHeader crumb="Brands" title={brandDisplayName(brand.vendor)} count={brand.count} />
      <ProductGrid page={page} base={`/brands/${slug}`} />
    </div>
  );
}
