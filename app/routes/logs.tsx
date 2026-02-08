import { useState } from "react";
import type { Route } from "./+types/logs";
import { Header } from "~/components/header";
import { queryLogs } from "~/lib/api";

export default function Logs({}: Route.ComponentProps) {
  const [service, setService] = useState("");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await queryLogs(service || undefined, query || undefined);
      setLogs(result.logs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)]">
      <Header />
      <main className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            Logs
          </h1>
          <p className="text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]">
            Search and view service logs
          </p>
        </div>

        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                Service
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                placeholder="e.g., frontend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                Query
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                placeholder="Search query"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-[var(--color-studojo-purple)] text-white py-2 px-4 rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6">
          <div className="font-mono text-sm space-y-2">
            {logs.length === 0 ? (
              <p className="font-['Satoshi'] text-[var(--color-studojo-muted)] text-center py-8">
                No logs found. Enter a search query above.
              </p>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="p-3 bg-[var(--color-studojo-surface-muted)] rounded-lg border border-gray-200"
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-[var(--color-studojo-muted)] font-['Satoshi'] text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className="text-[var(--color-studojo-purple)] font-['Satoshi'] font-medium text-xs">
                      [{log.service || "unknown"}]
                    </span>
                    <span className={`font-['Satoshi'] text-xs px-2 py-0.5 rounded ${
                      log.level === "error" ? "bg-red-100 text-red-800" :
                      log.level === "warn" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {log.level || "info"}
                    </span>
                  </div>
                  <p className="mt-1 font-['Satoshi'] text-[var(--color-studojo-ink)]">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
