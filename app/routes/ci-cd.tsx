import { useState } from "react";
import type { Route } from "./+types/ci-cd";
import { Header } from "~/components/header";
import { getDeployments } from "~/lib/api";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const deployments = await getDeployments();
    return { deployments };
  } catch (error) {
    console.error("Failed to load deployments:", error);
    return { deployments: [] };
  }
}

export default function CICD({ loaderData }: Route.ComponentProps) {
  const { deployments } = loaderData;
  const [selectedService, setSelectedService] = useState("");

  const filteredDeployments = deployments.filter(
    (d: any) => !selectedService || d.service.toLowerCase().includes(selectedService.toLowerCase())
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
                    <tr key={i} className="hover:bg-[var(--color-studojo-surface-muted)] transition-colors">
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
