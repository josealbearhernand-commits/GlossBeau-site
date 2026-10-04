# GlossBeau · Impeccable audit (2026-10-04)

> Re-run after the fixes: see `2026-10-04-impeccable-audit-after-fixes.md` (score 11 → 16 / 20).

Technical quality audit run with `/impeccable audit` (impeccable 4.5.0, engine 0.1.11) on the dev server at
http://localhost:3000 with the live Shopify catalog. Checked: homepage, /collections/nails, /brands,
/hair-care, /policies/shipping and the product page for Kiara Sky Gel Pro (12 photos). Viewports: 1280 and
1024 (desktop pane), 375/390 (pane mobile emulation and Playwright headless shell, touch emulated).
Evidence: pane screenshots, DOM measurements, console, network log, the bundled detector (source scan +
live URL scans at 1280×800 and 390×844), and WCAG contrast maths on the tokens.

This is a code-level audit. Nothing was fixed; each finding names the command that should fix it.

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2 / 4 | Hero auto-plays and auto-advances with no pause control; homepage has no h1 |
| 2 | Performance | 3 / 4 | Hidden 7th hero slide is `priority`-preloaded; unused SplitText plugin shipped |
| 3 | Responsive design | 1 / 4 | Product page lays out 872px wide on a 390px phone when a product has many photos |
| 4 | Theming | 3 / 4 | Three hard-coded hex backgrounds and a hard-coded white label outside the token set |
| 5 | Implementation integrity | 2 / 4 | "Placeholder copy." is live; forms, cart and search confirm actions that never happen |
| **Total** | | **11 / 20** | **Acceptable (significant work needed)** |

Rating bands: 18–20 Excellent · 14–17 Good · 10–13 Acceptable · 6–9 Poor · 0–5 Critical.

## Implementation integrity verdict: PASS, with reservations

The implementation expresses one coherent, product-specific system: a single token sheet in
`src/app/globals.css` (linen / walnut / apricot clay) mirrored into the Tailwind theme, Peak Design's measured
layout grammar for the sections, the Shop-style elevated product card, one icon set (Phosphor Light), real
Shopify photography everywhere, and honest error states (`CatalogError`) instead of sample data. Nothing is
interchangeable with a generic template.

What drags the score to 2: the Featured panel ships the literal words "Placeholder copy." and the build gate
only catches `[BRACKET]` placeholders; two e-mail forms, add-to-cart and site search all show success states
that are not backed by anything; six navigation links go to `#`; and the "Contact" company tile is a product
photo standing in for a page that does not exist.

Detector results (deterministic, verified in context):
- `side-tab` on `.policy blockquote` (globals.css:261): a 3px accent border-left. Genuine match, low impact
  (only shows if a policy ever uses a quote). Verified, P3.
- 18 × `image-hover-transform` advisories on the live homepage (brand tiles, product tiles and cards, explore
  tiles all scale 1.04–1.05 on hover). Verified. These are deliberate copies of the Peak Design and Shop
  references in DESIGN.md, so they are recorded here as an accepted pattern, not a defect. Advisory only.

## Executive summary

- Audit Health Score: **11 / 20** (Acceptable)
- Issues: **1 × P0 · 7 × P1 · 11 × P2 · 4 × P3** (23 total)
- Top issues:
  1. **P0** Product pages with many photos render at 872px on a phone: the whole page zooms out and the gallery
     runs off the right edge (seen in two engines).
  2. **P1** A product with no Shopify photo renders `<Image src="">`: broken image, React errors, failed preload.
  3. **P1** The footer newsletter input collapses to 22px tall on phones; its text is clipped.
  4. **P1** The hero auto-plays video and auto-advances with no pause/stop control (WCAG 2.2.2).
  5. **P1** The homepage has no `<h1>`, "Placeholder copy." is live, and forms/cart/search fake success.
- Next steps, in order: `/impeccable adapt` → `/impeccable harden` → `/impeccable clarify` →
  `/impeccable typeset` → `/impeccable optimize` → `/impeccable animate` → `/impeccable polish`.

## Detailed findings

### P0 · Blocking

**[P0] Product page breaks out of the phone viewport when a product has many photos**
- Location: `src/components/product/ProductGallery.tsx:24-44`, `src/app/products/[handle]/page.tsx:49`
- Category: Responsive
- Evidence: Kiara Sky Gel Pro (12 photos) measured at a 390×844 touch viewport: `innerWidth 872`,
  `document.scrollWidth 872`, gallery card `856×856`, right edge at 872. 12 thumbnails × 64px + 11 × 8px gaps
  = 856px, exactly the card width. Reproduced in the pane's mobile emulation and in Playwright's headless shell
  with `isMobile` + touch. Screenshot: `design-system/review/2026-10-04-audit-phone-product.png`.
