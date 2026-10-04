import { Hero } from "@/components/home/Hero";
import { BrandGrid } from "@/components/home/BrandGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { ExploreGrid } from "@/components/home/ExploreGrid";
import { WhatsNew } from "@/components/home/WhatsNew";
import { Company } from "@/components/home/Company";
import { ProPanel } from "@/components/home/ProPanel";
import { CatalogError, tryCatalog } from "@/components/site/CatalogError";
import { exploreCollections, whatsNew } from "@/data/home";
import { heroSlides } from "@/data/hero";
import { getHomeData } from "@/lib/shopify";

export const revalidate = 300;

export default async function Home() {
  const { data, error } = await tryCatalog(getHomeData);

  return (
    <>
      <Hero slides={heroSlides} />
      <BrandGrid brands={data?.brands} />
      {data ? (
        <BestSellers products={data.bestSellers} now={data.now} />
      ) : (
        <CatalogError error={error} title="Best sellers could not be loaded" />
      )}
      <ExploreGrid collections={exploreCollections} />
      <WhatsNew image={whatsNew.image} href={whatsNew.href} title={whatsNew.title} />
      <Company />
      <ProPanel />
    </>
  );
}
