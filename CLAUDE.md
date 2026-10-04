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
- Logo: ONE component `src/components/site/Logo.tsx` (header, footer, under the hero). Swap the real logo there.
- Homepage data: `src/data/home.ts` snapshot (vendors, 11 featured brands, best sellers per tab, 9 explore
  collections). `src/lib/shopify.ts` `getHomeData()` switches to live Storefront data once the token exists.
  "More brands (X)" is computed from the Shopify vendor list, never typed by hand.
- Product photos: `npm run images` (also runs before build) trims white borders with sharp into
  `public/products/` + `src/data/trimmed.json`; cards show them in a grey 4:5 box, 80% fill, multiply blend.
- Scroll effects copied from newadaranails.com (Wix float/slide/grow/fade): `src/components/motion/Reveal.tsx`.
- Review screenshots: `design-system/review/` (Peak vs GlossBeau compares; `2026-10-04-hero/` = every hero slide
  at 1440 and 390 plus full pages). Shoot again with `tools/glossbeau-hero-shots.js <outDir>` (dev server running).
- Playwright MCP cannot launch Chrome here; use `playwright-core` + the headless shell via Node instead
  (scratch scripts `shots.js` / `section-shot.js`, see C:\Users\beaut\.claude\projects\C--shopify-dev\tools).
- Look: Shop-style layout (28px soft cards, pills, Inter) on linen #f6f1eb, walnut #403a34 text, one accent
  Apricot clay #d4784e. Tokens in `src/app/globals.css`; the live design system is
  https://claude.ai/artifact/FmpZLez9iDpkmvWzpPKGxT and its source files are in `design-system/project/`.
- Hero: square-edged, edge to edge, sized like peakdesign.com's hero (1440×727 desktop, 390×397 phone; Peak's
  phone hero is that photo + a 360px text panel). 7 slides in `src/data/catalog.ts` `heroSlides`: 6 product clips
  (approved Higgsfield takes in `public/videos/`, posters in `public/stills/`) + the New Adara campaign portrait
  (`public/images/new-adara-gloss-society.jpg`). On desktop the 4:3 clips show whole with a blurred copy of the
  still filling the sides, so no bottle is cut. Arrows only, no dots. Unused takes in `media-archive/`.
- Site photos saved locally in `public/images/`: BaBylissPRO tools (Diamond Pro hero-14), Gloss Society Kit
  contents (What's new feature, pinned in `src/data/home.ts`, not replaced by live data).
  Recipe and viscosity notes: DESIGN.md "Cinematic scenes"; reusable skill `/cinematic-scene`.
- Brand grid under the hero copies the Diamond Pro brands wall; logos come from Shopify shop_images.
- Preview data: `src/data/catalog.ts` (real products). Live data: `src/lib/shopify.ts` once
  `SHOPIFY_STOREFRONT_TOKEN` is in `.env.local` (see `.env.example`).
- Screenshot helper: `C:\Users\beaut\.claude\projects\C--shopify-dev\tools\glossbeau-shots.js` (env ROUTE, MOTION).
- Next, in the owner's order: owner reviews the hero → logo (wordmark + small mark; Higgsfield allowed;
  colour decided after seeing the owner's resources) → Storefront token → Netlify + glossbeau.com (Namecheap).
- Impeccable skill could not be installed by Claude (blocked); owner installs it from github.com/pbakaus/impeccable.
