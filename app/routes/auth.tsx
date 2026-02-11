import { redirect } from "react-router";
import type { Route } from "./+types/auth";

// Redirect /auth to /login for backward compatibility
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/";
  return redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`);
}

