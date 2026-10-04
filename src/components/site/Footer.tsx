import Link from "next/link";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { EmailForm } from "./EmailForm";

const cols = [
  {
    title: "Support",
    links: [
      ["Shipping and returns", "#"],
      ["Track an order", "#"],
      ["Contact us", "#"],
      ["FAQ", "#"],
    ],
  },
  {
    title: "About",
    links: [
      ["Our story", "#"],
      ["Brands we carry", "/brands"],
      ["Professionals", "/#pro"],
      ["Privacy", "#"],
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
              <h2 className="mb-6 text-[16px] font-semibold uppercase leading-none tracking-[0.02em] lg:text-[24px]">{c.title}</h2>
              <ul className="grid gap-4">
                {c.links.map(([label, href]) => (
                  <li key={label} className="leading-4">
                    <Link href={href} className="text-[14px] leading-[14px] text-ink underline-offset-4 hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div>
          <h2 className="mb-4 text-[24px] font-semibold uppercase leading-[26px] tracking-[0.02em]">Subscribe to newsletter</h2>
          <p className="mb-4 text-[16px] leading-[22px]">Be the first to know about new products, pro deals and restocks.</p>
          <EmailForm
            id="footer-email"
            buttonLabel="Sign me up"
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            inputClassName="h-10 flex-1 bg-surface px-3"
            buttonClassName="pd-btn-sm pd-btn-dark"
          />
        </div>
      </div>

      <div className="container-pd pb-5 lg:pb-16">
        <div className="grid items-center gap-6 border-t border-faint pt-8 text-center lg:grid-cols-3 lg:text-left">
          <ul className="order-3 flex justify-center gap-6 lg:order-1 lg:justify-start">
            <li>
              <Link href="#" className="text-[14px] text-ink hover:underline hover:underline-offset-4">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-[14px] text-ink hover:underline hover:underline-offset-4">
                Terms
              </Link>
            </li>
          </ul>
          <div className="order-1 flex flex-col items-center justify-center gap-4 lg:order-2 lg:flex-row lg:gap-10">
            <Logo size={22} href="/" />
            <p className="text-[16px] leading-5 text-muted">© 2026 GlossBeau.</p>
          </div>
          <div className="order-2 flex justify-center gap-4 lg:order-3 lg:justify-end">
            <a href="#" aria-label="Instagram" className="grid size-10 place-items-center text-ink hover:text-muted">
              <Icon name="instagram" size={24} />
            </a>
            <a href="#" aria-label="TikTok" className="grid size-10 place-items-center text-ink hover:text-muted">
              <Icon name="tiktok" size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
