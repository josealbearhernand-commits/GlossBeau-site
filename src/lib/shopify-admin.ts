// Server only: imported by src/app/api/newsletter/route.ts, never by a client component.

/**
 * Shopify Admin API, server side only. Used for one job: newsletter sign-ups (customers + email consent).
 *
 * Auth is the Dev Dashboard "client credentials" grant: the app (scopes write_customers / read_customers only)
 * belongs to the same Shopify organization as the store, so the server trades its Client ID + Client secret for
 * an access token that lasts 24 hours. The token is cached in memory and renewed a few minutes before it expires.
 * Env (never committed): SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_CLIENT_ID, SHOPIFY_ADMIN_CLIENT_SECRET.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN ?? "";
const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID ?? "";
const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET ?? "";
const version = process.env.SHOPIFY_ADMIN_API_VERSION ?? process.env.SHOPIFY_API_VERSION ?? "2026-07";

export const adminConfigured = () => Boolean(domain && clientId && clientSecret);

let cached: { token: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && Date.now() < cached.expires) return cached.token;
  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }).toString(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify token request failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in?: number };
  // Renew 5 minutes early; Shopify issues 24-hour tokens (expires_in 86399).
  cached = { token: json.access_token, expires: Date.now() + Math.max(60, (json.expires_in ?? 86399) - 300) * 1000 };
  return cached.token;
}

export async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await accessToken() },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (res.status === 401) cached = null; // revoked or rotated: fetch a fresh token next time
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (!res.ok || json.errors || !json.data) throw new Error(`Shopify Admin API error: ${res.status} ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

/** The tag every GlossBeau newsletter sign-up carries, so these subscribers can be e-mailed apart from Diamond Pro's. */
export const NEWSLETTER_TAG = "glossbeau-newsletter";

type UserError = { field?: string[] | null; message: string };

const FIND = /* GraphQL */ `
  query FindCustomer($q: String!) {
    customers(first: 1, query: $q) {
      nodes {
        id
        defaultEmailAddress {
          marketingState
        }
      }
    }
  }
`;

const CREATE = /* GraphQL */ `
  mutation CreateSubscriber($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const TAG = /* GraphQL */ `
  mutation TagSubscriber($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      userErrors {
        field
        message
      }
    }
  }
`;

const CONSENT = /* GraphQL */ `
  mutation Subscribe($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

function consent() {
  return { marketingState: "SUBSCRIBED", marketingOptInLevel: "SINGLE_OPT_IN", consentUpdatedAt: new Date().toISOString() };
}

async function findCustomer(email: string) {
  const data = await adminFetch<{ customers: { nodes: { id: string; defaultEmailAddress: { marketingState: string } | null }[] } }>(FIND, {
    q: `email:"${email.replace(/"/g, "")}"`,
  });
  return data.customers.nodes[0] ?? null;
}

async function subscribeExisting(id: string, state: string | undefined) {
  // tagsAdd only adds: the customer's existing tags stay as they are.
  const t = await adminFetch<{ tagsAdd: { userErrors: UserError[] } }>(TAG, { id, tags: [NEWSLETTER_TAG] });
  if (t.tagsAdd.userErrors.length) throw new Error(`tagsAdd: ${JSON.stringify(t.tagsAdd.userErrors)}`);
  if (state === "SUBSCRIBED") return;
  const c = await adminFetch<{ customerEmailMarketingConsentUpdate: { userErrors: UserError[] } }>(CONSENT, {
    input: { customerId: id, emailMarketingConsent: consent() },
  });
  if (c.customerEmailMarketingConsentUpdate.userErrors.length) throw new Error(`consent: ${JSON.stringify(c.customerEmailMarketingConsentUpdate.userErrors)}`);
}

/**
 * Adds the e-mail to the store's marketing list: a new customer is created subscribed and tagged; a returning
 * customer keeps their tags, gains the newsletter tag and is marked subscribed. No account, no welcome e-mail.
 */
export async function subscribeToNewsletter(email: string): Promise<void> {
  const existing = await findCustomer(email);
  if (existing) return subscribeExisting(existing.id, existing.defaultEmailAddress?.marketingState);

  const res = await adminFetch<{ customerCreate: { customer: { id: string } | null; userErrors: UserError[] } }>(CREATE, {
    input: { email, tags: [NEWSLETTER_TAG], emailMarketingConsent: consent() },
  });
  if (res.customerCreate.customer) return;
  // Someone with this e-mail appeared between the lookup and the create (search index lag or a double click)
  const again = await findCustomer(email);
  if (again) return subscribeExisting(again.id, again.defaultEmailAddress?.marketingState);
  throw new Error(`customerCreate: ${JSON.stringify(res.customerCreate.userErrors)}`);
}
