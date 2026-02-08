import { Link } from "react-router";
import type { Route } from "./+types/docs";
import { Header } from "~/components/header";
import { useEffect, useState } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const controlPlaneUrl = process.env.VITE_CONTROL_PLANE_URL || "https://api.studojo.com";
    const response = await fetch(`${controlPlaneUrl}/v1/dev/docs`);
    if (!response.ok) {
      return { docs: [] };
    }
    const data = await response.json();
    return { docs: data || [] };
  } catch (error) {
    console.error("Failed to load docs list:", error);
    return { docs: [] };
  }
}

export default function Docs({ loaderData }: Route.ComponentProps) {
  const { docs } = loaderData;

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)]">
      <Header />
      <main className="max-w-[var(--section-max-width)] mx-auto px-[var(--section-padding-x)] py-[var(--section-padding-y)]">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            Documentation
          </h1>
          <p className="text-lg font-['Satoshi'] text-[var(--color-studojo-muted)]">
            Browse and search the Studojo documentation
          </p>
        </div>

        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8">
          {docs.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docs.map((doc: any) => (
                <li key={doc.slug}>
                  <Link
                    to={`/docs/${doc.slug}`}
                    className="block p-4 border-2 border-[var(--color-studojo-ink)] rounded-lg hover:shadow-[var(--shadow-brutal)] transition-all hover:bg-[var(--color-studojo-purple-bg)]"
                  >
                    <h3 className="text-lg font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-1">
                      {doc.title}
                    </h3>
                    <p className="text-sm font-['Satoshi'] text-[var(--color-studojo-muted)]">
                      {doc.slug}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="font-['Satoshi'] text-[var(--color-studojo-muted)]">
                No documentation available. Check your connection to the control plane.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
