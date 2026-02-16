import { useState, useEffect } from "react";
import type { Route } from "./+types/logs";
import { Header } from "~/components/header";
import { LogStream } from "~/components/LogStream";
import { queryLogs, getServices } from "~/lib/api";

export default function Logs({}: Route.ComponentProps) {
  const [service, setService] = useState("");
  const [pod, setPod] = useState("");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const svcs = await getServices();
      setServices(svcs);
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setStreaming(false);
    try {
      const result = await queryLogs(service || undefined, query || undefined);
      setLogs(result.logs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStreaming = () => {
    if (!service) {
      alert("Please select a service");
      return;
    }
    setStreaming(true);
    setLogs([]);
  };

  const handleStopStreaming = () => {
    setStreaming(false);
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={streaming}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleStartStreaming();
                    } else {
                      handleStopStreaming();
                    }
                  }}
                  className="w-4 h-4 text-[var(--color-studojo-purple)] border-2 border-[var(--color-studojo-ink)] rounded focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                />
                <span className="font-['Satoshi'] font-medium text-[var(--color-studojo-ink)]">
                  Real-time Streaming
                </span>
              </label>
            </div>
          </div>

          {streaming ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                  Service
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                >
                  <option value="">Select a service...</option>
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                  Pod (optional)
                </label>
                <input
                  type="text"
                  value={pod}
                  onChange={(e) => setPod(e.target.value)}
                  className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                  placeholder="Leave empty for first pod"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                  Service
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                >
                  <option value="">All services</option>
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
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
          )}
        </div>

        {streaming ? (
          <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] overflow-hidden">
            <div className="h-[600px]">
              {service ? (
                <LogStream service={service} pod={pod || undefined} follow={true} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="font-['Satoshi'] text-[var(--color-studojo-muted)]">
                    Please select a service to start streaming logs
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6">
            <div className="font-mono text-sm space-y-2">
              {logs.length === 0 ? (
                <p className="font-['Satoshi'] text-[var(--color-studojo-muted)] text-center py-8">
                  No logs found. Enter a search query above or enable real-time
                  streaming.
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
                      <span
                        className={`font-['Satoshi'] text-xs px-2 py-0.5 rounded ${
                          log.level === "error"
                            ? "bg-red-100 text-red-800"
                            : log.level === "warn"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
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
        )}
      </main>
    </div>
  );
}
