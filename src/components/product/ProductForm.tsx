"use client";

import { useMemo, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Icon } from "@/components/site/Icon";
import { money } from "@/data/home";
import { site } from "@/config/site";
import type { ShopVariant } from "@/lib/shopify";

/**
 * Option pickers (shade, size…), the matching variant's price and stock, quantity and the order control.
 * Options with up to 12 values show as chips; longer lists (gel shades) use a dropdown.
 *
 * There is no cart or checkout yet. Until the Storefront cart API is wired (cartCreate → checkoutUrl),
 * the primary control is honest about that: it opens an e-mail to the support inbox with the product,
 * the chosen options and the quantity filled in, so a shopper can actually order today.
 */
export function ProductForm({
  title,
  options,
  variants,
  onVariantChange,
}: {
  title: string;
  options: { name: string; values: string[] }[];
  variants: ShopVariant[];
  onVariantChange?: (v: ShopVariant | undefined) => void;
}) {
  const [picked, setPicked] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((o) => [o.name, variants.find((v) => v.availableForSale)?.selectedOptions.find((s) => s.name === o.name)?.value ?? o.values[0]])),
  );
  const [qty, setQty] = useState(1);

  const variant = useMemo(
    () => variants.find((v) => v.selectedOptions.every((s) => picked[s.name] === s.value)) ?? (options.length === 0 ? variants[0] : undefined),
    [variants, picked, options.length],
  );
  const available = Boolean(variant?.availableForSale);

  const pick = (name: string, value: string) => {
    const next = { ...picked, [name]: value };
    setPicked(next);
    onVariantChange?.(variants.find((v) => v.selectedOptions.every((s) => next[s.name] === s.value)));
  };

  const chosen = (variant?.selectedOptions ?? []).filter((s) => s.value !== "Default Title").map((s) => `${s.name}: ${s.value}`);
  const orderHref = `mailto:${site.supportEmail}?subject=${encodeURIComponent(`Order: ${title}`)}&body=${encodeURIComponent(
    [`I would like to order ${qty} × ${title}.`, ...chosen, "", "Please reply with the total and a payment link."].join("\n"),
  )}`;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (available) window.location.href = orderHref;
      }}
    >
      {variant && (
        <p className="tnum t-lead flex items-baseline gap-3 text-ink">
          <span>{money(variant.price)}</span>
          {variant.compareAtPrice && <s className="text-muted">{money(variant.compareAtPrice)}</s>}
          {!available && <span className="badge badge-soldout">Sold out</span>}
        </p>
      )}

      {options.map((o) => (
        <fieldset key={o.name} className="flex flex-col gap-3">
          <legend className="t-eyebrow mb-3 text-ink">
            {o.name}: <span className="text-ink">{picked[o.name]}</span>
          </legend>
          {o.values.length <= 12 ? (
            <div className="flex flex-wrap gap-2">
              {o.values.map((v) => (
                <button key={v} type="button" className="chip" aria-pressed={picked[o.name] === v} onClick={() => pick(o.name, v)}>
                  {v}
                </button>
              ))}
            </div>
          ) : (
            <select
              className="pd-input h-12 max-w-[360px] bg-surface px-3"
              value={picked[o.name]}
              onChange={(e) => pick(o.name, e.target.value)}
              aria-label={o.name}
            >
              {o.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          )}
        </fieldset>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-[50px] items-center rounded-full border border-faint text-ink">
          <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Icon name="minus" size={16} />
          </button>
          <span className="tnum w-8 text-center text-[1rem]" aria-live="polite">
            {qty}
          </span>
          <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
            <Icon name="plus" size={16} />
          </button>
        </div>
        <Magnetic>
          <button type="submit" className="btn btn-primary min-w-[200px]" disabled={!available}>
            {available ? "Order by e-mail" : "Sold out"}
            {available && <Icon name="arrowUpRight" size={16} />}
          </button>
        </Magnetic>
      </div>
      {available && (
        <p className="t-body-sm max-w-[48ch] text-muted">
          Online checkout opens soon. For now the button starts an e-mail to{" "}
          <a className="link text-ink" href={orderHref}>
            {site.supportEmail}
          </a>{" "}
          with this item filled in, and we reply with the total and a payment link.
        </p>
      )}
    </form>
  );
}
