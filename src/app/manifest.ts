import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GlossBeau",
    short_name: "GlossBeau",
    description:
      "Salon-grade hair care, nails, barber and styling tools, for everyone. Curated professional brands with real results.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2ebd0",
    theme_color: "#2a2521",
    icons: [
      { src: "/brand/glossbeau-icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/glossbeau-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
