import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP Router
 *
 * Configures HTTP routes for authentication endpoints.
 * Better Auth requires these routes to handle:
 * - Sign up / Sign in
 * - Sign out
 * - Session management
 * - Password reset (if enabled)
 */

const http = httpRouter();

/**
 * POST /auth/*
 * Handles authentication requests (login, signup, etc.)
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

/**
 * GET /auth/*
 * Handles authentication requests (session checks, etc.)
 */
http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
