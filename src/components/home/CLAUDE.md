# Homepage hero – notes

- Hero: square-edged, edge to edge, 600px tall on desktop (max 70% of the screen height) and 420px on phones.
  7 slides in `src/data/catalog.ts` `heroSlides`: 6 product clips (1112×834 approved Higgsfield takes in
  `public/videos/`, 1600×1200 posters in `public/stills/`) + the New Adara campaign portrait
  (`public/images/new-adara-gloss-society-wide.jpg`, a 3302×2300 full-resolution crop of the 3302×5331 original;
  its hands are soft in the photo itself). On desktop the 4:3 clips show whole with a blurred copy of the still
  filling the sides, so no bottle is cut. Since 2026-10-05 the New Adara photo does the same on desktop
  (it was magnified ~1.7× by cover), media edges are feathered into the blur (`.hero-media-soft`, `--ar` per slide), and
  the bottom fade (`.hero-fade`, 64/96px) is eased so photos stay crisp. Arrows only: no dots, no link button, no scale/zoom on the slides.
