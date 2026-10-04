import { Logo } from "@/components/site/Logo";

/**
 * Stands in for a product photo Shopify does not have yet: the same grey photo box every card uses,
 * with a faint wordmark and an honest caption. Never an empty <img src="">.
 */
export function NoPhoto({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="No photo yet"
      className={`product-box flex h-full w-full flex-col items-center justify-center gap-2 ${className}`}
    >
      <Logo tone="dark" height={14} className="opacity-40" />
      <span className="t-caption text-muted">Photo coming soon</span>
    </div>
  );
}
