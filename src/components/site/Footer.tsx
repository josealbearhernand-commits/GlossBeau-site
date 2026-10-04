import Link from "next/link";
import { Icon } from "./Icon";

const cols = [
  {
    title: "Shop",
    links: [
      ["Hair care", "/collections/hair-care"],
      ["Nails", "/collections/nails"],
      ["Barber", "/collections/barber"],
      ["Tools", "/collections/tools"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Shipping and returns", "#"],
      ["Track an order", "#"],
      ["Contact us", "#"],
      ["FAQ", "#"],
    ],
  },
  {
    title: "GlossBeau",
    links: [
      ["Our story", "#"],
      ["Brands we carry", "/#brands"],
      ["Professionals", "#"],
      ["Privacy", "#"],
    ],
  },
];

/** The dark band at the bottom of the page. */
export function Footer() {
  return (
    <footer className="on-dark mt-24 bg-ink text-on-dark">
      <div className="page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <p className="inline-flex items-baseline text-[28px] font-semibold tracking-[-0.055em]">
            glossbeau
            <span aria-hidden="true" className="ml-[2px] inline-block size-1.5 rounded-full bg-accent-wash" />
          </p>
          <p className="t-body-sm max-w-xs text-on-dark/70">
            Salon-grade hair care, nails, barber and styling tools. The brands professionals trust, open to everyone.
          </p>
          <div className="flex gap-2">
            <a href="#" aria-label="Instagram" className="grid size-12 place-items-center rounded-[20px] bg-slate-ink text-on-dark hover:bg-ash">
              <Icon name="instagram" size={22} />
            </a>
            <a href="#" aria-label="TikTok" className="grid size-12 place-items-center rounded-[20px] bg-slate-ink text-on-dark hover:bg-ash">
              <Icon name="tiktok" size={22} />
            </a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="t-ui-sm mb-5">{c.title}</p>
            <ul className="flex flex-col gap-3">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="t-body-sm text-on-dark/70 hover:text-on-dark">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="page flex flex-wrap items-center justify-between gap-4 border-t border-on-dark/15 py-6">
        <p className="t-caption text-on-dark/60">© 2026 GlossBeau. A Diamond Pro Salon Supply store.</p>
        <p className="t-caption text-on-dark/60">glossbeau.com</p>
      </div>
    </footer>
  );
}
