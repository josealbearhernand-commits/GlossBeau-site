import Image from "next/image";
import { NoPhoto } from "@/components/product/NoPhoto";
import type { ShopProduct } from "@/lib/shopify";

/**
 * THE product photo box, used by every card on the site (homepage carousel, collections, brands, search,
 * related products): a square-cornered 4:5 box in pure white, the photo centred with object-fit: contain
 * inside the inner 80% (so tall bottles fill 80% of the height and wide brushes 80% of the width), and
 * so photos sit on white with no blend and no ring around them.
 *
 * `product.photo` is resolved on the server (src/lib/shopify.ts): the pre-trimmed copy from
 * scripts/trim-images.mjs when it exists, otherwise the Shopify CDN URL at width=800. The photo is never
 * shown larger than twice its own pixels: a small source stays small and centred instead of being stretched.
 */
export function ProductImage({
  product,
  sizes,
  priority = false,
  className = "",
  radius = "rounded-none",
  children,
}: {
  product: Pick<ShopProduct, "title" | "photo">;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Tailwind radius class for the box; square everywhere now. */
  radius?: string;
  /** Badges and other overlays, positioned against the box. */
  children?: React.ReactNode;
}) {
  const photo = product.photo;
  return (
    <div className={`product-box relative aspect-[4/5] overflow-hidden ${radius} ${className}`}>
      {photo ? (
        <div className="absolute inset-[10%]">
          <Image
            src={photo.src}
            alt={product.title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ maxWidth: photo.width * 2, maxHeight: photo.height * 2, margin: "auto" }}
          />
        </div>
      ) : (
        <NoPhoto className="absolute inset-0" />
      )}
      {children}
    </div>
  );
}
