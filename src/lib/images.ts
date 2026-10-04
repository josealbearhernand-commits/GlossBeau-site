/** Shopify CDN URL with a width parameter (the CDN resizes on the fly, never above the source size). Safe for client code. */
export const cdnWidth = (url: string, width: number) =>
  url.includes("cdn.shopify.com") ? `${url}${url.includes("?") ? "&" : "?"}width=${width}` : url;
