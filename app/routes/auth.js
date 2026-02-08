import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
export async function loader({ request }) {
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode") || "signin";
    return { mode };
}
export default function Auth({ loaderData }) {
    const { mode: initialMode } = loaderData;
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode === "signup" ? "signup" : "signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
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
    const handleSubmit = async (e) => {
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
                }
                else {
                    const redirect = searchParams.get("redirect") || "/";
                    navigate(redirect);
                }
            }
            else {
                const result = await authClient.signUp.email({
                    email,
                    password,
                });
                if (result.error) {
                    setError(result.error.message || "Sign up failed");
                }
                else {
                    const redirect = searchParams.get("redirect") || "/";
                    navigate(redirect);
                }
            }
        }
        catch (err) {
            setError(err.message || "An error occurred");
        }
        finally {
            setLoading(false);
        }
    };
    const handleModeToggle = () => {
        const newMode = mode === "signin" ? "signup" : "signin";
        setMode(newMode);
        setError(null);
        setSearchParams({ mode: newMode });
    };
    return (_jsx("div", { className: "min-h-screen bg-[var(--color-studojo-surface)] flex items-center justify-center px-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8", children: [_jsx("h1", { className: "text-3xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: mode === "signin" ? "Sign In" : "Sign Up" }), _jsx("p", { className: "text-[var(--color-studojo-muted)] font-['Satoshi'] mb-6", children: mode === "signin"
                            ? "Sign in to access the Dev Panel"
                            : "Create an account to access the Dev Panel" }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg", children: _jsx("p", { className: "text-sm font-['Satoshi'] text-red-800", children: error }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]", placeholder: "you@example.com" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-[var(--color-studojo-purple)] text-white py-2 px-4 rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors", children: loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up" })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { onClick: handleModeToggle, className: "text-sm font-['Satoshi'] text-[var(--color-studojo-purple)] hover:underline", children: mode === "signin"
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in" }) })] }) }) }));
}
