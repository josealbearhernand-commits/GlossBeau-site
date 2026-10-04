/**
 * Homepage configuration: which Shopify collections and brands the homepage features, and small
 * display helpers. No product data lives here; every product comes from src/lib/shopify.ts.
 */

export type Tab = "hair-care" | "nails" | "barber" | "tools";

/** Best sellers tabs. Each tab is fed by a Shopify collection (see tabCollections in src/lib/shopify.ts). */
export const tabs: { key: Tab; label: string }[] = [
  { key: "hair-care", label: "Hair care" },
  { key: "nails", label: "Nails" },
  { key: "barber", label: "Barber" },
  { key: "tools", label: "Tools" },
];

/** URL slug for a vendor: "BBCos Italy" → bbcos-italy, "L'EVO Professional" → levo-professional. */
export const brandSlug = (vendor: string) =>
  vendor
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const cdn = "https://cdn.shopify.com/s/files/1/0752/7546/8972/";

/**
 * The 11 featured brands, in the owner's order. `vendor` is the exact Shopify vendor string (used for
 * the vendor: query); `name` is how the site spells it (bbcos, New Adara Nails).
 */
export const featuredBrands: { name: string; vendor: string; logo: string; href: string }[] = [
  ["Nirvel", "Nirvel", "logo-nirvel.png"],
  ["Inoar", "Inoar", "logo-inoar.png"],
  ["Genus", "Genus", "logo-genus.png"],
  ["Olivia Garden", "Olivia Garden", "logo-olivia-garden.png"],
  ["BaBylissPRO", "BaBylissPRO", "logo-babyliss-pro.png"],
  ["Rolda", "Rolda", "logo-rolda.png"],
  ["bbcos", "BBCos Italy", "logo-bbcos.png"],
  ["New Adara Nails", "New Adara", "logo-new-adara.jpg"],
  ["Turbo Power", "Turbo Power", "logo-turbo-power.jpg"],
  ["OPI", "OPI", "logo-opi.jpg"],
  ["DND", "DND", "logo-dnd.jpg"],
].map(([name, vendor, file]) => ({ name, vendor, logo: cdn + "files/" + file, href: `/brands/${brandSlug(vendor)}` }));

/** The site's spelling of a vendor, when it differs from Shopify's. */
export const brandDisplayName = (vendor: string) =>
  featuredBrands.find((b) => b.vendor.toLowerCase() === vendor.toLowerCase())?.name ?? vendor;

export interface HomeCollection {
  /** Exact Shopify collection handle. */
  handle: string;
  /** Short uppercase label for the tile. */
  label: string;
  image: string;
}

/** Nine real Shopify collections for "Explore our products", with our own product photos. */
export const exploreCollections: HomeCollection[] = [
  { handle: "shampoos", label: "Shampoos", image: "/stills/intense-poster.jpg" },
  { handle: "hair-conditioners", label: "Conditioners", image: cdn + "files/inoar-glycolic-force-shampoo-and-conditioner-kit-500ml.jpg?v=1787784962" },
  { handle: "leave-in-conditioners", label: "Leave-ins", image: "/stills/glycolic-poster.jpg" },
  { handle: "professional-treatments", label: "Treatments", image: cdn + "files/https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0326_2F9541_2F9016_2Ffiles_2FGenUs_2_-_post.jpg?v=1777778561" },
  { handle: "hair-color", label: "Hair color", image: cdn + "collections/https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0604_2F7648_2F9909_2Fproducts_2FGenus_Crema_Colorante_100ml_1024x1024_2x_bc3fe4ed-8b72-466b-82da-4aca9177a804.jpg?v=1778123441" },
  { handle: "nails", label: "Nails", image: cdn + "files/1a7e2b_99e672e495ba4a3199769612daf2e79e_mv2.jpg?v=1791078427" },
  { handle: "barber", label: "Barber", image: cdn + "collections/banner_barber.jpg?v=1787786808" },
  { handle: "tools-accessories", label: "Tools", image: cdn + "collections/banner_tools.jpg?v=1787786809" },
  { handle: "clippers-trimmers", label: "Clippers", image: cdn + "files/https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F1_35930abd-a4cf-4ae0-a17e-6997cea21d6f.jpg?v=1786900738" },
];

/**
 * Hair care has no single Shopify collection; these are the hair collections the "Hair care" hub lists.
 * Images come from Shopify at render time.
 */
export const hairCareCollections = [
  "shampoos",
  "hair-conditioners",
  "leave-in-conditioners",
  "professional-treatments",
  "masks",
  "damaged-frizzy-hair",
  "hair-color",
  "developers-and-bleaching",
  "hairloss",
  "kits",
];

/**
 * "What's new" feature: the New Adara Gloss Society Kit (added to Shopify 2026-10-02). The photo is the
 * kit's contents shot from its Shopify media, saved in public/images.
 */
export const whatsNew = {
  handle: "new-adara-gloss-society-kit",
  title: "New Adara Gloss Society Kit",
  image: "/images/gloss-society-kit.jpg",
  href: "/products/new-adara-gloss-society-kit",
};

export const NEW_WINDOW_DAYS = 30;
export const isNew = (createdAt: string, now = Date.now()) =>
  now - new Date(createdAt).getTime() < NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;

/** "In 12 shades" / "In 3 sizes" (rendered uppercase): only when a product has more than one variant. */
export function variantLine(p: { variantCount: number; optionName?: string }): string | null {
  if (p.variantCount <= 1) return null;
  const o = (p.optionName ?? "").toLowerCase();
  const noun = /shade|colou?r/.test(o)
    ? "shades"
    : /size|ml|oz/.test(o)
      ? "sizes"
      : /scent/.test(o)
        ? "scents"
        : /shape/.test(o)
          ? "shapes"
          : "options";
  return `In ${p.variantCount} ${noun}`;
}

export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
