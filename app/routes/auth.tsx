import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
import type { Route } from "./+types/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "signin";
  return { mode };
}

export default function Auth({ loaderData }: Route.ComponentProps) {
  const { mode } = loaderData;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      const redirect = searchParams.get("redirect") || "/";
      navigate(redirect);
    }
  }, [session, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8">
          <h1 className="text-3xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-[var(--color-studojo-muted)] font-['Satoshi'] mb-6">
            {mode === "signin"
              ? "Sign in to access the Dev Panel"
              : "Create an account to access the Dev Panel"}
          </p>

          {mode === "signin" ? (
            <authClient.SignIn
              showEmail
              showPassword
              redirectTo={searchParams.get("redirect") || "/"}
            />
          ) : (
            <authClient.SignUp
              showEmail
              showPassword
              redirectTo={searchParams.get("redirect") || "/"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

