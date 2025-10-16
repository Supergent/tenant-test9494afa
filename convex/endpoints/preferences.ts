/**
 * Endpoint Layer: User Preferences
 *
 * Business logic for user preferences and settings.
 * Composes database operations from the db layer.
 * Handles authentication and authorization.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as UserPreferences from "../db/userPreferences";

/**
 * Get current user's preferences
 * Creates default preferences if they don't exist
 */
export const get = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await UserPreferences.getUserPreferencesByUser(ctx, authUser._id);
  },
});

/**
 * Update user preferences
 */
export const update = mutation({
  args: {
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    defaultView: v.optional(v.union(v.literal("list"), v.literal("board"))),
    defaultFilter: v.optional(v.string()),
    notificationsEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // 1. Authentication
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // 2. Rate limiting
    const rateLimit = await rateLimiter.limit(ctx, "updatePreferences", { key: authUser._id });
    if (!rateLimit.ok) {
      throw new Error(`Rate limit exceeded. Retry after ${rateLimit.retryAfter}ms`);
    }

    // 3. Get or create preferences
    const preferences = await UserPreferences.getOrCreateUserPreferences(ctx, authUser._id);

    if (!preferences) {
      throw new Error("Failed to get or create preferences");
    }

    // 4. Update preferences
    await UserPreferences.updateUserPreferences(ctx, preferences._id, {
      theme: args.theme,
      defaultView: args.defaultView,
      defaultFilter: args.defaultFilter,
      notificationsEnabled: args.notificationsEnabled,
    });

    return preferences._id;
  },
});

/**
 * Initialize default preferences for a new user
 */
export const initialize = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Check if preferences already exist
    const existing = await UserPreferences.getUserPreferencesByUser(ctx, authUser._id);
    if (existing) {
      return existing._id;
    }

    // Create default preferences
    return await UserPreferences.createUserPreferences(ctx, {
      userId: authUser._id,
      theme: "system",
      defaultView: "list",
      notificationsEnabled: true,
    });
  },
});
