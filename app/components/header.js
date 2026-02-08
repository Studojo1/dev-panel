import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { authClient } from "~/lib/auth-client";
const NAV_LINKS = [
    { to: "/", label: "Dashboard" },
    { to: "/services", label: "Services" },
    { to: "/logs", label: "Logs" },
    { to: "/metrics", label: "Metrics" },
    { to: "/ci-cd", label: "CI/CD" },
    { to: "/docs", label: "Docs" },
];
export function Header() {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const location = useLocation();
    const { data: session, isPending } = authClient.useSession();
    const handleSignOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/auth?mode=signin";
                },
            },
        });
    };
    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        if (userMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuOpen]);
    return (_jsx("header", { className: "sticky top-0 z-50 bg-white border-b-2 border-[var(--color-studojo-ink)] shadow-[var(--shadow-brutal)]", children: _jsxs("nav", { className: "max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)]", children: [_jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx(Link, { to: "/", className: "flex items-center space-x-2", children: _jsx("span", { className: "text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)]", children: "Dev Panel" }) }), _jsx("div", { className: "hidden md:flex items-center space-x-1", children: NAV_LINKS.map((link) => {
                                const isActive = location.pathname === link.to;
                                return (_jsx(Link, { to: link.to, className: `px-4 py-2 rounded-lg font-['Satoshi'] font-medium text-sm transition-colors ${isActive
                                        ? "bg-[var(--color-studojo-purple-bg)] text-[var(--color-studojo-purple)]"
                                        : "text-[var(--color-studojo-muted)] hover:text-[var(--color-studojo-ink)] hover:bg-[var(--color-studojo-surface-muted)]"}`, children: link.label }, link.to));
                            }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [isPending ? (_jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 animate-pulse" })) : session?.user ? (_jsxs("div", { className: "relative", ref: userMenuRef, children: [_jsxs("button", { onClick: () => setUserMenuOpen(!userMenuOpen), className: "flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--color-studojo-surface-muted)] transition-colors", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-[var(--color-studojo-purple)] flex items-center justify-center text-white font-['Satoshi'] font-medium text-sm", children: session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U" }), _jsx("span", { className: "hidden sm:block font-['Satoshi'] text-sm text-[var(--color-studojo-ink)]", children: session.user.name || session.user.email })] }), userMenuOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] py-1", children: [_jsxs("div", { className: "px-4 py-2 border-b border-gray-200", children: [_jsx("p", { className: "text-sm font-['Satoshi'] font-medium text-[var(--color-studojo-ink)]", children: session.user.name || "User" }), _jsx("p", { className: "text-xs font-['Satoshi'] text-[var(--color-studojo-muted)]", children: session.user.email })] }), _jsx("button", { onClick: handleSignOut, className: "w-full text-left px-4 py-2 text-sm font-['Satoshi'] text-red-600 hover:bg-red-50 transition-colors", children: "Sign Out" })] }))] })) : (_jsx(Link, { to: "/auth?mode=signin", className: "px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium text-sm hover:bg-[var(--color-studojo-violet-500)] transition-colors", children: "Sign In" })), _jsx("button", { onClick: () => setMobileOpen(!mobileOpen), className: "md:hidden p-2 rounded-lg hover:bg-[var(--color-studojo-surface-muted)] transition-colors", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: mobileOpen ? (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })) : (_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" })) }) })] })] }), mobileOpen && (_jsx("div", { className: "md:hidden py-4 border-t border-gray-200", children: _jsx("div", { className: "flex flex-col space-y-1", children: NAV_LINKS.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (_jsx(Link, { to: link.to, onClick: () => setMobileOpen(false), className: `px-4 py-2 rounded-lg font-['Satoshi'] font-medium text-sm transition-colors ${isActive
                                    ? "bg-[var(--color-studojo-purple-bg)] text-[var(--color-studojo-purple)]"
                                    : "text-[var(--color-studojo-muted)] hover:text-[var(--color-studojo-ink)] hover:bg-[var(--color-studojo-surface-muted)]"}`, children: link.label }, link.to));
                        }) }) }))] }) }));
}
