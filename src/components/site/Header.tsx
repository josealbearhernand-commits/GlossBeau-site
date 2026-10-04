"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const links = [
  // Hair care has no single Shopify collection: /hair-care lists the hair collections. The rest are exact handles.
  { label: "Hair care", href: "/hair-care" },
  { label: "Nails", href: "/collections/nails" },
  { label: "Barber", href: "/collections/barber" },
  { label: "Tools", href: "/collections/tools-accessories" },
  { label: "Brands", href: "/brands" },
  { label: "Sale", href: "/collections/sales" },
];

/** Real product types from the store; the search placeholder rotates through them. */
const searchTerms = [
  "keratin treatments",
  "gel polish",
  "clippers",
  "argan oil serum",
  "dip powder",
  "round brushes",
  "hair dryers",
  "styling gel",
  "leave-in conditioner",
  "acrylic powder",
];

/**
 * Peak Design header, measured at 1440px: a 40px announcement strip, then an 80px white nav row
 * with a hairline underneath. Sticky with `top: -40px`, so the strip scrolls away and the nav
 * row stays. At 390px the nav row is 64px: menu + search on the left, logo centred, account + cart.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(0);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTerm((t) => (t + 1) % searchTerms.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  const showHint = !query && !focused;

  const search = (
    <form
      role="search"
      action="/search"
      className="relative flex h-12 w-full items-center"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        Search
      </label>
      <Icon name="search" size={16} className="pointer-events-none absolute left-[18px] text-ink" />
      <input
        id="site-search"
        name="q"
        type="search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={`Search for ${searchTerms[term]}`}
        className="h-12 w-full rounded-[4px] border border-stone bg-canvas pl-[38px] pr-3 text-[16px] text-ink outline-none transition-colors focus:border-ink focus:bg-surface"
      />
      {showHint && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-3 left-[38px] right-3 flex items-center gap-1 overflow-hidden text-[16px] leading-6 text-muted">
          <span>Search for</span>
          <span className="relative h-6 flex-1 overflow-hidden">
            {searchTerms.map((t, i) => (
              <span
                key={t}
                className="absolute inset-x-0 top-0 whitespace-nowrap transition-[transform,opacity] duration-500 ease-out"
                style={{
                  transform: `translateY(${i === term ? 0 : i === (term + searchTerms.length - 1) % searchTerms.length ? -24 : 24}px)`,
                  opacity: i === term ? 1 : 0,
                }}
              >
                {t}
              </span>
            ))}
          </span>
        </div>
      )}
    </form>
  );

  return (
    <header className="sticky top-[-40px] z-40 bg-surface">
      {/* Announcement strip: 40px, like peakdesign.com's "Our mission / Find a store" strip */}
      <div className="flex h-10 items-center justify-center gap-6 whitespace-nowrap bg-surface px-4 text-[14px] uppercase tracking-[0.04em] text-ink lg:justify-between lg:px-10">
        <span className="shrink-0">Free US shipping on orders over $75</span>
        <a href="#pro" className="hidden shrink-0 text-right hover:underline hover:underline-offset-4 lg:block">
          Pro pricing for licensed stylists
        </a>
      </div>

      {/* Nav row: 80px desktop, 64px mobile */}
      <div className="flex h-16 items-center border-b border-faint px-2 lg:h-20 lg:px-10">
        <button
          type="button"
          className="grid size-14 place-items-center text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
        <button type="button" className="grid size-14 place-items-center text-ink lg:hidden" aria-label="Search" onClick={() => setOpen(true)}>
          <Icon name="search" size={22} />
        </button>

        <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
          <Logo size={22} href="/" />
        </div>

        <nav className="ml-10 hidden h-full items-center lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className="flex h-full items-center px-4 text-[16px] text-ink transition-colors hover:text-muted"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mx-6 hidden w-full min-w-0 max-w-[412px] shrink lg:block xl:mx-10 xl:ml-auto">{search}</div>

        <div className="flex h-full items-center lg:ml-auto xl:ml-0">
          <Link href="#" className="hidden h-full items-center px-4 text-[16px] text-ink hover:text-muted lg:flex">
            Support
          </Link>
          <Link href="#" aria-label="Account" className="grid h-full w-14 place-items-center text-ink hover:text-muted">
            <Icon name="user" size={24} />
          </Link>
          <button type="button" aria-label="Cart, 0 items" className="grid h-full w-14 place-items-center text-ink hover:text-muted">
            <Icon name="bag" size={24} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[104px] z-40 overflow-y-auto bg-surface px-5 pb-10 pt-4 lg:hidden">
          {search}
          <nav aria-label="Main" className="mt-4">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex h-14 items-center justify-between border-b border-faint text-[18px] font-medium text-ink"
                  >
                    {l.label}
                    <Icon name="arrowRight" size={20} />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#" onClick={() => setOpen(false)} className="flex h-14 items-center text-[16px] text-muted">
                  Support
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
