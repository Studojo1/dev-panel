import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin,
  haveIBeenPwned,
  jwt,
  lastLoginMethod,
  phoneNumber,
  twoFactor,
} from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import * as schema from "../../auth-schema";
import db from "./db.server";

const baseURL =
  process.env.BETTER_AUTH_URL ?? 
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3004");

export const auth = betterAuth({
  appName: "Studojo Dev Panel",
  database: drizzleAdapter(db, {
    provider: "postgres",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
      twoFactor: schema.twoFactor,
      passkey: schema.passkey,
      jwks: schema.jwks,
    },
  }),
  baseURL,
  trustedOrigins: [
    baseURL,
    "http://localhost:3004",
    "http://127.0.0.1:3004",
    "https://dev.studojo.com",
    ...(process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) || []),
  ],
  secret: process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET,
  
  cors: {
    enabled: true,
    origin: [
      baseURL,
      "http://localhost:3004",
      "http://127.0.0.1:3004",
      "https://dev.studojo.com",
      ...(process.env.CORS_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) || []),
    ],
    credentials: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "compact",
    },
    storeSessionInDatabase: true,
  },
  
  advanced: {
    cookiePrefix: "better-auth",
    cookieOptions: baseURL.includes("studojo.com") ? {
      domain: ".studojo.com",
      sameSite: "lax",
      secure: true,
    } : undefined,
  },

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "This password has been found in a data breach. Please choose a different password.",
    }),
    lastLoginMethod({ storeInDatabase: true }),
    jwt(),
    admin({}),
    passkey({
      rpName: "Studojo Dev Panel",
    }),
    twoFactor(),
    phoneNumber({
      sendOTP: ({ phoneNumber: to, code }) => {
        // In dev panel, we can use a simple console log or integrate with SMS service
        console.log(`[Dev Panel] OTP for ${to}: ${code}`);
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
    }),
  ],
});
