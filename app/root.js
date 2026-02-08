import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation, isRouteErrorResponse, } from "react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { authClient } from "./lib/auth-client";
import "./app.css";
export const links = () => [
    { rel: "icon", href: "/favicon.png", type: "image/png" },
    { rel: "preconnect", href: "https://api.fontshare.com" },
    {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700,900&display=swap",
    },
];
export function Layout({ children }) {
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx(Meta, {}), _jsx(Links, {})] }), _jsxs("body", { children: [children, _jsx(Toaster, { position: "top-right", toastOptions: {
                            classNames: {
                                toast: "font-['Satoshi']",
                                title: "font-['Satoshi'] font-medium",
                                description: "font-['Satoshi']",
                                success: "bg-emerald-50 border-emerald-200 text-emerald-900",
                                error: "bg-red-50 border-red-200 text-red-900",
                                info: "bg-blue-50 border-blue-200 text-blue-900",
                            },
                        } }), _jsx(ScrollRestoration, {}), _jsx(Scripts, {})] })] }));
}
export default function Root({ loaderData }) {
    const location = useLocation();
    const { data: session, isPending } = authClient.useSession();
    // Redirect to auth if not logged in (but allow auth routes)
    useEffect(() => {
        if (!isPending && !session && !location.pathname.startsWith("/auth") && !location.pathname.startsWith("/api")) {
            window.location.href = "/auth?mode=signin&redirect=" + encodeURIComponent(location.pathname);
        }
    }, [session, isPending, location.pathname]);
    return _jsx(Outlet, {});
}
export function ErrorBoundary({ error }) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let statusCode;
    if (isRouteErrorResponse(error)) {
        statusCode = error.status;
        message = error.status === 404 ? "Page Not Found" : error.status === 500 ? "Server Error" : "Error";
        details =
            error.status === 404
                ? "The page you're looking for doesn't exist or has been moved."
                : error.status === 500
                    ? "Something went wrong on our end. We're working to fix it!"
                    : error.statusText || details;
    }
    else if (error && error instanceof Error) {
        details = error.message;
        message = "Application Error";
    }
    return (_jsx("div", { className: "min-h-screen bg-[var(--color-studojo-surface)] flex items-center justify-center px-4", children: _jsx("div", { className: "w-full max-w-md", children: _jsxs("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8 text-center", children: [_jsx("h1", { className: "text-3xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: message }), _jsx("p", { className: "text-[var(--color-studojo-muted)] font-['Satoshi'] mb-6", children: details }), _jsx("a", { href: "/", className: "inline-block px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] transition-colors", children: "Go Home" })] }) }) }));
}
