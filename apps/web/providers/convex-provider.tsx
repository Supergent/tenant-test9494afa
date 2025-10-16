/**
 * Convex Provider with Better Auth Integration
 *
 * Wraps the application with Convex and authentication providers.
 * Use this provider at the root of your app to enable real-time
 * database queries and mutations with authentication.
 */

"use client";

import { ConvexProviderWithAuth } from "@convex-dev/better-auth/react";
import { convex } from "@/lib/convex";
import { authClient } from "@/lib/auth-client";
import { ReactNode } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} authClient={authClient}>
      {children}
    </ConvexProviderWithAuth>
  );
}
