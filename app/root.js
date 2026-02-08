import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation, } from "react-router";
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
