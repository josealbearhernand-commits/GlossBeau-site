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
- Look: Shop-style layout (28px soft cards, pills, Inter) on linen #f6f1eb, walnut #403a34 text, one accent
  Apricot clay #d4784e. Tokens in `src/app/globals.css`; the live design system is
  https://claude.ai/artifact/FmpZLez9iDpkmvWzpPKGxT and its source files are in `design-system/project/`.
- Hero: slideshow of 6 products (owner's order) in `src/data/catalog.ts` `heroSlides`; each plays an approved
  Higgsfield clip from `public/videos/` with a poster from `public/stills/`. Unused takes in `media-archive/`.
  Recipe and viscosity notes: DESIGN.md "Cinematic scenes"; reusable skill `/cinematic-scene`.
- Brand grid under the hero copies the Diamond Pro brands wall; logos come from Shopify shop_images.
- Preview data: `src/data/catalog.ts` (real products). Live data: `src/lib/shopify.ts` once
  `SHOPIFY_STOREFRONT_TOKEN` is in `.env.local` (see `.env.example`).
- Screenshot helper: `C:\Users\beaut\.claude\projects\C--shopify-dev\tools\glossbeau-shots.js` (env ROUTE, MOTION).
- Next, in the owner's order: owner reviews the hero → logo (wordmark + small mark; Higgsfield allowed;
  colour decided after seeing the owner's resources) → Storefront token → Netlify + glossbeau.com (Namecheap).
- Impeccable skill could not be installed by Claude (blocked); owner installs it from github.com/pbakaus/impeccable.
