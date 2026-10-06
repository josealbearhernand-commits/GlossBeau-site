"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { site } from "@/config/site";
import { useCart } from "@/components/cart/CartProvider";

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
 * Dark header on Peak Design's measurements: a 40px peach announcement strip, then an 80px dark brown nav
 * row (64px on phones) with the cream logo, cream links (peach on hover, 2px peach underline on the current
 * page), the search field on a slightly lighter brown, and the cart with a peach count badge. Sticky with
 * `top: -40px`, so the strip scrolls away and the nav row stays. All colours are header tokens in globals.css.
 *
 * The search form is a plain GET to /search (works without JavaScript). The phone menu is a dark panel fixed
 * under the nav row: it closes on Escape and on navigation, moves focus into its search field when it opens
 * and back to the menu button when it closes.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(0);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [panelTop, setPanelTop] = useState(104);
  const pathname = usePathname();
  const { count, setOpen: openCart } = useCart();
  const navRow = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Scroll lock + panel position + focus while the phone menu is open; Escape closes it.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    setPanelTop(navRow.current?.getBoundingClientRect().bottom ?? 104);
    panel.current?.querySelector<HTMLInputElement>("input")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Navigating anywhere closes the menu (state adjusted during render, the React-sanctioned form).
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTerm((t) => (t + 1) % searchTerms.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  const showHint = !query && !focused;

  // One form, rendered twice (desktop row, phone panel) with its own ids so the page never repeats an id.
  const search = (id: string) => (
    <form role="search" action="/search" method="get" className="relative flex h-12 w-full items-center">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <Icon name="search" size={16} className="pointer-events-none absolute left-[18px] text-header-text" />
      <input
        id={id}
        name="q"
        type="search"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={`Search products, for example ${searchTerms[term]}`}
        className="header-search h-12 w-full rounded-[4px] border border-header-field-border bg-header-field pl-[38px] pr-3 text-[1rem] text-header-text outline-none transition-colors focus:border-header-text"
      />
      {showHint && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-3 left-[38px] right-3 flex items-center gap-1 overflow-hidden text-[1rem] leading-6 text-header-text opacity-70">
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

  const iconButton = "grid size-14 place-items-center text-header-text transition-colors hover:text-announce-bg";

  return (
    <header className="on-header sticky top-[-40px] z-40 bg-header-bg text-header-text">
      {/* Announcement strip: 40px, peach, dark brown text */}
      <div className="flex h-10 items-center justify-center gap-6 whitespace-nowrap bg-announce-bg px-4 text-[0.875rem] uppercase tracking-[0.04em] text-announce-text lg:justify-between lg:px-10">
        <span className="shrink-0">Free US shipping on orders over ${site.freeShippingThreshold}</span>
        <a href="#pro" className="hidden shrink-0 text-right hover:underline hover:underline-offset-4 lg:block">
          Pro pricing for licensed stylists
        </a>
      </div>

      {/* Nav row: 80px desktop, 64px mobile. Between 1024 and 1280 the row is tight: 24px side padding, 12px link
          padding and no Support text link, so the links never wrap and the search keeps a usable width. */}
      <div ref={navRow} className="flex h-16 items-center border-b border-header-field-border px-2 lg:h-20 lg:px-6 xl:px-10">
        <button
          ref={toggle}
          type="button"
          className={`${iconButton} lg:hidden`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={open ? "phone-menu" : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
        <button type="button" className={`${iconButton} lg:hidden`} aria-label="Search" onClick={() => setOpen(true)}>
          <Icon name="search" size={22} />
        </button>

        <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
          <Logo tone="cream" height={24} href="/" priority />
        </div>

        <nav className="ml-6 hidden h-full items-center lg:flex xl:ml-10" aria-label="Main">
          {links.map((l) => {
            const current = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={current ? "page" : undefined}
                className={`relative flex h-full items-center whitespace-nowrap px-3 text-[1rem] text-header-text transition-colors hover:text-announce-bg xl:px-4 ${
                  current ? "after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:bg-announce-bg xl:after:inset-x-4" : ""
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 hidden w-full min-w-0 max-w-[412px] shrink lg:block xl:mx-10 xl:ml-auto">{search("site-search")}</div>

        <div className="flex h-full items-center lg:ml-auto xl:ml-0">
          <Link href="/contact" className="hidden h-full items-center px-4 text-[1rem] text-header-text transition-colors hover:text-announce-bg xl:flex">
            Support
          </Link>
          {/* Cart: opens the drawer; the peach badge shows the live item count */}
          <button
            type="button"
            onClick={() => openCart(true)}
            aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart, empty"}
            className="relative grid h-full w-14 place-items-center text-header-text transition-colors hover:text-announce-bg"
          >
            <Icon name="bag" size={24} />
            {count > 0 && (
              <span className="tnum absolute right-2 top-1/2 grid min-w-[20px] -translate-y-[22px] place-items-center rounded-full bg-announce-bg px-1.5 text-[0.6875rem] font-semibold leading-[20px] text-announce-text">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="phone-menu"
          ref={panel}
          style={{ top: panelTop }}
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-header-bg px-5 pb-10 pt-4 text-header-text lg:hidden"
        >
          {search("phone-search")}
          <nav aria-label="Main" className="mt-4">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === l.href ? "page" : undefined}
                    className={`flex h-14 items-center justify-between border-b border-header-field-border text-[1.125rem] font-medium ${pathname === l.href ? "text-announce-bg" : "text-header-text"}`}
                  >
                    {l.label}
                    <Icon name="arrowRight" size={20} />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" onClick={() => setOpen(false)} className="flex h-14 items-center text-[1rem] text-header-text opacity-80">
                  Support: contact us
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
