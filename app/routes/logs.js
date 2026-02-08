import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Header } from "~/components/header";
import { queryLogs } from "~/lib/api";
export default function Logs({}) {
    const [service, setService] = useState("");
    const [query, setQuery] = useState("");
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleSearch = async () => {
        setLoading(true);
        try {
            const result = await queryLogs(service || undefined, query || undefined);
            setLogs(result.logs || []);
        }
        catch (error) {
            console.error("Failed to fetch logs:", error);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-[var(--color-studojo-surface)]", children: [_jsx(Header, {}), _jsxs("main", { className: "max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2", children: "Logs" }), _jsx("p", { className: "text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]", children: "Search and view service logs" })] }), _jsx("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2", children: "Service" }), _jsx("input", { type: "text", value: service, onChange: (e) => setService(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), className: "w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]", placeholder: "e.g., frontend" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2", children: "Query" }), _jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), className: "w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]", placeholder: "Search query" })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: handleSearch, disabled: loading, className: "w-full bg-[var(--color-studojo-purple)] text-white py-2 px-4 rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors", children: loading ? "Loading..." : "Search" }) })] }) }), _jsx("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6", children: _jsx("div", { className: "font-mono text-sm space-y-2", children: logs.length === 0 ? (_jsx("p", { className: "font-['Satoshi'] text-[var(--color-studojo-muted)] text-center py-8", children: "No logs found. Enter a search query above." })) : (logs.map((log, i) => (_jsxs("div", { className: "p-3 bg-[var(--color-studojo-surface-muted)] rounded-lg border border-gray-200", children: [_jsxs("div", { className: "flex items-start space-x-2", children: [_jsx("span", { className: "text-[var(--color-studojo-muted)] font-['Satoshi'] text-xs", children: new Date(log.timestamp).toLocaleString() }), _jsxs("span", { className: "text-[var(--color-studojo-purple)] font-['Satoshi'] font-medium text-xs", children: ["[", log.service || "unknown", "]"] }), _jsx("span", { className: `font-['Satoshi'] text-xs px-2 py-0.5 rounded ${log.level === "error" ? "bg-red-100 text-red-800" :
                                                    log.level === "warn" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-blue-100 text-blue-800"}`, children: log.level || "info" })] }), _jsx("p", { className: "mt-1 font-['Satoshi'] text-[var(--color-studojo-ink)]", children: log.message })] }, i)))) }) })] })] }));
}
