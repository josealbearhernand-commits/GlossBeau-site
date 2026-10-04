"use client";

import { useState } from "react";
import { site } from "@/config/site";

/**
 * Email capture used by the pro-pricing panel and the footer newsletter.
 *
 * No list provider is connected yet (Klaviyo / Shopify Email come later), so the form never pretends:
 * submitting hands the address to the support inbox through the visitor's own e-mail app, with the
 * subject filled in, and the confirmation says exactly that. Swap the onSubmit for the provider call
 * when it exists; the markup stays.
 */
export function EmailForm({
  id,
  placeholder = "Your email",
  buttonLabel,
  subject,
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: {
  id: string;
  placeholder?: string;
  buttonLabel: string;
  /** Subject line of the e-mail the form starts, e.g. "Newsletter sign-up". */
  subject: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p role="status" className="text-[1rem] leading-6">
        Your e-mail app should have opened a message to {site.supportEmail} for {email}. Send it and we will add you.{" "}
        <button type="button" className="link" onClick={() => setSent(false)}>
          Use another address
        </button>
      </p>
    );
  }

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const body = `${subject}: please add ${email}.`;
        window.location.href = `mailto:${site.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`pd-input ${inputClassName}`}
      />
      <button type="submit" className={`pd-btn ${buttonClassName}`}>
        {buttonLabel}
      </button>
    </form>
  );
}
