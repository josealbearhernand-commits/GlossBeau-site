import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/site/Icon";
import { money, type Product } from "@/data/catalog";

/** Shop's "product type hero": a big rounded image is the card, name overlaid top-left in white. */
export function ToolsBand({ hero, rail }: { hero: Product; rail: Product[] }) {
  return (
    <section className="page pt-16 lg:pt-20">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr] lg:gap-4">
        <Reveal mode="block">
          <Link href={`/products/${hero.handle}`} className="on-dark group relative block aspect-[4/3] overflow-hidden rounded-[28px] bg-ink text-on-dark lg:aspect-auto lg:h-full lg:min-h-[520px]">
            <Image src={hero.image} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain p-10 opacity-95 transition-transform duration-[1.2s] group-hover:scale-[1.04] lg:p-16" />
            <div className="absolute inset-x-0 top-0 p-6 lg:p-8">
              <p className="t-display">Tools</p>
              <p className="t-body-sm mt-2 flex items-center gap-1 text-on-dark/80">
                <Icon name="star" size={14} /> {hero.vendor} · {hero.title}
              </p>
            </div>
            <span className="btn btn-light absolute bottom-6 left-6 lg:bottom-8 lg:left-8">
              Shop tools <Icon name="arrowRight" size={16} />
            </span>
            <span className="tnum t-ui absolute bottom-6 right-6 rounded-full bg-surface/85 px-4 py-2 text-ink backdrop-blur-sm lg:bottom-8 lg:right-8">
              {money(hero.price)}
            </span>
          </Link>
        </Reveal>
        <ul className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-4">
          {rail.map((p, i) => (
            <li key={p.handle} className="min-w-0">
              <Reveal mode="block" delay={i * 0.06}>
                <Link href={`/products/${p.handle}`} className="card group flex items-center gap-3 p-2 transition-shadow hover:shadow-[var(--shadow-lg)] lg:gap-4">
                  <div className="frame gloss !m-0 size-20 flex-none lg:size-28">
                    <Image src={p.image} alt="" fill sizes="112px" className="p-2 transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
                  </div>
                  <div className="hidden min-w-0 pr-3 lg:block">
                    <p className="t-micro uppercase text-muted">{p.vendor}</p>
                    <p className="t-ui-sm line-clamp-2 text-ink">{p.title}</p>
                    <p className="tnum t-body-sm mt-1 text-ink">{money(p.price)}</p>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
