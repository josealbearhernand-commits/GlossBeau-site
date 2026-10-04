/**
 * Runs before `next build`. Reads src/config/site.ts and content/policies.md; any value or text still
 * in [BRACKETS] prints a warning. On Netlify's production context (CONTEXT=production) it exits 1,
 * so a live deploy can never ship placeholders. Preview and local builds only warn.
 */
import fs from "node:fs";

const problems = [];
const settings = fs.readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
for (const m of settings.matchAll(/^\s*(\w+):\s*"(\[[A-Z][A-Z ]+\])"/gm)) problems.push(`src/config/site.ts › ${m[1]} is still ${m[2]}`);

// Draft text and dead links in the components: "Placeholder copy", lorem ipsum, TODO copy, links to "#".
const srcDir = new URL("../src/", import.meta.url);
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = new URL(d.name + (d.isDirectory() ? "/" : ""), dir);
    return d.isDirectory() ? walk(p) : /\.(tsx?|md)$/.test(d.name) ? [p] : [];
  });
const draft = [/placeholder copy/i, /lorem ipsum/i, /\bTODO copy\b/i, /href=["']#["']/, /href: ["']#["']/];
for (const file of walk(srcDir)) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of draft) {
    const m = text.match(re);
    if (m) problems.push(`${decodeURIComponent(file.pathname).replace(/^.*\/src\//, "src/")} still contains “${m[0]}”`);
  }
}

const policies = new URL("../content/policies.md", import.meta.url);
if (fs.existsSync(policies)) {
  const text = fs.readFileSync(policies, "utf8");
  const known = new Set(["[LEGAL BUSINESS NAME]", "[SUPPORT EMAIL]", "[BUSINESS ADDRESS]"]);
  const other = [...new Set([...text.matchAll(/\[[A-Z][A-Z ]{2,}\]/g)].map((m) => m[0]))].filter((p) => !known.has(p));
  for (const p of other) problems.push(`content/policies.md has a placeholder with no setting: ${p}`);
  if (/\[PHONE\]|(phone|tel)\s*:/i.test(text)) problems.push("content/policies.md mentions a phone number; GlossBeau publishes none");
} else {
  problems.push("content/policies.md is missing: the policy pages will show an error until it is added");
}

if (problems.length) {
  const live = process.env.CONTEXT === "production";
  console[live ? "error" : "warn"](`\n${live ? "ERROR" : "WARNING"}: placeholders are not filled in:\n  - ${problems.join("\n  - ")}\n`);
  if (live) {
    console.error("Refusing to build the live site with placeholders. Fill them in src/config/site.ts.\n");
    process.exit(1);
  }
}
