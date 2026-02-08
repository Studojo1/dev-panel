import { Link } from "react-router";
import type { Route } from "./+types/index";
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

export default function Index({ loaderData }: Route.ComponentProps) {
  const { services } = loaderData;

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)]">
      <Header />
      <main className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            Dev Panel Dashboard
          </h1>
          <p className="text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]">
            Monitor and manage all Studojo services
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: any) => (
            <Link
              key={service.name}
              to={`/services/${service.name}`}
              className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-6 hover:shadow-[var(--shadow-brutal-lg)] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)]">
                  {service.name}
                </h3>
                <div
                  className={`h-3 w-3 rounded-full ${
                    service.status === "healthy" || service.status === "ready"
                      ? "bg-[var(--color-studojo-green)]"
                      : "bg-red-500"
                  }`}
                />
              </div>
              <div className="space-y-2 font-['Satoshi'] text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-studojo-muted)]">Status:</span>
                  <span className="font-medium text-[var(--color-studojo-ink)] capitalize">
                    {service.status}
                  </span>
                </div>
                {service.version && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-studojo-muted)]">Version:</span>
                    <span className="font-medium text-[var(--color-studojo-ink)]">
                      {service.version}
                    </span>
                  </div>
                )}
                {service.ready_replicas !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-studojo-muted)]">Replicas:</span>
                    <span className="font-medium text-[var(--color-studojo-ink)]">
                      {service.ready_replicas}/{service.replicas}
                    </span>
                  </div>
                )}
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
