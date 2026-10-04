"use client";

import { useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Icon } from "@/components/site/Icon";

/** Size picker, quantity and add-to-cart. Wires to the Storefront API cart once the token is in. */
export function ProductForm({ sizes, available }: { sizes?: string[]; available: boolean }) {
  const [size, setSize] = useState(sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        setAdded(true);
        setTimeout(() => setAdded(false), 2200);
      }}
    >
      {sizes && sizes.length > 1 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="t-eyebrow mb-3 text-ink">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                className="chip"
                aria-pressed={s === size}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-[50px] items-center rounded-full border border-faint text-ink">
          <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Icon name="minus" size={16} />
          </button>
          <span className="tnum w-8 text-center text-[16px]" aria-live="polite">
            {qty}
          </span>
          <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
            <Icon name="plus" size={16} />
          </button>
        </div>
        <Magnetic>
          <button type="submit" className="btn btn-primary min-w-[200px]" disabled={!available}>
            {!available ? "Sold out" : added ? "Added to cart" : "Add to cart"}
            {available && <Icon name={added ? "check" : "bag"} size={16} />}
          </button>
        </Magnetic>
      </div>
    </form>
  );
}
