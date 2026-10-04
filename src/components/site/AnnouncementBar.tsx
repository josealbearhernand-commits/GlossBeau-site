import { Icon } from "./Icon";

/** Full-width black band, 48px, like Shop's app banner: one notice, white text, an arrow. */
export function AnnouncementBar() {
  return (
    <a href="#best-sellers" className="flex h-12 items-center justify-center gap-3 bg-ink px-gutter text-on-dark">
      <span className="t-body-sm">Free US shipping on orders over $75</span>
      <span className="t-micro hidden text-on-dark/70 sm:inline">Professional brands, open to everyone</span>
      <Icon name="arrowRight" size={16} />
    </a>
  );
}
