import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about a product or an order? Send GlossBeau a message and we will reply by e-mail.",
};

/**
 * Contact: breadcrumb and heading, then the form on a white panel (soft shadow + feathered edge, like the
 * brand tiles) beside a short column with the support e-mail and order tracking. Stacks on phones.
 */
export default function ContactPage() {
  return (
    <div className="page pb-24 pt-8 lg:pt-12">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="max-lg:py-3 hover:text-ink">
          Home
        </Link>{" "}
        / Contact us
      </nav>

      <div className="mb-10 max-w-[60ch]">
        <Reveal as="h1" effect="slide" className="t-display text-ink">
          Contact us
        </Reveal>
        <p className="t-lead mt-4 text-ink">Questions about a product, an order or pro pricing? Send us a message and we&apos;ll reply by e-mail.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div className="rounded-[20px] bg-surface p-6 shadow-[var(--shadow-sm),var(--feather)] sm:p-8 lg:p-10">
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-8 lg:pt-4">
          <div>
            <h2 className="t-heading-sm text-ink">E-mail</h2>
            <p className="t-body mt-2 text-ink">
              <a className="link" href={`mailto:${site.supportEmail}`}>
                {site.supportEmail}
              </a>
            </p>
          </div>
          <div>
            <h2 className="t-heading-sm text-ink">Track an order</h2>
            <p className="t-body mt-2 text-ink">
              Sign in with the e-mail you used at checkout to see your orders and tracking.
            </p>
            <a className="link t-body mt-2 inline-block" href={site.orderStatusUrl}>
              Go to order tracking
            </a>
            <p className="t-caption mt-2 text-muted">Orders are handled by our partner, Diamond Pro Salon Supply.</p>
          </div>
          <div>
            <h2 className="t-heading-sm text-ink">Shipping and returns</h2>
            <p className="t-body mt-2 text-ink">
              <Link className="link" href="/policies/shipping">
                Shipping policy
              </Link>{" "}
              ·{" "}
              <Link className="link" href="/policies/refunds">
                Returns and refunds
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
