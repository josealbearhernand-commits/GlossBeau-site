/**
 * Preview catalog: real products and photos from the Diamond Pro Salon Supply
 * Shopify store (2rfhas-it.myshopify.com), captured 2026-10-03.
 * When the Storefront API token is added, src/lib/shopify.ts replaces this file
 * as the data source; the shapes below mirror the Storefront API fields used.
 */

export type Category = "hair-care" | "nails" | "barber" | "tools";

export interface Product {
  handle: string;
  title: string;
  vendor: string;
  category: Category;
  type: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  benefits?: string[];
  sizes?: string[];
  availableForSale: boolean;
  featured?: boolean;
}

const cdn = "https://cdn.shopify.com/s/files/1/0752/7546/8972/files/";

export const products: Product[] = [
  {
    handle: "genus-argan-hydrating-shampoo-for-dry-frizzy-hair",
    title: "Genus Argan Hydrating Shampoo",
    vendor: "Genus",
    category: "hair-care",
    type: "Shampoo",
    price: 9.99,
    image: cdn + "genus-argan-hydrating-shampoo-for-dry-frizzy-hair.jpg?v=1787784809",
    description:
      "A hydrating shampoo for dry, frizzy and chemically treated hair. Argan and linseed oils cleanse gently while restoring softness and shine.",
    benefits: ["Hydrates dry lengths", "Tames frizz", "Safe for color-treated hair"],
    sizes: ["300 ml", "1000 ml"],
    availableForSale: true,
    featured: true,
  },
  {
    handle: "genus-argan-hydrating-mask-for-dry-frizzy-hair",
    title: "Genus Argan Hydrating Mask",
    vendor: "Genus",
    category: "hair-care",
    type: "Hair mask",
    price: 15.99,
    image: cdn + "genus-argan-hydrating-mask-for-dry-frizzy-hair.jpg?v=1787784810",
    description:
      "A professional treatment mask for dry, frizzy and chemically treated hair. Argan oil deeply nourishes and leaves hair soft and manageable.",
    benefits: ["Deep nourishment", "Softness that lasts", "Frizz control"],
    sizes: ["500 ml", "1000 ml"],
    availableForSale: true,
    featured: true,
  },
  {
    handle: "genus-argan-moisturizing-serum-for-dry-and-frizzy-hair-100ml",
    title: "Genus Argan Moisturizing Serum",
    vendor: "Genus",
    category: "hair-care",
    type: "Serum",
    price: 13.99,
    image: cdn + "genus-argan-moisturizing-serum-for-dry-and-frizzy-hair-100ml.jpg?v=1787784809",
    description:
      "Argan and linseed oil serum that nourishes, hydrates and restores natural softness. Tames frizz and adds shine without weighing hair down.",
    benefits: ["Instant shine", "Weightless finish", "Heat protection"],
    sizes: ["100 ml"],
    availableForSale: true,
    featured: true,
  },
  {
    handle: "genus-argan-multi-action-leave-in-mask-spray-200ml",
    title: "Genus Argan Leave-in Mask Spray",
    vendor: "Genus",
    category: "hair-care",
    type: "Leave-in",
    price: 12.99,
    image: cdn + "genus-argan-multi-action-leave-in-mask-spray-200ml.jpg?v=1787784808",
    description:
      "A multi-action leave-in moisturizing spray mask for dry, frizzy and chemically treated hair, enriched with argan oil and linseed.",
    sizes: ["200 ml"],
    availableForSale: true,
  },
  {
    handle: "genus-keratin-restructuring-shampoo-for-damaged-treated-hair",
    title: "Genus Keratin Restructuring Shampoo",
    vendor: "Genus",
    category: "hair-care",
    type: "Shampoo",
    price: 9.99,
    image: cdn + "genus-keratin-restructuring-shampoo-for-damaged-treated-hair.jpg?v=1787784810",
    description:
      "Formulated for treated and damaged hair. Cleanses gently while keratin, silk proteins, caviar and collagen rebuild fragile structures.",
    sizes: ["300 ml", "1000 ml"],
    availableForSale: true,
  },
  {
    handle: "genus-keratin-restructuring-hair-mask-for-damaged-treated-hair",
    title: "Genus Keratin Restructuring Mask",
    vendor: "Genus",
    category: "hair-care",
    type: "Hair mask",
    price: 15.99,
    image: cdn + "genus-keratin-restructuring-hair-mask-for-damaged-treated-hair.jpg?v=1787784811",
    description:
      "A rich, creamy restructuring mask for treated and damaged hair, with keratin, silk proteins, caviar and collagen.",
    sizes: ["500 ml", "1000 ml"],
    availableForSale: true,
  },
  {
    handle: "genus-keratin-restructuring-treatment-for-split-ends-100ml",
    title: "Genus Keratin Split Ends Treatment",
    vendor: "Genus",
    category: "hair-care",
    type: "Treatment",
    price: 13.99,
    image: cdn + "genus-keratin-restructuring-treatment-for-split-ends-100ml.jpg?v=1787784811",
    description:
      "Seals split ends and smooths frizz on treated and damaged hair with a blend of keratin, silk proteins, caviar and collagen.",
    sizes: ["100 ml"],
    availableForSale: true,
  },
  {
    handle: "genus-intense-restoring-shampoo-for-frizzy-and-damaged-hair",
    title: "Genus Intense Restoring Shampoo",
    vendor: "Genus",
    category: "hair-care",
    type: "Shampoo",
    price: 9.99,
    image: cdn + "genus-intense-restoring-shampoo-for-frizzy-and-damaged-hair.jpg?v=1787784812",
    description:
      "A professional formula that restructures and revitalizes frizzy, damaged hair with silk proteins.",
    sizes: ["300 ml", "1000 ml"],
    availableForSale: true,
  },
  {
    handle: "inoar-argan-oil-thermoliss-thermoactivated-defrizzer-240ml",
    title: "Inoar Argan Oil Thermoliss Defrizzer",
    vendor: "Inoar",
    category: "hair-care",
    type: "Smoothing",
    price: 13.99,
    image: cdn + "inoar-argan-oil-thermoliss-thermoactivated-defrizzer-240ml.jpg?v=1787784808",
    description:
      "A heat-activated smoothing treatment that enhances straight styles, controls frizz and protects against heat. Vegan.",
    sizes: ["240 ml"],
    availableForSale: true,
  },
  {
    handle: "inoar-absolut-daymoist-leave-in-hair-treatment-200ml",
    title: "Inoar Absolut Daymoist Leave-in",
    vendor: "Inoar",
    category: "hair-care",
    type: "Leave-in",
    price: 11.99,
    image: cdn + "inoar-absolut-daymoist-leave-in-hair-treatment-200ml.jpg?v=1787784956",
    description:
      "A multifunctional leave-in spray for fragile and damaged hair with 15 benefits in one, including heat protection and detangling.",
    sizes: ["200 ml"],
    availableForSale: true,
  },
  {
    handle: "inoar-blends-collection-antioxidant-hair-care-range-vegan",
    title: "Inoar Blends Antioxidant Collection",
    vendor: "Inoar",
    category: "hair-care",
    type: "Collection",
    price: 9.99,
    image: cdn + "inoar-blends-collection-antioxidant-hair-care-range-vegan.jpg?v=1787784762",
    description:
      "An antioxidant vitamin complex that fights premature hair aging. Shampoo, conditioner, mask, leave-in and styling cream.",
    sizes: ["Shampoo", "Conditioner", "Mask", "Leave-in", "Styling cream"],
    availableForSale: true,
  },
  {
    handle: "inoar-rejutherapy-hair-care-collection-3-piece-set",
    title: "Inoar Rejutherapy Collection",
    vendor: "Inoar",
    category: "hair-care",
    type: "Collection",
    price: 11.99,
    image: cdn + "inoar-rejutherapy-hair-care-collection-3-piece-set.jpg?v=1787784807",
    description:
      "Hyaluronic acid, zinc, biotin and plant collagen for stronger, fuller-looking hair. Shampoo, conditioner and leave-in.",
    sizes: ["Shampoo", "Conditioner", "Leave-in"],
    availableForSale: true,
  },
  {
    handle: "inoar-recarga-de-queratina-hair-reconstruction-treatment-liquid-and-cream",
    title: "Inoar Recarga de Queratina",
    vendor: "Inoar",
    category: "hair-care",
    type: "Treatment",
    price: 13.99,
    image: cdn + "https_3A_2F_2Finoar.com_2Fwp-content_2Fuploads_2F2023_2F12_2Fqueratina001-Camera-2-2.jpg?v=1777732408",
    description:
      "A dual-form keratin reconstruction treatment that restores structure to damaged strands. Liquid or cream.",
    sizes: ["Liquid", "Cream"],
    availableForSale: true,
  },
  {
    handle: "nirvel-argan-fluid-hair-treatment-serum-lightweight-shine-60ml",
    title: "Nirvel Argan Fluid",
    vendor: "Nirvel",
    category: "hair-care",
    type: "Serum",
    price: 12.99,
    image: cdn + "https_3A_2F_2Fm.media-amazon.com_2Fimages_2FI_2F51Aq3iSRO2L._SL1080.jpg?v=1779764888",
    description:
      "A lightweight argan serum that boosts shine, shortens drying time and controls frizz.",
    sizes: ["60 ml"],
    availableForSale: true,
  },
  {
    handle: "nirvel-xpress-mask-deep-conditioning-hair-treatment-8-4-fl-oz",
    title: "Nirvel Xpress 1-Minute Mask",
    vendor: "Nirvel",
    category: "hair-care",
    type: "Hair mask",
    price: 12.99,
    image: cdn + "https_3A_2F_2Fm.media-amazon.com_2Fimages_2FI_2F51y7tUbUi1L._AC_SL1080.jpg?v=1779764766",
    description:
      "A one-minute deep conditioning treatment that delivers rapid hydration to all hair types.",
    sizes: ["8.4 fl oz", "34 fl oz"],
    availableForSale: true,
  },
  {
    handle: "inoar-agua-milagrosa-vegan-hair-treatment-spray-6-7-fl-oz",
    title: "Inoar Agua Milagrosa Treatment Spray",
    vendor: "Inoar",
    category: "hair-care",
    type: "Treatment",
    price: 20.99,
    image: cdn + "inoar-agua-milagrosa-vegan-hair-treatment-spray-6-7-fl-oz.jpg?v=1787784960",
    description:
      "A professional treatment spray with 17 amino acids and 4 plant-based keratins that instantly restores moisture and controls frizz. Vegan.",
    sizes: ["6.7 fl oz"],
    availableForSale: true,
    featured: true,
  },
  {
    handle: "inoar-glycolic-force-leave-in-hair-treatment-200ml",
    title: "Inoar Glycolic Force Leave-in",
    vendor: "Inoar",
    category: "hair-care",
    type: "Leave-in",
    price: 12.99,
    image: cdn + "inoar-glycolic-force-leave-in-hair-treatment-200ml.jpg?v=1787785009",
    description:
      "Intense hydration that repairs damaged fibers and reduces porosity. Detangles, restores shine and protects from heat.",
    sizes: ["200 ml"],
    availableForSale: true,
  },
  {
    handle: "nirvel-professional-silver-shampoo-moisturizing-250ml-for-gray-hair",
    title: "Nirvel Silver Shampoo",
    vendor: "Nirvel",
    category: "hair-care",
    type: "Shampoo",
    price: 10.99,
    image: cdn + "https_3A_2F_2Fm.media-amazon.com_2Fimages_2FI_2F41ZQzS0PLML._SL1080.jpg?v=1779765187",
    description:
      "A revitalizing shampoo that hydrates, smooths and boosts shine in gray, blonde or bleached hair, with hyaluronic acid.",
    sizes: ["250 ml"],
    availableForSale: true,
  },
  // Tools
  {
    handle: "babylisspro-nano-titanium-light-ionic-high-speed-dryer-bntc9200",
    title: "BaBylissPRO Nano Titanium Light Ionic Dryer",
    vendor: "BaBylissPRO",
    category: "tools",
    type: "Dryer",
    price: 159.99,
    image: cdn + "https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2FScreenshot-2024-10-14-104741_a01c3d0b-bc8b-4ce7-8345-bfa495a66ee0.jpg?v=1786899798",
    description:
      "The lightest, most compact dryer in the Nano Titanium line. High-speed ionic airflow for fast, frizz-free drying.",
    benefits: ["Under 1 lb", "High-speed brushless motor", "Ionic frizz control"],
    availableForSale: true,
    featured: true,
  },
  {
    handle: "olivia-garden-ceramic-ion-thermal-round-brush",
    title: "Olivia Garden Ceramic + Ion Round Brush",
    vendor: "Olivia Garden",
    category: "tools",
    type: "Brush",
    price: 12.95,
    image: cdn + "715-CID18_2048x_07ac2fa5-c847-4cb2-90ec-28c3e816f911.jpg?v=1787528229",
    description:
      "A ceramic-coated barrel heats faster and holds heat longer for quicker, longer-lasting blowouts.",
    sizes: ['1"', '1 3/8"', '1 3/4"', '2 1/8"', '3 1/2"'],
    availableForSale: true,
  },
  {
    handle: "olivia-garden-heatpro-round-thermal-brush",
    title: "Olivia Garden HeatPro Round Brush",
    vendor: "Olivia Garden",
    category: "tools",
    type: "Brush",
    price: 16.95,
    image: cdn + "717-HPD18_2048x_1560a401-bbec-4748-98d2-5de7cf2c1b5f.jpg?v=1787528243",
    description:
      "Extreme-heat certified to 550°F with a ceramic barrel that heats twice as fast.",
    sizes: ['1"', '1 1/4"', '1 3/4"', '2 1/8"', '2 3/4"'],
    availableForSale: true,
  },
  {
    handle: "andis-recon-cordless-clipper-562257",
    title: "Andis Recon Cordless Clipper",
    vendor: "Andis",
    category: "tools",
    type: "Clipper",
    price: 289.99,
    image: cdn + "https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F1_35930abd-a4cf-4ae0-a17e-6997cea21d6f.jpg?v=1786900738",
    description:
      "Engineered for barbers who demand reliable cutting power and precision, cord-free.",
    availableForSale: true,
  },
  {
    handle: "andis-profoil-lithium-plus-shaver-17255",
    title: "Andis ProFoil Lithium Plus Shaver",
    vendor: "Andis",
    category: "barber",
    type: "Shaver",
    price: 64.99,
    image: cdn + "https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F17255-profoil-lithium-titanium-shaver-ts-2-straight-1-web_7a28aa8f-2c0c-4ab0-9572-c86894a320ca.png?v=1786900826",
    description:
      "Gold titanium foil heads for an exceptionally close, smooth shave.",
    availableForSale: true,
  },
  // Barber
  {
    handle: "immortal-hair-styling-gel-gold-edition-strong-hold-1-lb",
    title: "Immortal Styling Gel Gold Edition",
    vendor: "Inmortal NYC",
    category: "barber",
    type: "Styling gel",
    price: 9.99,
    image: cdn + "https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2F1_8566d830-db66-44de-baab-426ff4ebe05d.jpg?v=1786894175",
    description:
      "Barbershop-grade strong hold with a high-shine finish. Alcohol free.",
    sizes: ["1 lb"],
    availableForSale: true,
  },
  {
    handle: "immortal-exclusive-wax-guilty-strong-hold-hair-styling-3-4-oz",
    title: "Immortal Guilty Hair Wax",
    vendor: "Inmortal NYC",
    category: "barber",
    type: "Wax",
    price: 10.99,
    image: cdn + "https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0725_2F9317_2F8795_2Ffiles_2Fthe-guilty-man-classic-hair-wax_0b32db20-885c-43fd-896e-7dce975996e0.jpg?v=1786894306",
    description:
      "Extra-strong hold with a natural sheen that keeps hair lightweight all day.",
    sizes: ["3.4 oz"],
    availableForSale: true,
  },
  {
    handle: "clubman-reserve-whiskey-woods-talc-free-body-powder-9-oz",
    title: "Clubman Reserve Whiskey Woods Powder",
    vendor: "Clubman",
    category: "barber",
    type: "Powder",
    price: 8.99,
    image: cdn + "https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0601_2F5159_2F5121_2Ffiles_2Fcl_90782_whiskeywoodspowder_9oz_lr.jpg?v=1786895580",
    description:
      "A warm blend of tobacco leaf, bergamot, whiskey and woods in a talc-free powder.",
    sizes: ["9 oz"],
    availableForSale: true,
  },
  {
    handle: "immortal-nyc-reserve-colognes-01-eau-de-cologne-17-fl-oz",
    title: "Immortal NYC Reserve 01 Cologne",
    vendor: "Inmortal NYC",
    category: "barber",
    type: "Cologne",
    price: 10.99,
    image: cdn + "https_3A_2F_2Fcdn.shopify.com_2Fs_2Ffiles_2F1_2F0671_2F6345_2F5548_2Ffiles_2FWhatsApp_Image_2025-05-29_at_22.16.11.jpg?v=1786852147",
    description:
      "Floral jasmine over amber and cedarwood. A clear, sophisticated signature scent.",
    sizes: ["17 fl oz"],
    availableForSale: true,
  },
  // Nails
  {
    handle: "opi-gelcolor-stay-classic-base-coat-0-5-oz-gc001",
    title: "OPI GelColor Stay Classic Base Coat",
    vendor: "OPI",
    category: "nails",
    type: "Gel base",
    price: 17.99,
    image: cdn + "opi-gelcolor-stay-classic-base-coat-gc001.jpg?v=1788626651",
    description:
      "The original OPI gel base. Grips the natural nail for long-lasting GelColor wear and removes cleanly.",
    sizes: ["0.5 oz"],
    availableForSale: true,
  },
  {
    handle: "opi-gelcolor-stay-shiny-top-coat-0-5-oz-gc003",
    title: "OPI GelColor Stay Shiny Top Coat",
    vendor: "OPI",
    category: "nails",
    type: "Gel top",
    price: 17.99,
    image: cdn + "opi-gelcolor-stay-shiny-top-coat-gc003.jpg?v=1788626657",
    description:
      "Locks in GelColor with a high-gloss shine that resists dulling and chipping for weeks.",
    sizes: ["0.5 oz"],
    availableForSale: true,
  },
  {
    handle: "opi-powder-perfection-dip-powder-big-apple-red-1-5-oz-dpn25",
    title: "OPI Powder Perfection, Big Apple Red",
    vendor: "OPI",
    category: "nails",
    type: "Dip powder",
    price: 15.99,
    image: cdn + "OPI-Dipping-Powder-Perfection-Big-Apple-Red-1_5-oz-DPN25-Dipping-Powder-at-Beyond-Polish.jpg?v=1789175569",
    description:
      "OPI's signature true red in a rich creme finish, in a professional dip powder.",
    sizes: ["1.5 oz"],
    availableForSale: true,
    featured: true,
  },
  {
    handle: "opi-powder-perfection-dip-powder-samoan-sand-1-5-oz-dpp61a",
    title: "OPI Powder Perfection, Samoan Sand",
    vendor: "OPI",
    category: "nails",
    type: "Dip powder",
    price: 15.99,
    image: cdn + "OPI-Powder-Perfection-Samoan-Sand-1_5-oz-DPP61-Dipping-Powder-at-Beyond-Polish.jpg?v=1789176291",
    description:
      "OPI's best-selling sheer nude pink in a soft creme finish, in a professional dip powder.",
    sizes: ["1.5 oz"],
    availableForSale: true,
  },
];

