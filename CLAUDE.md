# GlossBeau – project notes

Domain: glossbeau.com (bought at Namecheap, connect at the end)
Hosting: Netlify
Shopify store: [diamondprosalonsupply].myshopify.com
Products come from the Shopify Headless storefront via the Storefront API.
I will give you the access token when you ask. Keep it in a private .env file.

## Brand
- Hair-care focused store, open to the general public, nail, barber, and tools like hair blowers and flat irons included  
- Only use real product photos from Shopify, no stock product images

## Design
Use the style guide in DESIGN.md (colors, fonts, sizes, spacing) for the whole site. Use resources inside the DESIGN.md to built. 
The font "BwGradual" is a paid font. Use a free, similar-looking Google Font instead.

## How to work with me
I'm not very technical. Explain each step in plain language and tell me before running anything.


## Where things stand (updated 2026-10-04)
- Site: Next.js 16 in this folder. Run `npm run dev` and open http://localhost:3000. `npm run build` passes.
- Homepage below the brands grid is a copy of peakdesign.com's layout (measured at 1440/390px, numbers in
  each component's comment): Peak-style header (40px strip + 80px nav, rotating search placeholder),
  Best sellers tabs + carousel, Explore 3×3 tiles, What's new dark panel, company tiles + featured split,
  pro-pricing panel, Peak-style footer. Serif headings = Fraunces, mono variant line = Geist Mono.
- Policies: `content/policies.md` (GlossBeau's own text, never the Shopify store policies) → /policies/shipping,
  /refunds, /privacy, /terms via `src/lib/policies.ts` (split on "## " headings, e-mails become mailto links).
  Company name, support e-mail and address live ONLY in `src/config/site.ts` (used by policies, header Support
  link, footer). No phone number anywhere, no social icons. `scripts/check-placeholders.mjs` runs before every
  build: warns locally, fails a Netlify production build if any [BRACKET] placeholder is left.
- Logo: ONE component `src/components/site/Logo.tsx` (header, footer, under the hero). Swap the real logo there.
- Catalog: LIVE from the Shopify Storefront API only (`src/lib/shopify.ts`); there is no sample catalog. Needs
  `.env.local` with SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN (see `.env.example`). Without it (or on
  any Shopify error) pages show the `CatalogError` message, never products. `src/data/home.ts` is config only
  (tabs, 11 featured brands with exact Shopify vendor names, explore collections, hair-care hub list, What's new).
- Routes: `/collections/[handle]` = exactly one Shopify collection; `/brands` = every vendor A–Z with counts;
  `/brands/[slug]` = products whose vendor matches (vendor:'…' query, slug from `brandSlug()`); `/hair-care` = hub
  of the hair collections because Shopify has no single hair-care collection; `/products/[handle]` = live photos,
  options, variants (cart not wired yet). "Show more" paginates with Shopify cursors (?after=).
- Product photos: cards show Shopify photos in a grey 4:5 box, 80% fill, multiply blend. `npm run images` can
  pre-trim white borders into `public/products/` + `src/data/trimmed.json` for any URL listed in home.ts (none now).
- Scroll effects copied from newadaranails.com (Wix float/slide/grow/fade): `src/components/motion/Reveal.tsx`.
- Review screenshots: `design-system/review/` (Peak vs GlossBeau compares; `2026-10-04-hero/` = every hero slide
  at 1440 and 390 plus full pages). Shoot again with `tools/glossbeau-hero-shots.js <outDir>` (dev server running).
- Playwright MCP cannot launch Chrome here; use `playwright-core` + the headless shell via Node instead
  (scratch scripts `shots.js` / `section-shot.js`, see C:\Users\beaut\.claude\projects\C--shopify-dev\tools).
- Look: Shop-style layout (28px soft cards, pills, Inter) on linen #f6f1eb, walnut #403a34 text, one accent
  Apricot clay #d4784e. Tokens in `src/app/globals.css`; the live design system is
  https://claude.ai/artifact/FmpZLez9iDpkmvWzpPKGxT and its source files are in `design-system/project/`.
- Hero: square-edged, edge to edge, 600px tall on desktop (max 70% of the screen height) and 420px on phones.
  7 slides in `src/data/catalog.ts` `heroSlides`: 6 product clips (1112×834 approved Higgsfield takes in
  `public/videos/`, 1600×1200 posters in `public/stills/`) + the New Adara campaign portrait
  (`public/images/new-adara-gloss-society-wide.jpg`, a 3302×2300 full-resolution crop of the 3302×5331 original;
  its hands are soft in the photo itself). On desktop the 4:3 clips show whole with a blurred copy of the still
  filling the sides, so no bottle is cut. Arrows only: no dots, no link button, no scale/zoom on the slides.
- Site photos saved locally in `public/images/`: BaBylissPRO tools (Diamond Pro hero-14, cropped to the tools), Gloss Society Kit
  contents (What's new feature, pinned in `src/data/home.ts`, not replaced by live data).
  Recipe and viscosity notes: DESIGN.md "Cinematic scenes"; reusable skill `/cinematic-scene`.
- Brand grid under the hero copies the Diamond Pro brands wall; logos come from Shopify shop_images.
- Screenshot helper: `C:\Users\beaut\.claude\projects\C--shopify-dev\tools\glossbeau-shots.js` (env ROUTE, MOTION).
- Next, in the owner's order: owner reviews the hero → logo (wordmark + small mark; Higgsfield allowed;
  colour decided after seeing the owner's resources) → Storefront token → Netlify + glossbeau.com (Namecheap).
- Impeccable skill could not be installed by Claude (blocked); owner installs it from github.com/pbakaus/impeccable.
