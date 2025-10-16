import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth Client
 *
 * This client provides typed access to authentication operations.
 * Use this to get the current authenticated user in your endpoints.
 *
 * Example:
 * ```typescript
 * const user = await authComponent.getAuthUser(ctx);
 * if (!user) throw new Error("Unauthorized");
 * ```
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Better Auth Configuration
 *
 * Configures authentication with:
 * - Email/password authentication (no email verification required)
 * - Convex plugin for JWT-based sessions (30-day expiration)
 * - Database adapter for storing users and sessions
 *
 * This is a single-tenant app (no organization plugin needed).
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    baseURL: process.env.SITE_URL!,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex({
        jwtExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  });
};
