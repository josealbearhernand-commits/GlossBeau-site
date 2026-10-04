import { Reveal } from "@/components/motion/Reveal";

/**
 * Peak Design section heading: serif 40px / 44px line-height / -0.4px tracking at desktop
 * (24px / 26.4px on phones), followed by a long horizontal rule. Peak literally types "———"
 * after the title; we draw the same 2px line so it stays crisp at every size.
 */
export function SectionHeading({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <Reveal as="h2" effect="slide" id={id} className={`pd-heading flex items-center gap-4 ${className}`}>
      <span>{children}</span>
      <span aria-hidden="true" className="inline-block h-[2px] w-[96px] shrink-0 bg-ink" />
    </Reveal>
  );
}
