import { Hero } from "@/components/home/Hero";
import { BrandGrid } from "@/components/home/BrandGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { ExploreGrid } from "@/components/home/ExploreGrid";
import { WhatsNew } from "@/components/home/WhatsNew";
import { Company } from "@/components/home/Company";
import { ProPanel } from "@/components/home/ProPanel";
import { byHandle, heroSlides } from "@/data/catalog";
import { getHomeData } from "@/lib/shopify";

export const revalidate = 300;

export default async function Home() {
  const slides = heroSlides.map((s) => ("handle" in s ? { ...s, product: byHandle(s.handle)! } : s));
  const data = await getHomeData();

  return (
    <>
      <Hero slides={slides} />
      <BrandGrid vendors={data.vendors} />
      <BestSellers products={data.bestSellers} now={data.now} />
      <ExploreGrid collections={data.collections} />
      <WhatsNew image={data.whatsNew.image} href={data.whatsNew.href} title={data.whatsNew.title} />
      <Company />
      <ProPanel />
    </>
  );
}
