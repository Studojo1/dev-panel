import { Link } from "react-router";
import type { Route } from "./+types/services";
import { Header } from "~/components/header";
import { getServices } from "~/lib/api";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const services = await getServices();
    return { services };
  } catch (error) {
    console.error("Failed to load services:", error);
    return { services: [] };
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

export default function Services({ loaderData }: Route.ComponentProps) {
  const { services } = loaderData;

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)]">
      <Header />
      <main className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            Services
          </h1>
          <p className="text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]">
            Monitor and manage all Studojo services
          </p>
        </div>

        <div className="space-y-4">
          {services.map((service: any) => (
            <Link
              key={service.name}
              to={`/services/${service.name}`}
              className="block bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 hover:shadow-[var(--shadow-brutal-lg)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-4 w-4 rounded-full ${getStatusColor(service.status)}`} />
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)]">
                        {service.name}
                      </h3>
                      {service.version && service.version !== "unknown" && (
                        <span className="px-2 py-1 bg-[var(--color-studojo-purple-bg)] text-[var(--color-studojo-purple)] rounded text-xs font-['Satoshi'] font-medium">
                          {service.version}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 font-['Satoshi'] text-sm text-[var(--color-studojo-muted)]">
                      <span>Status: <span className="font-medium text-[var(--color-studojo-ink)] capitalize">{service.status}</span></span>
                      {service.ready_replicas !== undefined && (
                        <span>Replicas: <span className="font-medium text-[var(--color-studojo-ink)]">{service.ready_replicas}/{service.replicas}</span></span>
                      )}
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-[var(--color-studojo-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8 text-center">
            <p className="font-['Satoshi'] text-[var(--color-studojo-muted)]">
              No services found. Check your connection to the control plane.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
