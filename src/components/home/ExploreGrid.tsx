import { Reveal } from "@/components/motion/Reveal";
import { CollectionTile } from "./CollectionTile";
import { SectionHeading } from "./SectionHeading";
import type { HomeCollection } from "@/data/home";

/** Peak Design "Explore our products": heading (32px below), then a 3 × 3 grid of square tiles 24px apart. */
export function ExploreGrid({ collections }: { collections: HomeCollection[] }) {
  return (
    <section className="pd-section container-pd">
      <div className="pb-6 lg:pb-8">
        <SectionHeading>Explore our products</SectionHeading>
      </div>
      <Reveal as="ul" stagger={0.07} effect="grow" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.slice(0, 9).map((c) => (
          <li key={c.handle}>
            <CollectionTile href={`/collections/${c.handle}`} label={c.label} image={c.image} />
          </li>
        ))}
      </Reveal>
    </section>
  );
}
