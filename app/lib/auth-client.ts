import {
  adminClient,
  jwtClient,
  lastLoginMethodClient,
  phoneNumberClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Get the frontend URL for Better Auth (dev-panel uses same auth as main app)
const getAuthBaseURL = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    // Handle local development
    if (port === "3004" || window.location.port === "3004") {
      return `http://${host}:3000`; // Main frontend port
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
};

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  plugins: [
    lastLoginMethodClient(),
    jwtClient(),
    adminClient(),
    phoneNumberClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      },
    }),
  ],
});

