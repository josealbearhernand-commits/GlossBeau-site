import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Peak Design "What's new" panel, measured at 1440px: full-width dark band with 64px padding; a
 * two-column grid (text | photo). Text column padded 64px: eyebrow, 48px / 52.8px serif headline,
 * one 16px line, and a 48px white button. Photo 649 × 656 with 8px radius. Stacks on phones with
 * the photo on top, like Peak. Dark brown instead of Peak's black.
 */
export function WhatsNew({ image, href, title }: { image: string; href: string; title: string }) {
  return (
    <section className="on-dark bg-slate-ink text-on-dark">
      <div className="container-pd pd-section">
        <div className="grid lg:grid-cols-2">
          <div className="order-last flex items-center py-8 lg:order-none lg:p-16">
            <Reveal effect="float" className="flex max-w-[521px] flex-col gap-6">
              <div className="flex flex-col gap-6">
                <p className="pd-eyebrow">What&apos;s new</p>
                <h2 className="font-serif text-[32px] leading-[35px] tracking-[-0.01em] lg:text-[48px] lg:leading-[53px]">
                  Your next essential just dropped.
                </h2>
                <p className="text-[16px] leading-[22px]">Fresh arrivals from the brands salons trust, now open to everyone.</p>
              </div>
              <div>
                <Link href={href} className="pd-btn pd-btn-lg pd-btn-white">
                  Shop new arrivals
                </Link>
              </div>
            </Reveal>
          </div>
          {/* Photo first on phones (Peak's order), beside the text on desktop. The kit photo has an off-white
              studio background, so it sits whole (contain) on that same colour rather than being cropped. */}
          <Reveal effect="grow" className="relative aspect-[649/656] overflow-hidden rounded-[8px] bg-[#f6f2ef]">
            <Image src={image} alt={title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
