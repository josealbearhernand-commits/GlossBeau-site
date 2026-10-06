# GlossBeau — build resources

Added 2026-10-03 from the "25 Claude Design Tricks" guide (RoboNuggets). These are the tools and rules
used to build glossbeau.com. Everything below sits on top of the three style references further down
(Oakâme for the linen canvas and walnut type, Arsenijs Fabrica for the single ember accent and pill
buttons, Shop for the floating product-card constellation).

## Live design system
- Browsable tokens, components and brand book: https://claude.ai/artifact/FmpZLez9iDpkmvWzpPKGxT
- Source of truth for colors, type scale, spacing and radii. `src/app/globals.css` mirrors it.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind v4, hosted on Netlify. Products via the Shopify
  Storefront API (`src/lib/shopify.ts`, token in `.env.local`, never committed).
- shadcn registry initialised so Canvas UI effects install themselves.

## Fonts (tip 05)
- Onest from Google Fonts replaces the paid BwGradual. Weights 200–600. Loaded with `next/font`.
- Alternatives if Onest ever changes: Switzer (fontshare.com/fonts/switzer, free for commercial use),
  General Sans (Fontshare). Check licences on fontesk.com per font; pair with fontjoy.com.

## Motion: GSAP (tip 21)
- `gsap` 3.15 + `@gsap/react`. Fully free, including ScrollTrigger, ScrollSmoother, SplitText.
- Use `useGSAP(() => {...}, { scope })` in client components. Patterns in use: pinned, scroll-scrubbed
  product spotlight; SplitText line reveals on headlines; infinite marquee; image parallax; magnetic
  pill buttons; the "gloss sweep" hover on product tiles (CSS). Bar: gsap.com/showcase.
- Always respect `prefers-reduced-motion`.

