// Liveness/readiness target for Kubernetes. Probing "/" rendered the index
// loader, which asks studojo.com for an auth token with no cookie: 18 wasted
// calls a minute and better-auth 429s (B2C audit 30 Sep).
export function loader() {
  return new Response("ok", { headers: { "Content-Type": "text/plain" } });
}