- Why: the two-column grid has no mobile column definition, so the implicit `auto` track sizes to the gallery
  column's max-content width, and the thumbnail strip (`overflow-x-auto` with `shrink-0` items) reports its
  full content width. Nothing says `min-width: 0`.
- Impact: every product with roughly 7+ photos (shade ranges, kits) is unusable on phones: text is tiny,
  the add-to-cart button is off-screen, the page pans sideways.
- Standard: WCAG 1.4.10 Reflow.
- Recommendation: `grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.1fr_1fr]` on the wrapper, `min-w-0` on both
  gallery columns, `w-full min-w-0` on the thumbnail `<ul>`. Re-measure at 390 with a 12-photo product.
- Suggested command: `/impeccable adapt`

### P1 · Major

**[P1] Products without a photo render an empty `src`**
- Location: `src/lib/shopify.ts:132` (`image: p.featuredImage?.url ?? ""`), consumed by `ProductCard.tsx:17`,
  `ProductTile.tsx:32`, `ProductGallery.tsx:13`
- Category: Implementation integrity / Performance
- Evidence: /collections/nails shows "PND Gel Base Coat 0.5 oz" as a broken-image icon; console: `Image is
  missing required "src" property`, `An empty string was passed to the src attribute`, two failed
  `ReactDOM.preload()` calls.
- Impact: a visibly broken card in the grid, and an empty-string `src` makes some browsers re-request the
  page itself. Any product the owner adds without media will do this.
- Recommendation: keep `image` optional, and render a branded empty frame (grey box with the logo mark) when
  it is missing. Never pass `""` to `next/image`.
- Suggested command: `/impeccable harden`

**[P1] Footer newsletter input collapses to 22px on phones**
- Location: `src/components/site/Footer.tsx:67-73`, `src/components/site/EmailForm.tsx:37`
- Category: Responsive
- Evidence: at 390px the input measures `350×22` (computed height 22px, `h-10` ignored); the "Your email"
  placeholder is clipped at the top. Screenshot: `design-system/review/2026-10-04-audit-phone-footer-form.png`. The pro-panel form has
  the same `flex-col` + `flex-1` combination and only survives because `py-4` pads it to 54px.
- Why: `flex-1` sets `flex-basis: 0%`; inside a column flex container with no height, the basis resolves
  to content height and overrides the explicit `h-10`.
- Impact: a 22px tap target that looks broken; WCAG 2.5.8 target size fails.
- Recommendation: `w-full sm:flex-1` (or `flex-none sm:flex-1`) on the input, and the same on the pro form.
- Suggested command: `/impeccable adapt`

**[P1] Hero slideshow cannot be paused by keyboard or touch**
- Location: `src/components/home/Hero.tsx:69-98, 111-117`
- Category: Accessibility
- Evidence: video slides auto-play and advance on `ended`; photo slides advance after 5s. The only pause is
  `onPointerEnter`, which never fires on a touch screen and is unreachable from the keyboard.
- Impact: moving content longer than 5 seconds with no way to stop it.
- Standard: WCAG 2.2.2 Pause, Stop, Hide (Level A).
- Recommendation: add a visible pause/play button beside the arrows (48px circle, same style), pause on
  focus-within, and honour it in both timers.
- Suggested command: `/impeccable harden`

**[P1] Homepage has no `<h1>`**
- Location: `src/components/home/Hero.tsx:175-177` (the big wordmark is a `<span>`), `src/app/page.tsx`
- Category: Accessibility
- Evidence: `document.querySelectorAll('h1').length === 0` on `/`; the outline starts at "H2: The brands we
  carry". Every other route has a proper h1.
- Impact: screen-reader users land on a page with no title; search engines get no page heading.
- Standard: WCAG 1.3.1, 2.4.6.
- Recommendation: make the wordmark under the hero the h1 (visually unchanged), or add a visually hidden h1
  "GlossBeau: salon-grade hair care, nails, barber and tools".
- Suggested command: `/impeccable typeset`

**[P1] "Placeholder copy." ships in the Featured panel**
- Location: `src/components/home/Company.tsx:53`
- Category: Implementation integrity
- Evidence: the paragraph under "The brands behind every great chair." begins with the words "Placeholder
  copy." `scripts/check-placeholders.mjs` only matches `[UPPERCASE BRACKETS]`, so the build gate lets it through.
