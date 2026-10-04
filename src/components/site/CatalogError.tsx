import { CatalogError as CatalogErrorClass } from "@/lib/shopify";

/**
 * Shown wherever live Shopify data could not be loaded. There is no sample catalog to fall back on,
 * so the message is the whole content of that section or page.
 */
export function CatalogError({ error, title = "Products could not be loaded" }: { error: unknown; title?: string }) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div role="alert" className="container-pd py-16">
      <div className="rounded-[8px] border border-accent bg-accent-wash p-8 text-ink">
        <p className="pd-eyebrow mb-3">Shopify connection</p>
        <h2 className="font-serif text-[28px] leading-[32px]">{title}</h2>
        <p className="mt-4 max-w-[70ch] text-[16px] leading-6">{message}</p>
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
