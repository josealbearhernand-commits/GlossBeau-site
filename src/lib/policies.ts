/**
 * Policy pages come from one Markdown file, content/policies.md (the owner's GlossBeau text, not the
 * Shopify store policies). The file is split on its "## " headings; each policy is matched
 * to a URL by keywords in its heading. [BRACKET] placeholders are replaced from src/config/site.ts.
 * Links between policies (any /policies/… link, or a link to the other policy's heading) keep working,
 * every e-mail address becomes a mailto: link, and any line that is only a phone placeholder is dropped
 * (GlossBeau publishes no phone number).
 */
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { placeholders } from "@/config/site";

export const policyRoutes = [
  { slug: "shipping", title: "Shipping Policy", match: /shipping/i },
  { slug: "refunds", title: "Return & Refund Policy", match: /refund|return/i },
  { slug: "privacy", title: "Privacy Policy", match: /privacy/i },
  { slug: "terms", title: "Terms of Service", match: /terms/i },
] as const;

export type PolicySlug = (typeof policyRoutes)[number]["slug"];

export interface Policy {
  slug: PolicySlug;
  title: string;
  html: string;
  /** Placeholders still present in this policy's text. */
  unfilled: string[];
}

const file = path.join(process.cwd(), "content", "policies.md");

function sections(): { heading: string; body: string }[] {
  const text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const out: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string } | null = null;
  for (const line of text.split("\n")) {
    if (/^\\?---\s*$/.test(line)) continue; // section separators (some exports escape them as \---)
    const h = /^##\s+(.+)/.exec(line);
    if (h) {
      current = { heading: h[1].trim(), body: "" };
      out.push(current);
    } else if (current) current.body += line + "\n";
  }
  return out;
}

function fill(md: string) {
  let s = md
    .split("\n")
    .filter((line) => !/\[PHONE\]/i.test(line))
    .join("\n");
  for (const [token, value] of Object.entries(placeholders)) s = s.split(token).join(value);
  return s;
}

/** Bare e-mail addresses (not already inside a link) become mailto: links. */
function linkEmails(md: string) {
  return md.replace(/(?<![\[(<\w.:/])([\w.+-]+@[\w-]+(?:\.[\w-]+)+)(?![\w.)\]>])/g, "[$1](mailto:$1)");
}

/** Rewrites links so "Return & Refund Policy" → /policies/refunds, and "#shipping-policy" style anchors too. */
function linkPolicies(md: string) {
  let s = md;
  for (const r of policyRoutes) {
    s = s.replace(new RegExp(`\\]\\(#[^)]*${r.slug}[^)]*\\)`, "gi"), `](/policies/${r.slug})`);
  }
  return s;
}

export function getPolicies(): Policy[] {
  if (!fs.existsSync(file)) return [];
  const secs = sections();
  return policyRoutes.flatMap((r) => {
    const sec = secs.find((s) => r.match.test(s.heading));
    if (!sec) return [];
    const md = linkEmails(linkPolicies(fill(sec.body)));
    const html = marked.parse(md, { gfm: true, async: false }) as string;
    const unfilled = [...new Set([...md.matchAll(/\[[A-Z][A-Z ]{2,}\]/g)].map((m) => m[0]))];
    return [{ slug: r.slug, title: sec.heading.replace(/\s*\(.*\)\s*$/, "") || r.title, html, unfilled }];
  });
}

export const getPolicy = (slug: string) => getPolicies().find((p) => p.slug === slug) ?? null;
