import Link from "next/link";
import { CatalogError, tryCatalog } from "@/components/site/CatalogError";
import { CollectionTile } from "@/components/home/CollectionTile";
import { Reveal } from "@/components/motion/Reveal";
import { exploreCollections, hairCareCollections } from "@/data/home";
import { allCollections, countCollectionProducts } from "@/lib/shopify";

export const revalidate = 300;
export const metadata = { title: "Hair care" };

/**
 * Hair care hub. Shopify has no single "hair care" collection, so this page lists the real hair
 * collections (shampoos, conditioners, treatments, colour…) with their live product counts. Each tile
 * goes to /collections/<exact handle>. If a "Hair Care" collection is created in Shopify later, the
 * header and footer links can point straight at it instead.
 */
export default async function HairCarePage() {
  const result = await tryCatalog(async () => {
    const all = await allCollections();
    const picked = hairCareCollections.map((h) => all.find((c) => c.handle === h)).filter((c) => c != null);
    const counts = await Promise.all(picked.map((c) => countCollectionProducts(c.handle)));
    return picked.map((c, i) => ({ ...c, count: counts[i] }));
  });
  const items = result.data;
  if (!items) return <CatalogError error={result.error} title="Hair care collections could not be loaded" />;
  const ourPhoto = new Map(exploreCollections.map((c) => [c.handle, c.image]));

  return (
    <div className="page pt-12 lg:pt-20">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / Hair care
      </nav>
      <div className="mb-10 border-b border-faint pb-10">
        <Reveal as="h1" className="t-display text-ink">
          Hair care
        </Reveal>
        <p className="t-lead mt-3 max-w-[60ch] text-ink">Shampoos, conditioners, treatments and colour from the professional lines salons use.</p>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <li key={c.handle}>
            <CollectionTile
              href={`/collections/${c.handle}`}
              label={`${c.title} (${c.count})`}
              image={ourPhoto.get(c.handle) ?? c.image ?? "/stills/intense-poster.jpg"}
              priority={i < 3}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
