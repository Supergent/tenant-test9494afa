/**
 * Better Auth Client Configuration
 *
 * Client-side authentication utilities for React components.
 * Use the hooks provided by this client in your React components.
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [convexClient()],
});

/**
 * Example usage in components:
 *
 * ```tsx
 * import { authClient } from "@/lib/auth-client";
 *
 * function MyComponent() {
 *   const { data: session } = authClient.useSession();
 *   const { signIn, signOut, signUp } = authClient;
 *
 *   if (!session) {
 *     return <button onClick={() => signIn.email(...)}>Sign In</button>;
 *   }
 *
 *   return <div>Welcome {session.user.email}</div>;
 * }
 * ```
 */