export const categories: {
  slug: Category;
  name: string;
  tagline: string;
  image: string;
  count: number;
}[] = [
  {
    slug: "hair-care",
    name: "Hair care",
    tagline: "Shampoo, masks, serums and treatments",
    image: cdn + "genus-argan-hydrating-mask-for-dry-frizzy-hair.jpg?v=1787784810",
    count: 240,
  },
  {
    slug: "nails",
    name: "Nails",
    tagline: "OPI, DND and the full gel system",
    image: cdn + "OPI-Dipping-Powder-Perfection-Big-Apple-Red-1_5-oz-DPN25-Dipping-Powder-at-Beyond-Polish.jpg?v=1789175569",
    count: 316,
  },
  {
    slug: "barber",
    name: "Barber",
    tagline: "Gels, waxes, colognes and shave",
    image: "https://cdn.shopify.com/s/files/1/0752/7546/8972/collections/banner_barber.jpg?v=1787786808",
    count: 42,
  },
  {
    slug: "tools",
    name: "Tools",
    tagline: "Dryers, irons, brushes and clippers",
    image: "https://cdn.shopify.com/s/files/1/0752/7546/8972/collections/banner_tools.jpg?v=1787786809",
    count: 38,
  },
];

/** Brand logos from the Diamond Pro brands wall (Shopify shop_images). */
export const brandLogos: { name: string; logo: string; href: string }[] = [
  ["Nirvel", "logo-nirvel.png", "/collections/hair-care"],
  ["Inoar", "logo-inoar.png", "/collections/hair-care"],
  ["Genus", "logo-genus.png", "/collections/hair-care"],
  ["Olivia Garden", "logo-olivia-garden.png", "/collections/tools"],
  ["BaBylissPRO", "logo-babyliss-pro.png", "/collections/tools"],
  ["Andis", "logo-andis.jpg", "/collections/tools"],
  ["Wahl", "logo-wahl.png", "/collections/tools"],
  ["OPI", "logo-opi.jpg", "/collections/nails"],
  ["DND", "logo-dnd.jpg", "/collections/nails"],
  ["Kiara Sky", "logo-kiara-sky.png", "/collections/nails"],
  ["Rolda", "logo-rolda.png", "/collections/barber"],
  ["Immortal NYC", "logo-immortal-nyc.png", "/collections/barber"],
  ["Clubman", "logo-clubman.png", "/collections/barber"],
  ["L3VEL3", "logo-l3vel3.png", "/collections/barber"],
  ["Eco Style", "logo-eco-style.png", "/collections/barber"],
  ["Feather", "logo-feather.png", "/collections/barber"],
  ["Sodi Pro", "logo-sodi-pro.jpg", "/collections/hair-care"],
  ["BBCos Italy", "logo-bbcos.png", "/collections/hair-care"],
  ["AmPro", "logo-ampro.webp", "/collections/barber"],
  ["Clairol Professional", "logo-clairol.png", "/collections/hair-care"],
  ["Graham", "logo-graham.png", "/collections/barber"],
  ["Turbo Power", "logo-turbo-power.jpg", "/collections/tools"],
  ["iGel Beauty", "logo-igel.jpg", "/collections/nails"],
  ["PND", "logo-pnd.png", "/collections/nails"],
  ["Apollo Buffers", "logo-apollo.png", "/collections/nails"],
  ["New Adara", "logo-new-adara.jpg", "/collections/nails"],
  ["IBD", "logo-ibd.png", "/collections/nails"],
].map(([name, file, href]) => ({ name, logo: cdn + file, href }));

