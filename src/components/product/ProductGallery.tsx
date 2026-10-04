"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductForm } from "@/components/product/ProductForm";
import { NoPhoto } from "@/components/product/NoPhoto";
import type { ShopProductDetail, ShopVariant } from "@/lib/shopify";

/**
 * Product photos with thumbnails, beside the option pickers. Picking a variant that has its own
 * photo (a gel shade, say) switches the big photo to it. A product with no media shows the NoPhoto frame.
 */
export function ProductGallery({ product }: { product: ShopProductDetail }) {
  const images = product.images.length
    ? product.images
    : product.image
      ? [{ url: product.image, alt: product.title, width: 1000, height: 1000 }]
      : [];
  const [current, setCurrent] = useState(0);

  const onVariant = (v: ShopVariant | undefined) => {
    if (!v?.image) return;
    const i = images.findIndex((img) => img.url.split("?")[0] === v.image!.split("?")[0]);
    if (i >= 0) setCurrent(i);
  };

  return (
    <div className="contents">
      <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
        <div className="card gloss relative aspect-square overflow-hidden">
          {images[current] ? (
            <Image src={images[current].url} alt={images[current].alt} fill priority quality={90} sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-8" />
          ) : (
            <NoPhoto className="rounded-[var(--radius-card)]" />
          )}
        </div>
        {images.length > 1 && (
          <ul className="scroll-thin flex w-full min-w-0 gap-2 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <li key={img.url} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-pressed={i === current}
                  className={`relative block size-16 overflow-hidden rounded-[12px] border bg-surface ${i === current ? "border-ink" : "border-faint"}`}
                >
                  <Image src={img.url} alt="" fill sizes="64px" className="object-contain p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="t-eyebrow text-ink">
            {product.vendor}
            {product.productType ? ` · ${product.productType}` : ""}
          </p>
          <h1 className="t-heading text-ink">{product.title}</h1>
        </div>
        <ProductForm title={product.title} options={product.options} variants={product.variants} onVariantChange={onVariant} />
        {product.descriptionHtml ? (
          <div className="prose-gb t-body max-w-[60ch] text-ink" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
        ) : (
          product.description && <p className="t-body max-w-[60ch] text-ink">{product.description}</p>
        )}
      </div>
    </div>
  );
}
