import { Hero } from "@/components/home/Hero";
import { BrandGrid } from "@/components/home/BrandGrid";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { Spotlight } from "@/components/home/Spotlight";
import { BestSellers } from "@/components/home/BestSellers";
import { Editorial } from "@/components/home/Editorial";
import { ToolsBand } from "@/components/home/ToolsBand";
import { EmailCapture } from "@/components/home/EmailCapture";
import { byHandle, byCategory, heroSlides, products } from "@/data/catalog";

export default function Home() {
  const pick = (h: string) => byHandle(h)!;
  const slides = heroSlides.map((s) => ({ product: pick(s.handle), video: s.video, poster: s.poster }));
  const spotlight: [typeof products[number], typeof products[number], typeof products[number]] = [
    pick("genus-argan-hydrating-shampoo-for-dry-frizzy-hair"),
    pick("genus-argan-hydrating-mask-for-dry-frizzy-hair"),
    pick("genus-argan-moisturizing-serum-for-dry-and-frizzy-hair-100ml"),
  ];
  const best = [
    pick("genus-keratin-restructuring-hair-mask-for-damaged-treated-hair"),
    pick("inoar-argan-oil-thermoliss-thermoactivated-defrizzer-240ml"),
    pick("nirvel-argan-fluid-hair-treatment-serum-lightweight-shine-60ml"),
    pick("opi-gelcolor-stay-shiny-top-coat-0-5-oz-gc003"),
    pick("inoar-absolut-daymoist-leave-in-hair-treatment-200ml"),
    pick("immortal-exclusive-wax-guilty-strong-hold-hair-styling-3-4-oz"),
    pick("genus-keratin-restructuring-treatment-for-split-ends-100ml"),
    pick("opi-powder-perfection-dip-powder-samoan-sand-1-5-oz-dpp61a"),
  ];
  const tools = byCategory("tools");

  return (
    <>
      <Hero slides={slides} />
      <BrandGrid />
      <CategoryTiles />
      <BestSellers products={best} />
      <Spotlight
        products={spotlight}
        beats={[
          {
            title: "Wash in moisture.",
            copy: "Argan and linseed oils cleanse without stripping, so dry and frizzy hair starts the routine already softer.",
          },
          {
            title: "Feed it deeply.",
            copy: "Five minutes with the hydrating mask restores slip and shine to chemically treated lengths.",
          },
          {
            title: "Seal the gloss.",
            copy: "A few drops of serum tame flyaways and protect from heat. Weightless, salon-finish shine.",
          },
        ]}
      />
      <Editorial />
      <ToolsBand hero={tools[0]} rail={tools.slice(1, 4)} />
      <EmailCapture />
    </>
  );
}
