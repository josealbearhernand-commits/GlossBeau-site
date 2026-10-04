/**
 * Homepage data snapshot from the Shopify store (Admin API, captured 2026-10-04).
 * Shapes mirror what src/lib/shopify.ts returns from the Storefront API, so once the
 * SHOPIFY_STOREFRONT_TOKEN is in .env.local the live data replaces this file unchanged.
 */

export type Tab = "hair-care" | "nails" | "barber" | "tools";

export interface HomeProduct {
  handle: string;
  title: string;
  vendor: string;
  price: number;
  image: string;
  /** ISO date the product was created in Shopify. Drives the NEW badge (last 30 days). */
  createdAt: string;
  variantCount: number;
  /** Name of the first real option, e.g. "Shade", "Size", "Scent". */
  optionName?: string;
}

export interface HomeCollection {
  handle: string;
  title: string;
  /** Short uppercase label for the tile. */
  label: string;
  image: string;
}

const cdn = "https://cdn.shopify.com/s/files/1/0752/7546/8972/";

/**
 * Every vendor in the store, exactly as Shopify lists them (shop.productVendors).
 * The brand grid counts "More brands" from this list; nothing is hard-coded.
 */
export const shopifyVendors = [
  "ABS", "African Pride", "AmPro", "Andis", "Aora", "BaBylissPRO", "Barber Marmara", "BBCos Italy", "BIGEN", "Bigen",
  "Buff Bloom", "Clairol Professional", "Clippercide", "Clubman", "Diamond Pro Salon Supply", "Diane", "DND", "Eco Style",
  "Feather", "Genus", "Graham", "Inmortal NYC", "Inoar", "Kiara Sky", "Kupa", "L'EVO Professional", "L3VEL3", "New Adara",
  "Nirvel", "Nitro", "Olivia Garden", "OPI", "PND", "Rolda", "ROQVEL Professional", "Sanek", "Silicon Mix", "Sodi Pro",
  "Stylecraft", "Turbo Power", "Wahl",
];

/** Store-name "vendor" that is not a brand; excluded from brand counts. */
export const STORE_VENDOR = "Diamond Pro Salon Supply";

/**
 * The 11 featured brands, in the owner's order. `vendor` is the exact Shopify vendor string
 * (display name differs for bbcos → "BBCos Italy" and New Adara Nails → "New Adara").
 */
export const featuredBrands: { name: string; vendor: string; logo: string; href: string }[] = [
  { name: "Nirvel", vendor: "Nirvel", logo: cdn + "files/logo-nirvel.png", href: "/collections/nirvel-cosmetics" },
  { name: "Inoar", vendor: "Inoar", logo: cdn + "files/logo-inoar.png", href: "/collections/inoar-professional" },
  { name: "Genus", vendor: "Genus", logo: cdn + "files/logo-genus.png", href: "/collections/genus-cosmetics" },
  { name: "Olivia Garden", vendor: "Olivia Garden", logo: cdn + "files/logo-olivia-garden.png", href: "/collections/olivia-garden" },
  { name: "BaBylissPRO", vendor: "BaBylissPRO", logo: cdn + "files/logo-babyliss-pro.png", href: "/collections/babyliss-professional" },
  { name: "Rolda", vendor: "Rolda", logo: cdn + "files/logo-rolda.png", href: "/collections/rolda" },
  { name: "bbcos", vendor: "BBCos Italy", logo: cdn + "files/logo-bbcos.png", href: "/collections/bbcos-itlay" },
  { name: "New Adara Nails", vendor: "New Adara", logo: cdn + "files/logo-new-adara.jpg", href: "/collections/new-adara" },
  { name: "Turbo Power", vendor: "Turbo Power", logo: cdn + "files/logo-turbo-power.jpg", href: "/collections/turbo-power" },
  { name: "OPI", vendor: "OPI", logo: cdn + "files/logo-opi.jpg", href: "/collections/opi" },
  { name: "DND", vendor: "DND", logo: cdn + "files/logo-dnd.jpg", href: "/collections/dnd" },
];

