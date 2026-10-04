# Site content

- `policies.md` — GlossBeau's own policy text (NOT the Shopify store policies). One file with four
  top-level `# ` headings: Shipping Policy, Return & Refund Policy, Privacy Policy, Terms of Service.
  Rendered at /policies/shipping, /policies/refunds, /policies/privacy, /policies/terms by
  `src/lib/policies.ts`. Placeholders `[LEGAL BUSINESS NAME]`, `[SUPPORT EMAIL]`, `[PHONE]` are filled
  from `src/config/site.ts`.
