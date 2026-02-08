import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router";
import { Header } from "~/components/header";
export async function loader({ request }) {
    try {
        const controlPlaneUrl = process.env.VITE_CONTROL_PLANE_URL || "https://api.studojo.com";
        const response = await fetch(`${controlPlaneUrl}/v1/dev/docs`);
        if (!response.ok) {
            return { docs: [] };
        }
        const data = await response.json();
        return { docs: data || [] };
    }
    catch (error) {
        console.error("Failed to load docs list:", error);
        return { docs: [] };
    }
}
export default function Docs({ loaderData }) {
    const { docs } = loaderData;
    return (_jsxs("div", { className: "min-h-screen bg-[var(--color-studojo-surface)]", children: [_jsx(Header, {}), _jsxs("main", { className: "max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: "Documentation" }), _jsx("p", { className: "text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "Browse and search the Studojo documentation" })] }), _jsx("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8", children: docs.length > 0 ? (_jsx("ul", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: docs.map((doc) => (_jsx("li", { children: _jsxs(Link, { to: `/docs/${doc.slug}`, className: "block p-4 border-2 border-[var(--color-studojo-ink)] rounded-lg hover:shadow-[var(--shadow-brutal)] transition-all hover:bg-[var(--color-studojo-purple-bg)]", children: [_jsx("h3", { className: "text-lg font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-1", children: doc.title }), _jsx("p", { className: "text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]", children: doc.slug })] }) }, doc.slug))) })) : (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "No documentation available. Check your connection to the control plane." }) })) })] })] }));
}
