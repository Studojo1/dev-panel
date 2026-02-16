import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/services.$name";
import { Header } from "~/components/header";
import { LogStream } from "~/components/LogStream";
import {
  getServices,
  getServiceHistory,
  rollbackService,
  scaleService,
  getCICDStatusForService,
  getDeployments,
} from "~/lib/api";
import { toast } from "sonner";

export async function loader({ params, request }: Route.LoaderArgs) {
  const serviceName = params.name;
  try {
    const services = await getServices();
    const service = services.find((s: any) => s.name === serviceName);

    if (!service) {
      throw new Response("Service not found", { status: 404 });
    }

    let history: any[] = [];
    try {
      history = await getServiceHistory(serviceName);
    } catch (error) {
      console.warn("Failed to load service history:", error);
    }

    let deployments: any[] = [];
    try {
      deployments = await getDeployments(serviceName);
    } catch (error) {
      console.warn("Failed to load deployments:", error);
    }

    return { service, history, deployments };
  } catch (error: any) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Failed to load service:", error);
    throw new Response("Failed to load service", { status: 500 });
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "healthy":
      return "bg-[var(--color-studojo-green)]";
    case "degraded":
      return "bg-[var(--color-studojo-orange)]";
    case "unhealthy":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

type Tab = "overview" | "logs" | "deployments" | "workflows";

export default function ServiceDetail({ loaderData }: Route.ComponentProps) {
  const { service, history, deployments } = loaderData;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [replicas, setReplicas] = useState(service.replicas || 1);
  const [isScaling, setIsScaling] = useState(false);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);

  // Load workflows when workflows tab is active
  useEffect(() => {
    if (activeTab === "workflows") {
      loadWorkflows();
    }
  }, [activeTab, service.name]);

  const loadWorkflows = async () => {
    setLoadingWorkflows(true);
    try {
      const data = await getCICDStatusForService(service.name);
      setWorkflows(data.workflows || []);
    } catch (error) {
      console.error("Failed to load workflows:", error);
      toast.error("Failed to load workflow runs");
    } finally {
      setLoadingWorkflows(false);
    }
  };

  const handleRollback = async () => {
    if (!selectedVersion) {
      toast.error("Please select a version to rollback to");
      return;
    }

    setIsRollingBack(true);
    try {
      await rollbackService(service.name, selectedVersion);
      toast.success(`Rolled back to ${selectedVersion}`);
      setShowConfirmModal(false);
      setSelectedVersion("");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to rollback");
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleScale = async () => {
    if (replicas < 0 || replicas > 100) {
      toast.error("Replicas must be between 0 and 100");
      return;
    }

    setIsScaling(true);
    try {
      await scaleService(service.name, replicas);
      toast.success(`Scaled ${service.name} to ${replicas} replicas`);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to scale service");
    } finally {
      setIsScaling(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "logs", label: "Logs" },
    { id: "deployments", label: "Deployments" },
    { id: "workflows", label: "Workflows" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)]">
      <Header />
      <main className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
        <div className="mb-6">
          <Link
            to="/services"
            className="inline-flex items-center text-[var(--color-studojo-purple)] font-['Satoshi'] font-medium hover:underline mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Services
          </Link>
          <h1 className="text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            {service.name}
          </h1>
        </div>

        {/* Service Status Card */}
        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className={`h-4 w-4 rounded-full ${getStatusColor(service.status)}`}
              />
              <span className="text-lg font-['Clash_Display'] font-bold text-[var(--color-studojo-ink)] capitalize">
                {service.status}
              </span>
            </div>
            {service.version && service.version !== "unknown" && (
              <span className="px-3 py-1 bg-[var(--color-studojo-purple-bg)] text-[var(--color-studojo-purple)] rounded text-sm font-['Satoshi'] font-medium">
                {service.version}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-['Satoshi']">
            <div>
              <div className="text-sm text-[var(--color-studojo-muted)]">
                Replicas
              </div>
              <div className="text-xl font-bold text-[var(--color-studojo-ink)]">
                {service.ready_replicas}/{service.replicas}
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--color-studojo-muted)]">
                Version
              </div>
              <div className="text-xl font-bold text-[var(--color-studojo-ink)]">
                {service.version || "unknown"}
              </div>
            </div>
            <div>
              <div className="text-sm text-[var(--color-studojo-muted)]">
                Last Deployment
              </div>
              <div className="text-xl font-bold text-[var(--color-studojo-ink)]">
                {service.last_deployment
                  ? new Date(service.last_deployment).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] mb-6">
          <div className="flex border-b-2 border-[var(--color-studojo-ink)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-['Satoshi'] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--color-studojo-purple-bg)] text-[var(--color-studojo-purple)] border-b-2 border-[var(--color-studojo-purple)] -mb-[2px]"
                    : "text-[var(--color-studojo-muted)] hover:text-[var(--color-studojo-ink)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Scaling Controls */}
                <div>
                  <h2 className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4">
                    Scaling
                  </h2>
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                        Replicas
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={replicas}
                        onChange={(e) =>
                          setReplicas(parseInt(e.target.value) || 0)
                        }
                        className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                      />
                    </div>
                    <button
                      onClick={handleScale}
                      disabled={isScaling || replicas === service.replicas}
                      className="px-6 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors"
                    >
                      {isScaling ? "Scaling..." : "Scale"}
                    </button>
                  </div>
                </div>

                {/* Rollback Section */}
                <div>
                  <h2 className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4">
                    Rollback
                  </h2>
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium font-['Satoshi'] text-[var(--color-studojo-ink)] mb-2">
                        Select Version
                      </label>
                      <select
                        value={selectedVersion}
                        onChange={(e) => setSelectedVersion(e.target.value)}
                        className="w-full border-2 border-[var(--color-studojo-ink)] rounded-lg px-4 py-2 font-['Satoshi'] focus:outline-none focus:ring-2 focus:ring-[var(--color-studojo-purple)]"
                      >
                        <option value="">Select a version...</option>
                        {history
                          .filter(
                            (h: any) =>
                              h.version !== service.version &&
                              h.version !== "unknown"
                          )
                          .map((h: any) => (
                            <option key={h.version} value={h.version}>
                              {h.version} (
                              {new Date(h.created_at).toLocaleDateString()})
                            </option>
                          ))}
                      </select>
                    </div>
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!selectedVersion || isRollingBack}
                      className="px-6 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors"
                    >
                      Rollback
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Logs Tab */}
            {activeTab === "logs" && (
              <div className="h-[600px]">
                <LogStream service={service.name} follow={true} />
              </div>
            )}

            {/* Deployments Tab */}
            {activeTab === "deployments" && (
              <div>
                <h2 className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4">
                  Deployment History
                </h2>
                {history.length === 0 ? (
                  <p className="font-['Satoshi'] text-[var(--color-studojo-muted)]">
                    No deployment history available.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {history.map((h: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-4 border-2 rounded-lg ${
                          h.version === service.version
                            ? "border-[var(--color-studojo-purple)] bg-[var(--color-studojo-purple-bg)]"
                            : "border-[var(--color-studojo-ink)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-['Clash_Display'] font-bold text-[var(--color-studojo-ink)]">
                                {h.version}
                              </span>
                              {h.version === service.version && (
                                <span className="px-2 py-1 bg-[var(--color-studojo-purple)] text-white rounded text-xs font-['Satoshi'] font-medium">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="mt-1 font-['Satoshi'] text-sm text-[var(--color-studojo-muted)]">
                              {new Date(h.created_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="font-['Satoshi'] text-sm text-[var(--color-studojo-muted)]">
                            Replicas: {h.ready_replicas}/{h.replicas}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Deployment Records */}
                {deployments.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4">
                      Deployment Records
                    </h2>
                    <div className="space-y-2">
                      {deployments.map((d: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 border-2 border-[var(--color-studojo-ink)] rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-['Clash_Display'] font-bold text-[var(--color-studojo-ink)]">
                                  {d.version}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded text-xs font-['Satoshi'] font-medium ${
                                    d.status === "success"
                                      ? "bg-[var(--color-studojo-green-bg)] text-[var(--color-studojo-green)]"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {d.status}
                                </span>
                                {d.workflow_run && (
                                  <a
                                    href={`https://github.com/studojo/studojo/actions/runs/${d.workflow_run}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--color-studojo-purple)] hover:underline text-xs font-['Satoshi']"
                                  >
                                    Workflow #{d.workflow_run}
                                  </a>
                                )}
                              </div>
                              <div className="mt-1 font-['Satoshi'] text-sm text-[var(--color-studojo-muted)]">
                                {new Date(d.deployed_at).toLocaleString()} by{" "}
                                {d.deployed_by || "unknown"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Workflows Tab */}
            {activeTab === "workflows" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)]">
                    GitHub Actions Workflows
                  </h2>
                  <button
                    onClick={loadWorkflows}
                    disabled={loadingWorkflows}
                    className="px-4 py-2 border-2 border-[var(--color-studojo-ink)] rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-surface-muted)] transition-colors disabled:opacity-50"
                  >
                    {loadingWorkflows ? "Loading..." : "Refresh"}
                  </button>
                </div>
                {loadingWorkflows ? (
                  <p className="font-['Satoshi'] text-[var(--color-studojo-muted)]">
                    Loading workflows...
                  </p>
                ) : workflows.length === 0 ? (
                  <p className="font-['Satoshi'] text-[var(--color-studojo-muted)]">
                    No workflow runs found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {workflows.map((workflow: any) => (
                      <div
                        key={workflow.run_id}
                        className="p-4 border-2 border-[var(--color-studojo-ink)] rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold font-['Clash_Display'] text-lg text-[var(--color-studojo-ink)]">
                                {workflow.name}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold font-['Satoshi'] uppercase tracking-wider ${
                                  workflow.status === "completed" &&
                                  workflow.conclusion === "success"
                                    ? "bg-[var(--color-studojo-green-bg)] text-[var(--color-studojo-green)]"
                                    : workflow.status === "completed" &&
                                      workflow.conclusion === "failure"
                                    ? "bg-red-100 text-red-800"
                                    : workflow.status === "in_progress" ||
                                      workflow.status === "queued"
                                    ? "bg-[var(--color-studojo-yellow-bg)] text-[var(--color-studojo-yellow)] animate-pulse"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {workflow.conclusion || workflow.status}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center space-x-4 font-['Satoshi'] text-sm text-[var(--color-studojo-muted)]">
                              <span>Run #{workflow.run_id}</span>
                              <span>•</span>
                              <span>
                                {new Date(workflow.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {workflow.html_url && (
                            <a
                              href={workflow.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] transition-colors"
                            >
                              View on GitHub →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal-xl)] p-6 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-4">
                Confirm Rollback
              </h3>
              <p className="font-['Satoshi'] text-[var(--color-studojo-muted)] mb-6">
                Are you sure you want to rollback <strong>{service.name}</strong>{" "}
                to version <strong>{selectedVersion}</strong>?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-[var(--color-studojo-ink)] rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-surface-muted)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRollback}
                  disabled={isRollingBack}
                  className="flex-1 px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] disabled:opacity-50 transition-colors"
                >
                  {isRollingBack ? "Rolling back..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
