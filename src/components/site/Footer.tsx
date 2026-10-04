import Link from "next/link";
import { Logo } from "./Logo";
import { EmailForm } from "./EmailForm";
import { site } from "@/config/site";
import { countCollectionProducts } from "@/lib/shopify";

/** The Sale link only shows once the sales collection has this many products. */
const SALE_MIN = 8;

/**
 * Dark footer (same brown as the header): four columns on one top line (logo + tagline, Support, About,
 * Shop), a full-width newsletter row, then the bottom row with the copyright and the policy links. Rows are
 * separated by a 1px line in the header-field brown. Cream text; links are cream at 85% and turn peach on
 * hover. On phones the columns stack in two-column pairs, then the newsletter, then a centred bottom row.
 * All colours are header tokens from globals.css. "Our story" points at the featured block on the homepage
 * (#story) until a story page is written.
 */
export async function Footer() {
  const saleCount = await countCollectionProducts("sales").catch(() => 0);

  const cols: { title: string; links: [string, string][] }[] = [
    {
      title: "Support",
      links: [
        ["Shipping and returns", "/policies/refunds"],
        ["Track an order", `mailto:${site.supportEmail}?subject=${encodeURIComponent("Where is my order?")}`],
        ["Contact us", `mailto:${site.supportEmail}`],
      ],
    },
    {
      title: "About",
      links: [
        ["Our story", "/#story"],
        ["Brands we carry", "/brands"],
        ["Professionals", "/#pro"],
      ],
    },
    {
      title: "Shop",
      links: [
        ["Hair care", "/hair-care"],
        ["Nails", "/collections/nails"],
        ["Barber", "/collections/barber"],
        ["Tools", "/collections/tools-accessories"],
        ...(saleCount >= SALE_MIN ? ([["Sale", "/collections/sales"]] as [string, string][]) : []),
      ],
    },
  ];

  const link = "text-[0.875rem] leading-5 text-header-text/85 transition-colors hover:text-announce-bg max-lg:inline-block max-lg:py-2";

  return (
    <footer className="on-header bg-header-bg text-header-text">
      {/* Top row: logo + tagline and the three link columns, all on the same top line */}
      <div className="container-pd pt-10 lg:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8 lg:pb-16">
          <div className="col-span-2 lg:col-span-1">
            <Logo tone="cream" height={36} href="/" />
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-6 text-header-text/85">
              Salon-grade hair care, nails and barber tools, open to everyone.
            </p>
          </div>
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="mb-4 text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.12em] text-header-text">{c.title}</h2>
              <ul className="grid gap-3">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className={link}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Newsletter row */}
      <div className="border-t border-header-field">
        <div className="container-pd grid gap-6 py-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-12">
          <div>
            <h2 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-header-text">Subscribe to our newsletter</h2>
            <p className="mt-2 text-[1rem] leading-6 text-header-text/85">Be the first to know about new products, pro deals and restocks.</p>
          </div>
          <EmailForm
            id="footer-email"
            buttonLabel="Sign me up"
            subject="Newsletter sign-up"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            inputClassName="header-search h-12 w-full border-header-field-border bg-header-field px-4 text-header-text focus:border-header-text sm:w-auto sm:flex-1"
            buttonClassName="pd-btn-dark h-12 px-6"
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-header-field">
        <div className="container-pd flex flex-col items-center gap-4 py-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <p className="text-[0.875rem] leading-5 text-header-text/85">
            © {new Date().getFullYear()} {site.brand} · {site.legalName}
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {(
              [
                ["Privacy", "/policies/privacy"],
                ["Terms", "/policies/terms"],
                ["Refunds", "/policies/refunds"],
                ["Shipping", "/policies/shipping"],
              ] as [string, string][]
            ).map(([label, href]) => (
              <li key={label}>
                <Link href={href} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
