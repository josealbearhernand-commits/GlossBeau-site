"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/site/Icon";

/** No colored containers in this system: the sign-up is a white elevated card with a accent submit. */
export function EmailCapture() {
  const [done, setDone] = useState(false);
  return (
    <section className="page pt-16 lg:pt-20">
      <Reveal mode="block">
        <div className="card grid gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="t-eyebrow mb-2">The GlossBeau list</p>
            <h2 className="t-heading text-ink">New arrivals and stylist tips, about twice a month.</h2>
          </div>
          {done ? (
            <p role="status" className="t-lead self-center text-ink">
              You are on the list. Check your inbox to confirm.
            </p>
          ) : (
            <form
              className="flex items-center self-center rounded-full border border-ink/10 bg-surface py-1 pl-5 pr-1"
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
            >
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                className="t-body min-w-0 flex-1 bg-transparent py-3 text-ink placeholder:text-muted focus:outline-none"
              />
              <button type="submit" aria-label="Sign up" className="grid size-12 flex-none place-items-center rounded-full bg-accent text-on-accent shadow-[var(--shadow-accent)] hover:bg-accent-deep">
                <Icon name="arrowRight" size={20} />
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
