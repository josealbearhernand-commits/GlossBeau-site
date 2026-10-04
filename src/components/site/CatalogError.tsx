import { CatalogError as CatalogErrorClass } from "@/lib/shopify";
import { site } from "@/config/site";

/**
 * Shown wherever live Shopify data could not be loaded. There is no sample catalog to fall back on,
 * so the message is the whole content of that section or page.
 *
 * Shoppers get a plain sentence and a way to reach us; the technical reason (missing token, HTTP status,
 * GraphQL error) only shows in development, where the owner is the one reading it.
 */
export function CatalogError({ error, title = "Products could not be loaded" }: { error: unknown; title?: string }) {
  const detail = error instanceof Error ? error.message : String(error);
  const dev = process.env.NODE_ENV !== "production";
  return (
    <div role="alert" className="container-pd py-16">
      <div className="rounded-[8px] border border-accent bg-accent-wash p-8 text-ink">
        <h2 className="font-serif text-[1.75rem] leading-[2rem]">{title}</h2>
        <p className="mt-4 max-w-[60ch] text-[1rem] leading-6">
          Our product list is not answering right now. Reload the page in a minute, or e-mail{" "}
          <a className="link" href={`mailto:${site.supportEmail}`}>
            {site.supportEmail}
          </a>{" "}
          and we will help you find what you need.
        </p>
        {dev && (
          <p className="mt-4 max-w-[70ch] rounded-[6px] bg-surface p-4 font-mono text-[0.8125rem] leading-5 text-ink">
            <span className="mb-1 block text-muted">Shown in development only</span>
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

/** Runs a loader and returns either its data or the error, so pages can render the message in place. */
export async function tryCatalog<T>(load: () => Promise<T>): Promise<{ data: T; error: null } | { data: null; error: unknown }> {
  try {
    return { data: await load(), error: null };
  } catch (error) {
    if (!(error instanceof CatalogErrorClass)) console.error(error);
    return { data: null, error };
  }
}
