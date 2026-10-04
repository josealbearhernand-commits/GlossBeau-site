/**
 * Shopify Storefront API client. Not used by the preview yet: pages read src/data/catalog.ts.
 * When SHOPIFY_STOREFRONT_TOKEN is set in .env.local, swap the data imports for these helpers.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "";
const token = process.env.SHOPIFY_STOREFRONT_TOKEN ?? "";
const version = process.env.SHOPIFY_API_VERSION ?? "2026-07";

export const storefrontReady = Boolean(domain && token);

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!storefrontReady) throw new Error("Storefront API not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN to .env.local.");
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

export const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    handle
    title
    vendor
    productType
    description
    availableForSale
    featuredImage { url altText width height }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount } }
    variants(first: 10) { nodes { id title availableForSale price { amount } } }
  }
`;
