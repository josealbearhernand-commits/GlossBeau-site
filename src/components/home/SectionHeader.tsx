import Link from "next/link";
import { Icon } from "@/components/site/Icon";

/** Shop-style category section header: 20px semibold, tight tracking, chevron; optional link. */
export function SectionHeader({
  title,
  href,
  eyebrow,
  as: Tag = "h2",
}: {
  title: string;
  href?: string;
  eyebrow?: string;
  as?: "h1" | "h2";
}) {
  const inner = (
    <>
      <Tag className="t-heading-sm inline-flex items-center gap-1 text-ink">
        {title}
        {href && <Icon name="caretDown" size={16} className="-rotate-90" />}
      </Tag>
    </>
  );
  return (
    <div className="mb-6 flex flex-col gap-1">
      {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
      {href ? (
        <Link href={href} className="group inline-flex w-fit items-center rounded-full">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
