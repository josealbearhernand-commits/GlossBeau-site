/**
 * Site-wide settings, changed in one place. The policy pages (content/policies.md) replace their
 * [BRACKET] placeholders with these values, and the footer and contact lines read them too. Any value
 * still in [BRACKETS] makes `npm run build` warn and fails a Netlify production build
 * (scripts/check-placeholders.mjs), so the live site never shows a placeholder.
 * There is deliberately no phone number: GlossBeau does not publish one.
 */
export const site = {
  /** Legal seller of record, shown on policy pages. */
  legalName: "Beauty Innovation LLC",
  supportEmail: "service@glossbeau.com",
  /** Postal address shown in the policy contact blocks. */
  address: "3901 Williams Blvd, Suite 22, Kenner, LA 70065, United States",
  /** Public brand name, never a placeholder. */
  brand: "GlossBeau",
  domain: "glossbeau.com",
  /** Free US standard shipping from this order subtotal (USD). The announcement bar, cart and product pages read it. */
  freeShippingThreshold: 90,
};

/** Placeholder token → settings value, used when rendering content/policies.md. */
export const placeholders: Record<string, string> = {
  "[LEGAL BUSINESS NAME]": site.legalName,
  "[SUPPORT EMAIL]": site.supportEmail,
  "[BUSINESS ADDRESS]": site.address,
};

export const unfilledPlaceholders = () =>
  Object.entries(site)
    .filter(([, v]) => typeof v === "string" && /\[[A-Z][A-Z ]+\]/.test(v))
    .map(([k]) => k);
