import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/site/Icon";

/**
 * Peak Design photo tile: full-bleed photo, 8px radius, a dark gradient at the bottom, a white
 * uppercase label bottom-left and a 32px white circle arrow bottom-right, 20px inset. The whole
 * tile is the link. `ratio` is 1:1 for Explore and 3:2 for the company tiles.
 */
export function CollectionTile({
  href,
  label,
  image,
  ratio = "square",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  href: string;
  label: string;
  image: string;
  ratio?: "square" | "landscape";
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={href}
      className={`pd-tile group relative block overflow-hidden rounded-[8px] bg-faint ${ratio === "square" ? "aspect-square" : "aspect-[3/2]"}`}
    >
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <span aria-hidden="true" className="pd-tile-shade absolute inset-0" />
      <span className="absolute inset-0 flex items-end justify-between p-5">
        <span className="pd-tile-label">{label}</span>
        <span className="grid size-8 place-items-center rounded-full border border-surface text-surface transition-colors group-hover:bg-surface group-hover:text-ink">
          <Icon name="arrowRight" size={16} />
        </span>
      </span>
    </Link>
  );
}