- Impact: visible on the live homepage; reads as an unfinished site.
- Recommendation: write the paragraph (three brands, who they are for, why the prices match salon pricing)
  and extend the placeholder check to `Placeholder copy` / `lorem`.
- Suggested command: `/impeccable clarify`

**[P1] Forms, cart and search confirm actions that never happen**
- Location: `src/components/site/EmailForm.tsx:24-32` ("Thanks, you're on the list." with no request),
  `src/components/product/ProductForm.tsx:44-48, 102` ("Added to cart" with no cart),
  `src/components/site/Header.tsx:62-68` (search submits to nothing; `/search` does not exist)
- Category: Implementation integrity
- Impact: a shopper who signs up, applies for pro pricing, adds to cart or searches gets a success message or
  silence, and nothing is recorded. This is the one category of defect that costs orders directly.
- Recommendation: until Klaviyo / Storefront cart / search are wired, either hide the controls or make them
  honest: "Cart coming soon" disabled state, newsletter → `mailto:` with a subject, search button that opens
  the collections list. Then wire the real thing.
- Suggested command: `/impeccable harden`

**[P1] Six navigation links go nowhere**
- Location: `Header.tsx:156` (Account), `Header.tsx:183` (mobile "Support" → `#`, desktop → mailto),
  `Footer.tsx:12, 15, 20` (Track an order, FAQ, Our story), `Company.tsx:8, 12` (Our story, Contact tiles)
- Category: Implementation integrity
- Evidence: `a[href="#"]` count on `/` = 6.
- Impact: dead ends in the header, footer and a full-width tile.
- Recommendation: point Contact at `mailto:` (site.ts), Track an order at the Shopify order status page,
  remove or write Our story / FAQ, hide Account until customer accounts exist.
- Suggested command: `/impeccable harden`

### P2 · Minor

**[P2] Header is cramped between 1024px and about 1180px**
- Location: `src/components/site/Header.tsx:137-150`
- Evidence: at 1024px "Hair care" wraps onto two lines (63px wide, 79px tall) and the search field shrinks to
  109px, cutting the rotating hint.
- Recommendation: keep the phone header to `xl` (1280), or give nav links `whitespace-nowrap` and let the
  search collapse to an icon below `xl`.
- Suggested command: `/impeccable adapt`

**[P2] Mobile menu: 40px gap, no Escape, no focus trap**
- Location: `src/components/site/Header.tsx:46-51, 165-190`
- Evidence: panel is `fixed top-[104px]`; once the announcement strip has scrolled away the nav ends at 64px
  and a 40px band of the page shows through (measured `panelTop 104`, `navBottom 64`). Escape leaves it
  open; focus is not moved into the panel.
- Recommendation: `top` from the header's measured bottom (or `inset-0` with the nav inside), close on
  Escape and on route change, move focus to the search field, return it to the toggle.
- Suggested command: `/impeccable harden`

**[P2] Best-sellers paging assumes 4 cards per page at every width**
- Location: `src/components/home/BestSellers.tsx:22-45, 100-114`
- Evidence: at 390px one card plus a peek is visible (241px cards) but the dots still count pages of four
  (2 dots for 6 products). Dots are 24×24 targets. `aria-controls` points at `best-<key>` ids that exist only
  for the active tab; the dots use `role="tab"` without panels.
- Recommendation: compute pages from `scrollWidth / clientWidth`; make the dots plain buttons inside a
  `nav aria-label="Carousel pages"`; 44px targets; drop `aria-controls` or render all panels.
- Suggested command: `/impeccable adapt` (paging) and `/impeccable harden` (ARIA)

**[P2] Carousel ARIA is invalid**
- Location: `src/components/home/Hero.tsx:111-125`
- Evidence: `aria-roledescription="carousel"` on a `<div>` with no role (the attribute requires one); slides
  have no `role="group"` / `aria-roledescription="slide"` / `aria-label="2 of 7"`; no live region.
- Recommendation: `role="region"` on the stage, `role="group"` per slide, `aria-live="polite"` while paused.
- Suggested command: `/impeccable harden`

**[P2] 9px vendor label on product cards**
- Location: `src/components/product/ProductCard.tsx:37` (`.t-micro`, globals.css:150)
- Evidence: computed `9px`, colour `--muted` (5.9:1, so contrast passes; size does not).
- Impact: unreadable on phones; vendor is a key purchase signal in a multi-brand store.
- Recommendation: 11–12px uppercase with 0.08em tracking (the `.pd-badge` scale), or the 12px `.t-caption`.
- Suggested command: `/impeccable typeset`

