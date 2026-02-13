import { jwtVerify, createRemoteJWKSet } from "jose";

// Get JWKS URL - prioritize explicit JWKS_URL, then VITE_AUTH_URL, then default
function getJWKSUrl(): string {
  if (process.env.JWKS_URL) {
    return process.env.JWKS_URL;
  }
  
  const authUrl = process.env.VITE_AUTH_URL || process.env.BETTER_AUTH_URL;
  if (authUrl) {
    return `${authUrl}/api/auth/jwks`;
  }
  
  // Production default
  if (process.env.NODE_ENV === "production") {
    return "https://studojo.com/api/auth/jwks";
  }
  
  // Development default
  return "http://localhost:3000/api/auth/jwks";
}

const JWKS_URL = getJWKSUrl();

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(JWKS_URL));
  }
  return jwks;
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const jwksSet = getJWKS();
    const { payload } = await jwtVerify(token, jwksSet, {
      algorithms: ["RS256", "ES256", "EdDSA"],
    });

    const userId = payload.sub || (payload as any).userId;
    if (!userId || typeof userId !== "string") {
      return null;
    }

    return userId;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("JWT verification failed:", error);
    }
    return null;
  }
}

