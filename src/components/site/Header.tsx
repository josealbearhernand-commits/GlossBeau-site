"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { Wordmark } from "./Wordmark";

const links = [
  { label: "Hair care", href: "/collections/hair-care" },
  { label: "Nails", href: "/collections/nails" },
  { label: "Barber", href: "/collections/barber" },
  { label: "Tools", href: "/collections/tools" },
  { label: "Brands", href: "/#brands" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md">
      <div className="page flex h-16 items-center gap-6">
        <button
          type="button"
          className="-ml-2 grid size-12 place-items-center rounded-[20px] text-ink hover:bg-canvas lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>

        <Link href="/" aria-label="GlossBeau home" className="rounded-full">
          <Wordmark size={22} />
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => {
            const current = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={current ? "page" : undefined}
                className={`t-nav rounded-full px-4 py-2 transition-colors ${
                  current ? "bg-canvas text-ink" : "text-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button type="button" className="grid size-12 place-items-center rounded-[20px] text-ink hover:bg-canvas" aria-label="Search">
            <Icon name="search" size={24} />
          </button>
          <button type="button" className="hidden size-12 place-items-center rounded-[20px] text-ink hover:bg-canvas sm:grid" aria-label="Account">
            <Icon name="user" size={24} />
          </button>
          <button type="button" className="relative grid size-12 place-items-center rounded-[20px] text-ink hover:bg-canvas" aria-label="Cart, 0 items">
            <Icon name="bag" size={24} />
          </button>
        </div>
      </div>
      <div className="h-px bg-faint" />

      {open && (
        <nav className="page bg-surface py-4 lg:hidden" aria-label="Main">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className="flex h-14 items-center justify-between border-b border-faint text-[20px] font-semibold tracking-[-0.05em] text-ink">
                  {l.label}
                  <Icon name="arrowRight" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
