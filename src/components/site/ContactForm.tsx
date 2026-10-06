"use client";

import { useState } from "react";
import { site } from "@/config/site";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Contact form, delivered by Netlify Forms. Netlify only accepts posts to a static file that declares the form,
 * so this POSTs url-encoded fields to /__forms.html (see public/__forms.html, same field names).
 * The "email" field becomes the Reply-To of the notification, so the owner replies straight to the customer.
 * "bot-field" is a honeypot, hidden from people and screen readers.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("subject", `GlossBeau contact: ${String(data.get("name") || "").trim() || "website visitor"}`);
    setState("sending");
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="flex flex-col gap-3">
        <h2 className="t-heading-sm text-ink">Thanks, your message is on its way.</h2>
        <p className="t-body text-ink">We&apos;ll reply to the e-mail address you gave us.</p>
        <button type="button" className="link self-start" onClick={() => setState("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  const field = "pd-input h-12 w-full bg-surface px-4";
  const label = "t-label mb-2 block text-ink";

  return (
    <form name="contact" method="POST" onSubmit={submit} className="flex flex-col gap-5">
      <input type="hidden" name="form-name" value="contact" />
      {/* Honeypot: off-screen, unfocusable, unlabeled for assistive tech; bots fill it, people never see it */}
      <p className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={label}>
            Name
          </label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" maxLength={120} className={field} />
        </div>
        <div>
          <label htmlFor="contact-email" className={label}>
            E-mail
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" maxLength={200} className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-order" className={label}>
          Order number <span className="text-muted">(optional)</span>
        </label>
        <input id="contact-order" name="order" type="text" inputMode="text" maxLength={40} placeholder="e.g. #1234" className={field} />
      </div>

      <div>
        <label htmlFor="contact-message" className={label}>
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={6} maxLength={4000} className="pd-input w-full resize-y bg-surface px-4 py-3 leading-6" />
      </div>

      {state === "error" && (
        <p role="alert" className="t-body-sm text-ink">
          Your message could not be sent. Please try again, or e-mail us at{" "}
          <a className="link" href={`mailto:${site.supportEmail}`}>
            {site.supportEmail}
          </a>
          .
        </p>
      )}

      <button type="submit" disabled={state === "sending"} className="pd-btn pd-btn-lg pd-btn-dark self-start disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
