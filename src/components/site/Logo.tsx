import Image from "next/image";
import Link from "next/link";

/**
 * THE one logo component: the GlossBeau wordmark from public/brand (SVG, 5219×1020).
 * `tone="dark"` is the brown mark for light backgrounds (under the hero, footer, cards);
 * `tone="cream"` is the cream mark for the dark brown header and panels.
 * `height` is the rendered height in px (width follows the 5.12:1 ratio); `href` wraps it in a link.
 */
const RATIO = 5219 / 1020;

export function Logo({
  tone = "dark",
  height = 22,
  className = "",
  href,
  label = "GlossBeau home",
  priority = false,
}: {
  tone?: "dark" | "cream";
  height?: number;
  className?: string;
  href?: string;
  label?: string;
  priority?: boolean;
}) {
  const width = Math.round(height * RATIO);
  const mark = (
    <Image
      src={`/brand/glossbeau-logo-${tone}.svg`}
      alt="GlossBeau"
      width={width}
      height={height}
      priority={priority}
      className={`block h-auto w-auto ${className}`}
      style={{ height, width }}
    />
  );
  if (!href) return mark;
  return (
    <Link href={href} aria-label={label} className="inline-flex items-center rounded-sm">
      {mark}
    </Link>
  );
}
