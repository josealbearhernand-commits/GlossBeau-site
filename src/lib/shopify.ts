/**
 * Shopify Storefront API client: the only source of products, collections and brands on the site.
 * Needs SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local (see .env.example).
 * There is no sample catalog: when Shopify cannot be reached, every reader throws a CatalogError
 * and the page shows that message instead of products.
 */
import { brandSlug, money, tabs, type Tab } from "@/data/home";
import trimmed from "@/data/trimmed.json";

export { money };

/** Display-ready product photo for the cards (see ProductImage.tsx). */
export interface ProductPhoto {
  src: string;
  width: number;
  height: number;
  /** true = pre-trimmed local copy from scripts/trim-images.mjs; false = Shopify CDN at width=800. */
  trimmed: boolean;
}

const manifest = trimmed as Record<string, { src: string; width: number; height: number }>;
const CARD_WIDTH = 800;

/** Shopify CDN URL with a width parameter (the CDN resizes on the fly, never above the source size). */
export const cdnWidth = (url: string, width: number) =>
  url.includes("cdn.shopify.com") ? `${url}${url.includes("?") ? "&" : "?"}width=${width}` : url;

/** The trimmed copy when the build step has one for this URL, otherwise the CDN image at card width. */
export function resolvePhoto(image: { url: string; width: number; height: number } | null | undefined): ProductPhoto | undefined {
  if (!image?.url) return undefined;
  const t = manifest[image.url];
  if (t) return { src: t.src, width: t.width, height: t.height, trimmed: true };
  const scale = Math.min(1, CARD_WIDTH / Math.max(image.width || CARD_WIDTH, 1));
  return { src: cdnWidth(image.url, CARD_WIDTH), width: Math.round((image.width || CARD_WIDTH) * scale), height: Math.round((image.height || CARD_WIDTH) * scale), trimmed: false };
}

const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "";
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";
const version = process.env.SHOPIFY_API_VERSION ?? "2026-07";
const REVALIDATE = 300;
/** Cache tag on every Storefront fetch; `revalidateTag(SHOPIFY_TAG)` drops the whole catalog cache. */
export const SHOPIFY_TAG = "shopify";

export class CatalogError extends Error {}

export const storefrontReady = Boolean(domain && token);

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!storefrontReady) {
    throw new CatalogError(
      "Shopify is not connected: add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN to .env.local and restart the dev server.",
    );
  }
  let res: Response;
  try {
    res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
      body: JSON.stringify({ query, variables }),
      // Every Shopify response is cached for 5 minutes and tagged, so POST /api/revalidate can purge them all at once.
      next: { revalidate: REVALIDATE, tags: [SHOPIFY_TAG] },
    });
  } catch (e) {
    throw new CatalogError(`Could not reach Shopify (${domain}): ${(e as Error).message}`);
  }
  if (!res.ok) throw new CatalogError(`Shopify answered ${res.status} ${res.statusText} for ${domain}.`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new CatalogError(`Shopify error: ${json.errors.map((e) => e.message).join("; ")}`);
  if (!json.data) throw new CatalogError("Shopify returned no data.");
  return json.data;
}

/* ───────── shapes ───────── */

export interface ShopProduct {
  handle: string;
  title: string;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  /** Featured photo URL; missing when the product has no media in Shopify yet (cards show the NoPhoto frame). */
  image?: string;
  /** The same photo, display-ready for the cards (trimmed copy or CDN at card width). */
  photo?: ProductPhoto;
  /** ISO date the product was created in Shopify. Drives the NEW badge (last 30 days). */
  createdAt: string;
  variantCount: number;
  /** Name of the first real option, e.g. "Shade", "Size", "Scent". */
  optionName?: string;
  availableForSale: boolean;
}

export interface ShopVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  image?: string;
}

export interface ShopProductDetail extends ShopProduct {
  description: string;
  descriptionHtml: string;
  productType: string;
  images: { url: string; alt: string; width: number; height: number }[];
  options: { name: string; values: string[] }[];
  variants: ShopVariant[];
}

export interface ShopCollection {
  handle: string;
  title: string;
  description: string;
  image?: string;
}

export interface Page<T> {
  items: T[];
  endCursor: string | null;
  hasNextPage: boolean;
}

/* ───────── fragments ───────── */

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    handle
    title
    vendor
    createdAt
    availableForSale
    featuredImage { url width height }
    priceRange { minVariantPrice { amount } }
    compareAtPriceRange { minVariantPrice { amount } }
    options { name optionValues { name } }
  }
