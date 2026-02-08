import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Header } from "~/components/header";
import { queryMetrics } from "~/lib/api";
export default function Metrics({}) {
    const [service, setService] = useState("");
    const [metric, setMetric] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleQuery = async () => {
        setLoading(true);
        try {
            const result = await queryMetrics(service || undefined, metric || undefined);
            setData(result);
        }
        catch (error) {
            console.error("Failed to fetch metrics:", error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-[var(--color-studojo-surface)]", children: [_jsx(Header, {}), _jsxs("main", { className: "max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: "Metrics" }), _jsx("p", { className: "text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "Query and visualize service metrics" })] }), _jsx("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2", children: "Service" }), _jsx("input", { type: "text", value: service, onChange: (e) => setService(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleQuery(), className: "w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]", placeholder: "e.g., frontend" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2", children: "Metric" }), _jsx("input", { type: "text", value: metric, onChange: (e) => setMetric(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleQuery(), className: "w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]", placeholder: "e.g., cpu_usage" })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: handleQuery, disabled: loading, className: "w-full bg-[var(--color-studojo-purple)] text-white py-2 px-4 rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors", children: loading ? "Loading..." : "Query" }) })] }) }), data && (_jsxs("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6", children: [_jsx("h2", { className: "text-xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4", children: "Metrics Data" }), _jsx("pre", { className: "font-mono text-sm bg-[var(--color-studojo-surface-muted)] p-4 rounded-lg overflow-x-auto", children: JSON.stringify(data, null, 2) })] }))] })] }));
}
