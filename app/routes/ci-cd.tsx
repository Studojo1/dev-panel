import { useState } from "react";
import type { Route } from "./+types/ci-cd";
import { Header } from "~/components/header";
import { getDeployments, getCICDStatus } from "~/lib/api";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const [deployments, cicdStatus] = await Promise.all([
      getDeployments(),
      getCICDStatus().catch(() => ({ workflows: [] })),
    ]);
    return { deployments, cicdStatus };
  } catch (error) {
    console.error("Failed to load data:", error);
    return { deployments: [], cicdStatus: { workflows: [] } };
  }
}

export default function CICD({ loaderData }: Route.ComponentProps) {
  const { deployments, cicdStatus } = loaderData;
  const [selectedService, setSelectedService] = useState("");

  const activeWorkflows = cicdStatus.workflows.filter((w: any) =>
    ["queued", "in_progress", "waiting"].includes(w.status),
  );

  const filteredDeployments = deployments.filter(
    (d: any) =>
      !selectedService ||
      d.service.toLowerCase().includes(selectedService.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)]">
      <Header />
      <main className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            CI/CD Status
          </h1>
          <p className="text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]">
            Monitor deployment history and CI/CD pipeline status
          </p>
        </div>

        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 mb-6">
          <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
            Filter by Service
          </label>
          <input
            type="text"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
            placeholder="Service name"
          />
        </div>

        {/* Active Pipelines Section */}
        {activeWorkflows.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4 flex items-center">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-studojo-green)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-studojo-green)]"></span>
              </span>
              Active Pipelines
            </h2>
            <div className="grid gap-4">
              {activeWorkflows.map((workflow: any) => (
                <div
                  key={workflow.run_id}
                  className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold font-['Clash_Display'] text-lg text-[var(--color-studojo-ink)]">
                      {workflow.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
                        Run #{workflow.run_id}
                      </span>
                      <span className="text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
                        •
                      </span>
                      <span className="text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
                        {new Date(workflow.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-[var(--color-studojo-yellow-bg)] text-[var(--color-studojo-yellow)] rounded-full text-xs font-bold font-['Satoshi'] uppercase tracking-wider animate-pulse">
                      {workflow.status.replace("_", " ")}
                    </span>
                    <a
                      href={workflow.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-studojo-purple)] hover:underline font-['Satoshi'] font-medium"
                    >
                      View Logs &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] overflow-hidden">
          {filteredDeployments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-['Satoshi'] text-[var(--color-studojo-muted)]">
                No deployments found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[var(--color-studojo-surface-muted)]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] uppercase tracking-wider">
                      Deployed At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] uppercase tracking-wider">
                      Deployed By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDeployments.map((deployment: any, i: number) => (
                    <tr
                      key={i}
                      className="hover:bg-[var(--color-studojo-surface-muted)] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)]">
                        {deployment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
                        {deployment.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold font-['Satoshi'] rounded-full ${
                            deployment.status === "success"
                              ? "bg-[var(--color-studojo-green-bg)] text-[var(--color-studojo-green)]"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {deployment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
                        {new Date(deployment.deployed_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
                        {deployment.deployed_by || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
