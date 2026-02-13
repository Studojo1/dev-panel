import { marked } from "marked";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/docs.$slug";
import { Header } from "~/components/header";

import { getToken } from "~/lib/api";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  try {
    const controlPlaneUrl = process.env.VITE_CONTROL_PLANE_URL || "https://api.studojo.com";
    const token = await getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${controlPlaneUrl}/v1/dev/docs/${slug}`, {
      headers,
      credentials: "include",
    });
    if (!response.ok) {
      return { content: null, slug };
    }
    const data = await response.json();
    return { content: data.content, slug };
  } catch (error) {
    console.error("Failed to load doc:", error);
    return { content: null, slug };
  }
}

export default function DocSlug({ loaderData }: Route.ComponentProps) {
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
    return (
      <div className="min-h-screen bg-[var(--color-studojo-surface)]">
        <Header />
        <main className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
          <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8">
            <h1 className="text-3xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4">
              Documentation Not Found
            </h1>
            <p className="font-['Satoshi'] text-[var(--color-studojo-muted)] mb-4">
              The document "{slug}" could not be found.
            </p>
            <Link
              to="/docs"
              className="inline-block px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] transition-colors"
            >
              Back to Docs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)]">
      <Header />
      <main className="max-w-4xl mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8">
          <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </main>
    </div>
  );
}
