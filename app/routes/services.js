import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router";
import { Header } from "~/components/header";
import { getServices } from "~/lib/api";
export async function loader({ request }) {
    try {
        const services = await getServices();
        return { services };
    }
    catch (error) {
        console.error("Failed to load services:", error);
        return { services: [] };
    }
}
export default function Services({ loaderData }) {
    const { services } = loaderData;
    return (_jsxs("div", { className: "min-h-screen bg-[var(--color-studojo-surface)]", children: [_jsx(Header, {}), _jsxs("main", { className: "max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: "Services" }), _jsx("p", { className: "text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "Monitor and manage all Studojo services" })] }), _jsx("div", { className: "space-y-4", children: services.map((service) => (_jsx(Link, { to: `/services/${service.name}`, className: "block bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 hover:shadow-[var(--shadow-brutal-lg)] transition-all", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: `h-4 w-4 rounded-full ${service.status === "healthy" || service.status === "ready"
                                                    ? "bg-[var(--color-studojo-green)]"
                                                    : "bg-red-500"}` }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)]", children: service.name }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 font-['Satoshi'] text-sm text-[var(--color-studojo-muted)]", children: [_jsxs("span", { children: ["Status: ", _jsx("span", { className: "font-medium text-[var(--color-studojo-ink)] capitalize", children: service.status })] }), service.version && (_jsxs("span", { children: ["Version: ", _jsx("span", { className: "font-medium text-[var(--color-studojo-ink)]", children: service.version })] })), service.ready_replicas !== undefined && (_jsxs("span", { children: ["Replicas: ", _jsxs("span", { className: "font-medium text-[var(--color-studojo-ink)]", children: [service.ready_replicas, "/", service.replicas] })] }))] })] })] }), _jsx("svg", { className: "w-5 h-5 text-[var(--color-studojo-muted)]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] }) }, service.name))) }), services.length === 0 && (_jsx("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8 text-center", children: _jsx("p", { className: "font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "No services found. Check your connection to the control plane." }) }))] })] }));
}