**[P2] Non-text contrast below 3:1**
- Location: `.pd-input` border (globals.css:329: `--stone` on `--surface` = 1.78:1); inactive carousel dots
  (`BestSellers.tsx:111`: `--stone` on canvas = 1.78:1)
- Standard: WCAG 1.4.11 Non-text Contrast.
- Recommendation: `--fog` is 2.14:1 and still fails; use `--muted` (5.9:1) at reduced opacity, or a darker
  hairline token (`#9a9186` ≈ 3.1:1 on white).
- Suggested command: `/impeccable polish`

**[P2] Reduced motion is a global kill switch**
- Location: `src/app/globals.css:379-384`
- Evidence: `*, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms
  !important }`. The GSAP reveals already skip correctly under reduced motion (verified: 0 hidden headings
  with reduced motion on), so the global rule only removes useful feedback (focus rings, button hover, tab
  state).
- Recommendation: delete the global rule; keep the targeted lines above it (smooth scroll off, gloss sweep
  off, carousel snap) and add the hero glide and image hover scale to that list.
- Suggested command: `/impeccable animate`

**[P2] Touch targets under 44px**
- Location: footer links (`Footer.tsx:54`: 17px rows, 16px gap, about 33px effective), breadcrumbs (15px
  rows), `.pd-tab` and `.chip` (40px), carousel dots (24px), product thumbnails are fine (64px).
- Standard: WCAG 2.5.8 (24px minimum) passes except the dots' spacing; Apple HIG 44pt fails for all listed.
- Recommendation: `py-3` on footer links on phones, 44px chips/tabs on touch, 44px dot hit areas.
- Suggested command: `/impeccable adapt`

**[P2] Hidden hero slide is preloaded, all six clips sit in the DOM**
- Location: `src/components/home/Hero.tsx:130-151`
- Evidence: the 7th slide (New Adara photo, 512KB JPEG) has `priority` although it is `visibility:hidden`
  on load; six `<video preload="metadata">` elements all reached `readyState 4` within a minute
  (3.4MB of MP4 total). Homepage preloads: 1 hero image + 4 product tiles + 3 explore tiles.
- Recommendation: `priority` only on slide 0's poster; render only the current and next slide's `<video>`;
  keep the rest as posters until they are one step away.
- Suggested command: `/impeccable optimize`

**[P2] Unused GSAP plugin and oversized font file**
- Location: `src/components/motion/gsap.ts:5-8` (SplitText registered, never imported elsewhere);
  `src/app/layout.tsx:17-23` (Fraunces with the whole weight axis plus italic, only 400 regular and one
  italic word are used)
- Recommendation: drop SplitText; request Fraunces `weight: ["400"]` with the `opsz`/`SOFT` axes only.
- Suggested command: `/impeccable optimize`

**[P2] Hard-coded colours outside the tokens**
- Location: `Hero.tsx:112` `bg-[#e9e2d9]` (this is `--faint`), `WhatsNew.tsx:34` `bg-[#f6f2ef]`,
  `Company.tsx:40` `bg-[#262a31]` (a cool grey on a warm palette), `globals.css:214` `.pd-tile-label
  color:#fff`, `globals.css:188` brand-card glow `rgba(212,120,78,…)` (the accent, hard-coded)
- Recommendation: `bg-faint`, a `--photo-bg` token for the kit photo, `--slate-ink` or a new `--photo-dark`
  for the tools panel, `--surface` for the label, `color-mix(in srgb, var(--accent) 35%, transparent)` for
  the glow.
- Suggested command: `/impeccable polish`

**[P2] Tabs have no arrow-key navigation**
- Location: `src/components/home/BestSellers.tsx:60-74`
- Evidence: `role="tablist"` / `role="tab"` with click handlers only; Tab key stops on every tab.
- Recommendation: Left/Right arrows move and select, or drop the tab roles and use a plain button group.
- Suggested command: `/impeccable harden`

### P3 · Polish

**[P3] Policy blockquote side tab** — `globals.css:261`, detector `side-tab`. Use a thin `--faint` rule or an
indented italic quote. `/impeccable polish`.

**[P3] Fixed-pixel type** — every size is `text-[16px]`-style px and `body` is `font-size: 16px`; browser zoom
works, user font-size preference does not. Convert the type scale to rem. `/impeccable typeset`.

