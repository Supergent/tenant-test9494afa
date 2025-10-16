/**
 * Database Layer: User Preferences
 *
 * This is the ONLY file that directly accesses the userPreferences table using ctx.db.
 * All user preference operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// Types for preferences
export type Theme = "light" | "dark" | "system";
export type DefaultView = "list" | "board";

// CREATE
export async function createUserPreferences(
  ctx: MutationCtx,
  args: {
    userId: string;
    theme?: Theme;
    defaultView?: DefaultView;
    defaultFilter?: string;
    notificationsEnabled: boolean;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("userPreferences", {
    userId: args.userId,
    theme: args.theme,
    defaultView: args.defaultView,
    defaultFilter: args.defaultFilter,
    notificationsEnabled: args.notificationsEnabled,
    createdAt: now,
    updatedAt: now,
  });
}

// READ - Get by ID
export async function getUserPreferencesById(
  ctx: QueryCtx,
  id: Id<"userPreferences">
) {
  return await ctx.db.get(id);
}

// READ - Get preferences by user
export async function getUserPreferencesByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

// READ - Get or create default preferences
export async function getOrCreateUserPreferences(
  ctx: MutationCtx,
  userId: string
) {
  const existing = await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();

  if (existing) {
    return existing;
  }

  // Create default preferences
  const now = Date.now();
  const id = await ctx.db.insert("userPreferences", {
    userId,
    theme: "system",
    defaultView: "list",
    notificationsEnabled: true,
    createdAt: now,
    updatedAt: now,
  });

  return await ctx.db.get(id);
}

// UPDATE
export async function updateUserPreferences(
  ctx: MutationCtx,
  id: Id<"userPreferences">,
  args: {
    theme?: Theme;
    defaultView?: DefaultView;
    defaultFilter?: string;
    notificationsEnabled?: boolean;
  }
) {
  return await ctx.db.patch(id, {
    ...args,
    updatedAt: Date.now(),
  });
}

// DELETE
export async function deleteUserPreferences(
  ctx: MutationCtx,
  id: Id<"userPreferences">
) {
  return await ctx.db.delete(id);
}

// DELETE - Delete all preferences for a user
export async function deleteUserPreferencesByUser(
  ctx: MutationCtx,
  userId: string
) {
  const preferences = await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  await Promise.all(
    preferences.map((pref) => ctx.db.delete(pref._id))
  );
}
