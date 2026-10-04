"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { Icon } from "@/components/site/Icon";
import { money } from "@/data/home";
import { site } from "@/config/site";
import { cdnWidth } from "@/lib/images";

/**
 * The cart drawer: slides in from the right when something is added or the bag icon is pressed. Each line
 * shows a white square photo, name, variant, price, quantity +/−, remove; then the subtotal, the free-shipping
 * line (one setting: site.freeShippingThreshold), "Shipping and taxes calculated at checkout", the Checkout
 * button (Shopify Checkout at cart.checkoutUrl) and the partner-store note, which is the one place on the
 * site that names Diamond Pro.
 */
export function CartDrawer() {
  const { cart, open, setOpen, pending, error, update, remove } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, setOpen]);

  const lines = cart?.lines ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const threshold = site.freeShippingThreshold;
  const away = Math.max(0, threshold - subtotal);

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-scrim transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-surface text-ink shadow-[var(--shadow-lg)] transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-faint px-5">
          <h2 className="text-[1.125rem] font-semibold">
            Your cart{cart && cart.totalQuantity > 0 ? ` (${cart.totalQuantity})` : ""}
          </h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="grid size-11 place-items-center text-ink hover:text-muted">
            <Icon name="close" size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="t-lead text-ink">Your cart is empty.</p>
              <p className="mt-2 text-[0.9375rem] text-muted">Salon-grade products are one tap away.</p>
              <Link href="/hair-care" onClick={() => setOpen(false)} className="pd-btn pd-btn-dark mt-6">
                Shop hair care
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-faint">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-4 py-5">
                  <Link href={`/products/${l.handle}`} onClick={() => setOpen(false)} className="relative block size-20 shrink-0 overflow-hidden bg-surface border border-faint">
                    {l.image && <Image src={cdnWidth(l.image, 200)} alt="" fill sizes="80px" className="object-contain p-1" />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link href={`/products/${l.handle}`} onClick={() => setOpen(false)} className="t-ui-sm line-clamp-2 text-ink">
                      {l.title}
                    </Link>
                    {l.variant !== "Default Title" && <p className="text-[0.8125rem] text-muted">{l.variant}</p>}
                    <p className="tnum text-[0.9375rem] text-ink">{money(l.price)}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex h-9 items-center rounded-full border border-faint">
                        <button type="button" disabled={pending} aria-label={`Decrease quantity of ${l.title}`} onClick={() => update(l.id, l.quantity - 1)} className="grid size-9 place-items-center rounded-full disabled:opacity-50">
                          <Icon name="minus" size={14} />
                        </button>
                        <span className="tnum w-7 text-center text-[0.9375rem]" aria-live="polite">
                          {l.quantity}
                        </span>
                        <button type="button" disabled={pending} aria-label={`Increase quantity of ${l.title}`} onClick={() => update(l.id, l.quantity + 1)} className="grid size-9 place-items-center rounded-full disabled:opacity-50">
                          <Icon name="plus" size={14} />
                        </button>
                      </div>
                      <button type="button" disabled={pending} onClick={() => remove(l.id)} className="link text-[0.8125rem] text-muted disabled:opacity-50">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && (
            <p role="alert" className="my-4 border border-accent bg-accent-wash p-3 text-[0.875rem] text-ink">
              {error}
            </p>
          )}
        </div>

        {lines.length > 0 && cart && (
          <div className="border-t border-faint px-5 pb-6 pt-4">
            <p className="text-[0.875rem] text-ink" aria-live="polite">
              {away > 0 ? (
                <>
                  You&apos;re <span className="tnum font-semibold">{money(away)}</span> away from free shipping.
                </>
              ) : (
                <>You&apos;ve got free shipping.</>
              )}
            </p>
            <div className="mt-2 h-1 w-full bg-faint" aria-hidden="true">
              <div className="h-1 bg-button transition-[width] duration-500" style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }} />
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-[1rem] font-semibold">Subtotal</span>
              <span className="tnum text-[1.125rem] font-semibold">{money(subtotal)}</span>
            </div>
            <p className="mt-1 text-[0.8125rem] text-muted">Shipping and taxes calculated at checkout.</p>
            <a href={cart.checkoutUrl} className={`btn btn-primary mt-4 w-full ${pending ? "pointer-events-none opacity-60" : ""}`}>
              Checkout
              <Icon name="arrowRight" size={16} />
            </a>
            <p className="mt-3 text-[0.75rem] leading-5 text-muted">
              Secure checkout by our partner store, Diamond Pro Salon Supply. You&apos;ll see that name on the payment page, your receipt
              and your card statement.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