/** Number of brands behind the "More brands" tile: every Shopify vendor not shown above. */
export function moreBrandCount(vendors: string[] = shopifyVendors): number {
  const shown = new Set(featuredBrands.map((b) => b.vendor.toLowerCase()));
  const rest = new Set(
    vendors
      .map((v) => v.trim())
      .filter((v) => v && v !== STORE_VENDOR && !shown.has(v.toLowerCase()))
      .map((v) => v.toLowerCase()),
  );
  return rest.size;
}

const f = (file: string) => cdn + "files/" + file;

/** Best sellers per tab (Shopify best-selling order within each category, 8 each). */
export const bestSellers: Record<Tab, HomeProduct[]> = {
  "hair-care": [
    { handle: "inoar-argan-oil-thermoliss-thermoactivated-defrizzer-240ml", title: "Inoar Argan Oil Thermoliss Thermoactivated Defrizzer 240ml", vendor: "Inoar", price: 13.99, image: f("inoar-argan-oil-thermoliss-thermoactivated-defrizzer-240ml.jpg?v=1787784808"), createdAt: "2026-05-02T14:37:55Z", variantCount: 1 },
    { handle: "inoar-glycolic-force-leave-in-hair-treatment-200ml", title: "Inoar Glycolic Force Leave-in Hair Treatment 200ml", vendor: "Inoar", price: 12.99, image: f("inoar-glycolic-force-leave-in-hair-treatment-200ml.jpg?v=1787785009"), createdAt: "2026-05-03T05:11:30Z", variantCount: 1 },
    { handle: "genus-argan-moisturizing-serum-for-dry-and-frizzy-hair-100ml", title: "Genus Argan Moisturizing Serum for Dry and Frizzy Hair 100ml", vendor: "Genus", price: 13.99, image: f("genus-argan-moisturizing-serum-for-dry-and-frizzy-hair-100ml.jpg?v=1787784809"), createdAt: "2026-05-03T02:38:01Z", variantCount: 1 },
    { handle: "genus-keratin-restructuring-hair-mask-for-damaged-treated-hair", title: "Genus Keratin Restructuring Hair Mask For Damaged Treated Hair", vendor: "Genus", price: 15.99, image: f("genus-keratin-restructuring-hair-mask-for-damaged-treated-hair.jpg?v=1787784811"), createdAt: "2026-05-03T02:41:50Z", variantCount: 2, optionName: "Size" },
    { handle: "nirvel-argan-fluid-hair-treatment-serum-lightweight-shine-60ml", title: "Nirvel Argan Fluid Hair Treatment Serum Lightweight Shine 60ml", vendor: "Nirvel", price: 12.99, image: f("https_3A_2F_2Fm.media-amazon.com_2Fimages_2FI_2F51Aq3iSRO2L._SL1080.jpg?v=1779764888"), createdAt: "2026-05-26T03:08:03Z", variantCount: 1 },
    { handle: "inoar-agua-milagrosa-vegan-hair-treatment-spray-6-7-fl-oz", title: "INOAR Agua Milagrosa Vegan Hair Treatment Spray 6.7 fl oz", vendor: "Inoar", price: 20.99, image: f("inoar-agua-milagrosa-vegan-hair-treatment-spray-6-7-fl-oz.jpg?v=1787784960"), createdAt: "2026-05-03T05:08:37Z", variantCount: 1 },
    { handle: "concept-cosmetics-set-laminescent-hair-treatment-and-spray-kit", title: "Genus Laminescent Hair Treatment and Spray Kit", vendor: "Genus", price: 18.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0326_2F9541_2F9016_2Ffiles_2FGenUs_2_-_post.jpg?v=1777778561"), createdAt: "2026-05-03T03:22:35Z", variantCount: 2, optionName: "Product form" },
    { handle: "inoar-recarga-de-queratina-hair-reconstruction-treatment-liquid-and-cream", title: "Inoar Recarga de Queratina Hair Reconstruction Treatment Liquid and Cream", vendor: "Inoar", price: 13.99, image: f("https_3A_2F_2Finoar.com_2Fwp-content_2Fuploads_2F2023_2F12_2Fqueratina001-Camera-2-2.jpg?v=1777732408"), createdAt: "2026-05-02T14:33:22Z", variantCount: 2, optionName: "Type" },
  ],
  nails: [
    { handle: "opi-gelcolor-opim-a-bubble-bunny-0-5-oz-gcs061", title: "OPI GelColor OPI'm a Bubble Bunny 0.5 oz GCS061", vendor: "OPI", price: 13.99, image: f("OPIGelColorInteli-GelOPI_maBubbleBunny_GCS061.webp?v=1789232694"), createdAt: "2026-09-12T17:04:52Z", variantCount: 1 },
    { handle: "kiara-sky-gel-pro-hema-free-gel-polish-0-5-oz", title: "Kiara Sky Gel Pro HEMA-Free Gel Polish 0.5 oz", vendor: "Kiara Sky", price: 12.99, image: f("kiara-sky-gel-pro-collection.jpg?v=1788627640"), createdAt: "2026-09-05T17:00:28Z", variantCount: 150, optionName: "Color" },
    { handle: "new-adara-gel-polish", title: "New Adara Gel Polish", vendor: "New Adara", price: 8.99, image: f("1a7e2b_e4421313d40945208f0558c26b123cb8_mv2.jpg?v=1791074874"), createdAt: "2026-10-01T03:24:01Z", variantCount: 117, optionName: "Shade" },
    { handle: "new-adara-duo-gel-nail-polish", title: "New Adara Duo Gel & Nail Polish", vendor: "New Adara", price: 9.99, image: f("1a7e2b_44a324f332824adbb14916783f8710cf_mv2.jpg?v=1791078379"), createdAt: "2026-10-01T18:00:39Z", variantCount: 80, optionName: "Shade" },
    { handle: "dnd-dc-gel-lacquer-duo-master-black-888", title: "DND DC Gel & Lacquer Duo Master Black #888", vendor: "DND", price: 9.95, image: f("DC-888-DUO.webp?v=1789252499"), createdAt: "2026-09-12T22:34:56Z", variantCount: 1 },
    { handle: "opi-powder-perfection-dip-powder-samoan-sand-1-5-oz-dpp61a", title: "OPI Powder Perfection Dip Powder Samoan Sand 1.5 oz DPP61A", vendor: "OPI", price: 15.99, image: f("OPI-Powder-Perfection-Samoan-Sand-1_5-oz-DPP61-Dipping-Powder-at-Beyond-Polish.jpg?v=1789176291"), createdAt: "2026-09-12T01:24:49Z", variantCount: 1 },
    { handle: "opi-gelcolor-stay-shiny-top-coat-0-5-oz-gc003", title: "OPI GelColor Stay Shiny Top Coat 0.5 oz GC003", vendor: "OPI", price: 17.99, image: f("opi-gelcolor-stay-shiny-top-coat-gc003.jpg?v=1788626657"), createdAt: "2026-09-05T16:44:15Z", variantCount: 1 },
    { handle: "new-adara-chrome-powder", title: "New Adara Chrome Powder", vendor: "New Adara", price: 2.99, image: f("1a7e2b_99e672e495ba4a3199769612daf2e79e_mv2.jpg?v=1791078427"), createdAt: "2026-10-01T20:57:17Z", variantCount: 42, optionName: "Shade" },
  ],
  barber: [
    { handle: "level3-5-in-1-clipper-spray-disinfectant-lubricant-cleaner-10-14-oz", title: "Level3 5-in-1 Clipper Spray Disinfectant Lubricant Cleaner 10.14 oz", vendor: "L3VEL3", price: 5.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2Fclipper-spray_d65f237b-700b-44db-aa6c-8461eeb056bc.jpg?v=1786894820"), createdAt: "2026-08-16T15:40:16Z", variantCount: 1 },
    { handle: "eco-style-krystal-styling-gel-strong-hold-weightless-8-oz", title: "Eco Style Krystal Styling Gel Strong Hold Weightless 8 oz", vendor: "Eco Style", price: 4.99, image: f("https_3A_2F_2Fm.media-amazon.com_2Fimages_2FI_2F71ViUkhNl0L._SL1500.jpg?v=1786901416"), createdAt: "2026-08-16T17:30:11Z", variantCount: 6, optionName: "Size" },
    { handle: "immortal-exclusive-wax-guilty-strong-hold-hair-styling-3-4-oz", title: "Immortal Exclusive Wax Guilty Strong Hold Hair Styling 3.4 oz", vendor: "Inmortal NYC", price: 10.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2Fthe-guilty-man-classic-hair-wax_0b32db20-885c-43fd-896e-7dce975996e0.jpg?v=1786894306"), createdAt: "2026-08-16T15:31:43Z", variantCount: 1 },
    { handle: "immortal-hair-styling-gel-gold-edition-strong-hold-1-lb", title: "Immortal Hair Styling Gel Gold Edition Strong Hold 1 lb", vendor: "Inmortal NYC", price: 9.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F1_8566d830-db66-44de-baab-426ff4ebe05d.jpg?v=1786894175"), createdAt: "2026-08-16T15:29:30Z", variantCount: 1 },
    { handle: "clubman-reserve-whiskey-woods-talc-free-body-powder-9-oz", title: "Clubman Reserve Whiskey Woods Talc-Free Body Powder 9 oz", vendor: "Clubman", price: 8.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0601_2F5159_2F5121_2Ffiles_2Fcl_90782_whiskeywoodspowder_9oz_lr.jpg?v=1786895580"), createdAt: "2026-08-16T15:52:57Z", variantCount: 1 },
    { handle: "l3vel3-tinted-hair-gel-black-color", title: "L3VEL3 Tinted Hair Gel Black Color", vendor: "L3VEL3", price: 19.5, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2Flevel3-tinted-gel_7bc0f2ab-05bd-49dc-a595-2fa488e0f8fb.jpg?v=1786902206"), createdAt: "2026-08-16T17:43:23Z", variantCount: 1 },
    { handle: "eco-style-argan-oil-styling-gel-32-oz", title: "Eco Style Argan Oil Styling Gel 32 oz", vendor: "Eco Style", price: 8.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2Fe5ca19973afa18a1f909c6dab450f47b.jpg?v=1786901714"), createdAt: "2026-08-16T17:35:11Z", variantCount: 1 },
    { handle: "andis-profoil-lithium-plus-shaver-17255", title: "Andis ProFoil Lithium Plus Shaver 17255", vendor: "Andis", price: 64.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F17255-profoil-lithium-titanium-shaver-ts-2-straight-1-web_7a28aa8f-2c0c-4ab0-9572-c86894a320ca.png?v=1786900826"), createdAt: "2026-08-16T17:20:22Z", variantCount: 1 },
  ],
  tools: [
    { handle: "babylisspro-nano-titanium-light-ionic-high-speed-dryer-bntc9200", title: "BaBylissPRO Nano Titanium Light Ionic High-Speed Dryer BNTC9200", vendor: "BaBylissPRO", price: 159.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2FScreenshot-2024-10-14-104741_a01c3d0b-bc8b-4ce7-8345-bfa495a66ee0.jpg?v=1786899798"), createdAt: "2026-08-16T17:03:15Z", variantCount: 1 },
    { handle: "olivia-garden-heatpro-speed-xl-round-brush", title: "Olivia Garden HeatPro Speed XL Round Brush", vendor: "Olivia Garden", price: 17.95, image: f("722-HPXLBOX01_2048x_636806a3-0f90-4dbe-84c6-e7d0a977c49a.jpg?v=1787528316"), createdAt: "2026-08-23T23:38:34Z", variantCount: 5, optionName: "Size" },
    { handle: "olivia-garden-prothermal-round-brush", title: "Olivia Garden ProThermal Round Brush", vendor: "Olivia Garden", price: 9.95, image: f("710-TBOX01-slider_2048x_bcf5db1d-da8a-44db-b31b-3371749c73da.jpg?v=1787528289"), createdAt: "2026-08-23T23:38:07Z", variantCount: 6, optionName: "Size" },
    { handle: "olivia-garden-essentials-thermal-brush", title: "Olivia Garden ESSENTIALS Thermal Brush", vendor: "Olivia Garden", price: 8.95, image: f("OGE-BD16T-slider_2048x_d3134625-0601-481b-b8f2-296c88cd2c0b.jpg?v=1787528326"), createdAt: "2026-08-23T23:38:44Z", variantCount: 5, optionName: "Size" },
    { handle: "andis-recon-cordless-clipper-562257", title: "Andis Recon Cordless Clipper 562257", vendor: "Andis", price: 289.99, image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F1_35930abd-a4cf-4ae0-a17e-6997cea21d6f.jpg?v=1786900738"), createdAt: "2026-08-16T17:18:54Z", variantCount: 1 },
    { handle: "olivia-garden-silkcut-shear-thinner-intro-case-deal", title: "Olivia Garden SilkCut Shear & Thinner Intro Case Deal", vendor: "Olivia Garden", price: 149.99, image: f("sk-c05_2048x_43cfc8dd-0ec0-41e7-a4d1-ebc1e78f3d9d.jpg?v=1787528375"), createdAt: "2026-08-23T23:39:34Z", variantCount: 3, optionName: "Size" },
    { handle: "olivia-garden-ecoceramic-firm-bristle-brush", title: "Olivia Garden EcoCeramic Firm Bristle Brush", vendor: "Olivia Garden", price: 19.75, image: f("717-ECD16F_2048x_5b637b7c-6126-4715-89b9-49643031d95e.jpg?v=1787528357"), createdAt: "2026-08-23T23:39:15Z", variantCount: 4, optionName: "Size" },
    { handle: "olivia-garden-og-barber-vented-paddle-brush", title: "Olivia Garden OG Barber Vented Paddle Brush", vendor: "Olivia Garden", price: 7.95, image: f("vp_2048x_f45fa2df-0362-4176-a2c9-8de354335de7.jpg?v=1787528306"), createdAt: "2026-08-23T23:38:24Z", variantCount: 1 },
  ],
};

export const tabs: { key: Tab; label: string; href: string }[] = [
  { key: "hair-care", label: "Hair care", href: "/collections/hair-care" },
  { key: "nails", label: "Nails", href: "/collections/nails" },
  { key: "barber", label: "Barber", href: "/collections/barber" },
  { key: "tools", label: "Tools", href: "/collections/tools-accessories" },
];

/** Nine real Shopify collections for "Explore our products", with our own product photos. */
export const exploreCollections: HomeCollection[] = [
  { handle: "shampoos", title: "Shampoos", label: "Shampoos", image: "/stills/intense-poster.jpg" },
  { handle: "hair-conditioners", title: "Hair Conditioners", label: "Conditioners", image: cdn + "files/inoar-glycolic-force-shampoo-and-conditioner-kit-500ml.jpg?v=1787784962" },
  { handle: "leave-in-conditioners", title: "Leave in Conditioners", label: "Leave-ins", image: "/stills/glycolic-poster.jpg" },
  { handle: "professional-treatments", title: "Professional Treatments", label: "Treatments", image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0326_2F9541_2F9016_2Ffiles_2FGenUs_2_-_post.jpg?v=1777778561") },
  { handle: "hair-color", title: "Hair Color", label: "Hair color", image: cdn + "collections/https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0604_2F7648_2F9909_2Fproducts_2FGenus_Crema_Colorante_100ml_1024x1024_2x_bc3fe4ed-8b72-466b-82da-4aca9177a804.jpg?v=1778123441" },
  { handle: "nails", title: "Nails", label: "Nails", image: f("1a7e2b_99e672e495ba4a3199769612daf2e79e_mv2.jpg?v=1791078427") },
  { handle: "barber", title: "Barber", label: "Barber", image: cdn + "collections/banner_barber.jpg?v=1787786808" },
  { handle: "tools-accessories", title: "Tools & Accessories", label: "Tools", image: cdn + "collections/banner_tools.jpg?v=1787786809" },
  { handle: "clippers-trimmers", title: "Clippers & Trimmers", label: "Clippers", image: f("https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F1_35930abd-a4cf-4ae0-a17e-6997cea21d6f.jpg?v=1786900738") },
];

/**
 * "What's new" feature: the New Adara Gloss Society Kit (added to Shopify 2026-10-02). The photo is the
 * kit's contents shot from its Shopify media (file 1a7e2b_4a0ea25f…, 1448×1086), saved in public/images;
 * the kit's *main* Shopify image is the campaign portrait used in the hero, at only 309×499.
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
export function variantLine(p: Pick<HomeProduct, "variantCount" | "optionName">): string | null {
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

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
