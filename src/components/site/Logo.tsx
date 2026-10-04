import Link from "next/link";

/**
 * THE one logo component. Today it renders the temporary "glossbeau." wordmark; when the real
 * logo is designed, swap the inside of this component (an <Image> or inline SVG) and every
 * place that shows the logo updates: header, footer, and the mark under the hero.
 *
 * `size` is the text size in px; `href` wraps it in a link (omit for a plain mark).
 */
export function Logo({
  size = 22,
  className = "",
  href,
  label = "GlossBeau home",
}: {
  size?: number;
  className?: string;
  href?: string;
  label?: string;
}) {
  const mark = (
    <span
      className={`inline-flex items-baseline whitespace-nowrap font-semibold tracking-[-0.055em] text-ink ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
    >
      glossbeau
      <span
        aria-hidden="true"
        className="ml-[0.08em] inline-block rounded-full bg-accent"
        style={{ width: size * 0.22, height: size * 0.22 }}
      />
    </span>
  );
  if (!href) return mark;
  return (
    <Link href={href} aria-label={label} className="inline-flex items-center rounded-sm">
      {mark}
    </Link>
  );
}
