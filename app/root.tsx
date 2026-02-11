import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  isRouteErrorResponse,
} from "react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import { authClient } from "./lib/auth-client";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "preconnect", href: "https://api.fontshare.com" },
  {
    rel: "stylesheet",
    href: "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700,900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "font-['Satoshi']",
              title: "font-['Satoshi'] font-medium",
              description: "font-['Satoshi']",
              success: "bg-emerald-50 border-emerald-200 text-emerald-900",
              error: "bg-red-50 border-red-200 text-red-900",
              info: "bg-blue-50 border-blue-200 text-blue-900",
            },
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();

  // Redirect to login if not logged in (but allow login, auth redirect, and api routes)
  useEffect(() => {
    if (!isPending && !session && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/auth") && !location.pathname.startsWith("/api")) {
      window.location.href = "/login?redirect=" + encodeURIComponent(location.pathname);
    }
  }, [session, isPending, location.pathname]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let statusCode: number | undefined;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    message = error.status === 404 ? "Page Not Found" : error.status === 500 ? "Server Error" : "Error";
    details =
      error.status === 404
        ? "The page you're looking for doesn't exist or has been moved."
        : error.status === 500
        ? "Something went wrong on our end. We're working to fix it!"
        : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    message = "Application Error";
  }

  return (
    <div className="min-h-screen bg-[var(--color-studojo-surface)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[var(--color-studojo-ink)] rounded-lg shadow-[var(--shadow-brutal)] p-8 text-center">
          <h1 className="text-3xl font-bold font-['Clash_Display'] text-[var(--color-studojo-ink)] mb-2">
            {message}
          </h1>
          <p className="text-[var(--color-studojo-muted)] font-['Satoshi'] mb-6">
            {details}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-[var(--color-studojo-purple)] text-white rounded-lg font-['Satoshi'] font-medium hover:bg-[var(--color-studojo-violet-500)] transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
