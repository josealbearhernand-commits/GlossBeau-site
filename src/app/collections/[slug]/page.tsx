import { notFound } from "next/navigation";
import { CatalogError, tryCatalog } from "@/components/site/CatalogError";
import { ListingHeader, ProductGrid } from "@/components/product/ProductGrid";
import { countCollectionProducts, getCollection, getCollectionProducts } from "@/lib/shopify";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;
type Search = Promise<{ after?: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const { data } = await tryCatalog(() => getCollection(slug));
  return { title: data?.title ?? "Collection" };
}

/** One Shopify collection, by its exact handle: only the products Shopify lists in that collection. */
export default async function CollectionPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { slug } = await params;
  const { after } = await searchParams;
  const result = await tryCatalog(async () => {
    const collection = await getCollection(slug);
    if (!collection) return null;
    const [page, count] = await Promise.all([getCollectionProducts(slug, 48, after ?? null), countCollectionProducts(slug)]);
    return { collection, page, count };
  });
  if (result.error) return <CatalogError error={result.error} />;
  if (!result.data) notFound();
  const { collection, page, count } = result.data;

  return (
    <div className="page pt-12 lg:pt-20">
      <ListingHeader crumb="Collections" title={collection.title} count={count} description={collection.description || undefined} />
      <ProductGrid page={page} base={`/collections/${slug}`} />
    </div>
  );
}
