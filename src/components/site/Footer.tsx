import Link from "next/link";
import { Logo } from "./Logo";
import { EmailForm } from "./EmailForm";
import { site } from "@/config/site";

// Every link goes somewhere real. Pages that do not exist yet (Our story, FAQ, order tracking) are not
// listed; add them here when they are written.
const cols = [
  {
    title: "Support",
    links: [
      ["Shipping and returns", "/policies/refunds"],
      ["Shipping policy", "/policies/shipping"],
      ["Track an order", `mailto:${site.supportEmail}?subject=${encodeURIComponent("Where is my order?")}`],
      ["Contact us", `mailto:${site.supportEmail}`],
    ],
  },
  {
    title: "About",
    links: [
      ["Brands we carry", "/brands"],
      ["Professionals", "/#pro"],
      ["Privacy", "/policies/privacy"],
      ["Terms", "/policies/terms"],
    ],
  },
  {
    title: "Shop",
    links: [
      ["Hair care", "/hair-care"],
      ["Nails", "/collections/nails"],
      ["Barber", "/collections/barber"],
      ["Tools", "/collections/tools-accessories"],
      ["Sale", "/collections/sales"],
    ],
  },
];

/**
 * Footer with peakdesign.com's structure and measurements (1440px): 64px padding, a
 * 737px | 560px grid, three link columns 224px wide with 32px gaps, 24px uppercase headings,
 * 14px links 32px apart, a newsletter form (input 40px + dark button), and a bottom row.
 */
export function Footer() {
  return (
    <footer className="bg-canvas text-ink">
      <div className="container-pd grid gap-12 py-5 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-16 lg:py-16">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:mt-8 lg:grid-cols-[repeat(3,minmax(0,224px))]">
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="mb-6 text-[1rem] font-semibold uppercase leading-none tracking-[0.02em] lg:text-[1.5rem]">{c.title}</h2>
              {/* On phones the rows sit 24px apart and each link carries 12px of vertical padding: a 41px
                  tap area with no overlap, with the 14px/32px desktop rhythm untouched. */}
              <ul className="grid gap-6 lg:gap-4">
                {c.links.map(([label, href]) => (
                  <li key={label} className="leading-4">
                    <Link href={href} className="text-[0.875rem] leading-[0.875rem] text-ink underline-offset-4 hover:underline max-lg:py-3">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div>
          <h2 className="mb-4 text-[1.5rem] font-semibold uppercase leading-[1.625rem] tracking-[0.02em]">Subscribe to newsletter</h2>
          <p className="mb-4 text-[1rem] leading-[1.375rem]">Be the first to know about new products, pro deals and restocks.</p>
          <EmailForm
            id="footer-email"
            buttonLabel="Sign me up"
            subject="Newsletter sign-up"
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            inputClassName="h-10 w-full bg-surface px-3 sm:w-auto sm:flex-1"
            buttonClassName="pd-btn-sm pd-btn-dark"
          />
        </div>
      </div>

      <div className="container-pd pb-5 lg:pb-16">
        <div className="grid items-center gap-6 border-t border-faint pt-8 text-center lg:grid-cols-2 lg:text-left">
          <ul className="order-3 flex justify-center gap-6 lg:order-1 lg:justify-start">
            <li>
              <Link href="/policies/privacy" className="text-[0.875rem] text-ink hover:underline hover:underline-offset-4 max-lg:py-3">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/policies/terms" className="text-[0.875rem] text-ink hover:underline hover:underline-offset-4 max-lg:py-3">
                Terms
              </Link>
            </li>
          </ul>
          <div className="order-1 flex flex-col items-center justify-center gap-4 lg:order-2 lg:flex-row lg:gap-10">
            <Logo size={22} href="/" />
            <p className="text-[1rem] leading-5 text-muted">© {new Date().getFullYear()} {site.brand} · {site.legalName}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
