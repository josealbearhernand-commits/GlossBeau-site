/**
 * Shopify Storefront Cart API: create a cart, add / change / remove lines, read it back. Server-side only
 * (imported by the server actions in src/app/actions/cart.ts). Payment happens on Shopify Checkout at
 * `checkoutUrl`; this site never handles card details.
 *
 * Every cart carries the attribute source=glossbeau so the partner store can tell our orders apart.
 */
import { storefront } from "@/lib/shopify";

export interface CartLine {
  id: string;
  quantity: number;
  variantId: string;
  title: string;
  /** Variant title ("Default Title" is hidden by the drawer). */
  variant: string;
  selectedOptions: { name: string; value: string }[];
  handle: string;
  image?: string;
  /** Unit price. */
  price: number;
  /** Line total. */
  total: number;
  availableForSale: boolean;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  currency: string;
  lines: CartLine[];
}

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount } }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount }
            selectedOptions { name value }
            image { url }
            product { title handle featuredImage { url } }
          }
        }
      }
    }
  }
`;

interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string } };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: { amount: string } };
      merchandise: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string };
        selectedOptions: { name: string; value: string }[];
        image: { url: string } | null;
        product: { title: string; handle: string; featuredImage: { url: string } | null };
      };
    }[];
  };
}

interface UserError {
  field: string[] | null;
  message: string;
}

export class CartError extends Error {}

function toCart(c: RawCart): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    subtotal: Number(c.cost.subtotalAmount.amount),
    currency: c.cost.subtotalAmount.currencyCode,
    lines: c.lines.nodes.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      variantId: l.merchandise.id,
      title: l.merchandise.product.title,
      variant: l.merchandise.title,
      selectedOptions: l.merchandise.selectedOptions,
      handle: l.merchandise.product.handle,
      image: l.merchandise.image?.url ?? l.merchandise.product.featuredImage?.url ?? undefined,
      price: Number(l.merchandise.price.amount),
      total: Number(l.cost.totalAmount.amount),
      availableForSale: l.merchandise.availableForSale,
    })),
  };
}

function check(errors: UserError[] | undefined) {
  if (errors?.length) throw new CartError(errors.map((e) => e.message).join("; "));
}

const uncached = { cache: "none" as const };

/** The cart for an id, or null when Shopify no longer has it (completed checkout, expired). */
export async function getCart(id: string): Promise<Cart | null> {
  const data = await storefront<{ cart: RawCart | null }>(/* GraphQL */ `query Cart($id: ID!) { cart(id: $id) { ...CartFields } } ${CART_FIELDS}`, { id }, uncached);
  return data.cart ? toCart(data.cart) : null;
}

export async function createCart(variantId: string, quantity: number): Promise<Cart> {
  const data = await storefront<{ cartCreate: { cart: RawCart | null; userErrors: UserError[] } }>(
    /* GraphQL */ `mutation Create($input: CartInput!) { cartCreate(input: $input) { cart { ...CartFields } userErrors { field message } } } ${CART_FIELDS}`,
    { input: { lines: [{ merchandiseId: variantId, quantity }], attributes: [{ key: "source", value: "glossbeau" }] } },
    uncached,
  );
  check(data.cartCreate.userErrors);
  if (!data.cartCreate.cart) throw new CartError("Shopify did not create the cart.");
  return toCart(data.cartCreate.cart);
}

export async function addLine(cartId: string, variantId: string, quantity: number): Promise<Cart> {
  const data = await storefront<{ cartLinesAdd: { cart: RawCart | null; userErrors: UserError[] } }>(
    /* GraphQL */ `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } } ${CART_FIELDS}`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    uncached,
  );
  check(data.cartLinesAdd.userErrors);
  if (!data.cartLinesAdd.cart) throw new CartError("Shopify did not return the cart.");
  return toCart(data.cartLinesAdd.cart);
}

export async function updateLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await storefront<{ cartLinesUpdate: { cart: RawCart | null; userErrors: UserError[] } }>(
    /* GraphQL */ `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { field message } } } ${CART_FIELDS}`,
    { cartId, lines: [{ id: lineId, quantity }] },
    uncached,
  );
  check(data.cartLinesUpdate.userErrors);
  if (!data.cartLinesUpdate.cart) throw new CartError("Shopify did not return the cart.");
  return toCart(data.cartLinesUpdate.cart);
}

export async function removeLine(cartId: string, lineId: string): Promise<Cart> {
  const data = await storefront<{ cartLinesRemove: { cart: RawCart | null; userErrors: UserError[] } }>(
    /* GraphQL */ `mutation Remove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { field message } } } ${CART_FIELDS}`,
    { cartId, lineIds: [lineId] },
    uncached,
  );
  check(data.cartLinesRemove.userErrors);
  if (!data.cartLinesRemove.cart) throw new CartError("Shopify did not return the cart.");
  return toCart(data.cartLinesRemove.cart);
}