## Canvas UI effects (tip 15)
- 35 free GPU effects (MIT + Commons Clause: use freely, don't resell). Install:
  `npx shadcn@latest add @canvas-ui/<effect>-react` (e.g. `liquid-react`, `particle-reveal-react`,
  `displacement-react`, `droplets-react`, `ripple-react`). Files land in `src/components/canvasui/`.
- Keep intensity low and tint to ember/walnut. Avoid Glass and Frost (reads as glassmorphism, breaks
  the no-shadow, no-gradient rule).

## Icons (tips 16, 17)
- One set only: Phosphor **light** from Iconify (`ph:*-light`, MIT), 1.5px monoline at 24px. Installed
  as `@iconify-icons/ph` (inline SVG, no runtime fetch) and rendered with `@iconify/react`.
- Names: search `magnifying-glass-light`, bag `handbag-light`, account `user-light`, menu `list-light`,
  close `x-light`, arrows `arrow-right-light` / `arrow-up-right-light`, chevron `caret-down-light`,
  heart, star, plus, minus, `truck-light`, `shield-check-light`, `leaf-light`, `sparkle-light`,
  `play-light`, `pause-light`, `instagram-logo-light`, `tiktok-logo-light`.
- Never let Claude draw icons. All graphics, logos and diagrams are SVG with clean paths.

## Component sources (tips 13, 14, 19)
- 21st.dev and reactbits.dev for proven sections (copy the agent prompt, match to tokens).
- Creators Toolbox picks: OriginKit (free animated components, MCP for agents), beUI, HeroUI,
  Logosystem (1,200+ logos for the GlossBeau logo moodboard), Refero Styles, mtioon motion guide,
  ThreeUI (threeui.com, three.js hero sections via shadcn). Check each licence before shipping.

## Quality passes (tips 11, 20)
- Impeccable (github.com/pbakaus/impeccable): run `/audit` and `/critique` on every page; "make this
  quieter" is the default note for this brand. Not yet installed on this machine (see CLAUDE.md).
- `/hig` skill: Apple Human Interface Guidelines as numbers. 44×44 tap targets, 4.5:1 text contrast,
  3:1 for large text and controls, sentence case, verbs on buttons, reduce-motion honoured.

## Copy rules (tips 06, 12)
- Study Aesop, Oribe, Le Labo, OUAI, Glossier. Headlines name a result, not a feature. One idea per
  screen. Buttons are verbs ("Shop hair care", "Add to cart"). No "Click here", no exclamation marks,
  no AI-sounding words (elevate, unlock, seamless, effortless).

## Cinematic scenes (hero clips) — the recipe that worked
- Method: `/cinematic-scene` skill (still first → approve → animate the approved still, 2 variants).
- Stills: Higgsfield `flux_3_image`, product photo as `image_references`, 4:3, 2k, 3 credits each.
  Prompt pattern: "[bottle exactly as reference, cap type] + [liquid state already happening, viscosity] +
  linen seamless background, soft window light, shallow depth of field, no text, no hands".
- Motion: Seedance 2.5 (`omni_reference`, `start_image` = approved still, 5 s, 4:3, audio off, 35 credits).
  Prompt describes motion only: "locked-off camera, nothing moves except …, extreme slow motion, no splash".
  Approved clips (public/videos) with posters (public/stills): serum `serum-still1-seedance.mp4`,
  Thermoliss `thermoliss-A1.mp4`, Genus Intense `intense-A2.mp4`, Agua Milagrosa `agua-A2.mp4`,
  Glycolic leave-in `glycolic-A1.mp4`, Nirvel Silver `silver-A2.mp4`. Unused takes live in `media-archive/` (not deployed).
- Viscosity notes from the owner: argan serum = thick like honey (pump cap); shampoos = creamy, lighter than
  the oil, no splash; leave-ins (Thermoliss, Glycolic) = light like water; Agua Milagrosa = water-light but
  tinted, trigger spray, so mist rather than drip.

## Product cards side by side (owner rule, 2026-10-05)
Whenever products sit next to each other (collection, brand and search grids, related products, carousels, and any
new layout), every card in the row is the same height and the cards line up at the top and the bottom:
- The card fills its grid cell or flex slot: `h-full` on the card and on every wrapper between the cell and the card.
- The text area under the photo is `flex-1`; the product name always reserves two lines (`line-clamp-2` plus a
  two-line min-height), the vendor is one line (`truncate`), so the prices line up across the row.
- Photo boxes stay the shared 4:5 `ProductImage`. Use `ProductCard` (grids) or `ProductTile` (carousels); do not
  build a new card. Check by measuring: every card in a row reports the same height.

## Background system (2026-10-05)
Tokens in `src/app/globals.css`: lighter cream `--canvas` #f8f1e7, peach `--peach` (#ff965b, same as the top strip)
mixed in with color-mix() for `--canvas-top`, `--canvas-soft` (light area under the hero), `--canvas-peach` (warm
orange-cream behind product cards), `--glow-peach(-strong)` blooms. Transitions use `--fade-len` (96px phones,
180px desktop). White cards get `--shadow-sm` plus a feathered white edge (`--feather`, or `--feather-tight` on the
orange). Section classes: `.hero-fade`, `.bg-hero-tail`, `.bloom`, `.bg-brands`, `.bg-band-light` (Best sellers),
`.halo` (brands wall), `.halo-warm` (product grids). No images and no background-attachment: fixed.

## Imagery
- Only real product photos from the Diamond Pro Salon Supply Shopify store (cdn.shopify.com). Product
  shots sit on a white "paper" tile with 20px breathing room, never cropped. No stock images, no
  generated product renders. Lifestyle photography bleeds full width with the flat `photo-shade`.

## Inspiration notes
- Aesop: cream canvas, graphite ink, sticky text column beside tall imagery, accents only in photos.
- Oribe: tabbed best-seller carousels, dual images per tile, header flips light/dark per section.
- Le Labo: big hero plus small secondary image layer; four-tile category grid.
- OUAI: hover swaps to the alternate product image.
- Glossier: New / Best seller badges on cards, persistent cart drawer, conversational copy.

---

This are URL's of website examples that I like

https://styles.refero.design/style/a6791bc8-c49d-4e7a-a09d-877afcd04c25

https://styles.refero.design/style/4fa67bd1-f01d-454a-b522-4a0359ff9815

https://styles.refero.design/style/eb3bf6c1-a18f-4d72-801e-50c2cdbbaa21

\# Arsenijs Fabrica — Style Reference

> Editorial beauty spread under gallery lights. Pure-white gallery walls, a single warm strobe pulsing orange against the monochrome, type set thin as glass and hung with generous negative space.



\*\*Theme:\*\* light



Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.



Arsenijs Fabrica operates as an editorial beauty spread: expansive white surfaces, whisper-weight display type that floats across the canvas, and a single vivid orange that cuts through monochrome like a studio strobe. The brand voice in type is restrained and continental — weights 200-300 at hero scale, near-black text on pure white, generous breathing room between sections. Orange appears as functional punctuation: filled CTAs, modal backgrounds, card borders, and link accents — never as a wash or gradient field. Components feel fashion-magazine lightweight: hairline 1px borders, 10px card corners, 600px pill buttons, and a deliberate absence of shadows across the structural layer.



\## Tokens — Colors



| Name | Value | Token | Role |

|------|-------|-------|------|

| Ember Orange | `#f15730` | `--color-ember-orange` | Filled CTA buttons, primary action backgrounds — deep saturated orange that reads as confident rather than playful, the only color with enough chroma to anchor a click target against the white field |

| Tangerine Blaze | `#f7651a` | `--color-tangerine-blaze` | Promotional surface fills (email capture modal, featured product cards, stat callout backgrounds) — slightly brighter and more luminous than Ember, used where orange must own an entire region of the layout |

| Apricot Whisper | `#ff8562` | `--color-apricot-whisper` | Borders on outlined cards, link underlines, icon strokes, accent hairlines — the lightest orange, functioning as a warm-tinted structural color rather than a fill |

| Graphite Black | `#111111` | `--color-graphite-black` | Body text, default borders, the dominant structural color — a true near-black, not warm, used for the bulk of hairline rules and paragraph copy |

| Inkwell | `#0d1717` | `--color-inkwell` | Heading text, navigation text, primary headings — a deep black with the faintest cool-green undertone that gives headlines a quiet cast against pure white |

| Pure White | `#ffffff` | `--color-pure-white` | Page canvas, card surfaces, text on dark/orange surfaces — the unchanging ground tone across every section |

| Mist Gray | `#eeeeee` | `--color-mist-gray` | Soft card borders, hairline dividers on white surfaces where Graphite would feel too heavy |

| Smoke | `#818181` | `--color-smoke` | Secondary captions, muted helper text, subdued icon strokes — the only mid-gray in the palette, used sparingly to fade metadata without going fully light |



\## Tokens — Typography



\### Onest — Sole brand typeface. The 200-300 weights at display sizes (48-152px) define the editorial couture voice — thin strokes hung on a white wall with aggressive negative letter-spacing. Weights 400-500 handle body and UI; 600-800 reserved for occasional emphasis. Substantial negative letter-spacing contracts large text to the width of small, producing the 'cut from a single line' effect. Substitute with Inter or General Sans if Onest is unavailable. · `--font-onest`

\- \*\*Substitute:\*\* Inter, General Sans, or DM Sans

\- \*\*Weights:\*\* 200, 300, 400, 500, 600, 800

\- \*\*Sizes:\*\* 9, 10, 11, 12, 14, 15, 16, 18, 20, 21, 23, 32, 36, 48, 52, 152

\- \*\*Line height:\*\* 0.90–1.60 (scale-wide, tight at display, airy at body)

\- \*\*Letter spacing:\*\* -0.019em at 14px, scaling to -0.091em at 152px (the tighter the size, the wider the tracking in absolute terms, but always negative as em-value)

\- \*\*Role:\*\* Sole brand typeface. The 200-300 weights at display sizes (48-152px) define the editorial couture voice — thin strokes hung on a white wall with aggressive negative letter-spacing. Weights 400-500 handle body and UI; 600-800 reserved for occasional emphasis. Substantial negative letter-spacing contracts large text to the width of small, producing the 'cut from a single line' effect. Substitute with Inter or General Sans if Onest is unavailable.



\### Times — Times — detected in extracted data but not described by AI · `--font-times`

\- \*\*Weights:\*\* 400

\- \*\*Sizes:\*\* 16px

\- \*\*Line height:\*\* 1.2

\- \*\*Role:\*\* Times — detected in extracted data but not described by AI



\### Arial — Arial — detected in extracted data but not described by AI · `--font-arial`

\- \*\*Weights:\*\* 400

\- \*\*Sizes:\*\* 13px

\- \*\*Line height:\*\* 1.2

\- \*\*Role:\*\* Arial — detected in extracted data but not described by AI



\### Type Scale



| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |

|------|--------|--------|------|-------------|----------------|-------|

| caption-lg | — | — | 12px | 1.2 | 0px | `--text-caption-lg` |

| body-sm | — | — | 14px | 1.4 | -0.27px | `--text-body-sm` |

| body | — | — | 16px | 1.55 | -0.35px | `--text-body` |

| subheading-sm | — | — | 20px | 1.21 | -0.62px | `--text-subheading-sm` |

| subheading | — | — | 23px | 1.18 | -0.85px | `--text-subheading` |

| heading-sm | — | — | 32px | 1.08 | -1.34px | `--text-heading-sm` |

| heading | — | — | 48px | 1.04 | -2.5px | `--text-heading` |

| heading-lg | — | — | 52px | 1 | -2.91px | `--text-heading-lg` |

| display | — | — | 152px | 0.9 | -13.83px | `--text-display` |



\## Tokens — Spacing \& Shapes



\*\*Density:\*\* compact



\### Spacing Scale



| Name | Value | Token |

|------|-------|-------|

| 4 | 4px | `--spacing-4` |

| 5 | 5px | `--spacing-5` |

| 8 | 8px | `--spacing-8` |

| 9 | 9px | `--spacing-9` |

| 10 | 10px | `--spacing-10` |

| 12 | 12px | `--spacing-12` |

| 13 | 13px | `--spacing-13` |

| 15 | 15px | `--spacing-15` |

| 20 | 20px | `--spacing-20` |

| 24 | 24px | `--spacing-24` |

| 25 | 25px | `--spacing-25` |

| 30 | 30px | `--spacing-30` |

| 40 | 40px | `--spacing-40` |

| 50 | 50px | `--spacing-50` |

| 90 | 90px | `--spacing-90` |



\### Border Radius



| Element | Value |

|---------|-------|

| tags | 30px |

| cards | 10px |

| images | 15px |

| inputs | 30px |

| avatars | 3000px |

| buttons | 600px |



\### Layout



\- \*\*Page max-width:\*\* 1280px

\- \*\*Section gap:\*\* 80px

\- \*\*Card padding:\*\* 20px

\- \*\*Element gap:\*\* 10px



\## Components



\### Top Announcement Bar

\*\*Role:\*\* Slim black strip delivering free-shipping and gift-purchase notices



Full-bleed, \~32px tall, background #111111, text #ffffff at 11px Onest weight 400 centered. Anchors the page with a dark cap.



\### Main Navigation

\*\*Role:\*\* Sticky header carrying logo, primary links, and utility icons (search, account, cart)



White background, \~64px tall, logo in Onest 600 uppercase letterspacing-tight left, nav links in Onest 400 14px Inkwell (#0d1717) with 24px horizontal gaps, utility icons right with 20px gaps. No background tint, no shadow — separates from page by proximity alone.



\### Hero Overlay Section

\*\*Role:\*\* Full-bleed product photography with display headline and CTA overlaid



Background: full-width product lifestyle photo (face mask containers, warm tones). Overlay text bottom-left: 'brand of modern and innovative cosmetics' in Onest 200 at 52px Inkwell, with line-height 1.00 and letter-spacing -2.91px. CTA: white pill button (600px radius), 15px vertical / 40px horizontal padding, Onest 500 14px Graphite. Right side carries small floating UI annotations at Smoke gray ('Percentage of natural ingredients 98%').



\### Pill CTA Button (Primary)

\*\*Role:\*\* Filled action button for checkout, subscribe, and 'shop now' actions



Background Ember Orange (#f15730), text #ffffff, border-radius 600px (fully pill), padding 15px 40px, Onest 500 14px. No border. On hover, shifts to Tangerine Blaze (#f7651a).



\### Pill CTA Button (Ghost/White)

\*\*Role:\*\* Secondary action overlaid on imagery or orange surfaces



Background #ffffff, text Graphite Black (#111111), border-radius 600px, padding 15px 40px, Onest 500 14px. Reads as the inverted version of the primary pill.



\### Pill Button (On Orange Modal)

\*\*Role:\*\* Form submit button inside the email capture modal



Background #ffffff, text Ember Orange (#f15730), border-radius 600px, padding 15px 48px, Onest 500 16px. The white-on-orange inversion makes the submit action pop against the Tangerine Blaze modal fill.



\### Email Capture Modal

\*\*Role:\*\* Centered overlay prompting newsletter signup with 10% discount



Tangerine Blaze (#f7651a) background, 10px border-radius, \~480px wide, centered on a dimmed page. Header: small heart icon + 'skincare community' in Onest 300 italic at 32px #ffffff. Body text: Onest 400 16px #ffffff. Email input: transparent fill with 2px #ffffff border, 30px radius, padding 13px 20px, white placeholder text. Submit: white pill (see above). Close X: top-right, 2px #ffffff stroke.



\### Outlined Product Card

\*\*Role:\*\* Grid card for product listings with orange hairline border



Background #ffffff, border 1.5px Apricot Whisper (#ff8562), border-radius 10px, padding 20px. Product image fills card width with 0px internal margin. Title below image in Onest 500 16px Inkwell. Price/CTA in Onest 400 14px Graphite. The orange border is the card's only accent — no shadow, no fill.



\### Stat Callout Block

\*\*Role:\*\* Large-percentage proof point (e.g. '98% natural ingredients')



Number in Onest 200 at 152px Graphite Black with line-height 0.90 and letter-spacing -13.83px — the type scale's largest size, creating a single-character-wide visual punch. Label in Onest 400 14px Smoke (#818181), sitting tight beneath the number. No background fill, no border.



\### Feature Row

\*\*Role:\*\* Horizontal list of trust signals with line-art icons (leaf = natural, rabbit = cruelty-free)



Inline row, no card. Each item: 20px line-art icon in Graphite Black + 10px gap + label in Onest 400 14px Graphite. Items separated by 40px horizontal space. No background, no border, sits flush against the section baseline.



\### Close Button (Modal X)

\*\*Role:\*\* Dismisses the email capture overlay



2px stroke #ffffff line forming an X, \~20px square, positioned absolute top-right of the modal with 16px margin. No background, no border, no radius.



\### Navigation Icon Button

\*\*Role:\*\* Utility actions in the header (search, account, cart)



No background, 1.5px Graphite Black line-art icon at \~20px, optional circular badge count in Tangerine Blaze with #ffffff text at 9px. Icons sit 20px apart.



\## Do's and Don'ts



\### Do

\- Set all display sizes (48px and above) in Onest weight 200-300 — the whisper-weight headline is the brand's editorial signature

\- Use letter-spacing in negative em values across the entire type scale, tightening to -0.091em at 152px display

\- Reserve Ember Orange (#f15730) for filled buttons and Tangerine Blaze (#f7651a) for entire promotional surfaces; never mix them in the same component

\- Use Apricot Whisper (#ff8562) for 1-2px hairline borders on cards and link underlines — not for fills

\- Apply 600px border-radius to every button and 30px to every input — the pill is non-negotiable for actions

\- Default card corners to 10px and product image corners to 15px

\- Use Mist Gray (#eeeeee) for borders only on white surfaces where Graphite would feel too heavy



\### Don't

\- Don't apply box-shadows to cards, buttons, or modals — the system communicates depth with borders and color alone

\- Don't use Orange for body text — its contrast on white fails accessibility, keep it for fills, borders, and large display numbers only

\- Don't use weights 600-800 for body text or UI labels — reserve them for the rare emphasis moment

\- Don't introduce a second accent color or hue — the orange must remain the single chromatic note

\- Don't use 0px or 4px border-radius on cards or images — the 10px/15px minimum is part of the soft editorial feel

\- Don't center product card text — left-align all UI copy; centering is reserved for the hero overlay and modal content

\- Don't apply gradients to surface fills — the only observed gradient is a single progress-bar indicator on a dark surface



\## Surfaces



| Level | Name | Value | Purpose |

|-------|------|-------|---------|

| 0 | Canvas | `#ffffff` | Page background, the base surface |

| 1 | Card White | `#ffffff` | Product card surfaces on white canvas — distinguished by border and shadow, not by fill |

| 2 | Orange Surface | `#f7651a` | Promotional modals, featured product highlights, stat callout blocks |

| 3 | Dark Surface | `#0d1717` | Full-bleed dark sections when used; rare |



\## Elevation



The system uses zero box-shadows across all observed components. Depth is communicated entirely through: 1px hairline borders in Graphite Black (#111111) or Apricot Whisper (#ff8562), 1-2px white borders on dark imagery to lift text overlays, and the contrast between the orange modal surface and the dimmed page behind it. This shadowless approach is deliberate — the editorial beauty context treats shadows as visually heavy and incompatible with the light, airy type treatment.



\## Imagery



Photography dominates the visual language: warm-toned, editorial beauty product shots — close crops of face mask containers, orange-tinted product packaging, and lifestyle skin imagery. Hero and product backgrounds are full-bleed with a slight darkening overlay to support white text. The 152px display type sits directly on top of photography without a scrim, relying on the photo's own contrast. Icons are exclusively 1.5-2px line-art in Graphite Black, monoline, geometric (leaf, rabbit, heart, search, user, cart). No illustrations, no 3D renders, no decorative graphics — the product photography is the brand's only visual storytelling medium.



\## Layout



Full-bleed page with a max-width 1280px content container. The hero is a full-viewport-width product photograph with a bottom-left display headline overlay and a white pill CTA. The email capture modal centers on a dimmed page (rgba black \~60%). Below the hero, sections flow in a vertical rhythm with 80px section gaps: a product grid (3-column on desktop, orange-bordered cards), a stat callout (98%) sitting in generous whitespace, and a trust-signal row (icons + labels) anchoring the fold. Navigation is a single sticky white header; the announcement bar is a fixed dark strip above it. Asymmetric compositions dominate — large left-aligned text blocks, right-anchored floating annotations, never centered content outside the modal.



\## Agent Prompt Guide



\*\*Quick Color Reference\*\*

\- text: #111111 (body) / #0d1717 (headings)

\- background: #ffffff

\- border: #111111 (structural) / #ff8562 (accent hairlines)

\- accent: #ff8562 (borders, icons, links)

\- primary action: #f15730 (filled action)

\- promotional surface: #f7651a (modals, featured blocks)



\*\*Example Component Prompts\*\*



1\. Create a Primary Action Button: #f15730 background, #000000 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.



2\. \*\*Email capture modal\*\*: Centered on dimmed page. Background #f7651a, 10px radius, \~480px wide. Header heart icon (2px #ffffff stroke) + 'skincare community' in Onest 300 italic 32px #ffffff. Body copy Onest 400 16px #ffffff. Email input: transparent, 2px #ffffff border, 30px radius, 13px 20px padding. Submit button: background #ffffff, text #f15730, 600px radius, 15px 48px padding, Onest 500 16px. Close X top-right: 2px #ffffff lines.



3\. \*\*Product card\*\*: Background #ffffff, border 1.5px #ff8562, 10px radius, 20px padding. Product image fills card width. Title below in Onest 500 16px #0d1717. No shadow.



4\. \*\*Stat callout\*\*: '98%' in Onest 200 at 152px #111111, line-height 0.90, letter-spacing -13.83px. Label 'Percentage of natural ingredients' in Onest 400 14px #818181 directly beneath. No background, no border.



5\. \*\*Trust signal row\*\*: Horizontal inline list. Each item: 20px line-art icon in #111111 + 10px gap + label in Onest 400 14px #111111. 40px gap between items. No background fill.



\## Type Signature



The combination of Onest weight 200 at 152px with -0.091em letter-spacing is the single most identifiable element of the visual system. This pairing produces a display headline so thin and so tightly tracked that the letters nearly touch at their widest stems — it reads as engraved rather than printed. Any new page should feature at least one instance of this display treatment; without it, the system loses its editorial identity. Body text (14-16px) uses weight 400-500 with far less aggressive tracking (-0.019em to -0.022em), keeping long passages legible.



\## Border System



Three border weights and three border colors, no exceptions: 1.5px (product cards, icon strokes) in Apricot Whisper #ff8562; 1px (structural dividers, card edges on white) in Graphite #111111; 2px (modal inputs, close X, on-image annotations) in white #ffffff or current accent. Borders carry all the structural information — there are no shadows, no colored fills behind borders, and no borderless filled regions outside the orange promotional surfaces.



\## Similar Brands



\- \*\*Glossier\*\* — Same light-cosmetics palette with a single warm pink-coral accent and large editorial display type on white

\- \*\*Aesop\*\* — Whisper-weight serif-adjacent sans serif, near-black text on warm white, product-photography-forward layout with zero shadows

\- \*\*By Far\*\* — Editorial fashion-cosmetics crossover with extreme display type sizes and pill-shaped CTAs

\- \*\*Cult51\*\* — Minimal skincare product card grid with hairline colored borders and monochrome typography

\- \*\*Milk Makeup\*\* — Bold color-blocked promotional modals interrupting an otherwise white editorial product layout



\## Quick Start



\### CSS Custom Properties



```css

:root {

&#x20; /\* Colors \*/

&#x20; --color-ember-orange: #f15730;

&#x20; --color-tangerine-blaze: #f7651a;

&#x20; --color-apricot-whisper: #ff8562;

&#x20; --color-graphite-black: #111111;

&#x20; --color-inkwell: #0d1717;

&#x20; --color-pure-white: #ffffff;

&#x20; --color-mist-gray: #eeeeee;

&#x20; --color-smoke: #818181;



&#x20; /\* Typography — Font Families \*/

&#x20; --font-onest: 'Onest', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

&#x20; --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

&#x20; --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;



&#x20; /\* Typography — Scale \*/

&#x20; --text-caption-lg: 12px;

&#x20; --leading-caption-lg: 1.2;

&#x20; --tracking-caption-lg: 0px;

&#x20; --text-body-sm: 14px;

&#x20; --leading-body-sm: 1.4;

&#x20; --tracking-body-sm: -0.27px;

&#x20; --text-body: 16px;

&#x20; --leading-body: 1.55;

&#x20; --tracking-body: -0.35px;

&#x20; --text-subheading-sm: 20px;

&#x20; --leading-subheading-sm: 1.21;

&#x20; --tracking-subheading-sm: -0.62px;

&#x20; --text-subheading: 23px;

&#x20; --leading-subheading: 1.18;

&#x20; --tracking-subheading: -0.85px;

&#x20; --text-heading-sm: 32px;

&#x20; --leading-heading-sm: 1.08;

&#x20; --tracking-heading-sm: -1.34px;

&#x20; --text-heading: 48px;

&#x20; --leading-heading: 1.04;

&#x20; --tracking-heading: -2.5px;

&#x20; --text-heading-lg: 52px;

&#x20; --leading-heading-lg: 1;

&#x20; --tracking-heading-lg: -2.91px;

&#x20; --text-display: 152px;

&#x20; --leading-display: 0.9;

&#x20; --tracking-display: -13.83px;



&#x20; /\* Typography — Weights \*/

&#x20; --font-weight-extralight: 200;

&#x20; --font-weight-light: 300;

&#x20; --font-weight-regular: 400;

&#x20; --font-weight-medium: 500;

&#x20; --font-weight-semibold: 600;

&#x20; --font-weight-extrabold: 800;



&#x20; /\* Spacing \*/

&#x20; --spacing-4: 4px;

&#x20; --spacing-5: 5px;

&#x20; --spacing-8: 8px;

&#x20; --spacing-9: 9px;

&#x20; --spacing-10: 10px;

&#x20; --spacing-12: 12px;

&#x20; --spacing-13: 13px;

&#x20; --spacing-15: 15px;

&#x20; --spacing-20: 20px;

&#x20; --spacing-24: 24px;

&#x20; --spacing-25: 25px;

&#x20; --spacing-30: 30px;

&#x20; --spacing-40: 40px;

&#x20; --spacing-50: 50px;

&#x20; --spacing-90: 90px;



&#x20; /\* Layout \*/

&#x20; --page-max-width: 1280px;

&#x20; --section-gap: 80px;

&#x20; --card-padding: 20px;

&#x20; --element-gap: 10px;



&#x20; /\* Border Radius \*/

&#x20; --radius-lg: 10px;

&#x20; --radius-xl: 15px;

&#x20; --radius-3xl: 30px;

&#x20; --radius-full: 55px;

&#x20; --radius-full-2: 60px;

&#x20; --radius-full-3: 600px;

&#x20; --radius-full-4: 3000px;



&#x20; /\* Named Radii \*/

&#x20; --radius-tags: 30px;

&#x20; --radius-cards: 10px;

&#x20; --radius-images: 15px;

&#x20; --radius-inputs: 30px;

&#x20; --radius-avatars: 3000px;

&#x20; --radius-buttons: 600px;



&#x20; /\* Surfaces \*/

&#x20; --surface-canvas: #ffffff;

&#x20; --surface-card-white: #ffffff;

&#x20; --surface-orange-surface: #f7651a;

&#x20; --surface-dark-surface: #0d1717;

}

```



\### Tailwind v4



```css

@theme {

&#x20; /\* Colors \*/

&#x20; --color-ember-orange: #f15730;

&#x20; --color-tangerine-blaze: #f7651a;

&#x20; --color-apricot-whisper: #ff8562;

&#x20; --color-graphite-black: #111111;

&#x20; --color-inkwell: #0d1717;

&#x20; --color-pure-white: #ffffff;

&#x20; --color-mist-gray: #eeeeee;

&#x20; --color-smoke: #818181;



&#x20; /\* Typography \*/

&#x20; --font-onest: 'Onest', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

&#x20; --font-times: 'Times', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

&#x20; --font-arial: 'Arial', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;



&#x20; /\* Typography — Scale \*/

&#x20; --text-caption-lg: 12px;

&#x20; --leading-caption-lg: 1.2;

&#x20; --tracking-caption-lg: 0px;

&#x20; --text-body-sm: 14px;

&#x20; --leading-body-sm: 1.4;

&#x20; --tracking-body-sm: -0.27px;

&#x20; --text-body: 16px;

&#x20; --leading-body: 1.55;

&#x20; --tracking-body: -0.35px;

&#x20; --text-subheading-sm: 20px;

&#x20; --leading-subheading-sm: 1.21;

&#x20; --tracking-subheading-sm: -0.62px;

&#x20; --text-subheading: 23px;

&#x20; --leading-subheading: 1.18;

&#x20; --tracking-subheading: -0.85px;

&#x20; --text-heading-sm: 32px;

&#x20; --leading-heading-sm: 1.08;

&#x20; --tracking-heading-sm: -1.34px;

&#x20; --text-heading: 48px;

&#x20; --leading-heading: 1.04;

&#x20; --tracking-heading: -2.5px;

&#x20; --text-heading-lg: 52px;

&#x20; --leading-heading-lg: 1;

&#x20; --tracking-heading-lg: -2.91px;

&#x20; --text-display: 152px;

&#x20; --leading-display: 0.9;

&#x20; --tracking-display: -13.83px;



&#x20; /\* Spacing \*/

&#x20; --spacing-4: 4px;

&#x20; --spacing-5: 5px;

&#x20; --spacing-8: 8px;

&#x20; --spacing-9: 9px;

&#x20; --spacing-10: 10px;

&#x20; --spacing-12: 12px;

&#x20; --spacing-13: 13px;

&#x20; --spacing-15: 15px;

&#x20; --spacing-20: 20px;

&#x20; --spacing-24: 24px;

&#x20; --spacing-25: 25px;

&#x20; --spacing-30: 30px;

&#x20; --spacing-40: 40px;

&#x20; --spacing-50: 50px;

&#x20; --spacing-90: 90px;



&#x20; /\* Border Radius \*/

&#x20; --radius-lg: 10px;

&#x20; --radius-xl: 15px;

&#x20; --radius-3xl: 30px;

&#x20; --radius-full: 55px;

&#x20; --radius-full-2: 60px;

&#x20; --radius-full-3: 600px;

&#x20; --radius-full-4: 3000px;

}

```

\# Shop — Style Reference

> Floating shopping constellation on white marble



\*\*Theme:\*\* light



Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.



Shop runs on a white-canvas discovery model where products float as large, heavily-rounded image cards instead of grid-locked thumbnails. The entire interface is pillow-soft: 20–28px radii everywhere, pill-shaped controls, a compact 16px GT Standard body with tight negative tracking that pulls text into crisp shapes. A single vivid violet (#5433eb) is the system's only saturated accent — it appears in the wordmark, the circular search submit, and as a tinted shadow on that same button. The rest of the palette is warm-neutral: white surfaces, a faint cool-gray canvas, hairline borders, and near-black text. Density stays compact with 12px gaps, but the hero and category bands breathe through generous 64–80px vertical rhythm, making commerce feel browsable rather than catalog-like.



\## Tokens — Colors



| Name | Value | Token | Role |

|------|-------|-------|------|

| Canvas Mist | `#f2f4f5` | `--color-canvas-mist` | Page background and secondary surface wash behind elevated cards |

| Pure White | `#ffffff` | `--color-pure-white` | Primary surface for cards, input fields, floating brand spotlights, and pill buttons |

| Ink Black | `#000000` | `--color-ink-black` | Primary text, headings, icons, nav symbols, and dark mode product cards |

| Faint Border | `#ebebeb` | `--color-faint-border` | Hairline dividers on cards, input outlines, and pill button borders |

| Muted Gray | `#787574` | `--color-muted-gray` | Secondary text, navigation labels, icon strokes in idle state |

| Cool Stone | `#cccccc` | `--color-cool-stone` | Placeholder fills, disabled states, and inactive icon backgrounds |

| Warm Fog | `#acb0aa` | `--color-warm-fog` | Subtle surface tints for secondary product cards and section backgrounds |

| Shop Violet | `#5433eb` | `--color-shop-violet` | Search submit button, wordmark dot, brand logo — the single accent that makes action and identity pop against the white canvas |

| Violet Wash | `#c0b5f3` | `--color-violet-wash` | Translucent halo behind the violet submit button, extending its glow without changing hue |

| Slate Ink | `#332f2d` | `--color-slate-ink` | Dark product card surfaces and deep-tone overlay text |

| Ash Veil | `#665a54` | `--color-ash-veil` | Warm desaturated gray used in product imagery backdrops, not an active UI token |



\## Tokens — Typography



\### GT Standard — Primary typeface at all sizes — body and headings alike. GTStandard-MRegular at 16px/-0.031em is the workhorse for body, buttons, and labels. GTStandard-MSemibold at 20px/-0.05em powers the few display-scale headings; GTStandard-MMedium at 11–12px handles micro-labels. Every weight renders at 400 optical weight — the font family carries its hierarchy through subtle grade shifts and tight negative tracking, not bold contrast. This is the signature: Shop doesn't shout with bold, it shapes text with tracking. · `--font-gt-standard`

\- \*\*Substitute:\*\* Inter, system-ui, -apple-system

\- \*\*Weights:\*\* 400

\- \*\*Sizes:\*\* 9px, 11px, 12px, 14px, 16px, 20px

\- \*\*Line height:\*\* 1.10–1.38

\- \*\*Letter spacing:\*\* -0.05em at 20px, -0.031em at 16px, -0.014em at 14px, -0.017em at 12px, -0.058em at 9px

\- \*\*Role:\*\* Primary typeface at all sizes — body and headings alike. GTStandard-MRegular at 16px/-0.031em is the workhorse for body, buttons, and labels. GTStandard-MSemibold at 20px/-0.05em powers the few display-scale headings; GTStandard-MMedium at 11–12px handles micro-labels. Every weight renders at 400 optical weight — the font family carries its hierarchy through subtle grade shifts and tight negative tracking, not bold contrast. This is the signature: Shop doesn't shout with bold, it shapes text with tracking.



\### Shopify Sans — Reserved for system-level messaging like the app download banner and cookie consent copy · `--font-shopify-sans`

\- \*\*Substitute:\*\* Inter

\- \*\*Weights:\*\* 400, 700

\- \*\*Sizes:\*\* 10px, 14px

\- \*\*Line height:\*\* 1.20–1.71

\- \*\*Letter spacing:\*\* -0.0230em

\- \*\*Role:\*\* Reserved for system-level messaging like the app download banner and cookie consent copy



\### Type Scale



| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |

|------|--------|--------|------|-------------|----------------|-------|

| caption | — | — | 11px | 1.33 | — | `--text-caption` |

| body-sm | — | — | 12px | 1.33 | — | `--text-body-sm` |

| body | — | — | 14px | 1.33 | — | `--text-body` |

| body-lg | — | — | 16px | 1.33 | — | `--text-body-lg` |



\## Tokens — Spacing \& Shapes



\*\*Density:\*\* compact



\### Spacing Scale



| Name | Value | Token |

|------|-------|-------|

| 4 | 4px | `--spacing-4` |

| 6 | 6px | `--spacing-6` |

| 8 | 8px | `--spacing-8` |

| 10 | 10px | `--spacing-10` |

| 11 | 11px | `--spacing-11` |

| 12 | 12px | `--spacing-12` |

| 16 | 16px | `--spacing-16` |

| 20 | 20px | `--spacing-20` |

| 24 | 24px | `--spacing-24` |

| 32 | 32px | `--spacing-32` |

| 38 | 38px | `--spacing-38` |

| 40 | 40px | `--spacing-40` |

| 48 | 48px | `--spacing-48` |

| 64 | 64px | `--spacing-64` |



\### Border Radius



| Element | Value |

|---------|-------|

| cards | 28px |

| chips | 9999px |

| pills | 20px |

| inputs | 9999px |

| search | 9999px |

| buttons | 9999px |



\### Shadows



| Name | Value | Token |

|------|-------|-------|

| sm | `rgba(0, 0, 0, 0.06) 0px 2px 8px 0px` | `--shadow-sm` |

| sm-2 | `rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0...` | `--shadow-sm-2` |

| lg | `rgba(0, 0, 0, 0.12) 0px 4px 24px 0px` | `--shadow-lg` |

| lg-2 | `rgba(69, 36, 219, 0.34) 0px 4px 24px 0px` | `--shadow-lg-2` |



\### Layout



\- \*\*Page max-width:\*\* 1200px

\- \*\*Section gap:\*\* 64px

\- \*\*Card padding:\*\* 0px

\- \*\*Element gap:\*\* 12px



\## Components



\### Hero Floating Product Card

\*\*Role:\*\* Hero showcase tile hovering above the wordmark



White surface, 28px radius, 2-layer soft shadow (0 4px 6px -1px rgba(0,0,0,0.1) + 0 2px 4px -2px rgba(0,0,0,0.1)). Contains a 1:1 product image with its own 20px radius, brand name in 14px semibold ink-black beneath, and a 5-star rating row in 9px caption. Zero internal padding on the card; the image bleeds to the rounded edge.



\### Brand Spotlight Card

\*\*Role:\*\* Elevated product card promoting a featured merchant



White surface, 28px radius, same dual-layer soft shadow. A 1:1 product image fills the upper area with 20px inner radius. Below: brand name in 14px semibold, star rating and review count in 9px caption. No visible border; the shadow alone separates it from the canvas.



\### Search Input with Violet Submit

\*\*Role:\*\* Primary navigation and discovery control



Pill-shaped container at 9999px radius, white fill, 1px ink-black border at 0.1 opacity, 4px vertical / 20px left horizontal padding. Right side reserves 48px for a circular violet (#5433eb) submit button with a white arrow glyph. The violet button carries a tinted shadow: 0 4px 24px rgba(69,36,219,0.34). Placeholder text in 16px regular at muted gray.



\### Category Pill

\*\*Role:\*\* Top-level category quick-access chip



Pill at 9999px radius, white fill, 1px faint (#ebebeb) border, subtle elevation shadow (0 2px 8px rgba(0,0,0,0.06)). Left side: 16px circular category icon in its native brand color. Right: 16px GTStandard-MRegular label in ink-black. Horizontal padding 6px, vertical 6px.



\### Product Image Tile

\*\*Role:\*\* Category-grid product type card with overlay label



Tall or wide image fills the entire card with zero internal padding. The card itself has 0px radius in the grid context (image defines the shape). A semi-transparent white label box sits at the bottom-left with the product type in 14px semibold, 12px internal padding, and 12px radius on the label chip.



\### Category Section Header

\*\*Role:\*\* Section title with chevron affordance



Left-aligned 20px GTStandard-MSemibold at -1.0px tracking in ink-black, followed by a 16px ink-black chevron. No background, no border. Sits above a 2-column or 4-column product grid with 24px bottom margin before the grid.



\### Sidebar Nav Rail

\*\*Role:\*\* Persistent left-edge navigation



Narrow vertical column (\~64px wide), white background, no border. Each nav item is a 24px ink-black icon centered in a 48px square tappable area. Active state fills the icon container with #f2f4f5 at 20px radius. Profile avatar at the bottom is a 32px circle with a 1px #ebebeb ring.



\### App Download Banner

\*\*Role:\*\* Top-of-page cross-platform install prompt



Full-width dark band (#000000) at 48px height, 1px radius, white centered text. Contains a 24px rounded app icon, a 14px Shopify Sans link label reading 'Download Shop app', subtext 'Available on iOS \& Android' at 10px, and a white right-pointing arrow. Sits flush against the top edge with zero internal margins beyond 12px horizontal.



\### Cookie Consent Button

\*\*Role:\*\* Cookie banner action button



Pill at 9999px radius, white fill, 1px #ebebeb border. Black 12px semibold label centered. Padding 6px vertical, 16px horizontal. Shadow: 0 2px 8px rgba(0,0,0,0.06) for subtle lift on the white canvas.



\### Category Carousel Arrow

\*\*Role:\*\* Carousel navigation control within product grids



Circular 32px white button with 0 4px 24px rgba(0,0,0,0.12) shadow. Contains a 16px ink-black right-chevron. Sits at the right edge of any horizontal product rail, vertically centered.



\### Product Type Hero Image

\*\*Role:\*\* Full-bleed product image with brand name overlay



Large rounded image (28px radius) filling roughly 60% of a category row. Brand name rendered in large white display type directly on the image at the top-left, followed by a star rating and review count in 14px white. No card chrome — the image IS the card.



\### Mini Product Thumbnail Strip

\*\*Role:\*\* Horizontal swatch row within a product card



Row of 3–4 small product images at \~48px square with 12px radius each, separated by 2px gaps. Sits at the bottom of a brand card as a quick-browse affordance. No labels, no borders — just the cropped product images.



\### Cookie Modal Link

\*\*Role:\*\* Inline text link in cookie consent copy



14px GTStandard-MRegular ink-black, underlined. No background, no border. Sits inline within body copy at standard line height.



\## Do's and Don'ts



\### Do

\- Use 28px radius for all product cards and 9999px for all pills, inputs, and category chips — the generous rounding is the brand signature

\- Set the violet (#5433eb) exclusively on the search submit button and the wordmark dot — it is the only saturated color in the system and must stay singular

\- Type body text at 16px GTStandard-MRegular with -0.5px tracking, never smaller for primary content — 12px is the floor for secondary labels

\- Pair every elevated card with the dual-layer soft shadow (0 4px 6px -1px + 0 2px 4px -2px at 10% black) — never use a single hard shadow

\- Separate layers with shadow alone on white surfaces; skip borders on cards and rely on the canvas-to-card color shift

\- Maintain 64–80px vertical breathing room between major content sections to preserve the airy, browseable feel

\- Tint the search button's shadow with the brand violet (rgba(69,36,219,0.34)) so the accent color is reinforced in the elevation itself



\### Don't

\- Do not add a second saturated accent color — the system is monochrome with one violet, introducing a second will flatten its impact

\- Do not use sharp corners on cards, buttons, or inputs — 0px radius is reserved for image edges only

\- Do not use bold (700+) weights — the GTStandard family carries hierarchy through grade and tracking, not weight contrast

\- Do not add visible borders to elevated cards — the shadow and white surface against the faint canvas do the separation work

\- Do not use colored backgrounds for UI containers — the product photography provides all color in the experience

\- Do not break the 9999px pill convention for any control that sits inline with text (search, category chips, cookie buttons)

\- Do not set body text below 12px — 9px is reserved exclusively for review counts and brand metadata in tight cards

\- Do not add gradients, illustrations, or decorative shapes — the visual language is product photography on white with soft shadows



\## Surfaces



| Level | Name | Value | Purpose |

|-------|------|-------|---------|

| 0 | Canvas | `#f2f4f5` | Page background — only visible at page edges and behind the sidebar rail |

| 1 | Surface | `#ffffff` | Main content surface for cards, inputs, pills, the sidebar, and the search bar |

| 2 | Elevated Card | `#ffffff` | Hero floating product cards and brand spotlights — same white but lifted by dual-layer soft shadow |

| 3 | Accent Product Image | `#000000` | Dark product imagery that reads as a 'dark mode' surface within the light canvas, holding white overlay text |



\## Elevation



\- \*\*Hero Product Card:\*\* `rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px`

\- \*\*Search Submit Button:\*\* `rgba(69,36,219,0.34) 0px 4px 24px 0px`

\- \*\*Category Pill:\*\* `rgba(0,0,0,0.06) 0px 2px 8px 0px`

\- \*\*Carousel Arrow:\*\* `rgba(0,0,0,0.12) 0px 4px 24px 0px`

\- \*\*Cookie Button:\*\* `rgba(0,0,0,0.06) 0px 2px 8px 0px`



\## Imagery



Photography is the dominant visual: full-bleed product photography on white, 1:1 crops, and lifestyle imagery with warm earth-tone palettes (tans, terracotta, sage, ivory). Product images carry their own color — the UI stays achromatic so product hues become the visual variety. Brand logos appear as overlay type on dark or light hero images rather than separate badges. The hero composition arranges product cards as a floating, slightly overlapping constellation above the wordmark. Icons are minimal and mono (ink-black outlined strokes), except for category pill icons which use a single brand color each. No illustrations, no 3D, no gradients on product imagery.



\## Layout



Max-width 1200px centered on a faint #f2f4f5 canvas, with a persistent 64px-wide left sidebar rail of icon-only navigation. The hero is a full-width band where product cards float above a centered violet 'shop' wordmark, with the pill search bar directly below. Category pills sit in a single centered row beneath the search. Content sections (Women, Men, Beauty, Home, Baby \& Toddler) follow as labeled bands, each containing a 4-column card grid of product image tiles or a 2-column hero-and-grid composition. Vertical rhythm is generous: 64–80px between major sections. The footer is a dark band at the page bottom with columnar link groups. Right-side carousel arrows on horizontal product rails indicate scrollable content without pagination dots.



\## Agent Prompt Guide



Quick Color Reference:

\- Background: #f2f4f5 (canvas), #ffffff (surface)

\- Text: #000000 (primary), #787574 (secondary)

\- Border: #ebebeb (hairline)

\- Accent: #5433eb (Shop violet — wordmark + search submit)

\- Shadow tint: rgba(69,36,219,0.34) for the violet button only

\- primary action: #5433eb (filled action)



Example Component Prompts:



1\. Create the hero search bar: 9999px radius pill, #ffffff fill, 1px border in rgba(5,41,77,0.1). Placeholder 'What are you shopping for today?' in 16px GTStandard-MRegular at #787574. Right-aligned circular submit button in #5433eb with a white right-arrow glyph, 48px diameter, shadow 0 4px 24px rgba(69,36,219,0.34). The input padding is 4px vertical, 20px left, reserving 48px right for the submit.



2\. Create a floating brand spotlight card: 28px radius, #ffffff fill, dual shadow (rgba(0,0,0,0.1) 0 4px 6px -1px + rgba(0,0,0,0.1) 0 2px 4px -2px). Top half: 1:1 product image at 20px inner radius filling to the card edges. Below: brand name in 14px GTStandard-MSemibold at #000000 with -0.2px tracking, followed by a 9px star-rating row at -0.5px tracking. No card padding, no border.



3\. Create a category pill chip: 9999px radius, #ffffff fill, 1px #ebebeb border, shadow rgba(0,0,0,0.06) 0 2px 8px. Left: 16px circular category icon in its native color. Right: 16px GTStandard-MRegular label in #000000 with -0.5px tracking. Padding 6px vertical, 6px left, 16px right.



4\. Create a category section header: 20px GTStandard-MSemibold at -1.0px tracking in #000000, followed by a 16px #000000 right-chevron, left-aligned. 24px bottom margin before the 4-column product grid beneath.



5\. Create the left sidebar nav: 64px-wide vertical rail, #ffffff fill, no border. Each item is a 24px #000000 icon centered in a 48px tap target. Active state fills a 20px-radius background of #f2f4f5 behind the icon. Profile avatar at bottom: 32px circle with 1px #ebebeb ring.



\## Typography Hierarchy Rules



The GT Standard family carries its entire hierarchy through three grades (Regular, Medium, Semibold) and negative tracking — never through weight contrast alone. Display and heading sizes use aggressive tracking tightening (-1.0px at 20px, -0.5px at 16px), while micro-labels relax to -0.2px. This creates a visual compression effect: big text pulls tight, small text breathes. Always pair size with the correct family grade: 16px body is Regular, 14px subheadings are Semibold, 12px meta is Medium. Never mix grades within a single text run — a label and its value must use the same family grade for visual coherence.



\## Product Card Composition



Product cards are image-first: the image defines the card's visual identity, and type is a supporting label beneath or overlaid on the image. White product cards stack the image on top with type below in a 12–16px gap. Dark product cards reverse this — brand name in large display type overlays the image at the top-left in white. The card radius (28px) is always larger than the inner image radius (20px) by \~8px, creating a subtle white frame effect even on white-background product images. Never crop a product image to the card's exact rounded shape — the inner 20px radius provides a visible white border that separates the product from the card edge.



\## Similar Brands



\- \*\*Instagram Shopping\*\* — Same white-canvas product discovery model with image-first cards and minimal chrome around merchandise

\- \*\*Pinterest\*\* — Floating rounded product tiles, soft shadows, and a browseable constellation layout over a centered search affordance

\- \*\*SSENSE\*\* — Large-format product imagery in heavily-rounded cards, compact 16px body type, and a single restrained accent color

\- \*\*Apple Shop\*\* — Generous 20–28px radii across all interactive surfaces and pill-shaped controls on a white canvas

\- \*\*Faire\*\* — Product-first discovery with elevated floating image cards, tight negative tracking on body type, and warm-neutral palette



\## Quick Start



\### CSS Custom Properties



```css

:root {

&#x20; /\* Colors \*/

&#x20; --color-canvas-mist: #f2f4f5;

&#x20; --color-pure-white: #ffffff;

&#x20; --color-ink-black: #000000;

&#x20; --color-faint-border: #ebebeb;

&#x20; --color-muted-gray: #787574;

&#x20; --color-cool-stone: #cccccc;

&#x20; --color-warm-fog: #acb0aa;

&#x20; --color-shop-violet: #5433eb;

&#x20; --color-violet-wash: #c0b5f3;

&#x20; --color-slate-ink: #332f2d;

&#x20; --color-ash-veil: #665a54;



&#x20; /\* Typography — Font Families \*/

&#x20; --font-gt-standard: 'GT Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

&#x20; --font-shopify-sans: 'Shopify Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;



&#x20; /\* Typography — Scale \*/

&#x20; --text-caption: 11px;

&#x20; --leading-caption: 1.33;

&#x20; --text-body-sm: 12px;

&#x20; --leading-body-sm: 1.33;

&#x20; --text-body: 14px;

&#x20; --leading-body: 1.33;

&#x20; --text-body-lg: 16px;

&#x20; --leading-body-lg: 1.33;



&#x20; /\* Typography — Weights \*/

&#x20; --font-weight-regular: 400;

&#x20; --font-weight-bold: 700;



&#x20; /\* Spacing \*/

&#x20; --spacing-4: 4px;

&#x20; --spacing-6: 6px;

&#x20; --spacing-8: 8px;

&#x20; --spacing-10: 10px;

&#x20; --spacing-11: 11px;

&#x20; --spacing-12: 12px;

&#x20; --spacing-16: 16px;

&#x20; --spacing-20: 20px;

&#x20; --spacing-24: 24px;

&#x20; --spacing-32: 32px;

&#x20; --spacing-38: 38px;

&#x20; --spacing-40: 40px;

&#x20; --spacing-48: 48px;

&#x20; --spacing-64: 64px;



&#x20; /\* Layout \*/

&#x20; --page-max-width: 1200px;

&#x20; --section-gap: 64px;

&#x20; --card-padding: 0px;

&#x20; --element-gap: 12px;



&#x20; /\* Border Radius \*/

&#x20; --radius-md: 4px;

&#x20; --radius-lg: 8px;

&#x20; --radius-xl: 11.4046px;

&#x20; --radius-2xl: 17.1064px;

&#x20; --radius-2xl-2: 20px;

&#x20; --radius-2xl-3: 22.8092px;

&#x20; --radius-3xl: 28px;

&#x20; --radius-3xl-2: 32px;

&#x20; --radius-full: 9999px;



&#x20; /\* Named Radii \*/

&#x20; --radius-cards: 28px;

&#x20; --radius-chips: 9999px;

&#x20; --radius-pills: 20px;

&#x20; --radius-inputs: 9999px;

&#x20; --radius-search: 9999px;

&#x20; --radius-buttons: 9999px;



&#x20; /\* Shadows \*/

&#x20; --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 8px 0px;

&#x20; --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;

&#x20; --shadow-lg: rgba(0, 0, 0, 0.12) 0px 4px 24px 0px;

&#x20; --shadow-lg-2: rgba(69, 36, 219, 0.34) 0px 4px 24px 0px;



&#x20; /\* Surfaces \*/

&#x20; --surface-canvas: #f2f4f5;

&#x20; --surface-surface: #ffffff;

&#x20; --surface-elevated-card: #ffffff;

&#x20; --surface-accent-product-image: #000000;

}

```



\### Tailwind v4



```css

@theme {

&#x20; /\* Colors \*/

&#x20; --color-canvas-mist: #f2f4f5;

&#x20; --color-pure-white: #ffffff;

&#x20; --color-ink-black: #000000;

&#x20; --color-faint-border: #ebebeb;

&#x20; --color-muted-gray: #787574;

&#x20; --color-cool-stone: #cccccc;

&#x20; --color-warm-fog: #acb0aa;

&#x20; --color-shop-violet: #5433eb;

&#x20; --color-violet-wash: #c0b5f3;

&#x20; --color-slate-ink: #332f2d;

&#x20; --color-ash-veil: #665a54;



&#x20; /\* Typography \*/

&#x20; --font-gt-standard: 'GT Standard', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

&#x20; --font-shopify-sans: 'Shopify Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;



&#x20; /\* Typography — Scale \*/

&#x20; --text-caption: 11px;

&#x20; --leading-caption: 1.33;

&#x20; --text-body-sm: 12px;

&#x20; --leading-body-sm: 1.33;

&#x20; --text-body: 14px;

&#x20; --leading-body: 1.33;

&#x20; --text-body-lg: 16px;

&#x20; --leading-body-lg: 1.33;



&#x20; /\* Spacing \*/

&#x20; --spacing-4: 4px;

&#x20; --spacing-6: 6px;

&#x20; --spacing-8: 8px;

&#x20; --spacing-10: 10px;

&#x20; --spacing-11: 11px;

&#x20; --spacing-12: 12px;

&#x20; --spacing-16: 16px;

&#x20; --spacing-20: 20px;

&#x20; --spacing-24: 24px;

&#x20; --spacing-32: 32px;

&#x20; --spacing-38: 38px;

&#x20; --spacing-40: 40px;

&#x20; --spacing-48: 48px;

&#x20; --spacing-64: 64px;



&#x20; /\* Border Radius \*/

&#x20; --radius-md: 4px;

&#x20; --radius-lg: 8px;

&#x20; --radius-xl: 11.4046px;

&#x20; --radius-2xl: 17.1064px;

&#x20; --radius-2xl-2: 20px;

&#x20; --radius-2xl-3: 22.8092px;

&#x20; --radius-3xl: 28px;

&#x20; --radius-3xl-2: 32px;

&#x20; --radius-full: 9999px;



&#x20; /\* Shadows \*/

&#x20; --shadow-sm: rgba(0, 0, 0, 0.06) 0px 2px 8px 0px;

&#x20; --shadow-sm-2: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;

&#x20; --shadow-lg: rgba(0, 0, 0, 0.12) 0px 4px 24px 0px;

&#x20; --shadow-lg-2: rgba(69, 36, 219, 0.34) 0px 4px 24px 0px;

}

```



\# Oakâme — Style Reference

> Sunlit Provençal atelier carved in warm stone



\*\*Theme:\*\* light



Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.



Oakâme operates as a sun-soaked Provençal atelier: a near-monochromatic warm-stone canvas (#f6f1eb) carrying deep walnut-brown ink (#403a34) and anchored by monumental display typography from the custom BwGradual face. The interface is deliberately quiet — no shadows, no gradients, no decorative color — letting reclaimed-oak furniture photography carry the entire visual weight. The signature rhythm comes from extreme type scale jumps: tiny tracked-out uppercase labels (10–12px) and ear-shattering display words (120–250px) share a page with almost no intermediate steps, producing a gallery-catalog tension between whisper and shout. Components stay architectural: hairline borders, pill-shaped controls, 8–20px padding, and a single 20px grid gutter. The system reads as a luxury furniture editorial — every screen is a spread.



\## Tokens — Colors



| Name | Value | Token | Role |

|------|-------|-------|------|

| Walnut Ink | `#403a34` | `--color-walnut-ink` | Neutral button treatment for secondary actions and selected controls. |

| Linen Canvas | `#f6f1eb` | `--color-linen-canvas` | Page background, card surface, button fill on light controls, image overlays. Warm cream tone — not pure white — that gives the whole interface its Mediterranean-stone atmosphere |

| Charcoal Note | `#333333` | `--color-charcoal-note` | Secondary body text and subdued copy where Walnut Ink is reserved for headings and UI. Pairs at 11.3:1 against the canvas for AAA-level reading |

| Slate Whisper | `#555555` | `--color-slate-whisper` | Tertiary helper text, metadata, and desaturated captions. The lightest readable neutral, sitting at 6.6:1 on the canvas |



\## Tokens — Typography



\### BwGradual — Sole typeface across the entire system — no secondary face. BwGradual is a contemporary geometric sans with wide proportions and a slightly humanist warmth that prevents the minimalist layout from feeling cold. Weight 400 handles body and most headings; weight 500 carries emphasized inline text; weight 700 anchors the largest display sizes. The most distinctive choice is the scale: 10px tracked-out labels and 120–250px display words coexist on the same page, bypassing 24–32px entirely. · `--font-bwgradual`

\- \*\*Substitute:\*\* Neue Haas Grotesk Display, Inter (with `cv11`, `ss01` features), or Söhne

\- \*\*Weights:\*\* 400, 500, 700

\- \*\*Sizes:\*\* 10, 12, 18, 20, 40, 50, 60, 120, 180, 250

\- \*\*Line height:\*\* 1.10–1.50

\- \*\*Letter spacing:\*\* Tight tracking on display: -0.056em at 120px+. Near-zero on body: -0.004em at 18–20px. Wide tracking on small uppercase labels: +0.083em to +0.100em at 10–12px.

\- \*\*OpenType features:\*\* `"ss01" on, "cv11" on, "tnum" on`

\- \*\*Role:\*\* Sole typeface across the entire system — no secondary face. BwGradual is a contemporary geometric sans with wide proportions and a slightly humanist warmth that prevents the minimalist layout from feeling cold. Weight 400 handles body and most headings; weight 500 carries emphasized inline text; weight 700 anchors the largest display sizes. The most distinctive choice is the scale: 10px tracked-out labels and 120–250px display words coexist on the same page, bypassing 24–32px entirely.



\### Type Scale



| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |

|------|--------|--------|------|-------------|----------------|-------|

| label | — | — | 10px | 1.3 | 1px | `--text-label` |

| caption | — | — | 12px | 1.3 | 0.83px | `--text-caption` |

| body-sm | — | — | 18px | 1.5 | -0.07px | `--text-body-sm` |

| body | — | — | 20px | 1.4 | -0.08px | `--text-body` |

| heading-sm | — | — | 40px | 1.25 | -2.24px | `--text-heading-sm` |

| heading | — | — | 50px | 1.24 | -2.8px | `--text-heading` |

| heading-lg | — | — | 60px | 1.2 | -3.36px | `--text-heading-lg` |

| display | — | — | 120px | 1.1 | -6.72px | `--text-display` |

| display-xl | — | — | 180px | 1.1 | -10.08px | `--text-display-xl` |

| display-hero | — | — | 250px | 1.1 | -14px | `--text-display-hero` |



\## Tokens — Spacing \& Shapes



\*\*Base unit:\*\* 4px



\*\*Density:\*\* comfortable



\### Spacing Scale



| Name | Value | Token |

|------|-------|-------|

| 4 | 4px | `--spacing-4` |

| 8 | 8px | `--spacing-8` |

| 20 | 20px | `--spacing-20` |

| 40 | 40px | `--spacing-40` |

| 68 | 68px | `--spacing-68` |



\### Border Radius



| Element | Value |

|---------|-------|

| tags | 9999px |

| cards | 0px |

| images | 0px |

| buttons | 0px |

| pillButtons | 9999px |



\### Layout



\- \*\*Section gap:\*\* 120px

\- \*\*Card padding:\*\* 0px

\- \*\*Element gap:\*\* 20px



\## Components



\### Top Navigation Bar

\*\*Role:\*\* Primary site navigation



Full-bleed horizontal bar at 60–80px height, sitting on the Linen Canvas. Left side: wordmark 'oakâme' at 18px BwGradual 500 in Walnut Ink, underlined by a single hairline. Center: 'PRODUCTS' label with a small dropdown caret. Right: cluster of text-link nav items (EN STOCK, NOTRE CONCEPT, LOOKBOOK, ESPACE PRO) in 12px uppercase BwGradual 400 with +0.083em tracking, plus an account icon and a cart icon with numeric badge. All links separated by 20–30px column-gap. No background fill, no border, no shadow — the bar is defined by its typography and the bottom hairline divider.



\### Pill Navigation Button

\*\*Role:\*\* Lightweight nav/filter action



Inline text link wrapped in a 1px Walnut Ink border, fully rounded (9999px radius). Padding 8px 20px. Label in 12px BwGradual 500, uppercase, +0.083em letter-spacing, Walnut Ink. Background stays Linen Canvas (no fill). Used for 'NOTRE CONCEPT' and similar conceptual links. Hover state: Walnut Ink fill with Linen Canvas text — an exact color inversion.



\### Filled Action Button

\*\*Role:\*\* Primary conversion control



Solid Walnut Ink (#403a34) background, Linen Canvas text. 0px corner radius (square), 12px 24px padding. Label in 12px BwGradual 500, uppercase, +0.083em tracking. The button's weight comes from its dark fill against the otherwise pale page — it reads as 'pressed' rather than friendly. One filled button per view maximum.



\### Product Category Card

\*\*Role:\*\* Category entry tile in 4-column grid



Square aspect ratio, 0px radius, 1px Walnut Ink border, 20px gutters between cards. No padding inside — the photographic content bleeds to the edges. The card is defined entirely by its frame and image; no overlay, no text-on-image. Used in the NOS CATÉGORIES section.



\### Hero Thumbnail Strip

\*\*Role:\*\* Product image quick-nav at hero bottom-right



Horizontal row of 4 small landscape thumbnails (\~140×90px each) tucked into the bottom-right of the hero canvas, 20px gap, 0px radius. The active thumbnail carries a 1px Walnut Ink border; inactive thumbnails are borderless. Tapping swaps the main hero image. No labels on the thumbnails.



\### Hero Display Title

\*\*Role:\*\* Bottom-left product name overlay



Product name set in BwGradual 400 at 120–250px, line-height 1.10, letter-spacing -0.056em, in Linen Canvas against the dark photo. Above the title: a 10px tracked-out label (e.g. 'CANAPÉ') in the same color, +0.100em letter-spacing, uppercase. The display word itself is not bolded — its size alone does the work.



\### Section Display Heading

\*\*Role:\*\* Full-bleed uppercase section opener



Multi-line heading at 50–60px BwGradual 500, uppercase, letter-spacing -0.056em, Walnut Ink on Linen Canvas. Line-height 1.20–1.24 so the lines lock tight. May span full viewport width and wrap to 3–4 lines — the wall of text is intentional, not paragraph copy. Paired with a 10–12px tracked-out eyebrow label above.



\### Eyebrow Label

\*\*Role:\*\* Category or section preface



10–12px BwGradual 500, uppercase, +0.083em to +0.100em letter-spacing, Walnut Ink. Sets the museum-label tone used above every product name and section opener.



\### Asymmetric Image-Text Split

\*\*Role:\*\* Editorial body section pattern



Two-column layout: left column holds a small headline-right-aligned label (e.g. 'QUALITÉ SUPÉRIÈRE ET DURABILITÉ') at 18–20px, right column holds body copy at 18–20px BwGradual 400 in Charcoal Note, 1.50 line-height. Photo bleeds in below or beside. Generous 60–120px vertical breathing room between the heading block and the split.



\### Body Copy Block

\*\*Role:\*\* Long-form descriptive text



18–20px BwGradual 400, Charcoal Note (#333333) or Walnut Ink, line-height 1.50, letter-spacing -0.004em. Maximum measure \~50ch. Uppercase used sparingly for short impact phrases; body stays in sentence case.



\### Product Detail Page

\*\*Role:\*\* Product information layout



Hero is a single full-bleed lifestyle photograph (100vw, \~80vh) with the Hero Display Title bottom-left and the Hero Thumbnail Strip bottom-right. No additional chrome, no floating panels, no overlays — the photograph is the entire product page above the fold.



\### Hairline Divider

\*\*Role:\*\* Section separator



1px solid Walnut Ink horizontal rule, full-bleed or constrained to content width. The only visual divider used between sections — replaces cards, shadows, and background changes.



\### Icon (Nav)

\*\*Role:\*\* Account and cart icons in top bar



Outline-style icons at 20px, 1px stroke weight, Walnut Ink. The cart icon is paired with a 12px numeric badge in a Walnut Ink circle (16px diameter) with Linen Canvas text.



\## Do's and Don'ts



\### Do

\- Use Linen Canvas (#f6f1eb) as the only background. Never introduce a second surface color or a white card.

\- Set all borders to 1px solid Walnut Ink (#403a34). No border-radius on cards, images, or content blocks — 0px only.

\- Use pill radius (9999px) exclusively for buttons, tags, and the cart badge. Everything else is square.

\- Reserve display sizes (120–250px) for hero product names and section openers. Never apply them to body copy or inline links.

\- Apply +0.083em to +0.100em letter-spacing on every 10–12px uppercase label. Tighten to -0.056em on anything above 100px.

\- Default body text to 18–20px BwGradual 400 in Walnut Ink, line-height 1.50. Go down to 12px only for tracked-out labels.

\- Separate sections with a full-width 1px Walnut Ink hairline — never with background color changes, cards, or shadows.



\### Don't

\- Don't introduce a chromatic accent color, gradient, or shadow anywhere in the system. The palette is two colors plus charcoal variants.

\- Don't set body text below 18px. Anything smaller must be uppercase and tracked-out, not regular running copy.

\- Don't add border-radius to images, category cards, or section blocks. Square edges are the system.

\- Don't mix two different dark text colors in the same paragraph. Choose Walnut Ink for headings, Charcoal Note for body, and don't alternate.

\- Don't place more than one filled Walnut Ink button per viewport. Other actions must be pill-outlined or text-only.

\- Don't use intermediate type sizes (24, 28, 32, 36px). The scale jumps from 20 to 40 — anything in between breaks the editorial tension.

\- Don't overlay text, badges, or UI on top of lifestyle photography. Only the hero display title and thumbnail strip are allowed in the image area.



\## Surfaces



| Level | Name | Value | Purpose |

|-------|------|-------|---------|

| 0 | Linen Canvas | `#f6f1eb` | Page background — the warm cream that fills every section between images |

| 1 | Card Surface | `#f6f1eb` | Category tiles and content blocks sit on the same canvas tone, separated only by hairline 1px Walnut Ink borders rather than elevated fill |



\## Elevation



The system is deliberately shadowless. Depth is communicated exclusively through 1px Walnut Ink borders and 20px column gaps — never through box-shadow, blur, or fill contrast. This is a conscious choice: reclaimed-oak furniture is a tactile, material-forward product, and digital elevation would undermine the physicality the brand sells. The flat treatment also flattens hierarchy between UI and photography, letting the images sit at the same depth as the chrome.



\## Imagery



Imagery is the entire product: large-scale, full-bleed Mediterranean outdoor lifestyle photography showing reclaimed-oak furniture on warm stone terraces, olive groves, and sunlit Provençal architecture. Tonal treatment is warm and slightly desaturated — the photos read as late-afternoon golden hour, never bright midday. Editorial crops dominate: sofas anchored against arches, tables pushed against horizon lines, no people, no clutter, no staged domesticity. Category tiles use tighter interior product shots on neutral plaster walls with single hard shadow lines. No illustrations, no 3D renders, no icons-as-art. Image treatment is unmasked and unretouched — natural grain, natural light, natural stone. The photographs carry the brand's warmth; the UI exists to frame them.



\## Layout



Full-bleed page model with no max-width container on the primary content axis. The first screen is a 100vw × \~80vh hero photograph with a bottom-left display word and bottom-right thumbnail strip. Below the fold, sections use a centered max-width (\~1400px) with 20–30px page padding for text and category content, but imagery continues to bleed edge-to-edge. The editorial rhythm alternates: giant display heading band → asymmetric two-column image+text block → 4-column category grid → full-bleed lifestyle photograph, each separated by a single 1px hairline rather than color or elevation changes. Vertical section gaps run 60–120px. Navigation is a single thin top bar — no sticky header, no sidebar, no mega-menu. Content density is sparse and gallery-like, not catalog-like.



\## Agent Prompt Guide



\*\*Quick Color Reference\*\*

\- text: #403a34 (Walnut Ink)

\- background: #f6f1eb (Linen Canvas)

\- secondary text: #333333 (Charcoal Note)

\- border: 1px solid #403a34

\- accent: none — system is monochromatic

\- primary action: #403a34 (filled action)



\*\*Example Component Prompts\*\*



1\. \*\*Hero with Display Title\*\*

Full-viewport (100vw × 80vh) lifestyle photograph as background. Bottom-left overlay: a 10px BwGradual 500 uppercase label in Linen Canvas with +0.100em letter-spacing (e.g. 'CANAPÉ'), then below it a 120–250px BwGradual 400 product name in Linen Canvas, letter-spacing -0.056em, line-height 1.10. Bottom-right: a horizontal row of 4 small thumbnails (140×90px, 0px radius, 20px gap) with the first thumbnail carrying a 1px Linen Canvas border.



2\. \*\*Section Display Heading Block\*\*

Linen Canvas background. A 10px BwGradual 500 uppercase eyebrow label in Walnut Ink with +0.100em tracking, then a 50–60px BwGradual 500 uppercase heading in Walnut Ink, letter-spacing -0.056em, line-height 1.20, spanning the full content width and wrapping over 3–4 lines. 120px vertical gap below before the next block.



3\. \*\*Product Category Grid\*\*

Linen Canvas background. 4-column grid, 20px column-gap and row-gap, 0px radius, 1px Walnut Ink border on each tile. Each tile is a square photograph with no overlay text. Below the grid, a 1px Walnut Ink full-width hairline divider.



4\. \*\*Outlined Pill Button\*\*

1px Walnut Ink border, 9999px radius, 8px 20px padding. Label: 12px BwGradual 500, uppercase, +0.083em letter-spacing, Walnut Ink on Linen Canvas. No background fill. Hover inverts: Walnut Ink fill, Linen Canvas text.



5\. \*\*Asymmetric Image-Text Split\*\*

Two-column layout on Linen Canvas. Left column: a 18–20px BwGradual 500 right-aligned label in Walnut Ink. Right column: 18–20px BwGradual 400 body copy in Charcoal Note, line-height 1.50, max-width \~50ch. Below or beside, a full-bleed Walnut Ink-bordered photograph at 0px radius. 60px gap between heading block and split.



\## Type Scale Philosophy



The scale is deliberately bimodal. There is no comfortable middle ground between the 10–12px tracked-out labels and the 120–250px display words. This forces every element to commit to being either a museum label or a wall-sized statement — there are no 'subtle headings'. An AI agent should not interpolate intermediate sizes like 24, 28, 32, or 36px; instead, choose the nearest scale step and let the type-size contrast carry the hierarchy.



\## Photography Rules



Every photograph should be warm-toned, naturally lit, and shot outdoors or against a plaster/stone interior. Never use pure white studio backgrounds — the entire catalog lives in golden-hour Provençal light. Avoid people, avoid clutter, avoid styled domesticity. The object against texture (stone, olive grove, aged wall) is the only acceptable composition.



\## Similar Brands



\- \*\*Maison du Monde\*\* — Same warm-neutral canvas and monumental editorial display typography applied to a furniture catalog — though Oakâme's restraint and monochromatic palette are far more severe.

\- \*\*Aesop\*\* — Identical discipline: a single warm neutral background, one dark text color, no shadows, and oversized serif-adjacent sans typography carrying the entire brand voice.

\- \*\*The Row\*\* — Same gallery-editorial pattern — hairline borders, no decorative chrome, full-bleed photography, and tracking-out uppercase labels under monumental product names.

\- \*\*Menu Space (menu.space)\*\* — Shares the hairline-border + full-bleed-photo + tracked-out-label structure for design-forward brands, though Oakâme is warmer and more material-driven.

\- \*\*Cereal magazine\*\* — Same sun-washed desaturated photography, generous whitespace, and tall thin sans-serif display type — the editorial mood that anchors Oakâme's interface.



\## Quick Start



\### CSS Custom Properties



```css

:root {

&#x20; /\* Colors \*/

&#x20; --color-walnut-ink: #403a34;

&#x20; --color-linen-canvas: #f6f1eb;

&#x20; --color-charcoal-note: #333333;

&#x20; --color-slate-whisper: #555555;



&#x20; /\* Typography — Font Families \*/

&#x20; --font-bwgradual: 'BwGradual', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;



&#x20; /\* Typography — Scale \*/

&#x20; --text-label: 10px;

&#x20; --leading-label: 1.3;

&#x20; --tracking-label: 1px;

&#x20; --text-caption: 12px;

&#x20; --leading-caption: 1.3;

&#x20; --tracking-caption: 0.83px;

&#x20; --text-body-sm: 18px;

&#x20; --leading-body-sm: 1.5;

&#x20; --tracking-body-sm: -0.07px;

&#x20; --text-body: 20px;

&#x20; --leading-body: 1.4;

&#x20; --tracking-body: -0.08px;

&#x20; --text-heading-sm: 40px;

&#x20; --leading-heading-sm: 1.25;

&#x20; --tracking-heading-sm: -2.24px;

&#x20; --text-heading: 50px;

&#x20; --leading-heading: 1.24;

&#x20; --tracking-heading: -2.8px;

&#x20; --text-heading-lg: 60px;

&#x20; --leading-heading-lg: 1.2;

&#x20; --tracking-heading-lg: -3.36px;

&#x20; --text-display: 120px;

&#x20; --leading-display: 1.1;

&#x20; --tracking-display: -6.72px;

&#x20; --text-display-xl: 180px;

&#x20; --leading-display-xl: 1.1;

&#x20; --tracking-display-xl: -10.08px;

&#x20; --text-display-hero: 250px;

&#x20; --leading-display-hero: 1.1;

&#x20; --tracking-display-hero: -14px;



&#x20; /\* Typography — Weights \*/

&#x20; --font-weight-regular: 400;

&#x20; --font-weight-medium: 500;

&#x20; --font-weight-bold: 700;



&#x20; /\* Spacing \*/

&#x20; --spacing-unit: 4px;

&#x20; --spacing-4: 4px;

&#x20; --spacing-8: 8px;

&#x20; --spacing-20: 20px;

&#x20; --spacing-40: 40px;

&#x20; --spacing-68: 68px;



&#x20; /\* Layout \*/

&#x20; --section-gap: 120px;

&#x20; --card-padding: 0px;

&#x20; --element-gap: 20px;



&#x20; /\* Named Radii \*/

&#x20; --radius-tags: 9999px;

&#x20; --radius-cards: 0px;

&#x20; --radius-images: 0px;

&#x20; --radius-buttons: 0px;

&#x20; --radius-pillbuttons: 9999px;



&#x20; /\* Surfaces \*/

&#x20; --surface-linen-canvas: #f6f1eb;

&#x20; --surface-card-surface: #f6f1eb;

}

```



\### Tailwind v4



```css

@theme {

&#x20; /\* Colors \*/

&#x20; --color-walnut-ink: #403a34;

&#x20; --color-linen-canvas: #f6f1eb;

&#x20; --color-charcoal-note: #333333;

&#x20; --color-slate-whisper: #555555;



&#x20; /\* Typography \*/

&#x20; --font-bwgradual: 'BwGradual', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;



&#x20; /\* Typography — Scale \*/

&#x20; --text-label: 10px;

&#x20; --leading-label: 1.3;

&#x20; --tracking-label: 1px;

&#x20; --text-caption: 12px;

&#x20; --leading-caption: 1.3;

&#x20; --tracking-caption: 0.83px;

&#x20; --text-body-sm: 18px;

&#x20; --leading-body-sm: 1.5;

&#x20; --tracking-body-sm: -0.07px;

&#x20; --text-body: 20px;

&#x20; --leading-body: 1.4;

&#x20; --tracking-body: -0.08px;

&#x20; --text-heading-sm: 40px;

&#x20; --leading-heading-sm: 1.25;

&#x20; --tracking-heading-sm: -2.24px;

&#x20; --text-heading: 50px;

&#x20; --leading-heading: 1.24;

&#x20; --tracking-heading: -2.8px;

&#x20; --text-heading-lg: 60px;

&#x20; --leading-heading-lg: 1.2;

&#x20; --tracking-heading-lg: -3.36px;

&#x20; --text-display: 120px;

&#x20; --leading-display: 1.1;

&#x20; --tracking-display: -6.72px;

&#x20; --text-display-xl: 180px;

&#x20; --leading-display-xl: 1.1;

&#x20; --tracking-display-xl: -10.08px;

&#x20; --text-display-hero: 250px;

&#x20; --leading-display-hero: 1.1;

&#x20; --tracking-display-hero: -14px;



&#x20; /\* Spacing \*/

&#x20; --spacing-4: 4px;

&#x20; --spacing-8: 8px;

&#x20; --spacing-20: 20px;

&#x20; --spacing-40: 40px;

&#x20; --spacing-68: 68px;

}

```







