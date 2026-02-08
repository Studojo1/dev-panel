import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
export async function loader({ request }) {
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode") || "signin";
    return { mode };
}
export default function Auth({ loaderData }) {
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
    return (_jsx("div", { className: "min-h-screen bg-[var(--color-studojo-surface)] flex items-center justify-center px-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8", children: [_jsx("h1", { className: "text-3xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: mode === "signin" ? "Sign In" : "Sign Up" }), _jsx("p", { className: "text-[var(--color-studojo-muted)] font-['Satoshi'] mb-6", children: mode === "signin"
                            ? "Sign in to access the Dev Panel"
                            : "Create an account to access the Dev Panel" }), mode === "signin" ? (_jsx(authClient.SignIn, { showEmail: true, showPassword: true, redirectTo: searchParams.get("redirect") || "/" })) : (_jsx(authClient.SignUp, { showEmail: true, showPassword: true, redirectTo: searchParams.get("redirect") || "/" }))] }) }) }));
}
