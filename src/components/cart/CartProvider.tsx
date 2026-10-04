"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Cart } from "@/lib/cart";
import { addToCartAction, getCartAction, removeLineAction, updateLineAction } from "@/app/actions/cart";

/**
 * Cart state for the whole site: the Shopify cart (loaded once on mount from the cookie-backed server
 * action, so pages stay static), the drawer's open state, and the three mutations. Adding opens the drawer.
 */
interface CartContext {
  cart: Cart | null;
  count: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  pending: boolean;
  error: string | null;
  add: (variantId: string, quantity: number) => Promise<boolean>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
}

const Ctx = createContext<CartContext | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getCartAction().then((r) => {
      if (alive && r.cart) setCart(r.cart);
    });
    return () => {
      alive = false;
    };
  }, []);

  const run = useCallback(async (op: () => Promise<{ cart: Cart | null; error?: string }>) => {
    setPending(true);
    setError(null);
    const r = await op();
    if (r.error) setError(r.error);
    else setCart(r.cart);
    setPending(false);
    return !r.error;
  }, []);

  const add = useCallback(
    async (variantId: string, quantity: number) => {
      const ok = await run(() => addToCartAction(variantId, quantity));
      if (ok) setOpen(true);
      return ok;
    },
    [run],
  );
  const update = useCallback(async (lineId: string, quantity: number) => void (await run(() => updateLineAction(lineId, quantity))), [run]);
  const remove = useCallback(async (lineId: string) => void (await run(() => removeLineAction(lineId))), [run]);

  return <Ctx.Provider value={{ cart, count: cart?.totalQuantity ?? 0, open, setOpen, pending, error, add, update, remove }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