export const brands = brandLogos.map((b) => b.name);

/**
 * Hero slideshow, in the owner's order. A product slide plays its approved Higgsfield clip
 * (`video`, with `poster` as the still); an image slide is a plain photo with its own link.
 * `focus` is the CSS object-position used when the slide is cropped to the hero's shape
 * (600px tall on desktop, 420px on phones, full width); default is centre.
 */
export type HeroSlideData =
  | { handle: string; video: string; poster: string; focus?: string }
  | { image: string; alt: string; href: string; title: string; focus?: string };

export const heroSlides: HeroSlideData[] = [
  { handle: "genus-argan-moisturizing-serum-for-dry-and-frizzy-hair-100ml", video: "/videos/serum-still1-seedance.mp4", poster: "/stills/serum-still-1-pump.jpg" },
  { handle: "inoar-argan-oil-thermoliss-thermoactivated-defrizzer-240ml", video: "/videos/thermoliss-A1.mp4", poster: "/stills/thermoliss-poster.jpg" },
  { handle: "genus-intense-restoring-shampoo-for-frizzy-and-damaged-hair", video: "/videos/intense-A2.mp4", poster: "/stills/intense-poster.jpg" },
  { handle: "inoar-agua-milagrosa-vegan-hair-treatment-spray-6-7-fl-oz", video: "/videos/agua-A2.mp4", poster: "/stills/agua-poster.jpg" },
  { handle: "inoar-glycolic-force-leave-in-hair-treatment-200ml", video: "/videos/glycolic-A1.mp4", poster: "/stills/glycolic-poster.jpg" },
  { handle: "nirvel-professional-silver-shampoo-moisturizing-250ml-for-gray-hair", video: "/videos/silver-A2.mp4", poster: "/stills/silver-poster.jpg" },
  {
    // New Adara Nails campaign photo (the Gloss Society Kit's cover photo in Shopify; full-size original from newadaranails.com)
    // Full-resolution crop (3302×2300) of the 3302×5331 original, the band with her eye and the bottles
    image: "/images/new-adara-gloss-society-wide.jpg",
    alt: "A woman holding New Adara gel polish bottles in front of her face",
    href: "/collections/new-adara",
    title: "New Adara Nails",
    focus: "80% 25%",
  },
];

export const byHandle = (handle: string) => products.find((p) => p.handle === handle);
export const byCategory = (c: Category) => products.filter((p) => p.category === c);
export const featured = products.filter((p) => p.featured);
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
