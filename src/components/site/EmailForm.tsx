"use client";

import { useState } from "react";

/**
 * Email capture used by the pro-pricing panel and the footer newsletter. No backend yet:
 * it only confirms the address locally. Wire it to Klaviyo / Shopify Email later.
 */
export function EmailForm({
  id,
  placeholder = "Your email",
  buttonLabel,
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: {
  id: string;
  placeholder?: string;
  buttonLabel: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const [done, setDone] = useState(false);
  if (done) return <p className="text-[16px] leading-6">Thanks, you&apos;re on the list.</p>;
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input id={id} type="email" required placeholder={placeholder} className={`pd-input ${inputClassName}`} />
      <button type="submit" className={`pd-btn ${buttonClassName}`}>
        {buttonLabel}
      </button>
    </form>
  );
}
