import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { EmailForm } from "@/components/site/EmailForm";

/**
 * Copy of Peak Design's "Find a retailer" panel: a light grey panel (64px padding, 48px gap)
 * with eyebrow, 40px serif headline with one italic word, a 16px line and a 53px input;
 * a 16:9 photo on the right. Ours invites licensed professionals to unlock trade pricing.
 */
export function ProPanel() {
  return (
    <section id="pro" className="pd-section container-pd scroll-mt-24">
      <Reveal effect="float" className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 bg-faint p-8 lg:gap-12 lg:p-16">
          <div className="flex flex-col gap-6">
            <p className="pd-eyebrow text-ink">For professionals</p>
            <h2 className="font-serif text-[32px] leading-[35px] tracking-[-0.01em] text-ink lg:text-[40px] lg:leading-[44px]">
              Licensed? Unlock <em className="italic">pro</em> pricing.
            </h2>
            <p className="text-[16px] leading-[22px] text-ink">Stylists, barbers and nail techs get trade pricing.</p>
          </div>
          <EmailForm
            id="pro-email"
            buttonLabel="Apply"
            className="flex flex-col gap-2 sm:flex-row"
            inputClassName="h-[53px] flex-1 bg-faint px-3 py-4"
            buttonClassName="pd-btn-dark h-[53px] px-6"
          />
        </div>
        <div className="relative aspect-[16/9] bg-faint lg:aspect-auto">
          <Image src="/stills/serum-still-1-pump.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </Reveal>
    </section>
  );
}
