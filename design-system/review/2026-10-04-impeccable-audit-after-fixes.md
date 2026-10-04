# GlossBeau · Impeccable audit, re-run after the fixes (2026-10-04)

Second run of `/impeccable audit` (impeccable 4.5.0) after the seven fix commands from the first audit
(`2026-10-04-impeccable-audit.md`) were applied in order: adapt → harden → clarify → typeset → optimize →
animate → polish. Same method as the first run: detector source scan plus live URL scans at 1280×800 and
390×844, headless-browser measurements on seven routes at both widths (touch emulated on the phone pass),
console and network logs, contrast maths on the tokens. `npm run build` passes, `tsc` and `eslint` are clean.

## Audit Health Score

| # | Dimension | Before | After | Key finding now |
|---|-----------|--------|-------|-----------------|
| 1 | Accessibility | 2 | **3** | No skip link; desktop footer links are 17px rows (mouse only) |
| 2 | Performance | 3 | **3** | Fraunces ships two 120–150KB variable files; largest poster is 406KB |
| 3 | Responsive design | 1 | **4** | Clean at 390, 1024, 1280 and 1440 on every route; touch targets 44px where the pointer is coarse |
| 4 | Theming | 3 | **3** | One documented hex exception (the kit photo's paper colour); light-only by brief, so no dark theme |
| 5 | Implementation integrity | 2 | **3** | Ordering is honest but interim (e-mail until the Storefront cart is wired) |
| **Total** | | **11 / 20** | **16 / 20** | **Good (address weak dimensions)** |

## Implementation integrity verdict: PASS

The system is unchanged in identity and now consistent in execution: every colour but one documented
exception comes from the token sheet, every control does what it says, every link lands somewhere, and a
product with no photo shows a branded frame instead of a broken image. The detector's source scan has zero
findings. Its live URL scans report four primary findings on every page, all of which are pinned by the brief
and recorded here as accepted, not as defects:

- `cream-palette`: the linen canvas is the brand (DESIGN.md).
- `overused-font` (Inter): the stand-in for GT Standard, pinned in DESIGN.md/CLAUDE.md.
- `all-caps-body` ×2: the two 14px uppercase lines in the announcement strip, copied from peakdesign.com.
- `kicker-above-heading` ("For professionals"): the eyebrow in the pro-pricing panel, part of the Peak Design
  "Find a retailer" layout the homepage copies.
- Advisory `image-hover-transform` (18 on the homepage, 47 on a collection): the hover growth on tiles and
  cards, copied from the Peak Design and Shop references. Stilled under reduced motion.

## What changed, by finding

| Severity | First-audit finding | Status |
|---|---|---|
| P0 | Product page 872px wide on a phone | Fixed: 390px, thumbnails scroll inside their strip |
| P1 | Empty `src` on products without a photo | Fixed: branded "Photo coming soon" frame, zero console errors |
| P1 | Footer e-mail input 22px tall on phones | Fixed: 40px (pro form 53px by design) |
| P1 | Hero with no pause control | Fixed: pause/play button, pauses on focus, valid carousel ARIA |
| P1 | Homepage without h1 | Fixed: the wordmark is the h1 with a screen-reader description |
| P1 | "Placeholder copy." live | Fixed: real copy; the build gate now also catches draft text and "#" links |
| P1 | Fake success on forms, cart and search | Fixed: forms open a pre-filled e-mail and say so; "Order by e-mail" with the item filled in; a real /search page |
| P1 | Six "#" links | Fixed: zero on every route |
| P2 | Header cramped at 1024px | Fixed: one-line nav, 293px search |
| P2 | Phone menu gap, no Escape, no focus handling | Fixed |
| P2 | Carousel paging assumed 4 per page | Fixed: pages measured from the track; 44px dots; plain buttons |
| P2 | Invalid carousel ARIA | Fixed: region, labelled slide groups, live region while paused |
| P2 | 9px vendor label | Fixed: 11px uppercase label |
| P2 | Non-text contrast 1.78:1 (dots, input borders) | Fixed: new `--hairline` token, 3.4:1 on linen, 3.8:1 on white |
| P2 | Global reduced-motion kill | Fixed: movement off, colour/shadow/outline feedback kept (verified hover states in both modes) |
| P2 | Touch targets | Fixed: 44px chips/tabs on coarse pointers, 41px footer rows and breadcrumbs on phones |
| P2 | Hidden slide preloaded, six clips in the DOM | Fixed: 3.4MB → 0.6MB of video on load, 8 → 1 image preloads |
| P2 | Unused SplitText; Fraunces weight range | SplitText and ScrollTrigger removed. Fraunces kept: the optical-size axis needs the variable file and the italic serves the "pro" headline |
| P2 | Hard-coded colours | Fixed: tokens or `color-mix()` everywhere; one documented exception in WhatsNew |
| P2 | Tabs without arrow keys | Fixed: WAI-ARIA tabs pattern, one tab stop |
| P3 | Policy blockquote side tab | Fixed: 1px hairline, italic |
| P3 | Fixed-pixel type | Fixed: rem throughout; verified scaling at a 20px root with no overflow |
| P3 | Support link mismatch | Fixed |
| P3 | "Show more" replaces the grid | Left as is (cursor paging; the link now also works on /search) |

Also found and fixed during the re-run: product cards under a page h1 are now h2 (the detector's
`skipped-heading`), the menu button's `aria-controls` only points at the panel while it exists, and the
footer's Privacy/Terms links got phone-size tap areas.

## Remaining findings

**[P2] No skip link** — Accessibility. Landmarks exist, so keyboard users can jump by region, but a "Skip to
products" link before the header would help on listing pages. `/impeccable harden`.

**[P2] Ordering is interim** — Implementation integrity. "Order by e-mail" is honest and works, but the real
job is the Storefront cart (`cartCreate` → `checkoutUrl`). Wire it when the owner reaches that step; the
button, note and cart icon are the only places to change.

**[P3] Fraunces weight** — Performance. Two variable files (146KB + 118KB). A static 400 cut would be
smaller but loses the `opsz`/`SOFT` axes the headings use. Revisit only if Lighthouse flags font weight.

**[P3] Thermoliss poster** — Performance. 406KB where the other posters are 130–190KB; re-encoding saves
under 20%, so a fresh export from the source still is the only real saving.

**[P3] Desktop footer link rows** — Accessibility. 14px links 32px apart, Peak's measurement; fine for a
mouse, already enlarged on phones.

## Positive findings

Everything from the first audit still holds, plus: a working search, honest interim ordering, a complete
no-photo state, carousel and tab semantics that match their keyboard behaviour, a reduced-motion mode that
still answers hover and focus, and a build gate that refuses draft copy.

## Recommended actions

1. **[P2] `/impeccable harden`**: skip link; then the Storefront cart when the owner is ready.
2. **[P3] `/impeccable optimize`**: only if a Lighthouse run on the Netlify build flags fonts or the one
   heavy poster.
3. **[P3] `/impeccable polish`**: final pass once the logo, token and Netlify steps land.

Re-run `/impeccable audit` after those to see the score move again.
