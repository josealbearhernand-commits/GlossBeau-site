import Image from "next/image";
import Link from "next/link";
import { money } from "@/data/home";
import type { ShopProduct } from "@/lib/shopify";
import { Icon } from "@/components/site/Icon";

/** Shop-style elevated card: 28px radius, dual soft shadow, 20px inner image radius, no border. */
export function ProductCard({ product, priority = false }: { product: ShopProduct; priority?: boolean }) {
  const sold = !product.availableForSale;
  const onSale = product.compareAtPrice != null && !sold;
  return (
    <Link
      href={`/products/${product.handle}`}
      className="card group flex min-w-0 flex-col text-ink outline-offset-4 transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]"
    >
      <div className="frame gloss aspect-square">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1200px) 280px, (min-width: 768px) 33vw, 50vw"
          priority={priority}
          className={`p-5 transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.05] ${
            sold ? "opacity-45" : ""
          }`}
        />
        {sold ? (
          <span className="badge badge-soldout absolute left-3 top-3">Sold out</span>
        ) : onSale ? (
          <span className="badge badge-sale absolute left-3 top-3">Sale</span>
        ) : null}
        <span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-accent text-on-accent opacity-0 shadow-[var(--shadow-accent)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
          <Icon name="plus" size={18} />
        </span>
      </div>
      <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
        <p className="t-micro uppercase tracking-[0.02em] text-muted">{product.vendor}</p>
        <h3 className="t-ui-sm line-clamp-2 text-ink">{product.title}</h3>
        <p className="tnum t-body-sm flex items-baseline gap-2 text-ink">
          <span>{money(product.price)}</span>
          {onSale && <s className="text-muted">{money(product.compareAtPrice!)}</s>}
        </p>
      </div>
    </Link>
  );
}
