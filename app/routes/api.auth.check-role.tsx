import type { Route } from "./+types/api.auth.check-role";
import { sql } from "drizzle-orm";
import { verifyToken } from "~/lib/jwks.server";
import db from "~/lib/db.server";

// Helper to add CORS headers
function addCorsHeaders(response: Response, origin: string | null): Response {
  const headers = new Headers(response.headers);
  
  // Allow dev.studojo.com and studojo.com origins
  const allowedOrigins = [
    "https://dev.studojo.com",
    "https://studojo.com",
    "https://www.studojo.com",
    "http://localhost:3004",
    "http://localhost:3000",
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const origin = request.headers.get("origin");
  
  // Handle OPTIONS preflight
  if (request.method === "OPTIONS") {
    const headers: HeadersInit = {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    };
    if (origin) {
      headers["Access-Control-Allow-Origin"] = origin;
    }
    return new Response(null, { status: 204, headers });
  }
  
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const response = Response.json({ error: "Not authenticated" }, { status: 401 });
    return addCorsHeaders(response, origin);
  }

  const token = authHeader.substring(7);

  try {
    const userId = await verifyToken(token);
    if (!userId) {
      const response = Response.json({ error: "Invalid or expired token" }, { status: 401 });
      return addCorsHeaders(response, origin);
    }

    const result = await db.execute(
      sql`SELECT role FROM "user" WHERE id = ${userId} LIMIT 1`
    );

    if (result.rows.length === 0) {
      const response = Response.json({ error: "User not found" }, { status: 404 });
      return addCorsHeaders(response, origin);
    }

    const role = result.rows[0].role as string | null;

    // Allow dev and admin roles
    if (role !== "dev" && role !== "admin") {
      const response = Response.json({ 
        error: "Forbidden - Dev or Admin access required",
        role: role || "none"
      }, { status: 403 });
      return addCorsHeaders(response, origin);
    }

    const response = Response.json({ role });
    return addCorsHeaders(response, origin);
  } catch (error) {
    console.error("Error checking role:", error);
    const response = Response.json({ 
      error: "Invalid token",
      details: process.env.NODE_ENV === "development" ? String(error) : undefined
    }, { status: 401 });
    return addCorsHeaders(response, origin);
  }
}

