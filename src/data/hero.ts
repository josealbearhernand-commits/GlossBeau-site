/**
 * Hero slideshow, in the owner's order. A product slide plays its approved Higgsfield clip
 * (`video`, with `poster` as the still); an image slide is a plain photo with its own link.
 * `focus` is the CSS object-position used when the slide is cropped to the hero's shape
 * (600px tall on desktop, 420px on phones, full width); default is centre.
 */
export type HeroSlideData =
  | { handle: string; title: string; video: string; poster: string; focus?: string }
  | { image: string; alt: string; href: string; title: string; focus?: string };

export const heroSlides: HeroSlideData[] = [
  { handle: "genus-argan-moisturizing-serum-for-dry-and-frizzy-hair-100ml", title: "Genus Argan Moisturizing Serum", video: "/videos/serum-still1-seedance.mp4", poster: "/stills/serum-still-1-pump.jpg" },
  { handle: "inoar-argan-oil-thermoliss-thermoactivated-defrizzer-240ml", title: "Inoar Argan Oil Thermoliss", video: "/videos/thermoliss-A1.mp4", poster: "/stills/thermoliss-poster.jpg" },
  { handle: "genus-intense-restoring-shampoo-for-frizzy-and-damaged-hair", title: "Genus Intense Restoring Shampoo", video: "/videos/intense-A2.mp4", poster: "/stills/intense-poster.jpg" },
  { handle: "inoar-agua-milagrosa-vegan-hair-treatment-spray-6-7-fl-oz", title: "Inoar Agua Milagrosa", video: "/videos/agua-A2.mp4", poster: "/stills/agua-poster.jpg" },
  { handle: "inoar-glycolic-force-leave-in-hair-treatment-200ml", title: "Inoar Glycolic Force Leave-in", video: "/videos/glycolic-A1.mp4", poster: "/stills/glycolic-poster.jpg" },
  { handle: "nirvel-professional-silver-shampoo-moisturizing-250ml-for-gray-hair", title: "Nirvel Silver Shampoo", video: "/videos/silver-A2.mp4", poster: "/stills/silver-poster.jpg" },
  {
    // Full-resolution crop (3302×2300) of the 3302×5331 original, the band with her eye and the bottles
    image: "/images/new-adara-gloss-society-wide.jpg",
    alt: "A woman holding New Adara gel polish bottles in front of her face",
    href: "/brands/new-adara",
    title: "New Adara Nails",
    focus: "80% 25%",
  },
];
