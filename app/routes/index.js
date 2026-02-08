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
export default function Index({ loaderData }) {
    const { services } = loaderData;
    return (_jsxs("div", { className: "min-h-screen bg-[var(--color-studojo-surface)]", children: [_jsx(Header, {}), _jsxs("main", { className: "max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: "Dev Panel Dashboard" }), _jsx("p", { className: "text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "Monitor and manage all Studojo services" })] }), _jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: services.map((service) => (_jsxs(Link, { to: `/services/${service.name}`, className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 hover:shadow-[var(--shadow-brutal-lg)] transition-all", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("h3", { className: "text-xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)]", children: service.name }), _jsx("div", { className: `h-3 w-3 rounded-full ${service.status === "healthy" || service.status === "ready"
                                                ? "bg-[var(--color-studojo-green)]"
                                                : "bg-red-500"}` })] }), _jsxs("div", { className: "space-y-2 font-['Satoshi'] text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-[var(--color-studojo-muted)]", children: "Status:" }), _jsx("span", { className: "font-medium text-[var(--color-studojo-ink)] capitalize", children: service.status })] }), service.version && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-[var(--color-studojo-muted)]", children: "Version:" }), _jsx("span", { className: "font-medium text-[var(--color-studojo-ink)]", children: service.version })] })), service.ready_replicas !== undefined && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-[var(--color-studojo-muted)]", children: "Replicas:" }), _jsxs("span", { className: "font-medium text-[var(--color-studojo-ink)]", children: [service.ready_replicas, "/", service.replicas] })] }))] })] }, service.name))) }), services.length === 0 && (_jsx("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8 text-center", children: _jsx("p", { className: "font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "No services found. Check your connection to the control plane." }) }))] })] }));
}
