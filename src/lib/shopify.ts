/**
 * Shopify Storefront API client. The homepage calls getHomeData(): with SHOPIFY_STOREFRONT_TOKEN
 * in .env.local it reads live products, vendors and collections; without it (or on any error)
 * it falls back to the snapshot in src/data/home.ts, which has the same shapes.
 */
import {
  bestSellers as snapshotBestSellers,
  exploreCollections,
  shopifyVendors,
  tabs,
  whatsNew as snapshotWhatsNew,
  type HomeCollection,
  type HomeProduct,
  type Tab,
} from "@/data/home";

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
    createdAt
    featuredImage { url }
    priceRange { minVariantPrice { amount } }
    variants(first: 1) { nodes { id } }
    variantsCount: totalInventory
    options { name optionValues { name } }
  }
`;

interface StorefrontProduct {
  handle: string;
  title: string;
  vendor: string;
  createdAt: string;
  featuredImage: { url: string } | null;
  priceRange: { minVariantPrice: { amount: string } };
  options: { name: string; optionValues: { name: string }[] }[];
}

function toHomeProduct(p: StorefrontProduct): HomeProduct | null {
  if (!p.featuredImage) return null;
  const real = p.options.filter((o) => o.name !== "Title");
  const variantCount = real.reduce((n, o) => n * Math.max(1, o.optionValues.length), 1);
  return {
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    price: Number(p.priceRange.minVariantPrice.amount),
    image: p.featuredImage.url,
    createdAt: p.createdAt,
    variantCount,
    optionName: real[0]?.name,
  };
}

/** Collection handles that feed each Best sellers tab (hair care has no single collection, so it uses "Best Sellers"). */
const tabCollections: Record<Tab, string> = {
  "hair-care": "best-sellers",
  nails: "nails",
  barber: "barber",
  tools: "tools-accessories",
};

export interface HomeData {
  vendors: string[];
  bestSellers: Record<Tab, HomeProduct[]>;
  collections: HomeCollection[];
  whatsNew: { handle: string; title: string; image: string; href: string };
  now: number;
}

async function liveVendors(): Promise<string[]> {
  const vendors = new Set<string>();
  let cursor: string | null = null;
  for (let i = 0; i < 6; i++) {
    const data: { products: { nodes: { vendor: string }[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } =
      await storefront(
        /* GraphQL */ `query Vendors($cursor: String) { products(first: 250, after: $cursor) { nodes { vendor } pageInfo { hasNextPage endCursor } } }`,
        { cursor },
      );
    data.products.nodes.forEach((n) => vendors.add(n.vendor));
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return [...vendors];
}

async function liveBestSellers(): Promise<Record<Tab, HomeProduct[]>> {
  const out = { ...snapshotBestSellers };
  for (const t of tabs) {
    const data: { collection: { products: { nodes: StorefrontProduct[] } } | null } = await storefront(
      /* GraphQL */ `query Best($handle: String!) { collection(handle: $handle) { products(first: 8, sortKey: BEST_SELLING) { nodes { ...ProductFields } } } } ${PRODUCT_FIELDS}`,
      { handle: tabCollections[t.key] },
    );
    const items = (data.collection?.products.nodes ?? []).map(toHomeProduct).filter((p): p is HomeProduct => Boolean(p));
    if (items.length >= 4) out[t.key] = items;
  }
  return out;
}

export async function getHomeData(): Promise<HomeData> {
  const now = Date.now();
  const fallback: HomeData = { vendors: shopifyVendors, bestSellers: snapshotBestSellers, collections: exploreCollections, whatsNew: snapshotWhatsNew, now };
  if (!storefrontReady) return fallback;
  try {
    // "What's new" is the owner's pick (src/data/home.ts), not the newest product, so it is not replaced here.
    const [vendors, best] = await Promise.all([liveVendors(), liveBestSellers()]);
    return { ...fallback, vendors, bestSellers: best };
  } catch (e) {
    console.warn("Storefront API unavailable, using snapshot:", (e as Error).message);
    return fallback;
  }
}
