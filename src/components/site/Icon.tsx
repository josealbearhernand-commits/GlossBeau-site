import { Icon as IconifyIcon } from "@iconify/react/dist/offline";
import type { IconifyIcon as IconData } from "@iconify/react";
import magnifyingGlass from "@iconify-icons/ph/magnifying-glass-light";
import handbag from "@iconify-icons/ph/handbag-light";
import user from "@iconify-icons/ph/user-light";
import list from "@iconify-icons/ph/list-light";
import x from "@iconify-icons/ph/x-light";
import arrowRight from "@iconify-icons/ph/arrow-right-light";
import arrowUpRight from "@iconify-icons/ph/arrow-up-right-light";
import caretDown from "@iconify-icons/ph/caret-down-light";
import heart from "@iconify-icons/ph/heart-light";
import star from "@iconify-icons/ph/star-light";
import plus from "@iconify-icons/ph/plus-light";
import minus from "@iconify-icons/ph/minus-light";
import truck from "@iconify-icons/ph/truck-light";
import shieldCheck from "@iconify-icons/ph/shield-check-light";
import leaf from "@iconify-icons/ph/leaf-light";
import sparkle from "@iconify-icons/ph/sparkle-light";
import play from "@iconify-icons/ph/play-light";
import pause from "@iconify-icons/ph/pause-light";
import drop from "@iconify-icons/ph/drop-light";
import scissors from "@iconify-icons/ph/scissors-light";
import check from "@iconify-icons/ph/check-light";
import storefront from "@iconify-icons/ph/storefront-light";

/** Phosphor Light, the one icon set used across GlossBeau (DESIGN.md › Icons). */
export const icons = {
  search: magnifyingGlass,
  bag: handbag,
  user,
  menu: list,
  close: x,
  arrowRight,
  arrowUpRight,
  caretDown,
  heart,
  star,
  plus,
  minus,
  truck,
  shieldCheck,
  leaf,
  sparkle,
  play,
  pause,
  drop,
  scissors,
  check,
  storefront,
} satisfies Record<string, IconData>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <IconifyIcon icon={icons[name]} width={size} height={size} className={className} aria-hidden="true" />
  );
}
