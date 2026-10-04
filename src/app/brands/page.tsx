import Image from "next/image";
import Link from "next/link";
import { CatalogError, tryCatalog } from "@/components/site/CatalogError";
import { Reveal } from "@/components/motion/Reveal";
import { brandDisplayName, featuredBrands } from "@/data/home";
import { allBrands } from "@/lib/shopify";

export const revalidate = 300;
export const metadata = { title: "Brands" };

/** Every brand in the store (Shopify vendors), A–Z with product counts; featured brands keep their logo tile. */
export default async function BrandsPage() {
  const { data: brands, error } = await tryCatalog(allBrands);
  if (!brands) return <CatalogError error={error} title="Brands could not be loaded" />;
  const logos = new Map(featuredBrands.map((b) => [b.vendor.toLowerCase(), b.logo]));

  return (
    <div className="page pt-12 lg:pt-20">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / Brands
      </nav>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-faint pb-10">
        <Reveal as="h1" className="t-display text-ink">
          Brands we carry
        </Reveal>
        <p className="tnum t-caption text-muted">{brands.length} brands</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        {brands.map((b) => {
          const logo = logos.get(b.vendor.toLowerCase());
          const name = brandDisplayName(b.vendor);
          return (
            <li key={b.slug} className="min-w-0">
              <Link href={`/brands/${b.slug}`} className="brand-card flex-col gap-2" aria-label={`${name}, ${b.count} products`}>
                {logo ? (
                  <Image src={logo} alt={name} width={240} height={160} sizes="(min-width: 1024px) 240px, 45vw" />
                ) : (
                  <span className="relative z-10 text-center text-[18px] font-semibold leading-tight text-ink">{name}</span>
                )}
                <span className="tnum relative z-10 text-[13px] text-muted">
                  {b.count} {b.count === 1 ? "product" : "products"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
