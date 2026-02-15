const API_BASE =
  typeof process !== "undefined" && process.env?.VITE_CONTROL_PLANE_URL
    ? process.env.VITE_CONTROL_PLANE_URL
    : import.meta.env.VITE_CONTROL_PLANE_URL || "https://api.studojo.com";

export interface ServiceStatus {
  name: string;
  status: string;
  version: string;
  replicas: number;
  ready_replicas: number;
  last_deployment: string;
}

export interface Deployment {
  service: string;
  version: string;
  deployed_at: string;
  deployed_by: string;
  status: string;
  workflow_run?: number;
}

export interface DeploymentHistory {
  version: string;
  deployed_at: string;
  replicas: number;
  ready_replicas: number;
}

/**
 * Get the frontend URL for Better Auth
 */
function getFrontendUrl(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;

    // Handle local development
    if (port === "3004" || window.location.port === "3004") {
      return `http://${host}:3000`;
    }

    // Handle production subdomain: dev.studojo.com -> studojo.com
    if (host.startsWith("dev.")) {
      const baseHost = host.replace(/^dev\./, "");
      return `${protocol}//${baseHost}`;
    }

    // Fallback: try to replace port if present
    if (window.location.origin.includes(":3004")) {
      return window.location.origin.replace(":3004", ":3000");
    }

    // For same-domain deployments, use the same origin
    return window.location.origin;
  }
  return process.env.VITE_AUTH_URL || "http://localhost:3000";
}

/**
 * Get authentication token, trying multiple methods:
 * 1. Try to get token from Better Auth client (if cookies are shared)
 * 2. Try to fetch token from frontend's share-token endpoint (OAuth-like)
 */
export async function getToken(): Promise<string | null> {
  // First, try to get token directly from Better Auth
  try {
    const { authClient } = await import("./auth-client");
    const { data, error } = await authClient.token();
    if (!error && data?.token) {
      return data.token;
    }
  } catch (error) {
    console.debug("Failed to get token from auth client:", error);
  }

  // If that fails, try to get token from frontend via share-token endpoint
  try {
    const frontendUrl = getFrontendUrl();

    const response = await fetch(`${frontendUrl}/api/auth/share-token`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        // Store token in sessionStorage for future use
        if (typeof window !== "undefined") {
          sessionStorage.setItem("dev_panel_token", data.token);
        }
        return data.token;
      }
    } else {
      // If request failed, check if we have a stored token
      if (typeof window !== "undefined") {
        const storedToken = sessionStorage.getItem("dev_panel_token");
        if (storedToken) {
          return storedToken;
        }
      }
    }
  } catch (error) {
    console.debug("Failed to get token from frontend:", error);
    // Fallback to stored token
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("dev_panel_token");
      if (storedToken) {
        return storedToken;
      }
    }
  }

  return null;
}

async function getAuthToken(): Promise<string | null> {
  return getToken();
}

async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

export async function getServices(): Promise<ServiceStatus[]> {
  const response = await fetchWithAuth(`${API_BASE}/v1/dev/services`);
  if (!response.ok) throw new Error("Failed to fetch services");
  const data = await response.json();
  return data.services || [];
}

export async function queryLogs(service?: string, query?: string, limit = 100) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (query) params.set("query", query);
  params.set("limit", limit.toString());

  const response = await fetchWithAuth(`${API_BASE}/v1/dev/logs?${params}`);
  if (!response.ok) throw new Error("Failed to fetch logs");
  return response.json();
}

export async function queryMetrics(
  service?: string,
  metric?: string,
  start?: string,
  end?: string,
) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (metric) params.set("metric", metric);
  if (start) params.set("start", start);
  if (end) params.set("end", end);

  const response = await fetchWithAuth(`${API_BASE}/v1/dev/metrics?${params}`);
  if (!response.ok) throw new Error("Failed to fetch metrics");
  return response.json();
}

export async function getCICDStatus(service?: string) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);

  const response = await fetchWithAuth(
    `${API_BASE}/v1/dev/ci-cd/status?${params}`,
  );
  if (!response.ok) throw new Error("Failed to fetch CI/CD status");
  return response.json();
}

export async function getDeployments(service?: string): Promise<Deployment[]> {
  const params = new URLSearchParams();
  if (service) params.set("service", service);

  const response = await fetchWithAuth(
    `${API_BASE}/v1/dev/deployments?${params}`,
  );
  if (!response.ok) throw new Error("Failed to fetch deployments");
  const data = await response.json();
  return data.deployments || [];
}

export async function getServiceHistory(
  service: string,
): Promise<DeploymentHistory[]> {
  const response = await fetchWithAuth(
    `${API_BASE}/v1/dev/services/${service}/history`,
  );
  if (!response.ok) throw new Error("Failed to fetch service history");
  const data = await response.json();
  return data.history || [];
}

export async function rollbackService(
  service: string,
  version: string,
): Promise<void> {
  const response = await fetchWithAuth(
    `${API_BASE}/v1/dev/services/${service}/rollback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ version }),
    },
  );
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: { message: "Rollback failed" } }));
    throw new Error(error.error?.message || "Rollback failed");
  }
}
