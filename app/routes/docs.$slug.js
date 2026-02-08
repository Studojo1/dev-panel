import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { marked } from "marked";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Header } from "~/components/header";
export async function loader({ params }) {
    const { slug } = params;
    try {
        const controlPlaneUrl = process.env.VITE_CONTROL_PLANE_URL || "https://api.studojo.com";
        const response = await fetch(`${controlPlaneUrl}/v1/dev/docs/${slug}`);
        if (!response.ok) {
            return { content: null, slug };
        }
        const data = await response.json();
        return { content: data.content, slug };
    }
    catch (error) {
        console.error("Failed to load doc:", error);
        return { content: null, slug };
    }
}
export default function DocSlug({ loaderData }) {
    const { content, slug } = loaderData;
    const [html, setHtml] = useState("");
    useEffect(() => {
        if (content) {
            marked.setOptions({
                highlight: (code, lang) => {
                    // In production, use highlight.js here
                    return code;
                },
            });
            marked.parse(content).then((html) => setHtml(html));
        }
    }, [content]);
    if (!content) {
        return (_jsxs("div", { className: "min-h-screen bg-[var(--color-studojo-surface)]", children: [_jsx(Header, {}), _jsx("main", { className: "max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]", children: _jsxs("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8", children: [_jsx("h1", { className: "text-3xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4", children: "Documentation Not Found" }), _jsxs("p", { className: "font-['Satoshi'] text-[var(--color-studojo-muted)] mb-4", children: ["The document \"", slug, "\" could not be found."] }), _jsx(Link, { to: "/docs", className: "inline-block px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] transition-colors", children: "Back to Docs" })] }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-[var(--color-studojo-surface)]", children: [_jsx(Header, {}), _jsx("main", { className: "max-w-4xl mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]", children: _jsx("div", { className: "bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8", children: _jsx("div", { className: "markdown-content", dangerouslySetInnerHTML: { __html: html } }) }) })] }));
}
