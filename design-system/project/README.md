GlossBeau is a hair-care store open to everyone, with nails, barber and styling tools alongside, selling the Diamond Pro Salon Supply catalog. The site borrows the Shop app's discovery layout, soft white cards floating on a quiet canvas, and sets it on GlossBeau's own warm palette: linen ground, walnut text, and one apricot-clay accent. Real product photography and the cinematic hero clips supply all other colour.

## Content fundamentals

- Write plainly and warmly, like a good stylist talking to a client. The shopper is "you"; the store is "we".
- Sentence case everywhere, including buttons and nav ("Shop tools", "Hair care"). The only uppercase is the `micro` vendor label on cards.
- Name products exactly as Shopify titles them, size included. Never rename them on the storefront.
- Say what a product does in concrete terms. No hype, no emoji, no exclamation marks.
- Buttons state the action: "Shop tools", "Add to cart", "More brands (15)". Confirmations repeat it: "Added to cart".

## Color

- `canvas` is the page ground everywhere. `surface` is for cards, inputs and the header, never for page sections.
- Text is `ink` (walnut). Secondary text, captions and vendor names are `muted`. Never pure black on the page; `ink-deep` is reserved for the footer and announcement grounds and for text on the accent.
- `accent` (Apricot clay) is the single saturated colour: primary buttons, the round submit, the active slide dot, the wordmark dot, the Sale badge and the brands-wall hover glow. Hover goes to `accent-deep`. Text on it is `on-accent` (dark), never white.
- No second hue. Category chips may carry a small coloured dot in the category's own colour; nothing else in the UI is coloured.
- No gradients and no coloured section backgrounds. The dark Tools tile and the footer use `ink-deep` with `on-dark` text; lifestyle photos take the flat `photo-shade`.

## Typography

- One family, Inter, standing in for GT Standard. Weights 400, 500 and 600 only; never 700.
- Hierarchy comes from size and tight negative tracking, not from bold. Display sizes tighten to -0.06em, body sits at -0.031em, micro labels relax.
- Section headers are `heading-sm` (20px semibold) with a right chevron when they link somewhere.
- Nothing below 14px for running text; `caption` for metadata; `micro` only for the vendor name and rating on a card.

## Spacing and layout

- `page-max` container with the responsive gutter (16 / 24 / 40px). The hero stage is a single 1120px card.
- Card grids: 2 columns on phones, 4 on desktop, `space-12` / `space-16` gaps. Brands wall: 2 / 4 / 6 columns.
- `space-64` between homepage sections; the Spotlight and editorial bands get `space-80`.
- Everything is centered or left-aligned inside cards; the page never puts text on a coloured block.

## Shape, borders and depth

- Cards and tiles use `radius-card` (28px); the photo inside sits 8px in at `radius-image` (20px), so every product has a thin white frame.
- Every inline control is a pill: buttons, chips, the search bar, dots, badges.
- Depth is the dual soft shadow (`shadow-card`), never a border. Hover lifts to `shadow-lg`. Only chips, badges and secondary buttons carry a hairline (`faint`) plus `shadow-sm`.
- The accent submit and primary button carry `shadow-accent`, a tinted glow.

## Imagery and motion

- Product photos come only from the Shopify catalog, shown `object-fit: contain` with breathing room on `surface`; never cropped, never stock.
- Hero slides are cinematic clips made with the `/cinematic-scene` method: a FLUX still of the real product (linen background, the liquid at its true viscosity), approved, then animated with Seedance. One clip per product, posters from the stills.
- Motion is GSAP: slides glide 1.6 s power2.inOut; section content reveals on scroll; pill buttons lean toward the pointer. Everything respects reduced motion.

## Iconography

- Phosphor Light from Iconify (`ph:*-light`), 1.5px monoline, inheriting `ink`. Search, bag, user, menu, close, arrows, caret, heart, star, plus, minus, truck, shield-check, leaf, sparkle.
- No emoji, no filled icons.

## Logo

Not designed yet. The wordmark is "glossbeau" in Inter 600, tracking -0.055em, with an `accent` dot after it (`Wordmark` component). Replace with the SVG logo once it exists.
