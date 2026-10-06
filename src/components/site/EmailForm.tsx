"use client";

import { useState } from "react";
import { site } from "@/config/site";

/**
 * Email capture used by the footer newsletter and the pro-pricing panel.
 *
 * - kind="newsletter": posts to /api/newsletter, which adds the address to the Shopify store's marketing list
 *   (tagged glossbeau-newsletter). A hidden "company" honeypot field is sent along; people never see it.
 * - kind="mailto" (pro pricing): no list exists for it, so it hands the address to the support inbox through the
 *   visitor's own e-mail app with the subject filled in, and the confirmation says exactly that.
 */
export function EmailForm({
  id,
  kind = "mailto",
  placeholder = "Your email",
  buttonLabel,
  subject,
  className = "",
  inputClassName = "",
  buttonClassName = "",
}: {
  id: string;
  kind?: "newsletter" | "mailto";
  placeholder?: string;
  buttonLabel: string;
  /** Subject line of the e-mail the mailto form starts, e.g. "Pro pricing request". */
  subject: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  if (state === "sent") {
    return (
      <p role="status" className="text-[1rem] leading-6">
        {kind === "newsletter" ? (
          <>{message || "You're on the list."} Thanks for signing up.</>
        ) : (
          <>Your e-mail app should have opened a message to {site.supportEmail} for {email}. Send it and we will add you.</>
        )}{" "}
        <button type="button" className="link" onClick={() => setState("idle")}>
          Use another address
        </button>
      </p>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (kind === "mailto") {
      const body = `${subject}: please add ${email}.`;
      window.location.href = `mailto:${site.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setState("sent");
      return;
    }
    const company = String(new FormData(e.currentTarget).get("company") ?? "");
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      setMessage(json.message ?? "");
      setState(res.ok ? "sent" : "error");
    } catch {
      setMessage("We couldn't sign you up just now. Please try again in a moment.");
      setState("error");
    }
  }

  return (
    <div className={kind === "newsletter" ? "flex flex-col gap-2" : undefined}>
      <form className={className} onSubmit={submit}>
        <label htmlFor={id} className="sr-only">
          {placeholder}
        </label>
        {kind === "newsletter" && (
          // Honeypot: off-screen and hidden from assistive tech; only bots fill it
          <span className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <input name="company" tabIndex={-1} autoComplete="off" />
          </span>
        )}
        <input
          id={id}
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          className={`pd-input ${inputClassName}`}
        />
        <button type="submit" disabled={state === "sending"} className={`pd-btn ${buttonClassName} disabled:opacity-60`}>
          {state === "sending" ? "Signing up…" : buttonLabel}
        </button>
      </form>
      {state === "error" && (
        <p role="alert" className="text-[0.875rem] leading-5">
          {message || "We couldn't sign you up just now. Please try again in a moment."}
        </p>
      )}
    </div>
  );
}
