"use server";

import { cookies } from "next/headers";
import { addLine, createCart, getCart, removeLine, updateLine, CartError, type Cart } from "@/lib/cart";

/**
 * Server actions the cart UI calls. The Shopify cart id lives in an httpOnly cookie for 30 days, so the
 * cart survives reloads and new tabs; a cart Shopify no longer knows (checked out, expired) is replaced.
 */
const COOKIE = "gb_cart";
const MAX_AGE = 60 * 60 * 24 * 30;

async function readId() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

async function writeId(id: string) {
  (await cookies()).set(COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE });
}

async function clearId() {
  (await cookies()).delete(COOKIE);
}

export type CartResult = { cart: Cart | null; error?: string };

const fail = (e: unknown): CartResult => ({ cart: null, error: e instanceof CartError ? e.message : "The cart could not be updated. Please try again." });

/** The current cart, or null when there is none yet. */
export async function getCartAction(): Promise<CartResult> {
  const id = await readId();
  if (!id) return { cart: null };
  try {
    const cart = await getCart(id);
    if (!cart) await clearId();
    return { cart };
  } catch (e) {
    return fail(e);
  }
}

export async function addToCartAction(variantId: string, quantity: number): Promise<CartResult> {
  const qty = Math.max(1, Math.min(99, Math.round(quantity)));
  try {
    const id = await readId();
    let cart: Cart | null = null;
    if (id) {
      try {
        cart = await addLine(id, variantId, qty);
      } catch (e) {
        // A dead cart id (completed checkout) comes back as an error; start a fresh cart instead.
        if (!(e instanceof CartError)) throw e;
        cart = null;
      }
    }
    if (!cart) {
      cart = await createCart(variantId, qty);
      await writeId(cart.id);
    }
    return { cart };
  } catch (e) {
    return fail(e);
  }
}

export async function updateLineAction(lineId: string, quantity: number): Promise<CartResult> {
  const id = await readId();
  if (!id) return { cart: null };
  try {
    return { cart: quantity <= 0 ? await removeLine(id, lineId) : await updateLine(id, lineId, Math.min(99, Math.round(quantity))) };
  } catch (e) {
    return fail(e);
  }
}

export async function removeLineAction(lineId: string): Promise<CartResult> {
  const id = await readId();
  if (!id) return { cart: null };
  try {
    return { cart: await removeLine(id, lineId) };
  } catch (e) {
    return fail(e);
  }
}
