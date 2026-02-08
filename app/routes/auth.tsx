import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
import type { Route } from "./+types/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "signin";
  return { mode };
}

export default function Auth({ loaderData }: Route.ComponentProps) {
  const { mode: initialMode } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      const redirect = searchParams.get("redirect") || "/";
      navigate(redirect);
    }
  }, [session, navigate, searchParams]);

  if (!isPending && session) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          setError(result.error.message || "Sign in failed");
        } else {
          const redirect = searchParams.get("redirect") || "/";
          navigate(redirect);
        }
      } else {
        const result = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "User",
        });

        if (result.error) {
          setError(result.error.message || "Sign up failed");
        } else {
          const redirect = searchParams.get("redirect") || "/";
          navigate(redirect);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = () => {
    const newMode = mode === "signin" ? "signup" : "signin";
    setMode(newMode);
    setError(null);
    setSearchParams({ mode: newMode });
  };

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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm font-['Satoshi'] text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-studojo-purple)] text-white py-2 px-4 rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors"
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleModeToggle}
              className="text-sm font-['Satoshi'] text-[var(--color-studojo-purple)] hover:underline"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