`;

interface RawProduct {
  handle: string;
  title: string;
  vendor: string;
  createdAt: string;
  availableForSale: boolean;
  featuredImage: { url: string; width: number; height: number } | null;
  priceRange: { minVariantPrice: { amount: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } };
  options: { name: string; optionValues: { name: string }[] }[];
}

function toProduct(p: RawProduct): ShopProduct {
  const real = p.options.filter((o) => o.name !== "Title");
  const variantCount = real.reduce((n, o) => n * Math.max(1, o.optionValues.length), 1);
  const price = Number(p.priceRange.minVariantPrice.amount);
  const compare = Number(p.compareAtPriceRange?.minVariantPrice?.amount ?? 0);
  return {
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    price,
    compareAtPrice: compare > price ? compare : undefined,
    image: p.featuredImage?.url || undefined,
    photo: resolvePhoto(p.featuredImage),
    createdAt: p.createdAt,
    variantCount,
    optionName: real[0]?.name,
    availableForSale: p.availableForSale,
  };
}

/** Sold-out products go to the end of every list, keeping Shopify's order otherwise. */
export const inStockFirst = <T extends { availableForSale: boolean }>(items: T[]): T[] =>
  [...items.filter((p) => p.availableForSale), ...items.filter((p) => !p.availableForSale)];

interface Connection<T> {
  nodes: T[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

/* ───────── products ───────── */

/** Products matching a Storefront search query, e.g. vendor:'OPI'. */
export async function searchProducts(query: string, first = 48, after: string | null = null): Promise<Page<ShopProduct>> {
  const data = await storefront<{ products: Connection<RawProduct> }>(
    /* GraphQL */ `query Search($query: String!, $first: Int!, $after: String) {
      products(first: $first, after: $after, query: $query, sortKey: BEST_SELLING) {
        nodes { ...ProductFields } pageInfo { hasNextPage endCursor }
      }
    } ${PRODUCT_FIELDS}`,
    { query, first, after },
  );
  return { items: inStockFirst(data.products.nodes.map(toProduct)), endCursor: data.products.pageInfo.endCursor, hasNextPage: data.products.pageInfo.hasNextPage };
}

/** Every product's handle and vendor (a few 250-row requests), for brand counts and the brand index. */
export async function allProductsLite(): Promise<{ handle: string; vendor: string }[]> {
  const out: { handle: string; vendor: string }[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < 20; i++) {
    const data: { products: Connection<{ handle: string; vendor: string }> } = await storefront(
      /* GraphQL */ `query Lite($cursor: String) { products(first: 250, after: $cursor) { nodes { handle vendor } pageInfo { hasNextPage endCursor } } }`,
      { cursor },
    );
    out.push(...data.products.nodes);
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return out;
}

export async function getProduct(handle: string): Promise<ShopProductDetail | null> {
  const data = await storefront<{
    product:
      | (RawProduct & {
          description: string;
          descriptionHtml: string;
          productType: string;
          images: { nodes: { url: string; altText: string | null; width: number; height: number }[] };
          variants: {
            nodes: {
              id: string;
              title: string;
              availableForSale: boolean;
              price: { amount: string };
              compareAtPrice: { amount: string } | null;
              selectedOptions: { name: string; value: string }[];
              image: { url: string } | null;
            }[];
          };
        })
      | null;
  }>(
    /* GraphQL */ `query Product($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
        description
        descriptionHtml
        productType
        images(first: 12) { nodes { url altText width height } }
        variants(first: 250) {
          nodes { id title availableForSale price { amount } compareAtPrice { amount } selectedOptions { name value } image { url } }
        }
      }
    } ${PRODUCT_FIELDS}`,
    { handle },
  );
  const p = data.product;
  if (!p) return null;
  return {
    ...toProduct(p),
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    productType: p.productType,
    images: p.images.nodes.map((i) => ({ url: i.url, alt: i.altText ?? p.title, width: i.width, height: i.height })),
    options: p.options.filter((o) => o.name !== "Title").map((o) => ({ name: o.name, values: o.optionValues.map((v) => v.name) })),
    variants: p.variants.nodes.map((v) => {
      const price = Number(v.price.amount);
      const compare = Number(v.compareAtPrice?.amount ?? 0);
      return {
        id: v.id,
        title: v.title,
        price,
        compareAtPrice: compare > price ? compare : undefined,
        availableForSale: v.availableForSale,
        selectedOptions: v.selectedOptions,
        image: v.image?.url,
      };
    }),
  };
}

/* ───────── collections ───────── */

export async function getCollection(handle: string): Promise<ShopCollection | null> {
  const data = await storefront<{ collection: { handle: string; title: string; description: string; image: { url: string } | null } | null }>(
    /* GraphQL */ `query Collection($handle: String!) { collection(handle: $handle) { handle title description image { url } } }`,
    { handle },
  );
  const c = data.collection;
  return c ? { handle: c.handle, title: c.title, description: c.description, image: c.image?.url } : null;
}

export async function getCollectionProducts(handle: string, first = 48, after: string | null = null): Promise<Page<ShopProduct>> {
  const data = await storefront<{ collection: { products: Connection<RawProduct> } | null }>(
    /* GraphQL */ `query CollectionProducts($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        products(first: $first, after: $after, sortKey: BEST_SELLING) { nodes { ...ProductFields } pageInfo { hasNextPage endCursor } }
      }
    } ${PRODUCT_FIELDS}`,
    { handle, first, after },
  );
  const c = data.collection?.products;
  if (!c) return { items: [], endCursor: null, hasNextPage: false };
  return { items: inStockFirst(c.nodes.map(toProduct)), endCursor: c.pageInfo.endCursor, hasNextPage: c.pageInfo.hasNextPage };
}

/** Number of products in a collection (handles only, 250 per request). */
export async function countCollectionProducts(handle: string): Promise<number> {
  let n = 0;
  let cursor: string | null = null;
  for (let i = 0; i < 20; i++) {
    const data: { collection: { products: Connection<{ handle: string }> } | null } = await storefront(
      /* GraphQL */ `query Count($handle: String!, $cursor: String) { collection(handle: $handle) { products(first: 250, after: $cursor) { nodes { handle } pageInfo { hasNextPage endCursor } } } }`,
      { handle, cursor },
    );
    const c = data.collection?.products;
    if (!c) break;
    n += c.nodes.length;
    if (!c.pageInfo.hasNextPage) break;
    cursor = c.pageInfo.endCursor;
  }
  return n;
}

/** Every collection the Storefront API can see (handle, title, image). */
export async function allCollections(): Promise<ShopCollection[]> {
  const data = await storefront<{ collections: Connection<{ handle: string; title: string; description: string; image: { url: string } | null }> }>(
    /* GraphQL */ `{ collections(first: 250) { nodes { handle title description image { url } } pageInfo { hasNextPage endCursor } } }`,
  );
  return data.collections.nodes.map((c) => ({ handle: c.handle, title: c.title, description: c.description, image: c.image?.url }));
}

/* ───────── brands (Shopify vendors) ───────── */

/** Store-name "vendor" that is not a brand; excluded from brand lists. */
export const STORE_VENDOR = "Diamond Pro Salon Supply";

export interface Brand {
  /** Exact Shopify vendor string, used in the vendor: query. */
  vendor: string;
  slug: string;
  count: number;
}

/** Every brand with its product count, A–Z. Vendors that differ only by case (BIGEN / Bigen) are merged. */
export async function allBrands(): Promise<Brand[]> {
  const lite = await allProductsLite();
  const byKey = new Map<string, Brand>();
  for (const { vendor } of lite) {
    const v = vendor.trim();
    if (!v || v === STORE_VENDOR) continue;
    const key = v.toLowerCase();
    const b = byKey.get(key);
    if (b) b.count++;
    else byKey.set(key, { vendor: v, slug: brandSlug(v), count: 1 });
  }
  return [...byKey.values()].sort((a, b) => a.vendor.localeCompare(b.vendor));
}

export async function getBrand(slug: string): Promise<Brand | null> {
  return (await allBrands()).find((b) => b.slug === slug) ?? null;
}

/** Products of one brand: every case-spelling of the vendor, OR-ed in the query. */
export async function getBrandProducts(brand: Brand, first = 48, after: string | null = null): Promise<Page<ShopProduct>> {
  const lite = await allProductsLite();
  const spellings = [...new Set(lite.map((p) => p.vendor.trim()).filter((v) => v.toLowerCase() === brand.vendor.toLowerCase()))];
  const q = spellings.map((v) => `vendor:'${v.replace(/'/g, "\\'")}'`).join(" OR ");
  return searchProducts(q, first, after);
}

/* ───────── homepage ───────── */

/** Collection handles that feed each Best sellers tab (hair care has no single collection, so it uses "Best Sellers"). */
export const tabCollections: Record<Tab, string> = {
  "hair-care": "best-sellers",
  nails: "nails",
  barber: "barber",
  tools: "tools-accessories",
};

export interface HomeData {
  brands: Brand[];
  bestSellers: Record<Tab, ShopProduct[]>;
  now: number;
}

export async function getHomeData(): Promise<HomeData> {
  const [brands, ...lists] = await Promise.all([allBrands(), ...tabs.map((t) => getCollectionProducts(tabCollections[t.key], 8))]);
  const bestSellers = Object.fromEntries(tabs.map((t, i) => [t.key, lists[i].items])) as Record<Tab, ShopProduct[]>;
  return { brands, bestSellers, now: Date.now() };
}
