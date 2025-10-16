/**
 * Rate Limiter Configuration
 *
 * Defines rate limits for all mutation endpoints to prevent abuse.
 * Uses token bucket algorithm for smooth rate limiting with burst capacity.
 */

import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // Task operations - allow bursts for quick task creation
  createTask: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 5 },
  updateTask: { kind: "token bucket", rate: 60, period: MINUTE, capacity: 10 },
  deleteTask: { kind: "token bucket", rate: 20, period: MINUTE, capacity: 3 },

  // Comment operations - moderate limits
  createComment: { kind: "token bucket", rate: 20, period: MINUTE, capacity: 3 },
  updateComment: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 5 },
  deleteComment: { kind: "token bucket", rate: 15, period: MINUTE, capacity: 3 },

  // Preference updates - low frequency expected
  updatePreferences: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 2 },

  // Auth operations - stricter limits to prevent abuse
  signup: { kind: "fixed window", rate: 5, period: HOUR },
  login: { kind: "fixed window", rate: 10, period: MINUTE },
});