**[P3] Mobile vs desktop "Support" link disagree** — `#` on the phone menu, `mailto:` on desktop
(`Header.tsx:153, 183`). Covered by the dead-links fix. `/impeccable harden`.

**[P3] "Show more" replaces the grid** — `ProductGrid.tsx:22-27` links to `?after=` and the next page shows
only the next 48, so the shopper loses the first 48. Expected for cursor paging, but a "Load more" that
appends would feel better on 316-product collections. `/impeccable harden`.

## Patterns and systemic issues

- **Column flex + `flex-1` on fixed-height inputs** appears in both e-mail forms; one happens to work. Treat
  `flex-1` inside `flex-col` as a smell.
- **Grids without a mobile column definition** (`grid lg:grid-cols-…` with no `grid-cols-1`/`minmax(0,1fr)`)
  are used in the product page, WhatsNew, Company and ProPanel. Only the product page breaks today because
  only it contains a non-wrapping strip, but the same trap is set everywhere.
- **Visual-only interactions**: three forms, the cart button and search all render a finished-looking UI with
  no behaviour behind it. The site needs one honest "not wired yet" pattern until each is connected.
- **ARIA roles applied by name**: `tablist` for pagination dots, `aria-roledescription` without a role,
  `aria-controls` to missing ids. Use the role's full keyboard and structure contract or no role.
- **Fixed px** for every size, including heights that fight flex sizing.

## Positive findings

- One real token system (`globals.css` `:root` → `@theme inline`) that the components actually use; the
  shadcn variables are mapped onto brand tokens instead of duplicated.
- Honest error handling: `CatalogError` in place of fake products, a pre-build placeholder gate, no sample
  catalog that could leak to production.
- Landmarks and labels are in place: `header`, `nav aria-label="Main"/"Footer"`, `main`, `footer`,
  `role="search"` with an sr-only label, `aria-label` on every icon button, `aria-current` on the active nav
  link, `aria-expanded` on the menu toggle, `fieldset`/`legend` for product options, `aria-pressed` on chips
  and thumbnails, `aria-live` on the quantity.
- Visible focus: `:focus-visible` outlines everywhere, with an `.on-dark` variant.
- Contrast on text is strong: ink 10:1 on linen, muted 5.25:1 on linen and 4.59:1 even on `--faint`,
  on-accent 5.49:1 on the apricot buttons, 13.5:1 on the dark panels.
- Images: `next/image` with `sizes` on every photo, 31 of 39 homepage images lazy, Shopify alt text passed
  through, decorative duplicates marked `alt=""`.
- Motion: scroll reveals use IntersectionObserver, run once, and are fully skipped under reduced motion;
  the magnetic button only runs on hover-capable devices; the search hint stops rotating under reduced motion.
- No horizontal overflow on the homepage or collection pages at 375px; the carousel and tab strip scroll
  inside their own containers.
- Fonts are self-hosted through `next/font` with `display: swap`; Inter limited to three weights.
- Server rendering with 5-minute revalidation on every catalog route; Shopify cursors for paging.

## Recommended actions

1. **[P0] `/impeccable adapt`**: product page at phone width (gallery column `min-w-0`, explicit mobile
   grid column, thumbnail strip), then the footer/pro inputs, the 1024px header, carousel paging and touch
   targets.
2. **[P1] `/impeccable harden`**: empty-image fallback card; honest states for newsletter, pro form, cart and
   search until they are wired; the six `#` links; a hero pause control and valid carousel ARIA; mobile menu
   Escape, focus and the 40px gap; tab keyboard support.
3. **[P1] `/impeccable clarify`**: replace "Placeholder copy." with real Featured-panel copy, align the
   Support link, extend the placeholder checker.
4. **[P1] `/impeccable typeset`**: homepage h1, 9px vendor label up to 11–12px, type scale in rem.
5. **[P2] `/impeccable optimize`**: priority only on the first poster, lazy video elements, drop SplitText,
   trim Fraunces.
6. **[P2] `/impeccable animate`**: replace the global reduced-motion kill with targeted rules.
7. **[P2] `/impeccable polish`**: tokens for the five hard-coded colours, 3:1 dots and input borders, the
   blockquote style, and the final pass before Netlify.

Re-run `/impeccable audit` after the fixes to see the score move.

## Not covered

- Lighthouse / bundle size were not measured (dev server only); `npm run build` was not re-run.
- Touch gestures on the carousel were exercised with emulated touch in the headless shell only, not on a
  physical phone.
- Dark mode is not implemented and is treated as intentional (light-only brand); the `dark` custom variant in
  `globals.css` has no tokens behind it.
