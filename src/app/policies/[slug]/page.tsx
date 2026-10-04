import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicies, getPolicy, policyRoutes } from "@/lib/policies";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return policyRoutes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getPolicy(slug);
  return { title: p?.title ?? policyRoutes.find((r) => r.slug === slug)?.title ?? "Policy" };
}

/** One GlossBeau policy from content/policies.md: readable column, site fonts and colours, clean tables. */
export default async function PolicyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const route = policyRoutes.find((r) => r.slug === slug);
  if (!route) notFound();
  const policy = getPolicy(slug);
  const others = getPolicies().filter((p) => p.slug !== slug);

  return (
    <div className="page pt-12 lg:pt-20">
      <nav aria-label="Breadcrumb" className="t-caption mb-6 text-muted">
        <Link href="/" className="max-lg:py-3 hover:text-ink">
          Home
        </Link>{" "}
        / Policies / {policy?.title ?? route.title}
      </nav>
      <article className="policy mx-auto max-w-[720px] pb-24">
        <h1 className="t-heading-lg mb-8 text-ink">{policy?.title ?? route.title}</h1>
        {policy ? (
          <>
            {policy.unfilled.length > 0 && process.env.NODE_ENV !== "production" && (
              <p role="alert" className="mb-8 rounded-[8px] border border-accent bg-accent-wash p-4 text-[0.875rem] text-ink">
                Placeholders still to fill in src/config/site.ts: {policy.unfilled.join(", ")}. (This note only shows in development.)
              </p>
            )}
            <div dangerouslySetInnerHTML={{ __html: policy.html }} />
          </>
        ) : (
          <p role="alert" className="rounded-[8px] border border-accent bg-accent-wash p-6 text-ink">
            This policy&apos;s text is missing: add it to <code>content/policies.md</code> under a heading that mentions &ldquo;{route.title}&rdquo;.
          </p>
        )}
        {others.length > 0 && (
          <nav aria-label="Other policies" className="mt-16 border-t border-faint pt-8">
            <p className="t-eyebrow mb-3">Other policies</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/policies/${p.slug}`} className="link t-body-sm">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </div>
  );
}
