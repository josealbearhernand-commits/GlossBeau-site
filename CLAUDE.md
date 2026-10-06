# GlossBeau – project notes

Domain: glossbeau.com (Namecheap DNS: A @ 75.2.60.5, CNAME www glossbeau.netlify.app; mail records untouched)
Hosting: Netlify, LIVE since 2026-10-04 at https://glossbeau.com (project "glossbeau", team GlossBeau, site id 3d661db8-9c7f-4143-8720-85ccbdf7f024)
Shopify store: [diamondprosalonsupply].myshopify.com
Products come from the Shopify Headless storefront via the Storefront API.
I will give you the access token when you ask. Keep it in a private .env file.

## Brand
- Hair-care focused store, open to the general public, nail, barber, and tools like hair blowers and flat irons included  
- Only use real product photos from Shopify, no stock product images

## Design
Use the style guide in DESIGN.md (colors, fonts, sizes, spacing) for the whole site. Use resources inside the DESIGN.md to built. 
The font "BwGradual" is a paid font. Use a free, similar-looking Google Font instead.
- Product cards side by side (any grid, row or carousel, on any page, now and in every future design) must all be
  the SAME HEIGHT and line up at top AND bottom: the card fills its cell (`h-full` on the card and on any wrapper such
  as `<Reveal className="h-full">`), the text area is `flex-1`, the name always reserves 2 lines (`line-clamp-2` +
  min-height), the vendor is one line (`truncate`), so prices sit on one line across the row. Reuse ProductCard /
  ProductTile instead of building a new card. See DESIGN.md "Product cards side by side".

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
- Logo: ONE component `src/components/site/Logo.tsx` renders the real wordmark from `public/brand/` (dark SVG on light areas, cream SVG in the dark header); icons in `src/app/icon.png`, `apple-icon.png`, `manifest.ts`; OG image `public/brand/og-image.png`. Header is dark brown with a peach strip (tokens `--header-*`, `--announce-*` in globals.css).
- Catalog: LIVE from the Shopify Storefront API only (`src/lib/shopify.ts`); there is no sample catalog. Needs
  `.env.local` with SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN (see `.env.example`). Without it (or on
  any Shopify error) pages show the `CatalogError` message, never products. `src/data/home.ts` is config only
  (tabs, 11 featured brands with exact Shopify vendor names, explore collections, hair-care hub list, What's new).
- Routes: `/collections/[handle]` = exactly one Shopify collection; `/brands` = every vendor A–Z with counts;
  `/brands/[slug]` = products whose vendor matches (vendor:'…' query, slug from `brandSlug()`); `/hair-care` = hub
  of the hair collections because Shopify has no single hair-care collection; `/products/[handle]` = live photos,
  options, variants, Add to cart. "Show more" paginates with Shopify cursors (?after=).
- Product photos: ONE component `src/components/product/ProductImage.tsx` draws every card's photo (homepage carousel,
  collections, brands, search, related): grey 4:5 box, photo centred in the inner 80%, multiply blend, never shown above 2×
  its own pixels. `scripts/trim-images.mjs` (prebuild, `npm run images`) trims EVERY product's featured photo from the
  Storefront API into `public/products/*.webp` (cap 800px) + `src/data/trimmed.json`; `resolvePhoto()` in shopify.ts picks
  the trimmed copy or the CDN URL at width=800. Cached by URL: a build only processes new photos (679 cached 2026-10-04).
- Cart: Storefront Cart API (`src/lib/cart.ts`, server actions in `src/app/actions/cart.ts`, cookie `gb_cart` 30 days,
  attribute source=glossbeau). `CartProvider` + `CartDrawer` in the layout; "Add to cart" in ProductForm; Checkout = cart.checkoutUrl
  on Shopify Checkout (partner store Diamond Pro Salon Supply, named ONLY in the drawer note). Free shipping threshold is one
  setting: `site.freeShippingThreshold` (90) → announcement bar, cart line, product page; policies text says $90 / $8 / $15.
- Cache: every Storefront fetch is tagged "shopify"; `POST /api/revalidate` (secret REVALIDATE_SECRET in production, none in
  dev) drops it all. Run `curl -X POST http://localhost:3000/api/revalidate` after changing products or collections.
- Jev (TypeSafe) helper for build scripts: `scripts/jev.mjs` (server-side only). Needs TYPESAFE_API_KEY in .env.local;
  not set as of 2026-10-04, so the image audit used Claude's own vision and no Jev calls.
- Image audit 2026-10-04: `design-system/review/image-replacements.csv` (OPI watermarks from other stores, small main
  images, faded mains) and before/after card screenshots in `design-system/review/2026-10-04-cards/`.
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
  filling the sides, so no bottle is cut. Since 2026-10-05 the New Adara photo does the same on desktop
  (it was magnified ~1.7× by cover), media edges are feathered into the blur (`.hero-media-soft`, `--ar` per slide), and
  the bottom fade (`.hero-fade`, 64/96px) is eased so photos stay crisp. Arrows only: no dots, no link button, no scale/zoom on the slides.
- Site photos saved locally in `public/images/`: BaBylissPRO tools (Diamond Pro hero-14, cropped to the tools), Gloss Society Kit
  contents (What's new feature, pinned in `src/data/home.ts`, not replaced by live data).
  Recipe and viscosity notes: DESIGN.md "Cinematic scenes"; reusable skill `/cinematic-scene`.
- Brand grid under the hero copies the Diamond Pro brands wall; logos come from Shopify shop_images.
- Screenshot helper: `C:\Users\beaut\.claude\projects\C--shopify-dev\tools\glossbeau-shots.js` (env ROUTE, MOTION).
- Deploy: Netlify builds from GitHub main (webhook + deploy key, Next.js runtime plugin, publish .next). Env vars live in
  Netlify (SHOPIFY_*, REVALIDATE_SECRET). Netlify's free plan only auto-builds commits authored by the Netlify account
  email (diamondprosalon@gmail.com); commits from josealbearhernand@gmail.com are "unrecognized contributor" and need
  `netlify api createSiteBuild --data '{"site_id":"3d661db8-9c7f-4143-8720-85ccbdf7f024"}'` or a local
  `git config user.email diamondprosalon@gmail.com`. The repo is public. Site visibility was set to Public in the Netlify UI.
  Local `netlify deploy --build` fails on Windows (plugin static publish); always build on Netlify.
- Contact (2026-10-05): `/contact` posts to `/__forms.html` (Netlify Forms needs the static copy in `public/__forms.html`,
  same field names). Form detection was turned ON for the site via API (processing_settings.ignore_html_forms=false);
  an email notification hook sends each message to service@glossbeau.com; field `email` = Reply-To. Headless-browser
  test posts get a 200 but are silently dropped as bots; test from a real browser.
- Newsletter: `/api/newsletter` + `src/lib/shopify-admin.ts` (Dev Dashboard app, client credentials, write/read_customers,
  tag glossbeau-newsletter). Needs SHOPIFY_ADMIN_CLIENT_ID / SHOPIFY_ADMIN_CLIENT_SECRET locally and in Netlify; the
  footer box switches to it with `kind="newsletter"` on its EmailForm (still mailto until the keys are tested).
- Impeccable skill installed 2026-10-04 into `.claude/skills/impeccable` (project scope, `npx impeccable install`); run `/impeccable <command>`.
  Audit 2026-10-04: 11/20 → 16/20 after adapt/harden/clarify/typeset/optimize/animate/polish (reports in
  `design-system/review/`). `/search?q=` is a real route; products without a photo show the NoPhoto frame; `--hairline` token for 3:1 lines.
