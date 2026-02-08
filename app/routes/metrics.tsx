import { useState } from "react";
import type { Route } from "./+types/metrics";
import { Header } from "~/components/header";
import { queryMetrics } from "~/lib/api";

export default function Metrics({}: Route.ComponentProps) {
  const [service, setService] = useState("");
  const [metric, setMetric] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async () => {
    setLoading(true);
    try {
      const result = await queryMetrics(service || undefined, metric || undefined);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
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
            Metrics
          </h1>
          <p className="text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]">
            Query and visualize service metrics
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
                onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                placeholder="e.g., frontend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                Metric
              </label>
              <input
                type="text"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuery()}
                className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                placeholder="e.g., cpu_usage"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleQuery}
                disabled={loading}
                className="w-full bg-[var(--color-studojo-purple)] text-white py-2 px-4 rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors"
              >
                {loading ? "Loading..." : "Query"}
              </button>
            </div>
          </div>
        </div>

        {data && (
          <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6">
            <h2 className="text-xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4">
              Metrics Data
            </h2>
            <pre className="font-mono text-sm bg-[var(--color-studojo-surface-muted)] p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
