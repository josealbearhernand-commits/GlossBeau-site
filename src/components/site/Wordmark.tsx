/**
 * Placeholder wordmark until the logo is designed: the name in semibold with a accent dot,
 * the Shop reference's signature. Replace with the SVG logo when it exists.
 */
export function Wordmark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-semibold tracking-[-0.055em] text-ink ${className}`}
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
}
